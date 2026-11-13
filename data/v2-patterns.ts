/**
 * 企业架构模式库（10 个模式）与 ADR 示例。
 * 统一模板覆盖用户要求的 14 项；所有内容为教学示例，不杜撰产品能力或性能数据。
 */

export interface PatternDiagram {
  nodes: { id: string; label: string; kind: string }[];
  edges: { from: number; to: number; label: string }[];
}

export interface ArchitecturePattern {
  id: string;
  name: string;
  cn: string;
  problem: string;
  suitable: string[];
  unsuitable: string[];
  components: string[];
  dataFlow: string[];
  queryFlow: string[];
  technologies: string[];
  complexity: "低" | "中" | "高";
  costFactors: string[];
  risks: string[];
  pros: string[];
  limits: string[];
  alternatives: string[];
  diagram: PatternDiagram;
}

const D = (
  nodes: [string, string, string][],
  edges: [number, number, string][],
): PatternDiagram => ({
  nodes: nodes.map(([id, label, kind], i) => ({ id: `P${i}-${id}`, label, kind })),
  edges: edges.map(([from, to, label]) => ({ from, to, label })),
});

export const architecturePatterns: ArchitecturePattern[] = [
  {
    id: "PAT-01", name: "Traditional RAG Pattern", cn: "单次检索 RAG 模式",
    problem: "用户问题主要靠文档语义即可回答，需要低成本、低延迟、易评估的问答能力。",
    suitable: ["FAQ / 制度 / 产品手册问答", "语料规模可控且以非结构化文档为主", "需要尽快建立可评估基线"],
    unsuitable: ["需要跨实体多跳路径与影响分析", "答案必须由结构化业务系统实时计算", "口径需要严格统一（应先建语义层）"],
    components: ["Document Parser", "Chunker", "Embedding Model", "Vector Index", "LLM", "Citation Renderer"],
    dataFlow: ["文档解析与切分", "生成 embedding 并写入索引", "索引项继承来源与 ACL"],
    queryFlow: ["Query → 单次检索 TopK", "拼接上下文 → LLM 生成", "输出带文档引用的答案"],
    technologies: ["向量索引 / 关键词索引", "Embedding + 生成模型", "引用与审计日志"],
    complexity: "低",
    costFactors: ["embedding 与生成 token", "索引存储", "文档更新重索引频率"],
    risks: ["漏检导致幻觉", "ACL 未在检索阶段生效", "文档过期未清理"],
    pros: ["链路最短、延迟与成本可控", "评估指标清晰", "运维复杂度最低"],
    limits: ["一次检索难以覆盖多跳关系", "复杂问题需用户自行拆解", "无法表达实体间结构化约束"],
    alternatives: ["PAT-02 Hybrid Search Pattern", "PAT-03 GraphRAG Pattern", "PAT-05 Agentic RAG Pattern"],
    diagram: D(
      [["doc", "Documents", "source"], ["chunk", "Chunk + Embed", "process"], ["idx", "Vector Index", "store"], ["q", "User Query", "app"], ["llm", "LLM + Citation", "llm"], ["a", "Answer", "app"]],
      [[0, 1, "解析"], [1, 2, "索引"], [3, 2, "TopK"], [2, 4, "上下文"], [4, 5, "带引用答案"]],
    ),
  },
  {
    id: "PAT-02", name: "Hybrid Search Pattern", cn: "混合检索模式",
    problem: "纯向量检索对专有名词、编号、错误码与精确短语召回不稳，需要关键词与语义互补。",
    suitable: ["文档含大量产品型号、工单号、错误码", "用户查询长短差异大", "已经存在可用的倒排索引"],
    unsuitable: ["语料全是同义改写、无精确匹配需求", "索引基础设施无法维护两套召回"],
    components: ["Keyword Index", "Vector Index", "Fusion (RRF)", "Re-ranker", "LLM", "Eval Set"],
    dataFlow: ["同一 Chunk 同时写倒排与向量索引", "统一 metadata 与 ACL", "离线评估集记录 Recall@K"],
    queryFlow: ["并行 keyword + vector 召回", "融合排序与重排", "取 TopK 生成答案"],
    technologies: ["倒排索引", "向量索引", "RRF / 重排器"],
    complexity: "低",
    costFactors: ["双索引存储", "重排器调用", "两路召回延迟"],
    risks: ["融合权重未调参导致负增益", "两路 ACL 不一致", "重排器版本变化影响可复现性"],
    pros: ["对精确词与语义查询都较稳", "改动范围小，可作为基线增强"],
    limits: ["仍不提供关系路径", "不解决口径与权限治理问题"],
    alternatives: ["PAT-01", "PAT-03"],
    diagram: D(
      [["q", "User Query", "app"], ["kw", "Keyword Search", "store"], ["vec", "Vector Search", "store"], ["fuse", "Fusion / Re-rank", "orchestrator"], ["llm", "LLM", "llm"], ["eval", "Evaluation Set", "security"]],
      [[0, 1, "并行"], [0, 2, "并行"], [1, 3, "候选"], [2, 3, "候选"], [3, 4, "TopK"], [4, 5, "评估"]],
    ),
  },
  {
    id: "PAT-03", name: "GraphRAG Pattern", cn: "图增强检索模式",
    problem: "问题需要沿实体关系做多跳遍历、影响分析或把分散证据按结构组织成上下文。",
    suitable: ["IT 故障传播 / 依赖影响分析", "关联网络与风险传导", "证据散落在多份文档且需要结构约束"],
    unsuitable: ["纯文档语义问答", "图谱质量低且无治理能力", "预算只允许最小链路"],
    components: ["Ontology", "Extraction Pipeline", "Entity Resolution", "Knowledge Graph", "Graph Retriever", "Vector Index", "Evidence Fusion"],
    dataFlow: ["文档抽取实体与关系", "消歧融合后带来源写入图", "图与索引共享权限标签"],
    queryFlow: ["识别锚实体", "受限跳数图遍历", "图路径 + 文档片段融合", "带图路径与文档引用生成"],
    technologies: ["属性图 / RDF", "图查询语言", "向量索引", "引用校验"],
    complexity: "高",
    costFactors: ["抽取 LLM 调用", "图建模与治理人力", "增量更新与重抽取"],
    risks: ["错误关系传播", "图噪声降低答案质量", "无基线无法证明增量价值"],
    pros: ["可解释的关系路径", "支持多跳与影响分析", "结构化约束减少无关证据"],
    limits: ["不必然优于 Traditional RAG", "构建与维护成本显著", "事实必须有来源、时间与证据"],
    alternatives: ["PAT-01", "PAT-02", "PAT-04"],
    diagram: D(
      [["doc", "Documents", "source"], ["ext", "Extraction", "process"], ["kg", "Knowledge Graph", "graph"], ["q", "Query", "app"], ["gq", "Graph Retrieval", "rag"], ["vec", "Document Retrieval", "rag"], ["fuse", "Evidence Fusion", "orchestrator"], ["a", "Cited Answer", "app"]],
      [[0, 1, "抽取"], [1, 2, "带来源写入"], [3, 4, "锚实体"], [3, 5, "语义"], [2, 4, "遍历"], [4, 6, "图路径"], [5, 6, "片段"], [6, 7, "引用校验"]],
    ),
  },
  {
    id: "PAT-04", name: "Ontology-driven Knowledge Graph Pattern", cn: "本体驱动知识图谱模式",
    problem: "多业务域共享概念与关系，需要显式约束类型、方向、基数与校验规则。",
    suitable: ["跨部门数据融合", "需要推理与一致性校验", "监管或审计要求概念定义可追溯"],
    unsuitable: ["单一应用、概念极少且稳定", "团队不具备语义建模能力", "原型阶段只需轻量领域模型"],
    components: ["Competency Questions", "OWL / 轻量领域模型", "SHACL", "Mapping Rules", "Graph Store", "Validation CI"],
    dataFlow: ["定义类与属性约束", "映射源数据到本体", "入库前 SHACL 校验"],
    queryFlow: ["按本体概念发起查询", "映射为图查询", "结果按类型约束解释"],
    technologies: ["OWL 2 / SHACL / 自定义 Schema", "属性图约束", "CI 校验"],
    complexity: "高",
    costFactors: ["建模专家投入", "本体版本演进", "校验流水线"],
    risks: ["过度形式化拖慢交付", "本体与物理模型脱节", "把 OWL 当数据库使用"],
    pros: ["概念边界清晰、可校验", "跨域融合有共同语言", "支持一致性检查"],
    limits: ["本体不是图谱实例", "不自动带来检索质量提升"],
    alternatives: ["轻量领域模型 + 属性图约束", "PAT-03"],
    diagram: D(
      [["cq", "Competency Questions", "concept"], ["onto", "Ontology / OWL", "ontology"], ["shacl", "SHACL Validation", "security"], ["map", "Mapping Rules", "process"], ["kg", "Graph Store", "graph"], ["ci", "Validation CI", "security"]],
      [[0, 1, "驱动"], [1, 2, "约束"], [1, 3, "映射"], [3, 4, "写入"], [4, 5, "回归校验"]],
    ),
  },
  {
    id: "PAT-05", name: "Agentic RAG Pattern", cn: "智能体式检索模式",
    problem: "复杂问题需要拆成多个子任务、跨多种工具取证，并在证据不足时继续检索。",
    suitable: ["根因分析、跨系统调查", "需要同时查询图、文档、SQL 与 API", "允许更高延迟与成本换取覆盖率"],
    unsuitable: ["简单事实查询与高并发低延迟场景", "缺乏评估与可观测能力", "工具权限无法收敛"],
    components: ["Agent Planner", "Query Decomposition", "Retrieval Strategy Selector", "Tool Registry", "Evidence Evaluator", "Citation Verifier", "Stop Conditions"],
    dataFlow: ["登记工具 schema 与权限", "每轮记录输入、输出、理由与成本", "归档轨迹用于审计"],
    queryFlow: ["Planner 拆分子问题", "选策略并调用工具", "评估证据充分性", "不足则再检索", "验证引用并输出不确定性"],
    technologies: ["Agent Runtime", "白名单工具", "结构化输出", "轨迹日志"],
    complexity: "高",
    costFactors: ["多轮 LLM 调用", "工具调用与重试", "轨迹存储与观测"],
    risks: ["错误传播被多步放大", "循环不收敛导致成本失控", "Agent 绕过权限或提示词注入"],
    pros: ["能处理需要多步取证的问题", "可显式输出不确定性与待确认项"],
    limits: ["不意味着一定需要知识图谱", "Agent 数量不是能力指标", "可复现性与调试成本更高"],
    alternatives: ["PAT-01（坚持单次 RAG）", "PAT-03", "PAT-06"],
    diagram: D(
      [["q", "User Query", "app"], ["plan", "Planner", "llm"], ["dec", "Decomposition", "process"], ["tool", "Tools (Graph/Doc/SQL/API)", "store"], ["ev", "Evidence Evaluation", "security"], ["syn", "Synthesis", "llm"], ["ver", "Citation Verification", "security"], ["a", "Final Answer", "app"]],
      [[0, 1, "规划"], [1, 2, "子问题"], [2, 3, "调用"], [3, 4, "证据"], [4, 3, "不足则再检索"], [4, 5, "充分"], [5, 6, "校验"], [6, 7, "引用 + 不确定性"]],
    ),
  },
  {
    id: "PAT-06", name: "Knowledge Agent Pattern", cn: "企业知识智能体模式",
    problem: "企业知识库需要从被动问答升级为带身份、权限、审计与工具治理的主动知识服务。",
    suitable: ["多类企业知识工具需要统一入口", "权限与合规要求严格", "需要跨会话的知识上下文与人工审批"],
    unsuitable: ["公开文档的简单问答", "没有可治理的工具目录", "无法承担审计与监控成本"],
    components: ["Identity & Permission", "Agent Runtime", "Planner", "Knowledge Context", "Tool Registry", "Ontology Service", "Graph / Document / Semantic / API", "Response Validation", "Audit & Monitoring"],
    dataFlow: ["注册工具与密级", "构建带 subject 的知识上下文", "每次调用写审计轨迹"],
    queryFlow: ["身份解析 → 规划 → 受控工具调用 → 证据校验 → 回答 + 审计"],
    technologies: ["企业 IdP", "策略引擎", "图 / 向量 / 语义层", "可观测平台"],
    complexity: "高",
    costFactors: ["身份与策略集成", "审计存储", "多工具运维"],
    risks: ["工具越权", "权限只在生成阶段遮掩", "敏感操作缺少人工审批"],
    pros: ["能力边界清晰", "可审计、可追责", "易接入多种企业知识源"],
    limits: ["七个逻辑角色不等于七个服务", "不自动带来更准确的答案"],
    alternatives: ["PAT-05", "PAT-10"],
    diagram: D(
      [["u", "User", "app"], ["idp", "Identity & Permission", "security"], ["rt", "Agent Runtime + Planner", "orchestrator"], ["ctx", "Knowledge Context", "concept"], ["reg", "Tool Registry", "store"], ["svc", "Ontology / KG / Doc / Semantic / API", "graph"], ["val", "Response Validation", "security"], ["aud", "Audit & Monitoring", "security"]],
      [[0, 1, "认证"], [1, 2, "授权上下文"], [2, 3, "组装"], [2, 4, "白名单"], [3, 5, "受控查询"], [4, 5, "工具调用"], [5, 6, "证据"], [6, 7, "记录"]],
    ),
  },
  {
    id: "PAT-07", name: "Semantic Layer + AI Pattern", cn: "语义层 + AI 模式",
    problem: "AI 与 BI 对同一指标给出不同数字，需要统一业务术语、指标口径与数据映射。",
    suitable: ["指标口径争议频繁", "同一指标同时服务报表与 AI 问答", "多数据源、多份口径实现"],
    unsuitable: ["一次性分析、无复用需求", "业务方尚未就定义达成一致（先治理再建层）"],
    components: ["Business Glossary", "Semantic Model", "Metrics Layer", "Mapping / Physical Tables", "Semantic Query API", "Policy Enforcement", "AI Consumer"],
    dataFlow: ["业务定义审批入库", "指标映射到物理字段并版本化", "权限策略随指标下发"],
    queryFlow: ["AI 以业务概念提问", "语义层翻译为受控查询", "返回带口径版本的答案"],
    technologies: ["指标字典 / 语义模型", "SQL / 查询服务", "策略引擎"],
    complexity: "中",
    costFactors: ["定义治理会议成本", "语义模型维护", "查询层性能"],
    risks: ["口径未审批即上线", "AI 绕过语义层直接拼 SQL", "版本变更未通知下游"],
    pros: ["同一指标一处定义", "AI 回答可给出口径版本", "BI 与 AI 结果一致"],
    limits: ["语义层不等于本体，也不等于知识图谱", "不自动清洗底层数据"],
    alternatives: ["直接在各应用内硬编码口径（不推荐）", "PAT-08"],
    diagram: D(
      [["gl", "Business Glossary", "concept"], ["sm", "Semantic Model", "ontology"], ["mt", "Metrics Layer", "concept"], ["map", "Physical Mapping", "store"], ["q", "Semantic Query API", "orchestrator"], ["ai", "AI / BI Consumer", "app"]],
      [[0, 1, "定义"], [1, 2, "指标"], [2, 3, "映射"], [3, 4, "翻译"], [4, 5, "带口径答案"]],
    ),
  },
  {
    id: "PAT-08", name: "Data Governance Pattern", cn: "数据治理模式",
    problem: "知识来源不明、无法追溯、过期未清理，或权限没有贯穿检索与生成链路。",
    suitable: ["受监管行业", "多来源知识融合", "LLM 生成内容需要审核与回滚"],
    unsuitable: ["纯个人实验项目（可先做最小记录）", "没有任何责任人可分配"],
    components: ["Source Registry", "Ingestion & Validation", "Classification", "Lineage Store", "Approval Workflow", "Policy Engine", "Monitoring & Expiration"],
    dataFlow: ["Source → Ingestion → Validation → Classification → Extraction → ER → Fusion → Approval → Publication → Monitoring → Expiration"],
    queryFlow: ["每次检索带 subject", "向量过滤 / 图剪枝 / 融合 / 生成四阶段一致鉴权", "输出记录血缘"],
    technologies: ["元数据目录", "血缘存储", "RBAC / ABAC / 脱敏", "审计日志"],
    complexity: "高",
    costFactors: ["治理人力与审批流程", "血缘与审计存储", "定期复核与清理作业"],
    risks: ["把 LLM 置信度当来源权威性", "文档删除后索引与图谱未清理", "只在答案阶段遮掩权限"],
    pros: ["可信度可判定", "支持审计回放与过期清理", "为 AI 提供受控知识底座"],
    limits: ["Data Governance 不等于数据库权限管理", "流程过重会拖慢迭代"],
    alternatives: ["最小可用 provenance 记录（PoC 阶段）"],
    diagram: D(
      [["src", "Source", "source"], ["ing", "Ingestion / Validation", "process"], ["cls", "Classification", "security"], ["er", "Extraction / ER / Fusion", "process"], ["appr", "Approval", "security"], ["pub", "Publication", "graph"], ["mon", "Monitoring / Expiration", "security"]],
      [[0, 1, "登记"], [1, 2, "定级"], [2, 3, "抽取融合"], [3, 4, "审核"], [4, 5, "发布"], [5, 6, "持续"]],
    ),
  },
  {
    id: "PAT-09", name: "Digital Twin + Knowledge Graph Pattern", cn: "数字孪生 + 知识图谱模式",
    problem: "需要把设备层级、业务关系与实时状态结合起来做影响分析与预测性维护。",
    suitable: ["资产层级清晰且状态数据可持续同步", "需要跨设备传播分析与维护建议", "制造 / 能源 / 设施运维"],
    unsuitable: ["只有静态台账、没有实时状态", "只想做指标监控大屏", "无法保证控制链路安全"],
    components: ["Physical Asset", "Sensors / Event Stream", "Time-series Store", "Asset Model / Ontology", "Knowledge Graph", "Twin State", "Simulation", "AI Agent", "Human Approval"],
    dataFlow: ["遥测写入时序库", "资产模型与图谱描述关系", "状态服务持续同步"],
    queryFlow: ["读取 Twin State + 图关系", "仿真假设场景", "输出建议 → 人工审批 → 受控执行"],
    technologies: ["IoT / 事件流", "时序数据库", "图数据库", "规则 / 仿真模型"],
    complexity: "高",
    costFactors: ["传感器与接入", "时序存储保留期", "状态同步与仿真算力"],
    risks: ["把监控大屏当作数字孪生", "Agent 直接控制真实设备", "时序数据与图谱实体 ID 不一致"],
    pros: ["关系与状态各司其职", "支持故障传播与预测性维护", "保留人工审批闭环"],
    limits: ["知识图谱描述关系但不替代时序库", "仿真输出是建议而非事实"],
    alternatives: ["纯时序监控（无关系推理）", "PAT-08 + 资产台账"],
    diagram: D(
      [["phy", "Physical World", "device"], ["iot", "Sensors / IoT", "device"], ["ts", "Time-series Store", "store"], ["am", "Asset Model / Ontology", "ontology"], ["kg", "Knowledge Graph", "graph"], ["st", "Digital Twin State", "process"], ["sim", "Analytics / Simulation", "llm"], ["ag", "AI Agent", "orchestrator"], ["h", "Human / Controlled Actuation", "security"]],
      [[0, 1, "遥测"], [1, 2, "写入"], [1, 5, "状态同步"], [3, 4, "关系"], [4, 5, "关联"], [2, 5, "历史"], [5, 6, "假设分析"], [6, 7, "建议"], [7, 8, "审批后执行"]],
    ),
  },
  {
    id: "PAT-10", name: "Multi-Agent Enterprise Knowledge Pattern", cn: "多智能体企业知识模式",
    problem: "职责差异明显（搜索、图查询、数据、合规），需要显式分工与相互校验。",
    suitable: ["工具与权限边界可按角色切分", "任务可并行且需要独立审计", "已有成熟单 Agent 基线"],
    unsuitable: ["任务简单、单 Agent 已满足 SLA", "缺乏跨 Agent 追踪与调试能力", "以「Agent 数量」为目标"],
    components: ["Router / Orchestrator", "Search Agent", "Graph Agent", "Data Agent", "Governance Agent", "Shared Evidence Store", "Trace & Audit"],
    dataFlow: ["角色注册与权限绑定", "结果写入共享证据池", "全链路 trace 关联"],
    queryFlow: ["Router 分派 → 并行取证 → Governance 复核 → 汇总验证 → 答案"],
    technologies: ["Agent Runtime", "消息 / 任务队列", "分布式追踪"],
    complexity: "高",
    costFactors: ["多模型调用", "通信与重试", "追踪存储与排障人力"],
    risks: ["通信与协调开销", "错误在 Agent 间传播", "调试与复现困难"],
    pros: ["职责与权限边界清晰", "可并行处理异构工具", "便于独立审计"],
    limits: ["逻辑角色不等于独立模型或微服务", "多 Agent 可能比单 Agent 更慢更贵"],
    alternatives: ["PAT-06（单运行时多工具）", "PAT-05"],
    diagram: D(
      [["r", "Router", "orchestrator"], ["s", "Search Agent", "llm"], ["g", "Graph Agent", "llm"], ["d", "Data Agent", "llm"], ["v", "Governance Agent", "security"], ["e", "Shared Evidence Store", "store"], ["t", "Trace & Audit", "security"], ["a", "Answer", "app"]],
      [[0, 1, "分派"], [0, 2, "分派"], [0, 3, "分派"], [1, 5, "证据"], [2, 5, "证据"], [3, 5, "证据"], [5, 4, "复核"], [4, 7, "通过"], [0, 6, "trace"], [6, 7, "审计"]],
    ),
  },
];

