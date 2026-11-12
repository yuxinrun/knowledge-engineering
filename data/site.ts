export interface ChapterSection {
  id: string;
  title: string;
}

export interface ChapterMeta {
  id: string;
  no: number;
  title: string;
  short: string;
  subtitle: string;
  minutes: number;
  group: "认知基础" | "建模与构建" | "工程实现" | "选型与落地" | "生产与治理" | "附录";
  sections: ChapterSection[];
  keywords: string[];
}

export const chapters: ChapterMeta[] = [
  {
    id: "ch1-overview", no: 1,
    title: "先建立整体认知：Ontology、Knowledge Graph、GraphRAG 到底是什么？",
    short: "整体认知",
    subtitle: "三个概念解决的是三个不同层次的问题：语义定义、知识组织、检索与生成。先把边界划清楚，再谈技术选型。",
    minutes: 12, group: "认知基础",
    keywords: ["Ontology", "Knowledge Graph", "GraphRAG", "OWL", "SHACL", "Triple", "对比表", "语义模型"],
    sections: [
      { id: "ch1-concepts", title: "三个概念：通俗解释与技术解释" },
      { id: "ch1-compare", title: "核心对比表与产物边界" },
      { id: "ch1-diagram", title: "三层关系总览（可交互）" },
      { id: "ch1-boundary", title: "常见误解与组合方式" },
      { id: "ch1-code", title: "最小对照示例" },
    ],
  },
  {
    id: "ch2-scenario", no: 2,
    title: "用一个真实企业场景理解三者",
    short: "企业 IT 运维场景",
    subtitle: "以 OrderSystem / PaymentService / Incident-001 为主线，贯穿全书，观察同一批业务事实在三个视角下的不同形态。",
    minutes: 14, group: "认知基础",
    keywords: ["OrderSystem", "PaymentService", "PaymentDB", "Incident-001", "Runbook-001", "知识图谱"],
    sections: [
      { id: "ch2-facts", title: "场景设定与 7 条业务事实" },
      { id: "ch2-views", title: "Ontology / KG / GraphRAG 三个视角" },
      { id: "ch2-graph", title: "交互式企业 IT 运维知识图谱" },
      { id: "ch2-answer", title: "一次有依据的问答" },
    ],
  },
  {
    id: "ch3-ontology", no: 3,
    title: "Ontology 本体到底怎么设计？",
    short: "本体设计工程流程",
    subtitle: "从业务边界和 Competency Questions 出发，经过 12 个工程步骤，落到 OWL 公理、SHACL 约束、验证数据与版本管理。",
    minutes: 20, group: "建模与构建",
    keywords: ["Competency Questions", "Class Hierarchy", "Domain", "Range", "Cardinality", "OWL", "SHACL", "反模式"],
    sections: [
      { id: "ch3-process", title: "12 步本体设计流程" },
      { id: "ch3-classes", title: "Class 设计与层次树" },
      { id: "ch3-properties", title: "Object / Data Property 设计" },
      { id: "ch3-owl", title: "OWL Turtle 示例" },
      { id: "ch3-shacl", title: "SHACL 约束示例" },
      { id: "ch3-owl-vs-shacl", title: "OWL 与 SHACL 的分工及 Neo4j 映射" },
      { id: "ch3-anti", title: "六类本体设计反例" },
      { id: "ch3-deliverables", title: "本体设计交付物清单" },
    ],
  },
  {
    id: "ch4-ingestion", no: 4,
    title: "Knowledge Graph：如何从企业文档构建？",
    short: "离线构建 Pipeline",
    subtitle: "文档解析、Chunk 切分、LLM 抽取、本体映射、实体消歧、知识融合、校验与增量更新，每一步都需要可观测、可回滚。",
    minutes: 22, group: "建模与构建",
    keywords: ["Document Intelligence", "Chunk", "Entity Extraction", "Entity Resolution", "Knowledge Fusion", "Provenance", "增量更新"],
    sections: [
      { id: "ch4-pipeline", title: "端到端 Pipeline 交互图" },
      { id: "ch4-steps", title: "每一步的输入 / 输出 / 失败处理" },
      { id: "ch4-extraction", title: "结构化抽取 JSON 与 Pydantic" },
      { id: "ch4-er", title: "Entity Resolution 与评分机制" },
      { id: "ch4-fusion", title: "Knowledge Fusion 与来源权威性" },
      { id: "ch4-validation", title: "校验、写入与增量更新" },
    ],
  },
  {
    id: "ch5-neo4j", no: 5,
    title: "Neo4j 知识图谱实战",
    short: "属性图与 Cypher",
    subtitle: "把语义模型映射成属性图：Label、Property、Direction、Constraint、Index，以及 10 类可执行 Cypher 示例。",
    minutes: 18, group: "工程实现",
    keywords: ["属性图", "Cypher", "MERGE", "Constraint", "影响分析", "只读权限", "参数化查询"],
    sections: [
      { id: "ch5-model", title: "属性图模型与数据模型图" },
      { id: "ch5-schema", title: "完整 Schema：节点、关系、约束" },
      { id: "ch5-cypher", title: "10 组可执行 Cypher 示例" },
      { id: "ch5-safety", title: "生产安全边界" },
    ],
  },
  {
    id: "ch6-graphrag", no: 6,
    title: "GraphRAG 到底怎么实现？",
    short: "Azure 企业级实现",
    subtitle: "Neo4j 存关系、Azure AI Search 存文本与向量、Azure OpenAI 负责抽取 / Embedding / 生成，Python 编排权限与检索。",
    minutes: 24, group: "工程实现",
    keywords: ["Azure Blob Storage", "Document Intelligence", "Azure AI Search", "Hybrid Search", "RRF", "Semantic Ranker", "Citation"],
    sections: [
      { id: "ch6-architecture", title: "Azure 企业级完整架构图（可交互）" },
      { id: "ch6-components", title: "组件职责与数据边界" },
      { id: "ch6-search", title: "Azure AI Search Index 与 Hybrid Search" },
      { id: "ch6-query-flow", title: "GraphRAG 查询时序流程" },
      { id: "ch6-demo", title: "交互式查询演示（模拟数据）" },
      { id: "ch6-boundary", title: "为什么不能只检索图数据库" },
    ],
  },
  {
    id: "ch7-selection", no: 7,
    title: "Traditional RAG、GraphRAG、Agentic RAG 怎么选？",
    short: "技术选型决策",
    subtitle: "六类方案、十一个比较维度、一个规则透明可解释的选型决策器；结论必须由输入条件推导，而不是黑盒。",
    minutes: 20, group: "选型与落地",
    keywords: ["Traditional RAG", "Agentic RAG", "结构化查询", "选型决策器", "多跳", "成本", "延迟"],
    sections: [
      { id: "ch7-matrix", title: "六方案 × 十一维度对比矩阵" },
      { id: "ch7-compare-diagram", title: "Traditional RAG 与 GraphRAG 对比图" },
      { id: "ch7-decision", title: "交互式选型决策器" },
      { id: "ch7-principles", title: "选型关键原则" },
    ],
  },
  {
    id: "ch8-cases", no: 8,
    title: "真实企业项目到底怎么选、怎么用？",
    short: "四类企业案例",
    subtitle: "IT 运维、金融风控、供应链、制造业四个教学场景模型，逐项判断是否需要 Ontology / KG / GraphRAG。",
    minutes: 20, group: "选型与落地",
    keywords: ["故障传播", "影响分析", "金融风控", "供应链", "制造业", "教学案例"],
    sections: [
      { id: "ch8-itops", title: "重点案例：企业 IT 运维" },
      { id: "ch8-finance", title: "金融风控：关联网络与规则引擎" },
      { id: "ch8-supply", title: "供应链：中断影响分析" },
      { id: "ch8-manufacturing", title: "制造业：设备与维修知识" },
      { id: "ch8-disclaimer", title: "案例边界声明" },
    ],
  },
  {
    id: "ch9-production", no: 9,
    title: "企业级生产环境设计",
    short: "安全、治理与运维",
    subtitle: "20 个必须落地的生产议题。安全过滤必须贯穿向量检索、图谱检索、上下文融合和最终答案生成。",
    minutes: 18, group: "生产与治理",
    keywords: ["RBAC", "ABAC", "ACL", "权限继承", "数据脱敏", "多租户", "灾备", "成本", "时态知识"],
    sections: [
      { id: "ch9-security", title: "身份认证、RBAC / ABAC 与权限过滤" },
      { id: "ch9-governance", title: "数据血缘、版本、时态与冲突" },
      { id: "ch9-ops", title: "队列、重试、监控、成本与高可用" },
      { id: "ch9-checklist", title: "生产上线检查清单" },
    ],
  },
  {
    id: "ch10-eval", no: 10,
    title: "如何评估 GraphRAG 是否真正有效？",
    short: "评估指标体系",
    subtitle: "抽取质量、检索质量、回答质量、系统性能、权限安全五组指标，配可交互的演示数据仪表盘。",
    minutes: 16, group: "生产与治理",
    keywords: ["Precision", "Recall", "F1", "Recall@K", "MRR", "NDCG", "Faithfulness", "Citation Accuracy", "ACL Leakage"],
    sections: [
      { id: "ch10-metrics", title: "完整指标体系与定义" },
      { id: "ch10-dashboard", title: "交互式评估仪表盘（演示数据）" },
      { id: "ch10-dataset", title: "评估数据集构建方法" },
      { id: "ch10-interpret", title: "如何解读与避免误用指标" },
    ],
  },
  {
    id: "ch11-roadmap", no: 11,
    title: "完整企业实施路线图",
    short: "八阶段路线图",
    subtitle: "从场景盘点、Ontology MVP 到 GraphRAG 生产化与持续演进，每阶段给出交付物、验收标准、风险与进入条件。",
    minutes: 15, group: "生产与治理",
    keywords: ["Phase", "MVP", "验收标准", "进入条件", "排期", "交付物"],
    sections: [
      { id: "ch11-phases", title: "八阶段交互路线图" },
      { id: "ch11-timeline", title: "示例排期与依赖关系" },
      { id: "ch11-deliverables", title: "交付物清单" },
      { id: "ch11-gates", title: "阶段门禁与止损条件" },
    ],
  },
  {
    id: "ch12-code", no: 12,
    title: "完整代码示例和项目目录",
    short: "代码与项目结构",
    subtitle: "建议的企业项目结构，以及 OWL / SHACL / Pydantic / Azure OpenAI / Entity Resolution / Neo4j / AI Search / FastAPI 关键代码示例。",
    minutes: 22, group: "生产与治理",
    keywords: ["项目结构", "Pydantic", "Structured Outputs", "FastAPI", "Cypher", "Hybrid Search", "Citations"],
    sections: [
      { id: "ch12-structure", title: "建议项目目录" },
      { id: "ch12-owl", title: "Ontology：OWL 与 SHACL" },
      { id: "ch12-extraction", title: "抽取与 Entity Resolution" },
      { id: "ch12-graph", title: "Neo4j：Schema、Driver 与图检索" },
      { id: "ch12-search", title: "Azure AI Search：Index 与检索" },
      { id: "ch12-api", title: "FastAPI 编排与带引用答案" },
      { id: "ch12-disclaimer", title: "示例代码边界与版本敏感性" },
    ],
  },
  {
    id: "appendix", no: 13,
    title: "附录：术语词典、FAQ 与官方技术参考",
    short: "附录",
    subtitle: "36 条术语、常见问题、打印与学习工具说明，以及 W3C / Neo4j / Microsoft 官方参考链接。",
    minutes: 8, group: "附录",
    keywords: ["Glossary", "FAQ", "W3C", "Microsoft GraphRAG", "Neo4j GraphRAG", "官方参考"],
    sections: [
      { id: "appendix-glossary", title: "技术术语词典" },
      { id: "appendix-faq", title: "常见问题 FAQ" },
      { id: "appendix-refs", title: "官方技术参考" },
      { id: "appendix-print", title: "白皮书打印与阅读说明" },
    ],
  },
];

