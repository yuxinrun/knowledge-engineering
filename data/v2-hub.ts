/**
 * V2.0 信息架构单一真相源：导航、页面注册、知识网络、学习路径、术语扩展。
 * 旧站（12 章 + 附录）继续以 `/#<id>` 访问，本文件不修改 data/site.ts。
 */

export interface NavItem { label: string; href: string; note?: string }
export interface NavGroup { id: string; label: string; en: string; items: NavItem[] }

/** 九大导航组。子项指向新专题页、页内锚点或原有章节（保留旧链接）。 */
export const hubNavGroups: NavGroup[] = [
  {
    id: "nav-foundation", label: "知识工程基础", en: "Foundations",
    items: [
      { label: "Ontology", href: "/#ch3-ontology", note: "原有章节" },
      { label: "Knowledge Graph", href: "/#ch4-ingestion", note: "原有章节" },
      { label: "GraphRAG", href: "/#ch6-graphrag", note: "原有章节" },
      { label: "RAG 与 GraphRAG 对比", href: "/#ch7-compare-diagram", note: "原有章节" },
    ],
  },
  {
    id: "nav-retrieval", label: "智能检索与推理", en: "Retrieval & Reasoning",
    items: [
      { label: "Traditional RAG", href: "/hub/retrieval#rt-traditional" },
      { label: "Hybrid RAG", href: "/hub/retrieval#rt-hybrid" },
      { label: "GraphRAG", href: "/hub/retrieval#rt-graphrag" },
      { label: "Agentic RAG", href: "/hub/agentic-rag" },
      { label: "Multi-Agent RAG", href: "/hub/retrieval#rt-multi-agent" },
      { label: "Retrieval Evaluation", href: "/hub/retrieval#rt-evaluation" },
    ],
  },
  {
    id: "nav-agent", label: "企业知识智能体", en: "Knowledge Agents",
    items: [
      { label: "Knowledge Agent", href: "/hub/knowledge-agent" },
      { label: "Enterprise AI Agent", href: "/hub/knowledge-agent#ka-what" },
      { label: "Tool Calling", href: "/hub/knowledge-agent#ka-designer" },
      { label: "Planning and Reasoning", href: "/hub/agentic-rag#ar-capabilities" },
      { label: "Agent Memory", href: "/hub/knowledge-agent#ka-architecture" },
      { label: "Agent Governance", href: "/hub/knowledge-agent#ka-security" },
    ],
  },
  {
    id: "nav-semantic", label: "企业语义体系", en: "Semantic Layer",
    items: [
      { label: "Enterprise Semantic Layer", href: "/hub/semantic-layer" },
      { label: "Business Glossary", href: "/hub/semantic-layer#sl-concepts" },
      { label: "Semantic Model", href: "/hub/semantic-layer#sl-concepts" },
      { label: "Metrics Layer", href: "/hub/semantic-layer#sl-explorer" },
      { label: "Ontology 与 Semantic Layer", href: "/hub/semantic-layer#sl-compare" },
      { label: "Semantic Query", href: "/hub/semantic-layer#sl-chain" },
    ],
  },
  {
    id: "nav-governance", label: "企业数据治理", en: "Data Governance",
    items: [
      { label: "Metadata Management", href: "/hub/data-governance#dg-scope" },
      { label: "Data Catalog", href: "/hub/data-governance#dg-scope" },
      { label: "Data Lineage", href: "/hub/data-governance#dg-explorer" },
      { label: "Data Quality", href: "/hub/data-governance#dg-quality" },
      { label: "Master Data Management", href: "/hub/data-governance#dg-lifecycle" },
      { label: "Knowledge Governance", href: "/hub/data-governance" },
      { label: "Access Control", href: "/hub/data-governance#dg-security" },
      { label: "Data Lifecycle", href: "/hub/data-governance#dg-lifecycle" },
    ],
  },
  {
    id: "nav-twin", label: "数字孪生", en: "Digital Twin",
    items: [
      { label: "Digital Twin Fundamentals", href: "/hub/digital-twin#dt-what" },
      { label: "Asset Model", href: "/hub/digital-twin#dt-scenario" },
      { label: "Digital Twin Graph", href: "/hub/digital-twin#dt-scenario" },
      { label: "Real-time Data Integration", href: "/hub/digital-twin#dt-architecture" },
      { label: "Simulation", href: "/hub/digital-twin#dt-boundary" },
      { label: "Predictive Maintenance", href: "/hub/digital-twin#dt-simulator" },
      { label: "Digital Thread", href: "/hub/digital-twin#dt-concepts" },
    ],
  },
  {
    id: "nav-architecture", label: "企业架构实验室", en: "Architecture Lab",
    items: [
      { label: "Enterprise Knowledge Architecture", href: "/hub/architecture" },
      { label: "Azure Reference Architecture", href: "/hub/architecture#ea-views" },
      { label: "AWS Reference Architecture", href: "/hub/architecture#ea-views" },
      { label: "Hybrid / Multi-cloud Architecture", href: "/hub/architecture#ea-views" },
      { label: "Knowledge Platform Architecture", href: "/hub/architecture#ea-map" },
      { label: "Agent Platform Architecture", href: "/hub/knowledge-agent#ka-architecture" },
    ],
  },
  {
    id: "nav-solutions", label: "企业解决方案", en: "Solutions",
    items: [
      { label: "IT Operations", href: "/hub/solutions#so-itops" },
      { label: "Financial Risk", href: "/hub/solutions#so-risk" },
      { label: "Supply Chain", href: "/hub/solutions#so-supply" },
      { label: "Manufacturing", href: "/hub/solutions#so-manufacturing" },
      { label: "Enterprise Knowledge Management", href: "/hub/solutions#so-ekm" },
      { label: "Customer 360", href: "/hub/solutions#so-customer360" },
    ],
  },
  {
    id: "nav-engineering", label: "实施与工程实践", en: "Engineering",
    items: [
      { label: "Project Roadmap", href: "/hub/engineering#en-roadmap" },
      { label: "Architecture Decision Records", href: "/hub/engineering#en-adr" },
      { label: "Design Patterns", href: "/hub/patterns" },
      { label: "Anti-patterns", href: "/hub/engineering#en-antipatterns" },
      { label: "Testing and Evaluation", href: "/hub/engineering#en-testing" },
      { label: "Security and Compliance", href: "/hub/engineering#en-security" },
      { label: "Cost and Performance", href: "/hub/engineering#en-cost" },
    ],
  },
];

export const hubExtraLinks: NavItem[] = [
  { label: "知识库首页", href: "/hub" },
  { label: "全站知识地图", href: "/hub/knowledge-map" },
  { label: "交互工具中心", href: "/hub/tools" },
  { label: "学习路径", href: "/hub/learn" },
  { label: "架构模式库 / ADR", href: "/hub/patterns" },
  { label: "全站搜索", href: "/hub/search" },
  { label: "术语词典（扩展版）", href: "/hub/glossary" },
  { label: "返回 V1 白皮书封面", href: "/" },
];

export interface HubSection { id: string; title: string }

export interface TopicRelations {
  core: string[];
  prereq: string[];
  related: string[];
  upstream: string[];
  downstream: string[];
  compare: string[];
  applications: string[];
  patterns: string[];
  code: string[];
}

const emptyRelations = (): TopicRelations => ({
  core: [], prereq: [], related: [], upstream: [], downstream: [],
  compare: [], applications: [], patterns: [], code: [],
});

export interface HubPageDef {
  id: string;
  slug: string;
  title: string;
  en: string;
  short: string;
  eyebrow: string;
  subtitle: string;
  domain: string;
  minutes: number;
  keywords: string[];
  sections: HubSection[];
  relations: TopicRelations;
  tools?: string[];
}

const S = (id: string, title: string): HubSection => ({ id, title });