export const patternById: Record<string, ArchitecturePattern> = Object.fromEntries(
  architecturePatterns.map((p) => [p.id, p]),
);

export interface ADR {
  id: string;
  title: string;
  businessQuestion: string;
  context: string;
  decision: string;
  rationale: string[];
  alternatives: { option: string; whyNot: string }[];
  consequences: string[];
  status: "Accepted (示例)" | "Proposed (示例)" | "Superseded (示例)";
  revisitWhen: string;
}

/** 从业务问题出发，不做产品功能罗列，不杜撰性能数据或企业案例。 */
export const adrExamples: ADR[] = [
  {
    id: "ADR-001", title: "为什么选择属性图（如 Neo4j）而不是 RDF Triple Store",
    businessQuestion: "IT 运维团队要在 3 个月内交付「故障影响哪些业务」的可交互查询，团队熟悉 Cypher，没有语义推理团队。",
    context: "问题以路径遍历、多跳影响分析为主；需要带属性的边、可运维的查询语言与团队现有技能匹配。本体目前只需轻量领域模型，不需要 OWL 推理机。",
    decision: "采用属性图作为主存储，用轻量领域模型 + 约束描述类型与方向；把形式化公理留到跨域融合阶段再评估。",
    rationale: ["交付约束是业务可查询的影响路径，不是自动推理", "团队技能与运维能力是硬约束", "本体可以先以 Schema / SHACL 子集表达，避免阻塞交付"],
    alternatives: [
      { option: "RDF + OWL + SPARQL", whyNot: "需要额外的语义建模与推理能力；当前业务问题不产生推理收益，反而增加交付与运维成本。" },
      { option: "关系数据库递归 CTE", whyNot: "可变深度路径查询与图遍历表达成本高，跨多类关系时维护困难。" },
    ],
    consequences: ["需要为方向、类型与基数建立显式校验", "未来若出现跨域公理推理需求，需要重新评估（见 revisitWhen）", "本体与图 Schema 的映射需文档化"],
    status: "Accepted (示例)", revisitWhen: "出现跨业务域概念融合或需要自动分类一致性推理时。",
  },
  {
    id: "ADR-002", title: "为什么文档检索使用独立搜索服务而不是仅用图数据库向量索引",
    businessQuestion: "用户既要问「PaymentService 依赖什么」，也要问「上次故障复盘怎么写的」，并要求答案带原文引用与权限过滤。",
    context: "两类访问模式不同：图遍历面向结构化关系；文档检索面向关键词 + 语义 + 过滤 + 重排 + 分页。索引项需继承文档 ACL 与保留策略。",
    decision: "文档与向量检索放在专用搜索索引，图库只保存实体关系事实；编排层做证据融合与引用校验。",
    rationale: ["把检索能力（混合召回、重排、过滤）与关系存储解耦", "便于独立重建索引与独立扩缩容", "文档删除后的索引清理边界更清晰"],
    alternatives: [
      { option: "全部放入图数据库（含向量索引）", whyNot: "若文档检索的过滤、重排、分词与生命周期能力不满足需求，会把治理责任混在一个存储里；这不是产品优劣判断，而是职责边界判断。" },
      { option: "全部放入搜索服务", whyNot: "多跳关系遍历与带方向的路径约束不是倒排/向量索引的强项。" },
    ],
    consequences: ["需要维护跨存储的一致性 ID 与权限标签", "融合层必须校验引用是否真实存在", "具体产品能力具版本敏感性，需以官方当期文档为准"],
    status: "Accepted (示例)", revisitWhen: "官方产品能力变化，或权限模型要求单一策略执行点时。",
  },
  {
    id: "ADR-003", title: "什么时候需要 OWL，什么时候只需要轻量级领域模型",
    businessQuestion: "第二业务域要接入图谱，业务方问「要不要先做一套完整本体」。",
    context: "当前只需明确类层次、关系方向、必填属性与校验规则；没有自动分类、跨本体对齐或形式化一致性证明的诉求。",
    decision: "先用轻量领域模型（类型定义 + 方向 + 基数 + SHACL 或等价校验）落地，保留升级到 OWL 的映射文档。",
    rationale: ["形式化程度应与推理需求匹配", "校验比推理更先产生业务价值", "避免本体工程成为交付瓶颈"],
    alternatives: [
      { option: "直接上完整 OWL 本体", whyNot: "在没有推理需求时，建模与治理成本无法被业务收益抵消。" },
      { option: "完全不定义类型与约束", whyNot: "抽取结果会失去方向一致性与校验能力，后续融合代价更高。" },
    ],
    consequences: ["需显式记录本决策的失效条件", "未来引入 OWL 时需做模型迁移与回归校验"],
    status: "Accepted (示例)", revisitWhen: "出现自动分类、跨域本体对齐或监管要求形式化语义时。",
  },
  {
    id: "ADR-004", title: "什么时候应该采用 Agentic RAG",
    businessQuestion: "客服知识库问答延迟要求 2 秒内，但故障调查场景允许分钟级响应；两类需求是否共用一套检索架构？",
    context: "客服问题是单文档可答的事实查询；故障调查需要拆成「原因 / 影响 / 历史相似 / 处置建议」四个子问题并跨图、文档、工单系统取证。",
    decision: "按问题类型分流：客服保持单次/混合 RAG；仅故障调查启用有最大轮次与预算上限的 Agentic RAG，并提供转人工通道。",
    rationale: ["Agent 增加延迟、成本与错误传播", "复杂问题的收益来自多步取证，而不是 Agent 本身", "必须以评估集证明增量，不能以架构先进性决策"],
    alternatives: [
      { option: "全站统一 Agentic RAG", whyNot: "简单问题承担不必要的延迟与成本，且失败模式更难排查。" },
      { option: "全站统一单次 RAG", whyNot: "多子问题查询的证据覆盖率不足，答案容易以偏概全。" },
    ],
    consequences: ["需要问题类型路由与降级策略", "Agent 轨迹必须记录每步输入、输出与理由", "必须定义停止条件与人工确认项"],
    status: "Accepted (示例)", revisitWhen: "P95 延迟、单次成本或证据覆盖率评估不再满足业务 SLA 时。",
  },
  {
    id: "ADR-005", title: "什么时候应该坚持传统 RAG",
    businessQuestion: "团队计划把 FAQ 机器人升级为「多 Agent + 知识图谱」，期望提升满意度，但当前没有评估集。",
    context: "现有问题 90% 可由单篇制度文档回答；主要投诉是文档过期与引用缺失，而不是关系推理不足。",
    decision: "不引入图谱与 Agent；先补文档生命周期、引用渲染、ACL 与评估集，再基于分组指标决定是否升级。",
    rationale: ["故障原因在治理与评估，不在检索架构", "GraphRAG 不必然优于传统 RAG", "没有基线就无法证明新增成本的价值"],
    alternatives: [
      { option: "引入 GraphRAG", whyNot: "问题不涉及关系路径，抽取与消歧成本无法转化为业务收益。" },
      { option: "引入多 Agent", whyNot: "增加协调、延迟与调试成本，且可能放大错误。" },
    ],
    consequences: ["需要建立统一的评估数据集与分组指标", "架构升级必须有量化进入条件"],
    status: "Accepted (示例)", revisitWhen: "关系型问题占比显著上升，或评估显示 Recall@K 存在结构性缺口时。",
  },
  {
    id: "ADR-006", title: "语义层是否必须依赖知识图谱",
    businessQuestion: "BI 报表与 AI 助手对 MTTR 给出不同数字，业务方希望「统一口径」，是否要先建知识图谱？",
    context: "分歧来自指标定义、维度与过滤规则不一致；数据来自 ITSM 与监控两张结构化表，不涉及跨实体路径推理。",
    decision: "先建独立的 Business Glossary + Metrics Layer + 物理映射，语义层直接服务 BI 与 AI；知识图谱作为可选后续能力。",
    rationale: ["语义层的核心价值是统一业务语义与指标口径", "本问题不需要关系事实与图遍历", "避免把口径治理问题误判为图建模问题"],
    alternatives: [
      { option: "先建知识图谱再统一指标", whyNot: "图谱保存实体关系事实，不能替代指标定义与口径审批。" },
      { option: "在每个应用内硬编码口径", whyNot: "会产生新的不一致，且无法版本化与审计。" },
    ],
    consequences: ["指标定义需业务方审批并版本化", "AI 必须通过 Semantic Query 访问，不能绕过语义层拼 SQL"],
    status: "Accepted (示例)", revisitWhen: "需要把指标按业务实体关系做影响分析时再评估图谱集成。",
  },
];
