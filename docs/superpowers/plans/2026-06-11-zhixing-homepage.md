# 知行合一 Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个包含 100 条知行合一文字、程序化 WebGL 场景和背景音乐的沉浸式单页网站。

**Architecture:** Vite 提供构建与开发服务器，页面内容由独立数据模块驱动，Three.js 管理固定全屏 3D 场景，GSAP 管理滚动显现，音频控制器负责首次交互播放与静音状态。页面所有功能均为前端静态实现。

**Tech Stack:** Vite, JavaScript, Three.js, GSAP, Vitest

---

### Task 1: 项目与内容数据

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/content.js`
- Create: `tests/content.test.js`

- [ ] 编写内容测试，验证 12 个主题、100 条唯一编号和完整编号范围。
- [ ] 运行 `npm.cmd test -- --run tests/content.test.js` 并确认因内容模块缺失而失败。
- [ ] 创建内容模块和基础 Vite 配置，使测试通过。

### Task 2: 音频控制

**Files:**
- Create: `src/audio-controller.js`
- Create: `tests/audio-controller.test.js`

- [ ] 编写测试，验证首次启动播放、静音切换和状态订阅。
- [ ] 运行测试并确认因控制器缺失而失败。
- [ ] 实现音频控制器并使测试通过。

### Task 3: 页面结构与样式

**Files:**
- Create: `src/main.js`
- Create: `src/styles.css`

- [ ] 构建加载层、固定导航、章节内容、主题卡片、完整索引和页尾。
- [ ] 实现桌面与移动端的排版、滚动显现和交互样式。
- [ ] 将背景音乐接入进入按钮和声音控制。

### Task 4: WebGL 场景

**Files:**
- Create: `src/scene.js`

- [ ] 创建粒子星场、动态环体、网格地形和发光核心。
- [ ] 根据滚动进度驱动颜色、镜头、模型旋转和地形运动。
- [ ] 根据设备性能和可减少动画偏好降低负载。

### Task 5: 验证与审查

**Files:**
- Modify as required by findings.

- [ ] 运行 `npm.cmd test -- --run`。
- [ ] 运行 `npm.cmd run build`。
- [ ] 在本地浏览器检查桌面和移动端，确认导航、完整内容、音乐和控制台。
- [ ] 执行代码审查并修复重要问题。