export const hubPages: HubPageDef[] = [
  {
    id: "hub-home", slug: "hub", title: "Enterprise Knowledge Engineering Hub", en: "Knowledge Base Home",
    short: "知识库首页", eyebrow: "V2.0 · KNOWLEDGE HUB", domain: "总览", minutes: 8,
    subtitle: "企业知识工程知识库：把知识建模、检索、智能体、语义体系、数据治理、数字孪生与企业架构连成一张可导航的知识网络。",
    keywords: ["知识工程", "企业知识库", "知识地图", "学习路径", "V2.0"],
    sections: [S("hv-overview", "定位与边界"), S("hv-domains", "八大知识域"), S("hv-entry", "从哪里开始")],
    relations: emptyRelations(),
  },
  {
    id: "retrieval", slug: "hub/retrieval", title: "智能检索与推理：从单次检索到多智能体检索", en: "Retrieval & Reasoning",
    short: "智能检索与推理", eyebrow: "DOMAIN B · RETRIEVAL", domain: "智能检索", minutes: 18,
    subtitle: "Traditional RAG、Hybrid RAG、GraphRAG、Agentic RAG、Multi-Agent RAG 与检索评估的边界、代价和适用条件。",
    keywords: ["Traditional RAG", "Hybrid RAG", "GraphRAG", "Agentic RAG", "Multi-Agent RAG", "Retrieval Evaluation", "Recall@K"],
    sections: [S("rt-traditional", "Traditional RAG：单次检索基线"), S("rt-hybrid", "Hybrid RAG：关键词与向量融合"), S("rt-graphrag", "GraphRAG：知识检索与上下文组织"), S("rt-agentic", "Agentic RAG：Agent 控制的多步工作流"), S("rt-multi-agent", "Multi-Agent RAG：角色分工与协调成本"), S("rt-evaluation", "Retrieval Evaluation：先建基线再谈升级")],
    relations: { ...emptyRelations(), core: ["rag", "graphrag", "agentic-rag"], prereq: ["vector-index"], related: ["knowledge-agent", "evaluation"], upstream: ["kg", "document"], downstream: ["enterprise-ai-agent"], compare: ["rag", "graphrag", "agentic-rag"], applications: ["itops"], patterns: ["PAT-01", "PAT-02", "PAT-03", "PAT-05"], code: ["code-hybrid-search"] },
  },
  {
    id: "agentic-rag", slug: "hub/agentic-rag", title: "Agentic RAG：从一次检索到自主规划的知识检索系统", en: "Agentic RAG",
    short: "Agentic RAG 专题", eyebrow: "专题一 · AGENTIC RAG", domain: "智能检索", minutes: 26,
    subtitle: "Agentic RAG 是由 Agent 控制的多步骤检索与推理工作流；它可以调用 GraphRAG，也可以只调用向量检索、SQL 和 API。",
    keywords: ["Query Planning", "Query Decomposition", "Iterative Retrieval", "Tool Calling", "Reflection", "Answer Verification", "Agent Loop", "Stop Conditions", "Human-in-the-loop"],
    sections: [S("ar-what", "Agentic RAG 是什么，以及传统 RAG 为什么会失败"), S("ar-modes", "单次 RAG / GraphRAG / Agentic RAG 三种模式对比"), S("ar-architecture", "十步架构：从 User Query 到 Citation Verification"), S("ar-capabilities", "核心机制：规划、分解、迭代、反思与停止条件"), S("ar-simulator", "交互工具：Agentic RAG 流程模拟器"), S("ar-boundary", "代价、风险与什么时候应该坚持传统 RAG")],
    relations: { ...emptyRelations(), core: ["agentic-rag", "planning", "tool-calling", "reflection"], prereq: ["rag", "graphrag", "retrieval-eval"], related: ["knowledge-agent", "multi-agent-rag", "agent-memory"], upstream: ["vector-index", "kg", "business-api"], downstream: ["knowledge-agent", "enterprise-ai-agent"], compare: ["rag", "graphrag", "knowledge-agent"], applications: ["itops", "customer360"], patterns: ["PAT-05", "PAT-10"], code: ["code-agent-loop"] },
    tools: ["agentic-rag-simulator"],
  },
  {
    id: "knowledge-agent", slug: "hub/knowledge-agent", title: "Knowledge Agent：让企业知识库从被动问答走向主动知识服务", en: "Knowledge Agent",
    short: "Knowledge Agent 专题", eyebrow: "专题二 · KNOWLEDGE AGENT", domain: "企业知识智能体", minutes: 28,
    subtitle: "面向企业知识上下文、工具白名单、权限强制与审计追踪的知识智能体参考架构；角色是可选逻辑职责，不是必须部署七个服务。",
    keywords: ["Tool Registry", "Entity Resolution", "Graph Query", "Document Retrieval", "Business API", "Agent Memory", "Permission Enforcement", "Audit Trail", "Human Approval"],
    sections: [S("ka-what", "定义与四组关键区别"), S("ka-architecture", "企业 Knowledge Agent 参考架构"), S("ka-roles", "七类 Agent 逻辑角色与拆分判据"), S("ka-designer", "交互工具：Knowledge Agent 架构设计器"), S("ka-code", "Python 伪代码：Router / Registry / 权限 / 证据校验"), S("ka-security", "安全边界：白名单、最小权限与人工审批")],
    relations: { ...emptyRelations(), core: ["knowledge-agent", "tool-registry", "permission", "audit"], prereq: ["agentic-rag", "ontology", "kg", "semantic-layer"], related: ["enterprise-ai-agent", "agent-governance", "agent-memory"], upstream: ["kg", "document", "business-api", "semantic-layer"], downstream: ["enterprise-copilot"], compare: ["agentic-rag", "rag", "multi-agent-rag"], applications: ["itops", "ekm"], patterns: ["PAT-06", "PAT-10"], code: ["code-agent-router", "code-permission-check"] },
    tools: ["knowledge-agent-designer"],
  },
  {
    id: "semantic-layer", slug: "hub/semantic-layer", title: "企业语义层：让企业数据拥有统一的业务语言", en: "Enterprise Semantic Layer",
    short: "企业语义体系", eyebrow: "专题三 · SEMANTIC LAYER", domain: "企业语义体系", minutes: 24,
    subtitle: "统一业务术语、指标、维度、计算规则与底层数据映射；与 Ontology、Knowledge Graph、Data Catalog 相关但不等价。",
    keywords: ["Business Glossary", "Business Concept", "Semantic Model", "Metrics Layer", "Dimensions", "Measures", "Business Rules", "Semantic Query", "Metric Definition"],
    sections: [S("sl-what", "什么是 Enterprise Semantic Layer，为什么需要它"), S("sl-concepts", "术语、概念、语义模型、指标层与维度"), S("sl-compare", "与 Ontology / Knowledge Graph / Data Catalog 的区别"), S("sl-chain", "从业务术语到业务答案的七段链路"), S("sl-explorer", "交互工具：Enterprise Semantic Model Explorer"), S("sl-governance", "口径治理、演示定义声明与版本敏感性")],
    relations: { ...emptyRelations(), core: ["semantic-layer", "metrics-layer", "business-glossary", "semantic-query"], prereq: ["data-governance", "metadata"], related: ["ontology", "kg", "data-catalog", "bi"], upstream: ["warehouse", "data-quality"], downstream: ["business-api", "enterprise-ai-agent"], compare: ["ontology", "kg", "data-catalog"], applications: ["itops", "bi"], patterns: ["PAT-07", "PAT-08"], code: ["code-semantic-query"] },
    tools: ["semantic-model-explorer"],
  },
  {
    id: "data-governance", slug: "hub/data-governance", title: "Enterprise Data Governance：企业知识可信度、安全与生命周期管理", en: "Data Governance",
    short: "企业数据治理", eyebrow: "专题四 · DATA GOVERNANCE", domain: "数据治理", minutes: 30,
    subtitle: "从来源到过期的全生命周期治理模型、知识血缘、质量评分与权限贯穿链路；LLM 置信度不等于来源权威性。",
    keywords: ["Metadata", "Data Catalog", "Data Lineage", "Data Quality", "MDM", "Entity Resolution Governance", "Knowledge Provenance", "RBAC", "ABAC", "Data Masking", "Retention", "Temporal Data", "Audit", "Compliance"],
    sections: [S("dg-scope", "治理范围：十八个必须回答的主题"), S("dg-lifecycle", "知识治理模型：Source → Publication → Expiration"), S("dg-questions", "十个必答问题：知识可信度如何判定"), S("dg-explorer", "交互工具：Knowledge Governance Explorer 与知识血缘"), S("dg-quality", "交互工具：知识质量评分仪表盘"), S("dg-security", "权限贯穿、时态数据、审计与合规")],
    relations: { ...emptyRelations(), core: ["data-governance", "lineage", "data-quality", "provenance", "access-control"], prereq: ["metadata", "data-catalog"], related: ["kg", "semantic-layer", "entity-resolution"], upstream: ["source-system"], downstream: ["kg", "vector-index", "knowledge-agent"], compare: ["data-catalog", "semantic-layer"], applications: ["itops", "risk"], patterns: ["PAT-08"], code: ["code-lineage-record"] },
    tools: ["governance-explorer", "quality-dashboard"],
  },
  {
    id: "digital-twin", slug: "hub/digital-twin", title: "Digital Twin：从企业知识图谱到现实世界的数字映射", en: "Digital Twin",
    short: "数字孪生", eyebrow: "专题五 · DIGITAL TWIN", domain: "数字世界", minutes: 26,
    subtitle: "现实对象、状态数据与持续同步机制三者缺一不可；用 Factory-A / Line-01 / Machine-001 贯穿资产、遥测、仿真与预测性维护。",
    keywords: ["Digital Model", "Digital Shadow", "Physical Asset", "Asset Hierarchy", "Event Stream", "Time Series", "Simulation", "Predictive Maintenance", "Digital Thread", "Controlled Actuation"],
    sections: [S("dt-what", "Digital Twin 与 Digital Model / Shadow 的区别"), S("dt-concepts", "十四个核心概念与职责边界"), S("dt-architecture", "从物理世界到受控执行的十层架构"), S("dt-scenario", "制造业场景：统一资产模型与关系方向"), S("dt-simulator", "交互工具：Digital Twin Simulator"), S("dt-boundary", "与知识图谱、时序库、仿真和 Agent 的关系")],
    relations: { ...emptyRelations(), core: ["digital-twin", "asset-model", "twin-state", "iot-integration"], prereq: ["kg", "ontology", "time-series"], related: ["predictive-maintenance", "simulation", "digital-thread"], upstream: ["sensor", "ontology"], downstream: ["knowledge-agent", "work-order"], compare: ["kg", "dashboard"], applications: ["manufacturing"], patterns: ["PAT-09"], code: ["code-twin-state"] },
    tools: ["digital-twin-simulator"],
  },
  {
    id: "architecture", slug: "hub/architecture", title: "企业知识工程总体架构：从数据到知识，再到智能决策", en: "Enterprise Knowledge Architecture",
    short: "企业知识工程总体架构", eyebrow: "专题六 · ENTERPRISE ARCHITECTURE", domain: "企业架构", minutes: 32,
    subtitle: "八层全景架构 + 横切治理，提供技术逻辑、Azure 参考与技术中立三套视图；没有任何云厂商产品是唯一标准答案。",
    keywords: ["Enterprise Data Sources", "Ingestion", "Knowledge Modeling", "Knowledge Storage", "Knowledge Services", "Intelligence Layer", "Enterprise Applications", "Cross-cutting Governance"],
    sections: [S("ea-overview", "八层分层架构总览"), S("ea-map", "全屏可交互总体架构图"), S("ea-views", "三套架构视图：技术逻辑 / Azure / 技术中立"), S("ea-decisions", "关键设计决策与上下游关系"), S("ea-anti", "常见反模式与可替代方案")],
    relations: { ...emptyRelations(), core: ["enterprise-architecture", "knowledge-platform", "agent-platform", "governance-plane"], prereq: ["kg", "data-governance", "semantic-layer"], related: ["knowledge-agent", "digital-twin", "graphrag"], upstream: ["source-system", "ontology"], downstream: ["enterprise-copilot", "itops"], compare: ["azure-architecture", "vendor-neutral"], applications: ["itops", "manufacturing", "risk"], patterns: ["PAT-01", "PAT-04", "PAT-09", "PAT-10"], code: ["code-layer-contract"] },
    tools: ["architecture-explorer"],
  },
  {
    id: "solutions", slug: "hub/solutions", title: "企业解决方案：六类业务场景的架构取舍", en: "Enterprise Solution Patterns",
    short: "企业解决方案", eyebrow: "DOMAIN H · SOLUTIONS", domain: "企业实践", minutes: 20,
    subtitle: "IT 运维、金融风控、供应链、制造、企业知识管理与 Customer 360：从业务问题出发判断需要哪些能力，而不是套用固定流水线。",
    keywords: ["IT Operations", "Financial Risk", "Supply Chain", "Manufacturing", "Enterprise Knowledge Management", "Customer 360", "案例边界"],
    sections: [S("so-itops", "IT Operations：故障传播与影响分析"), S("so-risk", "Financial Risk：关联网络与规则引擎"), S("so-supply", "Supply Chain：中断影响分析"), S("so-manufacturing", "Manufacturing：设备与维修知识"), S("so-ekm", "Enterprise Knowledge Management"), S("so-customer360", "Customer 360：身份统一与权限边界")],
    relations: { ...emptyRelations(), core: ["solution-pattern", "domain-scenario"], prereq: ["enterprise-architecture"], related: ["design-pattern", "adr"], upstream: ["kg", "semantic-layer"], downstream: ["enterprise-copilot"], compare: ["pattern"], applications: ["itops", "risk", "supply", "manufacturing", "ekm", "customer360"], patterns: ["PAT-01", "PAT-03", "PAT-09"], code: [] },
  },
  {
    id: "engineering", slug: "hub/engineering", title: "实施与工程实践：路线图、ADR、测试、安全与成本", en: "Implementation & Engineering",
    short: "实施与工程实践", eyebrow: "DOMAIN H · ENGINEERING", domain: "企业实践", minutes: 22,
    subtitle: "把架构落到交付物：阶段门禁、架构决策记录、设计模式与反模式、评估体系、安全合规以及成本与性能工程。",
    keywords: ["Project Roadmap", "ADR", "Design Patterns", "Anti-patterns", "Testing", "Security", "Compliance", "Cost", "Performance"],
    sections: [S("en-roadmap", "Project Roadmap 与阶段门禁"), S("en-adr", "Architecture Decision Records 写法"), S("en-patterns", "设计模式与模式库入口"), S("en-antipatterns", "十类高频反模式"), S("en-testing", "Testing and Evaluation：离线、在线与权限测试"), S("en-security", "Security and Compliance：不能只靠提示词"), S("en-cost", "Cost and Performance：预算、延迟与缓存")],
    relations: { ...emptyRelations(), core: ["adr", "evaluation", "design-pattern", "anti-pattern"], prereq: ["enterprise-architecture"], related: ["data-governance", "retrieval-eval"], upstream: ["enterprise-architecture"], downstream: ["production"], compare: [], applications: ["itops"], patterns: ["PAT-01", "PAT-10"], code: ["code-eval-set"] },
  },
  {
    id: "patterns", slug: "hub/patterns", title: "企业架构模式库与 ADR 示例", en: "Architecture Pattern Library",
    short: "架构模式库 / ADR", eyebrow: "专题七 · PATTERN LIBRARY", domain: "企业架构", minutes: 28,
    subtitle: "十个可复用的企业知识架构模式，统一模板覆盖问题、场景、架构、数据流、选型、复杂度、成本、风险、局限与替代方案。",
    keywords: ["Traditional RAG Pattern", "Hybrid Search Pattern", "GraphRAG Pattern", "Ontology-driven KG", "Agentic RAG Pattern", "Knowledge Agent Pattern", "Semantic Layer + AI", "Data Governance Pattern", "Digital Twin + KG", "Multi-Agent", "ADR"],
    sections: [S("pt-library", "架构模式库（统一模板 · 可交互）"), S("pt-adr", "Architecture Decision Records 示例"), S("pt-principles", "技术准确性十二条声明")],
    relations: { ...emptyRelations(), core: ["design-pattern", "adr"], prereq: ["enterprise-architecture"], related: ["solution-pattern", "anti-pattern"], upstream: ["enterprise-architecture"], downstream: ["production"], compare: ["pattern"], applications: ["itops", "manufacturing"], patterns: ["PAT-01", "PAT-10"], code: [] },
    tools: ["pattern-library"],
  },
  {
    id: "tools", slug: "hub/tools", title: "交互工具中心", en: "Interactive Tools",
    short: "交互工具中心", eyebrow: "LAB · INTERACTIVE TOOLS", domain: "实验工具", minutes: 10,
    subtitle: "V1 三个交互工具完整保留；V2 新增五个核心工具。全部使用本地确定性模拟数据，不会连接任何真实后端服务。",
    keywords: ["Agentic RAG 模拟器", "Knowledge Agent 设计器", "语义模型浏览器", "治理血缘浏览器", "数字孪生模拟器"],
    sections: [S("tl-overview", "工具清单与模拟模式声明"), S("tl-list", "八个交互工具")],
    relations: emptyRelations(),
  },
  {
    id: "knowledge-map", slug: "hub/knowledge-map", title: "全站知识地图与知识关系浏览器", en: "Knowledge Graph of Topics",
    short: "知识关系浏览器", eyebrow: "KNOWLEDGE NETWORK", domain: "知识网络", minutes: 14,
    subtitle: "节点是知识专题与技术概念，连线是依赖、关联、比较、应用与可选组合关系；支持搜索、按域过滤、上下游查看与 1–3 跳浏览。",
    keywords: ["知识地图", "Knowledge Network", "依赖", "关联", "比较", "应用", "多跳", "上下游"],
    sections: [S("km-browser", "知识关系浏览器"), S("km-paths", "多条合法学习路径说明")],
    relations: emptyRelations(),
    tools: ["knowledge-network"],
  },
  {
    id: "learn", slug: "hub/learn", title: "学习路径：四种角色，四条路线", en: "Learning Paths",
    short: "学习路径", eyebrow: "LEARNING PATHS", domain: "学习体验", minutes: 12,
    subtitle: "知识图谱工程师、企业 AI 架构师、数据架构师、工业智能架构师四条路径，每条包含目标、前置、顺序、实践任务与成果。",
    keywords: ["知识图谱工程师", "企业 AI 架构师", "数据架构师", "工业智能架构师", "实践任务", "学习成果"],
    sections: [S("lp-overview", "路径设计与进度记录"), S("lp-paths", "四条学习路径")],
    relations: emptyRelations(),
    tools: ["learning-paths"],
  },
  {
    id: "search", slug: "hub/search", title: "全站搜索：章节、专题、术语、代码与架构模式", en: "Global Search",
    short: "全站搜索", eyebrow: "GLOBAL SEARCH", domain: "检索", minutes: 6,
    subtitle: "一次检索覆盖 V1 的 12 章、附录、20 组代码示例，以及 V2 的专题、小节、工具、架构模式、ADR 与扩展术语。",
    keywords: ["全站搜索", "代码示例搜索", "架构模式搜索", "术语搜索"],
    sections: [S("gs-search", "搜索入口")],
    relations: emptyRelations(),
    tools: ["global-search"],
  },
  {
    id: "glossary", slug: "hub/glossary", title: "术语词典（扩展版）", en: "Extended Glossary",
    short: "术语词典", eyebrow: "GLOSSARY", domain: "术语", minutes: 10,
    subtitle: "在原有 36 条术语基础上扩展 V2 的语义层、智能体、治理与数字孪生术语；支持搜索、分类过滤与关联跳转。",
    keywords: ["Glossary", "术语", "Business Glossary", "Semantic Layer", "Agentic RAG", "Digital Twin"],
    sections: [S("gl-terms", "全部术语")],
    relations: emptyRelations(),
    tools: ["glossary-v2"],
  },
];

