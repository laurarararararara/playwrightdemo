# Playwright 0→1 入门 Demo

一个小而完整的练习项目：从「跑通第一条用例」到「Page Object + 配置」。

## 项目结构

```text
playwright-demo/
├── playwright.config.ts   # 全局配置（浏览器、baseURL、报告）
├── public/                # 本地练习站（图片、按钮、表单、弹窗）
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── assets/
├── tests/
│   ├── 01-hello.spec.ts   # 第一课：最小用例
│   ├── 02-todo.spec.ts    # 第二课：TodoMVC + POM
│   └── 03-demo-site.spec.ts # 第三课：本地练习站
├── pages/
│   ├── TodoPage.ts        # Page Object 示例
│   └── DemoPage.ts
└── package.json
```

## 环境要求

- **Node.js 18+**（带 npm）
- 若终端里只有 `node` 没有 `npm`，请安装完整 Node：https://nodejs.org  
  或 macOS：`brew install node`

## 快速开始

```bash
cd ~/playwright-demo

# 1. 安装依赖
npm install

# 2. 安装浏览器（只需第一次）
npx playwright install chromium

# 3. 跑全部用例（无头）
npm test

# 4. 有界面看浏览器怎么点（推荐第一次用这个）
npm run test:headed

# 4b. 只看本地练习站（图片 / 按钮 / 表单 / 弹窗）
npm run site
# 浏览器打开 http://127.0.0.1:4173

# 4c. 有界面跑本地练习站用例
npm run test:headed -- tests/03-demo-site.spec.ts

# 5. 可视化调试 UI（Playwright 自带，非常好用）
npm run test:ui

# 6. 逐步调试某一条
npm run test:debug -- tests/01-hello.spec.ts

# 7. 看最新测试日志
npm run report
```

## 测试日志

每次跑测试会在 `logs/` 目录生成一个按时间命名的日志文件，例如：

```text
logs/2026-05-30_172527.log
```

日志内容包括：
- 每条用例的**执行步骤**（点击、跳转、断言等）
- 每条用例的**成功 / 失败**状态和耗时
- 最后的**汇总**

查看最新日志：

```bash
npm run report
```

或直接打开 `logs/` 目录里最新的 `.log` 文件。

## 部署练习站到 GitHub Pages

`public/` 是纯静态页面，推送到 GitHub 后会自动部署，**电脑关机也能访问**。

### 第一次（只需做一次）

1. 在 GitHub 新建空仓库，例如 `playwright-demo`（不要勾选 README）
2. 本地推送：

```bash
cd ~/playwright-demo
git remote add origin https://github.com/你的用户名/playwright-demo.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages → Build and deployment**
4. **Source** 选 **GitHub Actions**（不是 Deploy from branch）
5. 等 Actions 跑完，访问：`https://你的用户名.github.io/playwright-demo/`

### 以后更新页面

改完 `public/` 里的文件后：

```bash
git add public/
git commit -m "update demo site"
git push
```

推送后 GitHub Actions 会自动重新部署（约 1 分钟）。

## 学习路径（建议顺序）

| 步骤 | 文件 | 学什么 |
|------|------|--------|
| 1 | `tests/01-hello.spec.ts` | `page.goto`、`getByRole`、断言 |
| 2 | `playwright.config.ts` | baseURL、trace、截图、报告 |
| 3 | `tests/02-todo.spec.ts` | 多条用例、`test.describe` |
| 4 | `pages/TodoPage.ts` | Page Object，用例只写业务 |
| 5 | `public/index.html` + `tests/03-demo-site.spec.ts` | 本地页面：图片、按钮、表单、弹窗 |

## 常用命令备忘

```bash
# 只跑某一个文件
npx playwright test tests/02-todo.spec.ts

# 只跑 chromium 里名字匹配的用例
npx playwright test -g "添加两条"

# 录制脚本（Codegen，适合入门）
npx playwright codegen https://demo.playwright.dev/todomvc
```

## 下一步可以练什么

1. 给 `TodoPage` 加 `deleteTodo()`、`clearCompleted()`
2. 在 `playwright.config.ts` 里加 `firefox` project 做跨浏览器
3. 用 `test.beforeEach` 每条用例前自动 `goto` 并清空列表
4. 把 `01-hello` 改成测你自己常访问的一个公开页面

## Demo 用的公开站点

- https://playwright.dev — 官网 smoke
- https://demo.playwright.dev/todomvc — 官方 Todo 练习站（无需本地起服务）
