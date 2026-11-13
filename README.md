# Ontology × Knowledge Graph × GraphRAG

中文企业级技术白皮书 + 交互式学习平台。基于 Next.js 15 App Router、TypeScript、Tailwind CSS、Radix/shadcn 风格组件、React Flow、Recharts、Prism 与 KaTeX。

> **V2.0《Enterprise Knowledge Engineering Hub / 企业知识工程知识库》**：在原白皮书（12 章 + 附录 + 3 个交互工具）之上做**增量升级**，新增 15 个 `/hub/*` 静态路由、7 大专题、5 个核心交互工具、全屏八层架构图、10 个架构模式、6 份 ADR、知识关系浏览器与 4 条学习路径。原有页面、组件、锚点与旧链接 `/#<章节 id>` 全部保留；详见文末「V2.0 增量升级」。

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

## V2.0 增量升级

### 本地启动

```bash
npm install
npm run dev        # http://localhost:3000  → 封面 /# 为 V1，/hub 为 V2 知识库首页
npm run build      # 生产构建（标准输出）
npm run start      # 启动生产构建
npm run typecheck  # TypeScript 检查
```

GitHub Pages 静态导出（CI 使用，见 `.github/workflows/deploy.yml`）：

```powershell
$env:GITHUB_PAGES = 'true'
$env:NEXT_PUBLIC_BASE_PATH = '/knowledge-engineering'
npm run build:pages     # 产物：.next-pages/（含 17 个页面 html）
```

### 路由清单

| 路由 | 内容 |
| --- | --- |
| `/`、`/#<章节 id>` | **V1 原有 12 章 + 附录 + 3 个交互工具**（未改动），封面/阅读模式 |
| `/hub` | 知识库首页：定位、八大知识域、入口 |
| `/hub/retrieval` | 智能检索与推理（Traditional / Hybrid / GraphRAG / Agentic / Multi-Agent / Evaluation） |
| `/hub/agentic-rag` | 专题一 + 工具 1：Agentic RAG 流程模拟器 |
| `/hub/knowledge-agent` | 专题二 + 工具 2：Knowledge Agent 架构设计器 |
| `/hub/semantic-layer` | 专题三 + 工具 3：Enterprise Semantic Model Explorer |
| `/hub/data-governance` | 专题四 + 工具 4：Knowledge Governance Explorer + 质量仪表盘 |
| `/hub/digital-twin` | 专题五 + 工具 5：Digital Twin Simulator |
| `/hub/architecture` | 专题六：全屏八层总体架构图（技术逻辑 / Azure 参考 / 技术中立三视图） |
| `/hub/patterns` | 专题七：10 个架构模式（统一 14 项模板）+ 6 份 ADR |
| `/hub/solutions` | 六类企业解决方案 |
| `/hub/engineering` | 路线图、ADR、模式、反模式、测试、安全合规、成本性能 |
| `/hub/tools` | 交互工具中心（V1 三个 + V2 五个 + 附加浏览器） |
| `/hub/knowledge-map` | 知识关系浏览器：搜索 / 域过滤 / 关系过滤 / 1–3 跳 / 上下游 / 章节跳转 |
| `/hub/learn` | 四条学习路径 + 本地勾选进度 + 最近访问 |
| `/hub/search` | 全站搜索：新旧章节、专题、概念、术语、FAQ、代码、工具、模式、ADR、路径 |
| `/hub/glossary` | 扩展术语词典（V1 36 条 + V2 24 条） |

### 交互工具

- **V1 保留**：`KnowledgeGraphExplorer`（ch2）、`AzureArchitectureDiagram` / `QuerySequenceDiagram` / `QueryFlowDemo`（ch6）、`DecisionMaker`（ch7）。
- **V2 新增**：Agentic RAG 流程模拟器、Knowledge Agent 架构设计器、Enterprise Semantic Model Explorer、Knowledge Governance Explorer（含血缘图与质量评分仪表盘）、Digital Twin Simulator。
- **附加浏览器**：知识关系浏览器、全屏企业架构图、架构模式库、学习路径、全站搜索、扩展术语词典。

所有工具均为**本地确定性模拟数据与规则**，不连接任何真实 Agent、LLM、图数据库、搜索服务、企业 API 或 IoT 设备；页面内均明确标注模拟模式。图表复用 V1 的 `FlowCanvas`（React Flow）与 Recharts 组件，支持节点点击、拖动、缩放、过滤与详情面板。

### 代码结构

| 目录 | 说明 |
| --- | --- |
| `app/hub/layout.tsx` + `app/hub/*/page.tsx` | V2 静态路由（每个页面只声明 metadata 与 `TopicPage pageId`） |
| `components/v2/hub-shell.tsx` | 多级导航、面包屑、主题、搜索弹窗、收藏、最近访问、阅读进度、移动端抽屉 |
| `components/v2/topic-page.tsx` | 通用内容渲染器 + 知识关联面板 + 前后导航 + 打印 |
| `components/v2/interactive.tsx` | `{ type: "custom", name }` 内容块 → 交互组件注册表 |
| `components/v2/tools/`、`components/v2/blocks.tsx` | 5 个核心工具 + 浏览器 + 小型交互块 |
| `data/v2-model.ts` | **统一企业场景数据模型**：IT Ops / Manufacturing 实体与关系、稳定 ID、统一元数据契约、语义指标、血缘、质量指标、孪生模拟数据 |
| `data/v2-hub.ts` | 9 大导航组、页面注册、知识网络（节点/边）、4 条学习路径、扩展术语 |
| `data/v2-content*.ts` | 专题正文（数据驱动，按专题组合不同可视化 block） |
| `data/v2-architecture.ts` | 8 层 / 54 组件 / 三视图 / 上下游连线 |
| `data/v2-patterns.ts` | 10 个架构模式 + 6 份 ADR |
| `data/v2-diagrams.ts`、`data/v2-simulations.ts` | React Flow 图数据与工具模拟数据 |
| `data/search-index.ts` | 扩展为 11 个类别，覆盖新旧章节、代码、模式、ADR、工具与概念 |
| `lib/v2-storage.ts`、`lib/v2-metadata.ts` | localStorage 状态与 per-route metadata |

### 边界与数据声明

- 新增示例实体（IT Ops 沿用 `SVC-002` / `INC-001` 等 V1 ID，Manufacturing 使用 `FAC-A` / `LINE-01` / `MCH-001` 等稳定 ID）、指标定义、血缘、质量评分、设备状态与 Agent 轨迹**全部为本地确定性模拟数据**，不是行业基准，不代表任何真实企业、设备或产品性能。
- 语义层的 5 个 IT 运营指标均标注为**演示定义**，不是任何真实企业的标准口径。
- 严格区分：Ontology ≠ Knowledge Graph、Knowledge Graph ≠ GraphRAG、GraphRAG ≠ Agentic RAG、Agentic RAG ≠ Knowledge Agent、Ontology ≠ Semantic Layer、Knowledge Graph ≠ Digital Twin、Digital Twin ≠ 监控大屏、Data Governance ≠ 数据库权限管理。
- 不存在必须采用的固定流水线；技术选型基于业务问题、数据特征、准确性、安全与维护成本。GraphRAG 不必然优于传统 RAG；Agent 数量不是能力指标；LLM 置信度不等于来源权威性；权限必须贯穿向量检索、图遍历、上下文融合与最终回答；生产系统不能只依赖提示词作为安全边界。
- Azure / AWS / Neo4j / OWL / SHACL 等产品能力与 API 具**版本敏感性**，文中仅作能力映射示例，不承诺功能、配额或性能；请以站内附录的可点击官方参考链接为准。