export const hubPageById: Record<string, HubPageDef> = Object.fromEntries(hubPages.map((p) => [p.id, p]));
export const topicPages = hubPages.filter((p) => p.relations.core.length > 0);
export function hubHref(page: HubPageDef): string { return `/${page.slug}`; }

/* ------------------------------------------------------------------ *
 * 全站知识网络
 * ------------------------------------------------------------------ */
export type KnowledgeDomain = "建模" | "检索" | "智能体" | "语义" | "治理" | "数字孪生" | "架构" | "实践" | "基础设施";
export type RelationKind = "依赖" | "关联" | "比较" | "应用" | "可选组合";

export interface KnowledgeNode {
  id: string;
  label: string;
  domain: KnowledgeDomain;
  href: string;
  summary: string;
  keywords: string[];
}

const N = (id: string, label: string, domain: KnowledgeDomain, href: string, summary: string, keywords: string[] = []): KnowledgeNode => ({
  id, label, domain, href, summary, keywords: [label, ...keywords],
});

export const knowledgeNodes: KnowledgeNode[] = [
  N("ontology", "Ontology 本体", "建模", "/#ch3-ontology", "定义概念、类型、关系与约束，是语义规约而非数据实例。", ["OWL", "SHACL"]),
  N("kg", "Knowledge Graph", "建模", "/#ch4-ingestion", "保存实体与关系事实，需要来源、时间、证据与治理。", ["Neo4j", "属性图", "Cypher"]),
  N("owl", "OWL / SHACL", "建模", "/#ch3-owl", "形式化公理与数据形状约束；何时需要、何时只需轻量领域模型。", ["W3C"]),
  N("entity-resolution", "Entity Resolution", "建模", "/#ch4-er", "把多来源提及合并为规范实体，需要治理与人工复核。", ["消歧", "MDM"]),
  N("document", "Document / Chunk", "基础设施", "/#ch4-pipeline", "原始文档与切分片段，是抽取与向量检索的共同输入。", ["Chunking"]),
  N("vector-index", "Vector / Hybrid Index", "基础设施", "/#ch6-search", "向量与关键词索引，支持企业文档检索。", ["Azure AI Search", "RRF"]),
  N("rag", "Traditional RAG", "检索", "/hub/retrieval#rt-traditional", "单次检索 + 生成基线，成本与延迟最低。", ["单次 RAG"]),
  N("hybrid-rag", "Hybrid RAG", "检索", "/hub/retrieval#rt-hybrid", "关键词 + 向量 + 重排，改善词汇与语义召回。", ["RRF", "Semantic Ranker"]),
  N("graphrag", "GraphRAG", "检索", "/hub/retrieval#rt-graphrag", "知识检索与上下文组织方法，不是 Agent 工作流。", ["图检索", "社区摘要"]),
  N("agentic-rag", "Agentic RAG", "检索", "/hub/agentic-rag", "由 Agent 控制的多步骤检索与推理工作流，不必然需要知识图谱。", ["Query Planning"]),
  N("multi-agent-rag", "Multi-Agent RAG", "检索", "/hub/retrieval#rt-multi-agent", "多角色分工检索，引入协调、通信与调试成本。", ["Multi-Agent"]),
  N("retrieval-eval", "Retrieval Evaluation", "检索", "/hub/retrieval#rt-evaluation", "Recall@K / MRR / NDCG / Faithfulness / Citation Accuracy。", ["评估"]),
  N("planning", "Planning & Decomposition", "智能体", "/hub/agentic-rag#ar-capabilities", "把复杂问题拆成可检索子任务并选择检索策略。", ["Agent Loop"]),
  N("tool-calling", "Tool Calling", "智能体", "/hub/knowledge-agent#ka-designer", "白名单工具调用，参数受 schema 与最小权限约束。", ["Tool Registry"]),
  N("reflection", "Reflection & Verification", "智能体", "/hub/agentic-rag#ar-capabilities", "证据充分性检查、引用验证与停止条件。", ["Answer Verification"]),
  N("knowledge-agent", "Knowledge Agent", "智能体", "/hub/knowledge-agent", "面向企业知识上下文、权限与审计的知识服务智能体。", ["Enterprise AI Agent"]),
  N("enterprise-ai-agent", "Enterprise AI Agent", "智能体", "/hub/knowledge-agent#ka-what", "企业场景下的智能体总称，Knowledge Agent 是其知识密集子类。", []),
  N("agent-memory", "Agent Memory", "智能体", "/hub/knowledge-agent#ka-architecture", "短期会话状态与长期知识记忆，必须带权限与时效。", []),
  N("agent-governance", "Agent Governance", "智能体", "/hub/knowledge-agent#ka-security", "工具白名单、审计、人工审批与失败降级。", []),
  N("tool-registry", "Tool Registry", "智能体", "/hub/knowledge-agent#ka-designer", "工具目录：schema、权限范围、超时、审计级别。", []),
  N("semantic-layer", "Enterprise Semantic Layer", "语义", "/hub/semantic-layer", "统一业务术语、指标、维度、计算规则与底层数据映射。", ["Metrics Layer"]),
  N("business-glossary", "Business Glossary", "语义", "/hub/semantic-layer#sl-concepts", "业务术语与定义的权威登记处。", []),
  N("metrics-layer", "Metrics Layer / Semantic Model", "语义", "/hub/semantic-layer#sl-explorer", "指标定义、维度、度量与口径版本。", ["Dimensions", "Measures"]),
  N("semantic-query", "Semantic Query", "语义", "/hub/semantic-layer#sl-chain", "按业务概念发起查询，由语义层翻译为物理查询。", []),
  N("data-catalog", "Data Catalog", "治理", "/hub/data-governance#dg-scope", "数据资产清单与发现入口，不负责统一指标口径。", []),
  N("metadata", "Metadata Management", "治理", "/hub/data-governance#dg-scope", "技术、业务与操作元数据的登记与维护。", []),
  N("lineage", "Data Lineage", "治理", "/hub/data-governance#dg-explorer", "从原文到生成答案的可追溯链路。", []),
  N("data-quality", "Data Quality", "治理", "/hub/data-governance#dg-quality", "完整性、有效性、重复率、血缘覆盖率与过期率。", []),
  N("provenance", "Knowledge Provenance", "治理", "/hub/data-governance#dg-questions", "来源、证据、版本、有效时间与审核状态。", []),
  N("data-governance", "Data Governance", "治理", "/hub/data-governance", "贯穿全生命周期的管理体系，不等于数据库权限。", ["RBAC", "ABAC"]),
  N("access-control", "Access Control", "治理", "/hub/data-governance#dg-security", "RBAC/ABAC/脱敏必须贯穿检索、遍历、融合与生成。", ["ACL", "Data Masking"]),
  N("permission", "Permission Enforcement", "治理", "/hub/knowledge-agent#ka-security", "执行时强制校验，不能依赖提示词约束。", []),
  N("audit", "Audit Trail", "治理", "/hub/knowledge-agent#ka-security", "记录每次工具调用、检索、证据与回答。", []),
  N("digital-twin", "Digital Twin", "数字孪生", "/hub/digital-twin", "现实对象 + 状态数据 + 持续同步；不是监控大屏。", []),
  N("asset-model", "Asset Model / Hierarchy", "数字孪生", "/hub/digital-twin#dt-scenario", "工厂、产线、设备、部件、传感器的层级关系。", []),
  N("twin-state", "Digital Twin State", "数字孪生", "/hub/digital-twin#dt-architecture", "现实对象的当前状态与历史轨迹。", []),
  N("iot-integration", "Real-time Data Integration", "数字孪生", "/hub/digital-twin#dt-architecture", "事件流与时序库承载随时间变化的遥测。", ["Event Stream", "Time Series"]),
  N("simulation", "Simulation", "数字孪生", "/hub/digital-twin#dt-boundary", "假设场景分析，输出建议而非直接控制设备。", []),
  N("predictive-maintenance", "Predictive Maintenance", "数字孪生", "/hub/digital-twin#dt-simulator", "基于状态与历史维修记录提出维护建议。", []),
  N("digital-thread", "Digital Thread", "数字孪生", "/hub/digital-twin#dt-concepts", "跨生命周期的数据与知识贯通链路。", []),
  N("enterprise-architecture", "Enterprise Knowledge Architecture", "架构", "/hub/architecture", "八层分层架构 + 横切治理，把能力组合成平台。", []),
  N("knowledge-platform", "Knowledge Platform", "架构", "/hub/architecture#ea-map", "知识建模、存储与服务的平台化封装。", []),
  N("agent-platform", "Agent Platform", "架构", "/hub/architecture#ea-map", "Agent 运行时、工具注册、观测与治理。", []),
  N("governance-plane", "Cross-cutting Governance", "架构", "/hub/architecture#ea-map", "身份、权限、审计、质量、监控、成本、安全、合规。", []),
  N("azure-architecture", "Azure Reference Architecture", "架构", "/hub/architecture#ea-views", "一种可选实现视图，不是唯一标准答案。", ["Azure AI Search", "Azure OpenAI"]),
  N("vendor-neutral", "Vendor-neutral Architecture", "架构", "/hub/architecture#ea-views", "按能力描述组件，不绑定具体产品。", []),
  N("design-pattern", "Design Patterns", "实践", "/hub/patterns", "可复用的架构模式与统一模板。", []),
  N("adr", "Architecture Decision Records", "实践", "/hub/patterns#pt-adr", "从业务问题出发记录取舍与后果。", []),
  N("anti-pattern", "Anti-patterns", "实践", "/hub/engineering#en-antipatterns", "高频错误做法及其代价。", []),
  N("evaluation", "Testing and Evaluation", "实践", "/hub/engineering#en-testing", "离线评估集、在线观测与权限泄漏测试。", []),
  N("solution-pattern", "Enterprise Solutions", "实践", "/hub/solutions", "按业务场景判断需要哪些能力。", []),
  N("itops", "IT Operations", "实践", "/hub/solutions#so-itops", "故障传播、影响分析与根因候选。", ["PaymentService", "INC-001"]),
  N("risk", "Financial Risk", "实践", "/hub/solutions#so-risk", "关联网络、规则引擎与可解释性。", []),
  N("supply", "Supply Chain", "实践", "/hub/solutions#so-supply", "中断影响分析。", []),
  N("manufacturing", "Manufacturing", "实践", "/hub/solutions#so-manufacturing", "设备、维修知识与数字孪生。", ["Factory-A"]),
  N("ekm", "Enterprise Knowledge Management", "实践", "/hub/solutions#so-ekm", "企业知识库与知识服务。", []),
  N("customer360", "Customer 360", "实践", "/hub/solutions#so-customer360", "身份统一与权限边界。", []),
  N("bi", "BI / Analytics", "基础设施", "/hub/semantic-layer#sl-what", "语义层可以独立服务 BI，不一定需要知识图谱。", []),
  N("warehouse", "Data Warehouse / Lakehouse", "基础设施", "/hub/architecture#ea-map", "结构化数据来源与物理映射目标。", []),
  N("business-api", "Business APIs", "基础设施", "/hub/knowledge-agent#ka-designer", "受控业务系统查询接口。", []),
  N("source-system", "Enterprise Data Sources", "基础设施", "/hub/architecture#ea-map", "PDF/Word/Excel/SharePoint/Confluence/SQL/ERP/CRM/ITSM/IoT。", []),
  N("time-series", "Time-series Database", "基础设施", "/hub/digital-twin#dt-boundary", "保存随时间变化的传感器数据。", []),
  N("sensor", "Sensors / IoT", "基础设施", "/hub/digital-twin#dt-architecture", "现实状态数据来源。", []),
  N("work-order", "Work Order / Human Approval", "实践", "/hub/digital-twin#dt-boundary", "敏感操作必须人工审批。", []),
  N("enterprise-copilot", "Enterprise Copilot", "实践", "/hub/architecture#ea-map", "面向员工的企业级 AI 入口。", []),
  N("production", "Production Operations", "实践", "/hub/engineering#en-cost", "上线后的监控、成本与演进。", []),
  N("pattern", "Pattern Selection", "实践", "/hub/patterns#pt-library", "按业务问题选择模式而非套用固定流水线。", []),
  N("dashboard", "Monitoring Dashboard", "数字孪生", "/hub/digital-twin#dt-what", "只呈现指标，不等于具备状态同步与反馈的数字孪生。", []),
  N("graphrag-vs-agentic", "GraphRAG vs Agentic RAG", "检索", "/hub/agentic-rag#ar-modes", "检索组织方法与 Agent 工作流是不同维度。", []),
];

