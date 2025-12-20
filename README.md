#  Steam Widget / Steam 状态组件

<div align="center">

[![Website](https://img.shields.io/badge/Website-芷岸听荷-blue?style=flat-square&logo=google-chrome)](https://qhzy.top) [![Steam](https://img.shields.io/badge/Steam-Profile-1b2838?style=flat-square&logo=steam)](https://store.steampowered.com/) [![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

**一套美观、响应式且可定制的 Steam 状态展示组件。**
适用于个人博客、侧边栏或任何网页项目。
包含后端 API 服务与三种风格的前端组件。

[查看演示 Demo](https://qhzy.top) · [报告 Bug](https://github.com/yourusername/your-repo/issues)

</div>

---

## ✨ 特性

*   **🎨 三种风格组件**：
    *   **标准展示版**：纯净展示，通过 HTML 属性配置，适合嵌入文章。
    *   **交互配置版**：带有输入界面，允许访客输入 ID 生成自己的卡片。
    *   **窄屏/侧边栏版**：专为移动端和侧边栏设计，背景图风格，高度自适应。
*   **🛠️ 高度可配置**：支持自定义 Steam ID、API Key、显示游戏数量等。
*   **⚡ 实时状态**：实时显示在线状态（在线、离线、游戏中）。
*   **🧩 WordPress 兼容**：内置样式修复，完美避开 WP 主题的全局样式干扰。
*   **📱 响应式设计**：适配各种屏幕尺寸。

---

## 🖼️ 前端组件预览(front)

### 1. 标准展示版 (default.html)
最常用的版本，适合在“关于我”页面展示。

### 2. 交互配置版 (query.html)
包含输入框，访客可以输入自己的 Steam ID 动态生成卡片。支持输入校验与 API Key 选填。

### 3. 窄屏/侧边栏版 (sidebar.html)
高度紧凑，带有游戏封面背景图，适合放置在博客侧边栏。

---

## 🚀 快速开始

### 后端 (back)

本项目依赖后端 API 获取 Steam 数据以解决跨域问题。

```bash
# 克隆仓库
git clone https://github.com/Qhzy1411/Steam-widget.git

# 进入后端目录
cd back

# 安装依赖 & 运行
npm install
npm start