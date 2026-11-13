/**
 * V2 其余页面正文：知识库首页、工具中心、知识地图、学习路径、全站搜索、术语词典。
 * 这些页面以交互组件为主，正文负责定位、边界声明与使用说明。
 */

import { CD, CO, CU, L, LEAD, P, S, T, SIM, type TopicPageContent } from "@/data/v2-content";

const hubHome: TopicPageContent = {
  sections: [
    S("hv-overview", "定位与边界",
      LEAD("V1《企业级知识工程完整实战指南》的 12 章与 3 个交互工具<strong>全部保留</strong>。V2.0 在其之上增加一套持续扩展的知识库：把知识建模、智能检索、知识智能体、企业语义、数据治理、数字孪生、企业架构与企业实践连成一张可导航的知识网络。"),
      P("本站不是重新开发的网站：原有封面、阅读模式、章节目录、搜索、主题、收藏、术语词典、评估仪表盘与全部交互图均继续使用原有组件与设计变量；新增页面通过顶栏「知识库」入口与全站搜索连接，旧链接 `/#<章节 id>` 保持可用。"),
      T(["", "V1（保留）", "V2.0（增量）"], [
        ["定位", "Ontology / KG / GraphRAG 技术白皮书", "Enterprise Knowledge Engineering Hub 企业知识库"],
        ["内容", "12 章 + 附录 + 20 组代码示例", "7 大专题 + 10 个架构模式 + ADR + 扩展术语"],
        ["交互工具", "知识图谱浏览器 / GraphRAG 架构与查询流程 / 选型决策器", "新增 5 个核心工具 + 知识关系浏览器 + 全屏架构图"],
        ["导航", "章节目录（单页锚点）", "九大多级导航 + 全站知识地图 + 四条学习路径"],
        ["数据", "IT 运维教学场景", "统一 IT Ops + Manufacturing 示例数据模型"],
      ], undefined, true),
      CO("assumption", "统一声明", "全站新增示例实体、指标、血缘、质量评分、设备状态与 Agent 轨迹均为<strong>本地确定性模拟数据</strong>，不是行业基准，不代表任何真实企业、设备或产品性能。"),
    ),
    S("hv-domains", "八大知识域",
      CD("A–H 知识域", [
        { title: "A · 知识建模", body: "Ontology 与 Knowledge Graph：定义概念、类型、关系与事实。", badge: "A", tone: "purple" },
        { title: "B · 知识检索", body: "RAG / GraphRAG / Agentic RAG：从单次检索到多步工作流。", badge: "B", tone: "blue" },
        { title: "C · 智能体", body: "Knowledge Agent 与 Enterprise AI Agent：带权限与审计的知识服务。", badge: "C", tone: "cyan" },
        { title: "D · 语义体系", body: "Enterprise Semantic Layer：统一业务术语、指标与数据映射。", badge: "D", tone: "green" },
        { title: "E · 数据治理", body: "Metadata / Lineage / Quality / Access Control / Lifecycle。", badge: "E", tone: "amber" },
        { title: "F · 数字世界", body: "Digital Twin / Asset Graph / Simulation / Digital Thread。", badge: "F", tone: "rose" },
        { title: "G · 企业架构", body: "八层总体架构、三套视图与横切治理。", badge: "G", tone: "blue" },
        { title: "H · 企业实践", body: "行业案例、架构模式、技术选型、实施路线与工程实践。", badge: "H", tone: "neutral" },
      ], 2),
      CU("home-domain-map"),
    ),
    S("hv-entry", "从哪里开始",
      L("按角色选择入口", [
        "知识图谱工程师 / 企业 AI 架构师 / 数据架构师 / 工业智能架构师 → 四条学习路径。",
        "想先看清全局 → 全站知识地图（支持搜索、按域过滤、1–3 跳浏览）。",
        "想先看工具 → 交互工具中心（V1 三个 + V2 五个）。",
        "想查一个概念或一段代码 → 全站搜索（覆盖新旧章节、术语、代码、模式与 ADR）。",
        "想看平台全貌 → 企业知识工程总体架构（全屏可交互分层图 + 三视图）。",
      ]),
      CU("home-quick-links"),
      CO("principle", "不存在必须采用的固定流水线", "Ontology → KG → GraphRAG → Agentic RAG 是一条常见学习路径，但不是技术依赖链。Digital Twin 可以用 Ontology 与 KG 但不一定需要 GraphRAG；Semantic Layer 可以独立服务 BI 与 AI；Agentic RAG 可以使用传统向量检索而不建知识图谱。"),
    ),
  ],
};