export const knowledgeNodeById: Record<string, KnowledgeNode> = Object.fromEntries(knowledgeNodes.map((n) => [n.id, n]));

const E = (source: string, target: string, kind: RelationKind, note: string): { id: string; source: string; target: string; kind: RelationKind; note: string } => ({
  id: `KE-${source}-${target}-${kind}`, source, target, kind, note,
});

export const knowledgeEdges = [
  E("ontology", "kg", "依赖", "本体约束实体与关系类型，但本体不是图谱实例"),
  E("owl", "ontology", "可选组合", "OWL 是可选的形式化手段，轻量领域模型也常见"),
  E("document", "entity-resolution", "依赖", "抽取出的提及先消歧再入库"),
  E("entity-resolution", "kg", "依赖", "规范实体写入知识图谱"),
  E("document", "vector-index", "依赖", "Chunk 生成向量索引"),
  E("vector-index", "rag", "依赖", "向量检索是单次 RAG 的基础"),
  E("vector-index", "hybrid-rag", "依赖", "混合检索叠加关键词与重排"),
  E("kg", "graphrag", "依赖", "GraphRAG 使用图结构组织检索上下文"),
  E("vector-index", "graphrag", "可选组合", "GraphRAG 常与文档检索融合，但不是必需"),
  E("rag", "graphrag", "比较", "单次检索 vs 图增强上下文"),
  E("graphrag", "agentic-rag", "可选组合", "Agentic RAG 可以调用 GraphRAG，也可以完全不用"),
  E("vector-index", "agentic-rag", "可选组合", "Agentic RAG 不意味着一定需要知识图谱"),
  E("business-api", "agentic-rag", "可选组合", "Agent 可调用 SQL / API 作为检索工具"),
  E("rag", "agentic-rag", "比较", "一次检索 vs 多步规划"),
  E("graphrag", "graphrag-vs-agentic", "比较", "检索上下文组织 vs 工作流控制"),
  E("planning", "agentic-rag", "依赖", "查询规划与分解是 Agentic RAG 的核心"),
  E("tool-calling", "agentic-rag", "依赖", "工具调用承载多步检索"),
  E("reflection", "agentic-rag", "依赖", "证据评估与引用验证决定是否继续检索"),
  E("retrieval-eval", "agentic-rag", "关联", "多步检索必须评估延迟、成本与错误传播"),
  E("agentic-rag", "multi-agent-rag", "可选组合", "多 Agent 是可选分工，不是必然升级"),
  E("multi-agent-rag", "knowledge-agent", "关联", "角色分工可承载企业知识职责"),
  E("tool-registry", "knowledge-agent", "依赖", "工具白名单定义能力边界"),
  E("permission", "knowledge-agent", "依赖", "每次工具调用前强制鉴权"),
  E("audit", "knowledge-agent", "依赖", "全链路审计不可省略"),
  E("agent-memory", "knowledge-agent", "可选组合", "记忆需带权限与时效"),
  E("agent-governance", "knowledge-agent", "依赖", "治理决定能否上线"),
  E("knowledge-agent", "enterprise-ai-agent", "关联", "知识密集型企业智能体"),
  E("kg", "knowledge-agent", "可选组合", "图查询是可选工具之一"),
  E("semantic-layer", "knowledge-agent", "可选组合", "语义查询可统一指标口径"),
  E("document", "knowledge-agent", "可选组合", "原始文档检索提供证据"),
  E("knowledge-agent", "enterprise-copilot", "应用", "企业 Copilot 的知识能力底座"),
  E("ontology", "semantic-layer", "比较", "定义概念类型 vs 统一业务指标口径"),
  E("kg", "semantic-layer", "比较", "保存关系事实 vs 定义指标与映射"),
  E("data-catalog", "semantic-layer", "比较", "资产发现 vs 口径权威定义"),
  E("business-glossary", "semantic-layer", "依赖", "术语是语义层的输入"),
  E("metrics-layer", "semantic-layer", "依赖", "指标定义是语义层核心"),
  E("semantic-query", "semantic-layer", "依赖", "按业务概念查询"),
  E("semantic-layer", "bi", "应用", "语义层可独立服务 BI"),
  E("semantic-layer", "business-api", "应用", "统一指标通过 API 暴露给 AI 与业务系统"),
  E("warehouse", "metrics-layer", "依赖", "指标映射到物理表字段"),
  E("metadata", "data-governance", "依赖", "元数据是治理底座"),
  E("data-catalog", "data-governance", "依赖", "资产清单支撑责任归属"),
  E("lineage", "data-governance", "依赖", "血缘支撑可信度判断"),
  E("data-quality", "data-governance", "依赖", "质量指标驱动治理闭环"),
  E("provenance", "data-governance", "依赖", "来源、证据、时间与版本"),
  E("access-control", "data-governance", "依赖", "权限贯穿全生命周期"),
  E("data-governance", "kg", "应用", "知识图谱中的事实需要治理"),
  E("data-governance", "vector-index", "应用", "索引项需要 ACL 与安全过滤"),
  E("data-governance", "knowledge-agent", "应用", "治理约束 Agent 的工具与回答"),
  E("source-system", "metadata", "依赖", "来源登记是元数据起点"),
  E("ontology", "digital-twin", "可选组合", "本体可定义资产类型与关系"),
  E("kg", "digital-twin", "可选组合", "图谱描述设备、部件与业务关系"),
  E("asset-model", "digital-twin", "依赖", "资产层级是孪生结构骨架"),
  E("sensor", "iot-integration", "依赖", "遥测进入事件流"),
  E("iot-integration", "twin-state", "依赖", "状态持续同步"),
  E("twin-state", "simulation", "可选组合", "仿真基于状态做假设分析"),
  E("simulation", "predictive-maintenance", "应用", "预测性维护给出建议"),
  E("predictive-maintenance", "work-order", "依赖", "敏感操作需人工审批"),
  E("digital-twin", "dashboard", "比较", "孪生不是普通监控大屏"),
  E("digital-thread", "digital-twin", "关联", "跨生命周期贯通"),
  E("time-series", "twin-state", "依赖", "时序库保存历史状态"),
  E("enterprise-architecture", "knowledge-platform", "依赖", "平台化封装知识能力"),
  E("enterprise-architecture", "agent-platform", "依赖", "智能体运行时与工具治理"),
  E("governance-plane", "enterprise-architecture", "依赖", "横切覆盖所有层"),
  E("kg", "knowledge-platform", "依赖", "知识存储层"),
  E("agentic-rag", "agent-platform", "可选组合", "智能层能力之一"),
  E("knowledge-agent", "agent-platform", "可选组合", "智能层能力之一"),
  E("enterprise-architecture", "azure-architecture", "可选组合", "一种具体实现视图"),
  E("enterprise-architecture", "vendor-neutral", "可选组合", "能力视角的实现视图"),
  E("enterprise-architecture", "enterprise-copilot", "应用", "企业应用落地"),
  E("design-pattern", "adr", "关联", "模式取舍用 ADR 记录"),
  E("design-pattern", "anti-pattern", "比较", "正确做法与反模式对照"),
  E("adr", "evaluation", "关联", "决策需要评估数据验证"),
  E("solution-pattern", "design-pattern", "依赖", "业务场景映射到模式"),
  E("itops", "kg", "应用", "故障传播与影响分析"),
  E("itops", "semantic-layer", "应用", "统一 MTTR / 可用率口径"),
  E("itops", "agentic-rag", "应用", "多步根因分析"),
  E("risk", "kg", "应用", "关联网络"),
  E("supply", "kg", "应用", "中断影响分析"),
  E("manufacturing", "digital-twin", "应用", "设备状态与预测性维护"),
  E("ekm", "knowledge-agent", "应用", "主动知识服务"),
  E("customer360", "entity-resolution", "应用", "身份统一"),
  E("customer360", "access-control", "依赖", "客户数据权限严格"),
  E("evaluation", "production", "应用", "上线前建立基线"),
  E("retrieval-eval", "evaluation", "关联", "检索质量是评估子集"),
];