export const chapterGroups = Array.from(new Set(chapters.map((c) => c.group)));

export const references = [
  { name: "W3C OWL 2 Web Ontology Language - Overview", url: "https://www.w3.org/TR/owl2-overview/", category: "语义标准" },
  { name: "W3C Shapes Constraint Language (SHACL)", url: "https://www.w3.org/TR/shacl/", category: "语义标准" },
  { name: "Protégé Ontology Editor", url: "https://protege.stanford.edu/", category: "建模工具" },
  { name: "Neo4j GraphRAG for Python", url: "https://neo4j.com/docs/neo4j-graphrag-python/current/", category: "GraphRAG" },
  { name: "Neo4j Documentation", url: "https://neo4j.com/docs/", category: "图数据库" },
  { name: "Azure AI Search Documentation", url: "https://learn.microsoft.com/azure/search/", category: "检索" },
  { name: "Azure OpenAI Service Documentation", url: "https://learn.microsoft.com/azure/ai-services/openai/", category: "模型服务" },
  { name: "Microsoft GraphRAG (GitHub)", url: "https://github.com/microsoft/graphrag", category: "GraphRAG" },
];

export const siteTitle = "企业级知识工程完整实战指南";
export const siteTagline = "Ontology × Knowledge Graph × GraphRAG";
