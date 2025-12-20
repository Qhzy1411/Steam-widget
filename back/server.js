const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const DEFALUT_STEAM_API_KEY = process.env.STEAM_API_KEY;
const DEFAULT_STEAM_ID = process.env.STEAM_ID;

// 将分钟转换为小时，并保留一位小数
const toHours = (minutes) => (minutes / 60).toFixed(1);

app.get('/', (req, res) => res.send('✅Qhzy\'s API Service is running'));

app.get('/steam-widget', async (req, res) => {
    // 从查询参数中获取 id, apikey, num, num2, 并设置默认值
    const steamId = req.query.id || DEFAULT_STEAM_ID;
    const steamAPIkey = req.query.apikey || DEFALUT_STEAM_API_KEY;
    const topGamesCount = parseInt(req.query.num, 10) || 10;
    const recentGamesCount = parseInt(req.query.num2, 10) || 5;

    try {
        if (!DEFALUT_STEAM_API_KEY) {
            return res.status(500).json({ error: 'Missing STEAM_API_KEY in .env file.' });
        }
        if (!steamId) {
            return res.status(400).json({ error: 'Please provide a Steam ID via query parameter or set a default in the .env file.' });
        }

        // 获取用户基础信息
        const summaryUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamAPIkey}&steamids=${steamId}`;
        const summaryRes = await axios.get(summaryUrl);

        if (!summaryRes.data.response.players || summaryRes.data.response.players.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const player = summaryRes.data.response.players[0];

        // 获取用户拥有的所有游戏信息
        const ownedGamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamAPIkey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
        const ownedRes = await axios.get(ownedGamesUrl);
        const allGames = ownedRes.data.response.games || [];

        // 计算总游戏时长排行
        const topGames = [...allGames]
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, topGamesCount) // 使用 num 参数作为数量限制
            .map(game => ({
                name: game.name,
                playtime: toHours(game.playtime_forever),
                appid: game.appid,
                image: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`
            }));

        // 计算近两周游戏时长排行
        const recentGames = [...allGames]
            .filter(game => game.playtime_2weeks && game.playtime_2weeks > 0)
            .sort((a, b) => b.playtime_2weeks - a.playtime_2weeks)
            .slice(0, recentGamesCount) // 使用 num2 参数作为数量限制
            .map(game => ({
                name: game.name,
                playtime: toHours(game.playtime_2weeks),
                appid: game.appid,
                image: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`
            }));

        // 组装并返回最终数据
        res.json({
            user: {
                name: player.personaname,
                avatar: player.avatarfull,
                status: player.personastate,
                gameName: player.gameextrainfo || null, // 显示当前正在玩的游戏
                profileUrl: player.profileurl
            },
            recentGames: recentGames,
            topGames: topGames
        });

    } catch (error) {
        console.error("API Error:", error.message);
        // 根据错误类型可以返回更详细的错误信息
        if (error.response) {
            // 请求已发出，但服务器以状态码响应
            return res.status(error.response.status).json({
                error: 'Failed to fetch data from Steam API.',
                details: error.response.data
            });
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            return res.status(503).json({ error: 'No response from Steam API. The service may be temporarily unavailable.' });
        } else {
            // 在设置请求时触发了错误
            return res.status(500).json({ error: 'An internal server error occurred.' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});