export const knowledgeDomains: KnowledgeDomain[] = ["建模", "检索", "智能体", "语义", "治理", "数字孪生", "架构", "实践", "基础设施"];
export const relationKinds: RelationKind[] = ["依赖", "关联", "比较", "应用", "可选组合"];

/* ------------------------------------------------------------------ *
 * 四条学习路径
 * ------------------------------------------------------------------ */
export interface LearningStep { label: string; href: string; task: string }
export interface LearningPath {
  id: string;
  code: string;
  role: string;
  title: string;
  goal: string;
  prerequisites: string[];
  steps: LearningStep[];
  outcomes: string[];
  accent: "cyan" | "blue" | "purple" | "green";
}

export const learningPaths: LearningPath[] = [
  {
    id: "LP-A", code: "A", role: "知识图谱工程师", title: "从语义建模到图谱检索", accent: "cyan",
    goal: "能独立完成一个受限业务域的本体设计、知识抽取与 GraphRAG 评估，并说明为什么需要（或不需要）每一层。",
    prerequisites: ["关系型数据库与 SQL 基础", "图的基本概念（节点 / 边 / 路径）", "Python 数据处理"],
    steps: [
      { label: "Ontology", href: "/#ch3-ontology", task: "为一个业务域写出 8 条 Competency Questions 与类层次。" },
      { label: "Knowledge Graph", href: "/#ch4-ingestion", task: "设计抽取 Schema 与实体消歧规则，给出来源与证据字段。" },
      { label: "Neo4j", href: "/#ch5-neo4j", task: "把本体映射为属性图，写出约束与 5 条只读 Cypher。" },
      { label: "GraphRAG", href: "/#ch6-graphrag", task: "实现图检索 + 文档检索的证据融合与引用输出。" },
      { label: "Evaluation", href: "/#ch10-eval", task: "构建 50 条评估集，比较 Traditional RAG 基线与 GraphRAG。" },
    ],
    outcomes: ["可交付的本体与 SHACL 约束", "可回溯的知识构建 Pipeline", "有基线对照的评估报告"],
  },
  {
    id: "LP-B", code: "B", role: "企业 AI 架构师", title: "从 RAG 到企业智能体平台", accent: "blue",
    goal: "能根据问题类型与治理约束选择检索架构，判断何时引入 Agent，并把能力组合成可运维的企业平台。",
    prerequisites: ["LLM 应用与 RAG 基础", "企业身份与权限模型", "基本的成本 / 延迟预算意识"],
    steps: [
      { label: "RAG", href: "/hub/retrieval#rt-traditional", task: "建立单次 RAG 基线与评估集。" },
      { label: "GraphRAG", href: "/hub/retrieval#rt-graphrag", task: "识别哪些问题真正需要关系路径。" },
      { label: "Agentic RAG", href: "/hub/agentic-rag", task: "画出 Agent Loop、停止条件与失败降级。" },
      { label: "Knowledge Agent", href: "/hub/knowledge-agent", task: "定义工具白名单、权限边界与审计字段。" },
      { label: "Enterprise Architecture", href: "/hub/architecture", task: "输出八层架构图与三套视图的取舍说明。" },
    ],
    outcomes: ["可解释的技术选型 ADR", "Agent 安全边界设计", "分层的企业知识平台蓝图"],
  },
  {
    id: "LP-C", code: "C", role: "数据架构师", title: "从治理到统一业务语义", accent: "purple",
    goal: "能建立贯穿来源、血缘、质量与权限的治理体系，并用语义层统一指标口径，避免 AI 与 BI 各说各话。",
    prerequisites: ["数据仓库 / 维度建模", "元数据与数据质量概念", "RBAC / ABAC 基础"],
    steps: [
      { label: "Data Governance", href: "/hub/data-governance", task: "定义 12 步知识生命周期与责任矩阵。" },
      { label: "Metadata / Catalog / Lineage", href: "/hub/data-governance#dg-explorer", task: "为一条知识补齐来源、证据、版本与有效期。" },
      { label: "Semantic Layer", href: "/hub/semantic-layer", task: "定义 3 个指标、维度、规则与物理映射。" },
      { label: "Ontology", href: "/#ch3-ontology", task: "对比概念类型定义与业务指标定义的差异。" },
      { label: "Knowledge Platform", href: "/hub/architecture#ea-map", task: "说明语义层如何同时服务 BI 与 AI。" },
    ],
    outcomes: ["知识血缘与质量仪表盘", "经审批的指标字典", "语义层与治理平台的边界文档"],
  },
  {
    id: "LP-D", code: "D", role: "工业智能架构师", title: "从资产模型到预测性维护", accent: "green",
    goal: "能区分数字孪生与监控大屏，设计资产图谱 + 时序数据的状态同步与仿真链路，并保证受控执行安全。",
    prerequisites: ["制造业资产层级概念", "时序数据与事件流基础", "图模型基础"],
    steps: [
      { label: "Digital Twin", href: "/hub/digital-twin#dt-what", task: "说明 Digital Model / Shadow / Twin 的判据。" },
      { label: "Asset Model", href: "/hub/digital-twin#dt-scenario", task: "为 Factory-A 建立稳定 ID 的资产层级与关系方向。" },
      { label: "Knowledge Graph", href: "/#ch4-ingestion", task: "把设备、部件、工单与人员建成图，并标注来源。" },
      { label: "IoT Integration", href: "/hub/digital-twin#dt-architecture", task: "设计事件流 → 时序库 → 孪生状态的同步链路。" },
      { label: "Predictive Maintenance", href: "/hub/digital-twin#dt-simulator", task: "给出需人工审批的维护建议流程与失败降级。" },
    ],
    outcomes: ["统一资产模型", "状态与图谱职责划分", "安全的维护建议闭环"],
  },
];

