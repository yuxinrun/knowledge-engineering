# Ontology × Knowledge Graph × GraphRAG

中文企业级技术白皮书 + 交互式学习平台。基于 Next.js 15 App Router、TypeScript、Tailwind CSS、Radix/shadcn 风格组件、React Flow、Recharts、Prism 与 KaTeX。

## 运行

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建
npm run start    # 启动生产构建
npm run typecheck
```

要求 Node.js >= 20.9（开发环境为 v22.12.0）。无需任何后端或云凭证：所有图谱、架构图、检索演示与评估指标均为**本地模拟数据**，页面中的 Python / Cypher / Azure 代码示例仅作教学用途，不会被执行。

若本地残留的 `.next` 被文件锁定，可用 `NEXT_DIST_DIR=.next-local npm run build` / `NEXT_DIST_DIR=.next-local npm run start` 指定独立构建目录；CI 中无需设置。

## 首页与阅读模式

- 首次打开为**封面模式**：全幅米白背景铺满视口（无居中卡片与左右留白），左侧标题/说明/按钮，右侧为可拖动、可点击的「知识工程循环」交互图；不显示左右侧边栏。布局参考 yuxin.run 的 Field Guide 首屏。
- 点击「开始学习」进入**阅读模式**：显示 12 章正文、左侧章节目录与右侧本章目录，并自动定位到第 1 章。
- 左右侧栏各自可**收起 / 展开**（顶部按钮），状态保存在 localStorage；收起后主内容自动占满宽度，页面左上/右上出现展开按钮。
- 顶部「封面」按钮可随时返回封面；移动端目录为抽屉式，封面与阅读区均为单列自适应。
- 「Checklist」按钮打开可勾选的学习清单（本地保存进度）；「术语词典」打开 36 条术语检索面板。

## GitHub Pages 自动部署

站点地址：`https://www.yuxin.run/knowledge-engineering/`（仓库已绑定自定义域名；`https://yuxinrun.github.io/knowledge-engineering/` 会重定向到此地址）

- 工作流：`.github/workflows/deploy.yml`，每次推送到 `main`（或手动 `workflow_dispatch`）自动执行 `npm ci` → 静态导出 → 上传 artifact → `actions/deploy-pages@v4` 部署。
- 静态导出由环境变量 `GITHUB_PAGES=true` 开启：`output: 'export'`、`basePath: /knowledge-engineering`、`trailingSlash`；`distDir` 被设为 `.next-pages`，因此导出产物位于 `.next-pages/`（工作流上传该目录）。`public/.nojekyll` 保证 `_next/` 资源不被 Jekyll 忽略。
- 本地复现导出（PowerShell）：

  ```powershell
  $env:GITHUB_PAGES = 'true'
  $env:NEXT_PUBLIC_BASE_PATH = '/knowledge-engineering'
  npm run build:pages
  ```

- 一次性配置：仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。工作流会尝试自动启用 Pages；若 `GITHUB_TOKEN` 权限不足导致启用失败，按此步骤手动选择即可，之后每次推送都会自动部署。
- 若改用自定义域名：把 `deploy.yml` 中 `NEXT_PUBLIC_BASE_PATH` 设为空字符串，并在 `public/CNAME` 写入域名。

## 结构

| 目录 | 说明 |
| --- | --- |
| `app/` | 页面入口、全局样式与主题初始化 |
| `components/ui/` | CodeBlock、Callout、DataTable、Dialog、Tabs、Accordion 等通用组件 |
| `components/viz/` | 12+ 个交互式可视化（React Flow / Recharts / 交互流程图） |
| `components/chapters/` | 12 章中文技术内容 |
| `components/site-shell.tsx` | 导航、目录、搜索、主题、收藏、阅读进度、移动端抽屉 |
| `data/` | 章节元数据、术语、FAQ、代码、图谱与架构节点、评估指标、选型规则 |

## 内容说明

- 书中 IT 运维场景（OrderSystem / PaymentService / Incident-001 等）、评估指标、排期均为**教学示例假设**，不是真实客户数据或行业统计。
- 技术结论区分「行业通用原则」「架构建议」「示例假设 / 演示数据」三类标注。
- Azure / Neo4j / OWL 相关 API 具有版本敏感性，请以官方参考链接（站内「附录」）为准。
