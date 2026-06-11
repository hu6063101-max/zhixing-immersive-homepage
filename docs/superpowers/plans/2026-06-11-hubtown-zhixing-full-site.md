# Hubtown 风格知行合一全站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有“知行合一”单页重构为 Hubtown 风格的九类页面沉浸式网站，核心为包含 100 个可点击金句坐标的认知地图。

**Architecture:** 使用 Vite 多页面静态构建与共享 JavaScript 外壳。`content.js` 提供内容，`map-data.js` 生成稳定坐标，`router.js` 根据路径选择页面，`scene.js` 根据页面模式渲染首页城市、认知地图或内容页背景。构建后为每个公开路由生成可直接访问的目录入口，兼容 GitHub Pages。

**Tech Stack:** Vite, JavaScript, Three.js, GSAP, Vitest

---

### Task 1: 稳定地图数据与页面路由

**Files:**
- Create: `src/map-data.js`
- Create: `src/site-pages.js`
- Create: `tests/map-data.test.js`
- Create: `tests/site-pages.test.js`

- [ ] 编写测试，验证生成 100 个唯一坐标、坐标分属 12 个主题、页面路由完整且不含登录和聊天。
- [ ] 运行 `npm.cmd test -- --run tests/map-data.test.js tests/site-pages.test.js`，确认模块缺失导致失败。
- [ ] 实现稳定坐标算法、页面元数据与路径解析，使测试通过。

### Task 2: 地图便签与承诺状态

**Files:**
- Create: `src/map-state.js`
- Create: `src/commitment-store.js`
- Create: `tests/map-state.test.js`
- Create: `tests/commitment-store.test.js`

- [ ] 编写测试，验证打开、关闭、上一条、下一条、主题筛选、搜索与承诺本地保存。
- [ ] 运行测试并确认缺失模块导致失败。
- [ ] 实现纯函数状态模块，使测试通过。

### Task 3: 共享外壳和首页

**Files:**
- Replace: `index.html`
- Replace: `src/main.js`
- Replace: `src/styles.css`
- Replace: `src/scene.js`
- Create: `src/pages/home.js`
- Create: `src/shell.js`

- [ ] 创建 Hubtown 风格加载器、固定菜单、声音控制和页面转场。
- [ ] 创建六幕首页内容与上一幕、下一幕、滚轮导航。
- [ ] 创建程序化发光城市、核心立方体、地形和镜头动画。

### Task 4: 认知地图

**Files:**
- Create: `src/pages/map.js`
- Modify: `src/scene.js`
- Modify: `src/styles.css`

- [ ] 渲染 12 个主题区域与 100 个可访问坐标。
- [ ] 点击坐标展开便签，支持关闭、上一条、下一条、搜索、主题筛选和列表。
- [ ] 移动端使用底部便签面板。

### Task 5: 主题内容页面

**Files:**
- Create: `src/pages/content-page.js`
- Create: `src/pages/commitment.js`
- Modify: `src/styles.css`

- [ ] 渲染知行体系、行动训练场、实践日志、认知模型、结果印证、原则与边界。
- [ ] 渲染行动承诺页面与本地保存反馈。
- [ ] 为所有页面添加页尾导航和认知地图入口。

### Task 6: 静态路由构建与验证

**Files:**
- Create: `scripts/create-static-routes.mjs`
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] 构建后生成 `/map`、`/system`、`/practice`、`/journal`、`/commitment`、`/models`、`/proof`、`/principles` 的入口文件。
- [ ] 运行 `npm.cmd test -- --run` 和 `npm.cmd run build`。
- [ ] 浏览器检查桌面和移动端首页、地图、便签、菜单、音频及内容页。
- [ ] 提交、推送并重新发布 GitHub Pages。