const tools: TopicPageContent = {
  sections: [
    S("tl-overview", "工具清单与模拟模式声明",
      LEAD("V1 的三个交互工具完整保留（企业知识图谱交互工具、GraphRAG 架构与查询流程交互工具、企业技术选型决策器）。V2 新增五个核心工具，另有知识关系浏览器、全屏架构图与模式库浏览器。"),
      CO("assumption", "模拟模式（重要）", "所有工具使用本地确定性模拟数据与规则，<strong>不连接任何真实 Agent、LLM、图数据库、搜索服务、企业 API 或 IoT 设备</strong>。" + SIM + "。输入相同必然得到相同输出，便于教学与回归验证。"),
      T(["", "工具", "所在页面", "交互能力"], [
        ["V1", "企业知识图谱交互工具", "原第 2 章（/#ch2-graph）", "搜索、中心实体、1–3 跳、类型过滤"],
        ["V1", "GraphRAG 架构 / 查询流程交互工具", "原第 6 章（/#ch6-architecture）", "组件详情、12 步时序、7 步查询演示"],
        ["V1", "企业技术选型决策器", "原第 7 章（/#ch7-decision）", "11 题问卷、透明评分、结果架构图"],
        ["V2-1", "Agentic RAG 流程模拟器", "/hub/agentic-rag", "自定义问题、逐步执行、证据与引用"],
        ["V2-2", "Knowledge Agent 架构设计器", "/hub/knowledge-agent", "角色/工具/权限配置、架构图生成"],
        ["V2-3", "Enterprise Semantic Model Explorer", "/hub/semantic-layer", "指标↔实体映射链路、权限与版本"],
        ["V2-4", "Knowledge Governance Explorer", "/hub/data-governance", "血缘节点、生命周期、质量仪表盘"],
        ["V2-5", "Digital Twin Simulator", "/hub/digital-twin", "资产状态、趋势、告警、传播路径"],
      ], undefined, true),
    ),
    S("tl-list", "八个交互工具",
      P("下方可直接跳转到每个工具的所在章节；工具本身内嵌在对应专题中，与正文一起阅读效果更好。"),
      CU("tool-tools-list"),
      CO("warning", "没有伪交互", "每个工具都有真实的状态变化：输入、选择、过滤、逐步执行、节点点击与详情面板均由 React state 驱动；没有任何「点击后只显示静态图」的占位控件。"),
    ),
  ],
};

const knowledgeMap: TopicPageContent = {
  sections: [
    S("km-browser", "知识关系浏览器",
      LEAD("节点代表知识专题与技术概念，连线代表<strong>依赖、关联、比较、应用、可选组合</strong>五种关系。支持搜索、按领域过滤、按关系类型过滤、点击节点查看详情与跳转对应章节，以及 1 到 3 跳关系浏览。"),
      CU("tool-knowledge-network"),
      CO("note", "「可选组合」不是依赖", "橙色/虚线类关系表示「可以一起用」，不表示「必须先有」。例如 Agentic RAG → GraphRAG 是可选组合；Semantic Layer → BI 是应用；Ontology ↔ Semantic Layer 是比较。"),
    ),
    S("km-paths", "多条合法学习路径说明",
      T(["路径", "示例链路", "说明"], [
        ["经典链路", "Ontology → KG → GraphRAG → Agentic RAG → Knowledge Agent → Semantic Layer → 企业 AI 平台", "常见但非强制"],
        ["数字孪生", "Digital Twin → Asset Model → Knowledge Graph → IoT Integration → Predictive Maintenance", "可以用 Ontology 和 KG，但不一定需要 GraphRAG"],
        ["语义独立", "Data Governance → Business Glossary → Semantic Layer → BI / AI", "可以独立服务 BI 和 AI，不需要 KG"],
        ["检索独立", "Traditional RAG → Agentic RAG → SQL / API 工具", "可以使用传统向量检索，不需要知识图谱"],
      ], undefined, true),
      CO("principle", "知识网络不是单一目录树", "允许不同路径是这次信息架构升级的核心：同一个概念可以在不同场景里处于上游、下游或完全缺席。"),
    ),
  ],
};

const learn: TopicPageContent = {
  sections: [
    S("lp-overview", "路径设计与进度记录",
      LEAD("四条学习路径按角色组织：知识图谱工程师（A）、企业 AI 架构师（B）、数据架构师（C）、工业智能架构师（D）。每条路径展示学习目标、前置知识、章节顺序、实践任务与学习成果。"),
      P("路径中的章节既有 V1 原有章节（保持旧链接），也有 V2 新专题。勾选状态保存在浏览器 localStorage，不会上传；清空按钮可重置本地进度。"),
      CO("assumption", "进度是本地状态", "阅读进度、收藏与最近访问都只存于当前浏览器，不涉及账号或服务端；换设备不会同步。"),
    ),
    S("lp-paths", "四条学习路径",
      CU("tool-learning-paths"),
      CU("recent-visits"),
    ),
  ],
};

const searchPage: TopicPageContent = {
  sections: [
    S("gs-search", "搜索入口",
      LEAD("一次检索覆盖 V1 的 12 章 + 附录、65 个小节、36 条术语、16 条 FAQ、20 组代码示例，以及 V2 的专题、小节、交互工具、架构模式、ADR 与扩展术语。"),
      P("支持按类别过滤（章节 / 小节 / 专题 / 术语 / FAQ / 代码 / 模式 / ADR / 工具）与多关键词匹配；结果高亮命中词，回车跳转第一条。V1 顶栏的原有搜索弹窗仍然可用，并且现在也能搜到 V2 内容。"),
      CU("tool-global-search"),
      CO("note", "跨路由跳转", "V1 内容跳转到 `/#<锚点>` 并自动进入阅读模式；V2 内容跳转到 `/hub/...`。两条路径都保留，旧链接不会被改写。"),
    ),
  ],
};

const glossaryPage: TopicPageContent = {
  sections: [
    S("gl-terms", "全部术语",
      LEAD("在原有 36 条术语基础上扩展 V2 的检索与智能体、语义与指标、治理与安全、数字孪生与架构术语。支持关键词搜索、分类过滤、展开技术解释与点击关联跳转。"),
      CU("tool-glossary-v2"),
      CO("note", "术语边界", "术语表给出简明定义与关联概念；完整边界说明（例如 Ontology ≠ Semantic Layer、GraphRAG ≠ Agentic RAG）请查看对应专题页面。"),
    ),
  ],
};

export const miscContent: Record<string, TopicPageContent> = {
  "hub-home": hubHome,
  tools,
  "knowledge-map": knowledgeMap,
  learn,
  search: searchPage,
  glossary: glossaryPage,
};