/* ------------------------------------------------------------------ *
 * V2 扩展术语（与 V1 的 36 条合并展示）
 * ------------------------------------------------------------------ */
export interface V2Term {
  term: string;
  cn: string;
  category: "检索与智能体" | "语义与指标" | "治理与安全" | "数字孪生与架构";
  plain: string;
  technical: string;
  related: string[];
  href: string;
}

export const v2Glossary: V2Term[] = [
  { term: "Agentic RAG", cn: "智能体式检索增强生成", category: "检索与智能体", plain: "让 Agent 自己规划要查几次、查哪里、什么时候停，再综合证据回答。", technical: "由 Agent 控制的多步骤检索与推理工作流；GraphRAG、向量检索、SQL、API 均可作为工具。不等价于知识图谱，也不等价于 Knowledge Agent。", related: ["GraphRAG", "Query Planning", "Agent Loop"], href: "/hub/agentic-rag" },
  { term: "Query Decomposition", cn: "查询分解", category: "检索与智能体", plain: "把一个复杂问题拆成几个可以分别查证的小问题。", technical: "Planner 依据问题类型与可用工具生成子任务 DAG，每个子任务绑定检索策略与停止条件。", related: ["Query Planning", "Iterative Retrieval"], href: "/hub/agentic-rag#ar-capabilities" },
  { term: "Iterative Retrieval", cn: "迭代检索", category: "检索与智能体", plain: "第一轮证据不够就再查一轮，直到够用或达到上限。", technical: "以证据充分性函数为循环条件，需设置最大轮次、成本预算与无增益退出，避免无限循环。", related: ["Stop Conditions", "Evidence Evaluation"], href: "/hub/agentic-rag#ar-capabilities" },
  { term: "Reflection", cn: "反思与自检", category: "检索与智能体", plain: "Agent 检查自己找到的证据是否互相矛盾、是否答非所问。", technical: "对候选证据做一致性、覆盖度与引用可回溯性检查；失败时触发补充检索或转人工。", related: ["Answer Verification", "Human-in-the-loop"], href: "/hub/agentic-rag#ar-capabilities" },
  { term: "Stop Conditions", cn: "停止条件", category: "检索与智能体", plain: "明确写清楚什么时候必须停下来，不再继续查。", technical: "证据充分、达到最大轮次 / Token 预算 / 延迟 SLA、工具连续失败或权限不足时退出循环。", related: ["Agent Loop", "Cost"], href: "/hub/agentic-rag#ar-capabilities" },
  { term: "Knowledge Agent", cn: "知识智能体", category: "检索与智能体", plain: "主动调用企业知识工具、带权限和审计地提供知识服务。", technical: "面向企业知识上下文的智能体运行时，包含身份、Planner、Knowledge Context、Tool Registry、Response Validation 与 Audit。", related: ["Tool Registry", "Agentic RAG", "Enterprise AI Agent"], href: "/hub/knowledge-agent" },
  { term: "Tool Registry", cn: "工具注册表", category: "检索与智能体", plain: "一张写明每个工具能做什么、谁能用、参数是什么的清单。", technical: "登记 schema、权限范围、超时、幂等性、审计级别与失败降级策略；运行时只接受白名单工具。", related: ["Tool Calling", "Least Privilege"], href: "/hub/knowledge-agent#ka-designer" },
  { term: "Agent Memory", cn: "智能体记忆", category: "检索与智能体", plain: "记住本次会话上下文与已验证的长期知识。", technical: "短期会话状态与长期知识必须带 subject、有效期与密级；记忆写入前同样需要权限与治理。", related: ["Agent Governance", "Permission Enforcement"], href: "/hub/knowledge-agent#ka-architecture" },
  { term: "Enterprise Semantic Layer", cn: "企业语义层", category: "语义与指标", plain: "把「什么叫一次故障、MTTR 怎么算」写在同一个地方，谁都按这个口径查。", technical: "统一业务术语、业务概念、语义模型、指标、维度、度量、业务规则与底层数据映射，并提供 Semantic Query 接口。", related: ["Business Glossary", "Metrics Layer", "Ontology"], href: "/hub/semantic-layer" },
  { term: "Metrics Layer", cn: "指标层", category: "语义与指标", plain: "指标公式、维度与口径版本的集中定义处。", technical: "定义 measure、dimension、grain、filter、聚合与版本；物理映射由语义层翻译执行，业务用户不直接写表字段。", related: ["Semantic Model", "Semantic Query"], href: "/hub/semantic-layer#sl-explorer" },
  { term: "Semantic Query", cn: "语义查询", category: "语义与指标", plain: "用业务语言提问，由系统翻译成物理表查询。", technical: "输入业务概念与维度，输出受权限约束的 SQL / API 调用；不得绕过指标定义直接拼物理字段。", related: ["Semantic Model", "Access Control"], href: "/hub/semantic-layer#sl-chain" },
  { term: "Business Glossary", cn: "业务术语表", category: "语义与指标", plain: "业务名词的权威解释清单。", technical: "登记术语、定义、责任人、同义词、审批状态与版本；是语义层的输入而非等价物。", related: ["Business Concept", "Data Catalog"], href: "/hub/semantic-layer#sl-concepts" },
  { term: "Knowledge Provenance", cn: "知识血缘 / 来源溯源", category: "治理与安全", plain: "一条知识是谁提供的、依据哪段原文、什么时候生效。", technical: "记录 Source ID、Evidence、Confidence、Valid Time、Transaction Time、Version、Approval Status 与 Access Policy。", related: ["Data Lineage", "Confidence", "Authority"], href: "/hub/data-governance#dg-questions" },
  { term: "Valid Time / Transaction Time", cn: "有效时间 / 事务时间", category: "治理与安全", plain: "事实在现实中何时成立，与系统何时把它记下来，是两件事。", technical: "双时态（bitemporal）建模支持「当时应该知道什么」的审计回放，避免用后见之明污染历史推理。", related: ["Temporal Data", "Audit"], href: "/hub/data-governance#dg-security" },
  { term: "Entity Resolution Governance", cn: "实体消歧治理", category: "治理与安全", plain: "两个名字是不是同一个东西，谁说了算、留没留证据。", technical: "对合并决策记录候选、评分、裁决来源、审批人与回滚点；LLM 置信度不能替代主数据权威。", related: ["MDM", "Entity Resolution"], href: "/hub/data-governance#dg-lifecycle" },
  { term: "ABAC", cn: "基于属性的访问控制", category: "治理与安全", plain: "按用户、数据密级、环境、用途等属性动态决定是否可见。", technical: "在向量检索过滤、图遍历剪枝、上下文融合与答案生成四个阶段一致执行；不能只在提示词里声明。", related: ["RBAC", "Data Masking", "ACL"], href: "/hub/data-governance#dg-security" },
  { term: "Knowledge Lifecycle", cn: "知识生命周期", category: "治理与安全", plain: "知识从进入系统到审核、发布、监控、过期的全过程。", technical: "Source → Ingestion → Validation → Classification → Transformation → Extraction → ER → Fusion → Approval → Publication → Monitoring → Expiration/Deletion。", related: ["Retention Policy", "Version Management"], href: "/hub/data-governance#dg-lifecycle" },
  { term: "Digital Twin", cn: "数字孪生", category: "数字孪生与架构", plain: "现实对象在数字世界里有一个持续同步的状态映射。", technical: "需要 Physical Asset、Digital Representation、Real-time Data 与持续同步机制；监控大屏缺少状态模型与反馈闭环，不构成孪生。", related: ["Digital Shadow", "Digital Thread", "Simulation"], href: "/hub/digital-twin#dt-what" },
  { term: "Digital Shadow", cn: "数字影子", category: "数字孪生与架构", plain: "现实到数字单向自动同步，数字端不能反向控制现实。", technical: "数据流向为 Physical → Digital 自动化；缺少 Digital → Physical 的自动反馈，因此不是完整 Twin。", related: ["Digital Model", "Digital Twin"], href: "/hub/digital-twin#dt-what" },
  { term: "Digital Thread", cn: "数字主线", category: "数字孪生与架构", plain: "把设计、制造、运维、维修各阶段的数据串起来。", technical: "跨生命周期的身份与血缘贯通，依赖稳定 ID、版本与访问控制。", related: ["Data Lineage", "Asset Model"], href: "/hub/digital-twin#dt-concepts" },
  { term: "Simulation", cn: "仿真", category: "数字孪生与架构", plain: "在数字世界里试「如果这样会怎样」，不直接动真设备。", technical: "基于 Twin State 与领域模型做假设分析；输出建议，任何真实控制必须经过独立安全验证与授权。", related: ["Predictive Maintenance", "Controlled Actuation"], href: "/hub/digital-twin#dt-boundary" },
  { term: "Architecture Decision Record", cn: "架构决策记录", category: "数字孪生与架构", plain: "把「为什么这么选、放弃了什么」写下来。", technical: "包含 Context（业务问题）、Decision、Alternatives、Consequences、Status 与复核触发条件；从业务约束出发而非产品比较。", related: ["Design Patterns", "Anti-patterns"], href: "/hub/patterns#pt-adr" },
  { term: "Cross-cutting Governance", cn: "横切治理", category: "数字孪生与架构", plain: "身份、权限、审计、质量、成本、安全、合规要覆盖每一层。", technical: "不是独立一层可选项，而是贯穿数据源到应用的策略平面与可观测平面。", related: ["Identity", "Audit", "Compliance"], href: "/hub/architecture#ea-map" },
  { term: "Hybrid RAG", cn: "混合检索 RAG", category: "检索与智能体", plain: "关键词检索与向量检索一起用，再合并排序。", technical: "常配合 RRF 与重排器改善召回；比单次向量检索稳定，但不提供关系路径推理。", related: ["Traditional RAG", "RRF"], href: "/hub/retrieval#rt-hybrid" },
];
