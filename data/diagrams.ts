import type { DiagramEdge, DiagramNode, LegendItem } from "@/data/diagram-types";

/* ---------- 1. 首页与第 1 章：三层关系总览 ---------- */
export const heroDiagram: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    {
      id: "data", label: "企业数据源", sub: "CMDB / 文档 / 工单 / 监控 / Excel", kind: "source", position: { x: 40, y: 0 },
      description: "原始材料既包含结构化资产清单，也包含非结构化文档。它们可以进入不同处理路径，不是只有一条流水线。",
      details: [
        { label: "示例输入", value: "CMDB 导出、Runbook PDF、Incident 工单" },
        { label: "关键要求", value: "来源、权限、版本、更新时间可追溯" },
        { label: "常见风险", value: "权限继承缺失、同一实体多份互相冲突的数据" },
      ],
    },
    {
      id: "ontology", label: "Ontology：语义模型", sub: "定义概念、类型、属性、关系与约束", kind: "ontology", position: { x: 40, y: 145 },
      description: "本体回答“企业世界中有哪些类型，它们之间允许发生什么关系”。它是模型层，不是知识数据本身。",
      details: [
        { label: "核心产物", value: "OWL、SHACL、领域模型、Competency Questions" },
        { label: "典型对象", value: "Class、Object Property、Data Property、Axiom" },
        { label: "可独立使用", value: "数据契约、主数据治理、跨系统语义对齐" },
      ],
    },
    {
      id: "kg", label: "Knowledge Graph", sub: "把真实实体与事实关系组织成图", kind: "graph", position: { x: 40, y: 290 },
      description: "知识图谱是按语义模型（或轻量 Schema）实例化的具体知识数据，可以存于 Neo4j、RDF Store 或其他图结构。",
      details: [
        { label: "核心产物", value: "Entity / Node / Relationship / Triple / Provenance" },
        { label: "可独立使用", value: "Cypher 影响分析、依赖查询、报表与可视化" },
        { label: "质量前提", value: "Entity Resolution、知识融合、校验与增量更新" },
      ],
    },
    {
      id: "graphrag", label: "GraphRAG", sub: "图检索 + 向量检索 + LLM 生成", kind: "rag", position: { x: 40, y: 435 },
      description: "GraphRAG 是检索增强生成架构，不是数据库产品。它组合图结构检索、文档语义检索与证据约束下的答案生成。",
      details: [
        { label: "核心产物", value: "Retriever、Context、Citation、可追溯答案" },
        { label: "可独立使用", value: "传统 RAG 无需图；轻量图检索也可不依赖完整 OWL" },
        { label: "关键风险", value: "多跳噪声、越权路径、引用失配与幻觉" },
      ],
    },
    {
      id: "apps", label: "企业 AI 应用", sub: "智能问答 / 影响分析 / 故障诊断 / 决策辅助", kind: "app", position: { x: 40, y: 580 },
      description: "面向业务的应用层。答案必须带证据链接、权限标签与版本信息，才能进入生产决策流程。",
      details: [
        { label: "典型场景", value: "故障问答、根因分析、责任团队定位、变更影响评估" },
        { label: "验收重点", value: "Faithfulness、Citation Accuracy、ACL Leakage Rate" },
      ],
    },
    {
      id: "direct-rag", label: "旁路：Traditional RAG", sub: "文档 → 分块 → 向量/关键词检索 → 回答", kind: "process", position: { x: 340, y: 290 },
      description: "当问题主要是文档语义检索时，可以跳过 Ontology 与知识图谱，直接建立带 Metadata Filter 的传统 RAG。",
      details: [{ label: "适用", value: "文档为主、关系简单、无需多跳推理" }, { label: "代价", value: "低；无需抽取、消歧与图维护" }],
    },
    {
      id: "direct-graph", label: "旁路：纯图查询", sub: "Cypher / 图算法 / 影响分析看板", kind: "fact", position: { x: 340, y: 145 },
      description: "知识图谱也可以独立服务于结构化查询和影响分析，完全不经过 LLM 生成。",
      details: [{ label: "适用", value: "精确依赖路径、拓扑分析、审计报表" }, { label: "代价", value: "无生成成本，答案可完全确定" }],
    },
  ],
  edges: [
    { id: "h1", source: "data", target: "ontology", label: "语义建模", kind: "ontology", animated: true, description: "从业务问题与文档语料中抽取领域概念，形成 Class 与 Property；并非所有项目都需要完整 OWL。" },
    { id: "h2", source: "ontology", target: "kg", label: "约束 / 映射", kind: "graph", animated: true, description: "本体为图谱提供类型与关系白名单；属性图需显式设计映射与独立校验机制。" },
    { id: "h3", source: "kg", target: "graphrag", label: "图检索证据", kind: "rag", animated: true, description: "图检索提供实体关系、路径与结构化事实；还需与文档证据融合。" },
    { id: "h4", source: "graphrag", target: "apps", label: "带引用答案", kind: "app", animated: true, description: "答案绑定 evidence_id、chunk_id 与图事实 ID，输出前做证据与权限校验。" },
    { id: "h5", source: "data", target: "direct-rag", label: "可独立", kind: "process", description: "常见旁路：文档语义检索场景不需要完整知识工程链路。" },
    { id: "h6", source: "direct-rag", target: "apps", label: "直接回答", kind: "process", description: "传统 RAG 直接向应用提供带文档引用的答案。" },
    { id: "h7", source: "kg", target: "direct-graph", label: "可独立", kind: "fact", description: "纯图查询不需要 LLM，可直接支撑确定性分析与看板。" },
    { id: "h8", source: "direct-graph", target: "apps", label: "结构化结果", kind: "fact", description: "图查询结果作为确定性事实进入应用，而非生成式答案。" },
  ],
  legend: [
    { kind: "source", label: "数据源" }, { kind: "ontology", label: "Ontology / 语义层" }, { kind: "graph", label: "Knowledge Graph" },
    { kind: "rag", label: "GraphRAG" }, { kind: "app", label: "AI 应用" }, { kind: "process", label: "可独立路径" },
  ],
};

export const independentLayers: { nodes: DiagramNode[]; edges: DiagramEdge[] } = {
  nodes: [
    { id: "i-onto", label: "Ontology 独立使用", sub: "数据契约 / 主数据治理 / 语义对齐", kind: "ontology", position: { x: 0, y: 60 }, description: "只使用语义模型统一跨系统字段与类型定义，不构建图谱、不做生成式问答。" },
    { id: "i-kg", label: "Knowledge Graph 独立使用", sub: "Cypher 查询 / 影响分析 / 拓扑看板", kind: "graph", position: { x: 320, y: 60 }, description: "以属性图存储事实关系并用确定性查询回答，完全不调用 LLM。" },
    { id: "i-rag", label: "GraphRAG 独立使用", sub: "文档 + 轻量图结构 + 混合检索", kind: "rag", position: { x: 640, y: 60 }, description: "以轻量实体关系与文档索引组合实现检索增强，不引入完整 OWL 推理体系。" },
    { id: "i-note", label: "三者可以组合，不必串联", sub: "按业务问题、数据形态与治理成本决定范围", kind: "concept", position: { x: 320, y: 230 }, description: "是否存在完整 Ontology、是否使用图数据库、是否引入 GraphRAG，是三个相互独立的架构决策。" },
  ],
  edges: [
    { id: "i1", source: "i-note", target: "i-onto", label: "决策 1", kind: "ontology", description: "是否需要显式语义模型？取决于跨系统语义一致性与推理需求。" },
    { id: "i2", source: "i-note", target: "i-kg", label: "决策 2", kind: "graph", description: "是否需要图结构？取决于关系查询与多跳分析需求。" },
    { id: "i3", source: "i-note", target: "i-rag", label: "决策 3", kind: "rag", description: "是否需要检索增强生成？取决于用户是否需要自然语言问答与证据引用。" },
  ],
};

/* ---------- 3. Ontology Class Hierarchy ---------- */
export interface TreeNode {
  id: string;
  label: string;
  kind: string;
  description: string;
  properties?: string[];
  example?: string;
  children?: TreeNode[];
}

export const classTree: TreeNode[] = [
  {
    id: "thing", label: "owl:Thing（顶层）", kind: "concept", description: "所有类的公共父类。企业本体一般从这里分出业务对象、技术资产、组织、事件、知识资产与环境。",
    children: [
      {
        id: "business-group", label: "BusinessEntity（业务对象）", kind: "business", description: "承载业务视角的对象，便于把技术资产与业务价值关联起来。",
        children: [
          { id: "business", label: "Business", kind: "business", description: "一条业务线或业务能力，例如“线上交易业务”。用于影响分析的业务侧上层节点。", properties: ["businessId", "businessName"], example: "BIZ-001 线上交易业务" },
        ],
      },
      {
        id: "asset-group", label: "TechnicalAsset（技术资产）", kind: "system", description: "可被部署、被调用、被监控的技术对象父类。",
        children: [
          { id: "system", label: "System", kind: "system", description: "一组协同提供业务能力的系统边界，包含多个 Service。", properties: ["systemId", "systemName", "criticality"], example: "OrderSystem" },
          { id: "service", label: "Service", kind: "service", description: "可独立部署/调用的服务单元，是调用关系与故障影响分析的核心类。", properties: ["serviceId", "serviceName", "status"], example: "PaymentService" },
          { id: "database", label: "Database", kind: "database", description: "提供持久化能力的数据存储实例。", properties: ["dbId", "dbType", "version"], example: "PaymentDB（PostgreSQL）" },
          { id: "infra", label: "Infrastructure", kind: "infrastructure", description: "主机、集群、网络与中间件等基础设施资产。", properties: ["assetId", "region", "vendor"], example: "PG-Cluster-01" },
        ],
      },
      {
        id: "org-group", label: "Organization（组织）", kind: "team", description: "责任主体，图谱中用于回答“应该联系谁”。",
        children: [
          { id: "team", label: "Team", kind: "team", description: "负责一个或多个服务的组织单元，含值班组信息。", properties: ["teamId", "name", "oncallChannel"], example: "PaymentTeam" },
        ],
      },
      {
        id: "event-group", label: "Event（事件）", kind: "incident", description: "有时间起点与状态变化的业务/运维事件。",
        children: [
          { id: "incident", label: "Incident", kind: "incident", description: "故障事件，关联受影响服务、处置手册与根因记录。", properties: ["incidentId", "severity", "occurredAt", "state"], example: "Incident-001（P1）" },
        ],
      },
      {
        id: "knowledge-group", label: "KnowledgeAsset（知识资产）", kind: "runbook", description: "可被检索、引用与版本化的知识载体。",
        children: [
          { id: "runbook", label: "Runbook", kind: "runbook", description: "标准化的故障处理手册，记录步骤、前置条件与回滚方案。", properties: ["runbookId", "title", "version", "reviewedAt"], example: "Runbook-001" },
          { id: "document", label: "Document", kind: "document", description: "原始文档实体，承载来源、权限与版本信息；Chunk 由它派生。", properties: ["documentId", "source", "classification", "updatedAt"], example: "支付服务故障处理手册.pdf" },
        ],
      },
      {
        id: "env-group", label: "Context（上下文）", kind: "environment", description: "用于限定事实生效范围的上下文类。",
        children: [
          { id: "environment", label: "Environment", kind: "environment", description: "部署/运行环境，例如 Production、Staging。注意：环境是属性值/上下文，不应把“运行中服务”做成 Service 的子类。", properties: ["environmentName", "region"], example: "Production" },
        ],
      },
    ],
  },
];

/* ---------- 4. Object Property 关系图 ---------- */
export const objectPropertyGraph: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    { id: "business", label: "Business", kind: "business", position: { x: 0, y: 0 }, description: "业务能力/业务线（示例扩展节点，用于展示跨层影响）。", details: [{ label: "标识", value: "businessId" }] },
    { id: "system", label: "System", kind: "system", position: { x: 230, y: 0 }, description: "系统边界类。", details: [{ label: "标识", value: "systemId" }] },
    { id: "team", label: "Team", kind: "team", position: { x: 460, y: 0 }, description: "责任团队类。", details: [{ label: "标识", value: "teamId" }] },
    { id: "incident", label: "Incident", kind: "incident", position: { x: 690, y: 0 }, description: "故障事件类。", details: [{ label: "标识", value: "incidentId" }] },
    { id: "infra", label: "Infrastructure", kind: "infrastructure", position: { x: 0, y: 180 }, description: "基础设施类。", details: [{ label: "标识", value: "assetId" }] },
    { id: "service", label: "Service（domain）", kind: "service", position: { x: 230, y: 180 }, description: "服务类，作为多数对象属性的定义域。", details: [{ label: "标识", value: "serviceId" }] },
    { id: "database", label: "Database", kind: "database", position: { x: 460, y: 180 }, description: "数据库类。", details: [{ label: "标识", value: "dbId" }] },
    { id: "environment", label: "Environment", kind: "environment", position: { x: 690, y: 180 }, description: "部署环境类。", details: [{ label: "标识", value: "environmentName" }] },
    { id: "runbook", label: "Runbook", kind: "runbook", position: { x: 230, y: 360 }, description: "运维手册类。", details: [{ label: "标识", value: "runbookId" }] },
    { id: "document", label: "Document", kind: "document", position: { x: 460, y: 360 }, description: "原始文档类。", details: [{ label: "标识", value: "documentId" }] },
    { id: "service-target", label: "Service（range）", kind: "service", position: { x: 690, y: 360 }, description: "服务类作为 calls / dependsOn 的值域；用单独节点避免自环混淆。", details: [{ label: "标识", value: "serviceId" }] },
  ],
  edges: [
    { id: "op1", source: "system", target: "service", label: "contains", kind: "system", description: "Domain: System；Range: Service；含义：系统包含服务。Cardinality：一个 Service 通常属于 1 个 System。方向不可反写。" },
    { id: "op2", source: "service", target: "service-target", label: "calls", kind: "service", description: "Domain/Range: Service；含义：运行期调用。与 dependsOn 不同：calls 描述可观测调用，dependsOn 描述设计/部署依赖。" },
    { id: "op3", source: "service", target: "infra", label: "dependsOn", kind: "process", description: "Domain: Service；Range: TechnicalAsset（含 Service / Database / Infrastructure）；含义：依赖关系，可用于影响分析。" },
    { id: "op4", source: "service", target: "database", label: "connectsTo", kind: "database", description: "Domain: Service；Range: Database；含义：服务建立数据库连接的配置事实，通常来自 CMDB 或配置文档。" },
    { id: "op5", source: "service", target: "team", label: "ownedBy", kind: "team", description: "Domain: Service；Range: Team；Cardinality 建议为 1..1；用于责任定位。" },
    { id: "op6", source: "service", target: "environment", label: "deployedIn", kind: "environment", description: "Domain: Service；Range: Environment；同一服务可在多个环境有不同实例，需结合实例 ID 或有效时间。" },
    { id: "op7", source: "incident", target: "service", label: "affects", kind: "incident", description: "Domain: Incident；Range: Service/System；含义：故障影响对象，是传播路径的起点。" },
    { id: "op8", source: "incident", target: "runbook", label: "resolvedBy", kind: "runbook", description: "Domain: Incident；Range: Runbook；含义：该事件实际采用的处置手册。" },
    { id: "op9", source: "service", target: "runbook", label: "documentedBy", kind: "runbook", description: "Domain: Service/System；Range: Runbook；含义：服务有对应的操作手册，与 resolvedBy 的语义不同。" },
    { id: "op10", source: "document", target: "runbook", label: "sourceOf（扩展）", kind: "document", description: "示例扩展关系：原始文档是 Runbook 的来源；在 Neo4j 中可用 HAS_CHUNK/MENTIONS 链路表达。" },
    { id: "op11", source: "business", target: "system", label: "contains（业务视角）", kind: "business", description: "示例扩展：业务线包含系统。若引入该关系，必须明确它与 System contains Service 的语义层级不同。" },
  ],
  legend: [
    { kind: "business", label: "业务层" }, { kind: "system", label: "系统" }, { kind: "service", label: "服务" },
    { kind: "database", label: "数据库" }, { kind: "team", label: "团队" }, { kind: "incident", label: "事件" },
    { kind: "runbook", label: "知识资产" }, { kind: "document", label: "文档" }, { kind: "environment", label: "环境" },
  ],
};

/* ---------- 5. 文档到知识图谱 Pipeline ---------- */
export interface PipelineStep {
  id: string;
  label: string;
  sub: string;
  kind: string;
  input: string;
  logic: string;
  output: string;
  tech: string;
  pitfall: string;
  failure: string;
}

export const pipelineSteps: PipelineStep[] = [
  { id: "p1", label: "1 企业文档", sub: "PDF / Word / Excel / HTML / Confluence / SharePoint", kind: "source", input: "原始文件与权限元数据", logic: "登记来源、密级、owner、版本与更新时间", output: "Document 清单 + ACL 标签", tech: "Blob Storage / SharePoint / Confluence API", pitfall: "扫描件无文本层、附件权限与正文权限不一致", failure: "进入人工登记队列，不进入下游处理" },
  { id: "p2", label: "2 文档解析", sub: "版面、表格、标题层级", kind: "process", input: "原始文件", logic: "版面分析、OCR、表格结构还原、标题与页码定位", output: "结构化文本 + 表格 + 页码坐标", tech: "Azure Document Intelligence / pdfplumber / python-docx", pitfall: "跨页表格断裂、合并单元格语义丢失", failure: "保留原文件引用，标记 parse_quality 并降级为逐页文本" },
  { id: "p3", label: "3 Chunk 切分", sub: "按章节 / 语义 / 表格 / 页码", kind: "chunk", input: "结构化文本", logic: "按标题层级与语义边界切分，表格整体保留，记录 page_number 与 chunk_id", output: "Chunk（带 source_document / 坐标）", tech: "自研切分器 + tokenizer 预算", pitfall: "切分过碎导致关系跨 Chunk 丢失；切分过大引入噪声", failure: "按标题边界重切并记录切分版本，可回放" },
  { id: "p4", label: "4 Entity Extraction", sub: "LLM 实体抽取", kind: "llm", input: "Chunk + Prompt + Schema", logic: "Structured Outputs 输出实体名、类型、属性、confidence 与 evidence", output: "候选 Entity JSON", tech: "Azure OpenAI Structured Outputs + Pydantic", pitfall: "别名、缩写、指代、模型补全未出现的事实", failure: "拒绝或解析失败时进入重试/死信队列，不写库" },
  { id: "p5", label: "5 Relationship Extraction", sub: "LLM 关系抽取", kind: "llm", input: "Chunk + 已抽取实体", logic: "只在本体允许的关系白名单内抽取 source / type / target / evidence", output: "候选 Relationship JSON", tech: "同一 Schema 内联合抽取", pitfall: "关系方向混乱、把状态当关系、跨段臆造关系", failure: "端点不在本批实体或类型非法时丢弃并计数告警" },
  { id: "p6", label: "6 Ontology Mapping", sub: "类型 / 关系白名单", kind: "ontology", input: "候选 JSON + OWL/SHACL", logic: "类型映射到 Class、关系映射到 Object Property、属性映射到 Data Property", output: "合规候选事实", tech: "OWL / SHACL / 枚举白名单", pitfall: "OWL Domain/Range 被误用为强制校验；属性图无自动语义推理", failure: "映射失败进入隔离区，附失败原因与原始 Chunk" },
  { id: "p7", label: "7 Entity Resolution", sub: "消歧与对齐", kind: "graph", input: "合规候选 + 权威 ID 表 + 别名表", logic: "精确 ID、Alias、规则、Embedding、LLM 上下文判断；高分自动合并、低分人工审核", output: "Canonical Entity ID + 候选匹配日志", tech: "阻断策略 + 打分函数 + 审核队列", pitfall: "同名不同实体被错误合并；自动合并不可逆", failure: "保留原始实体与审计日志，支持回滚与重新链接" },
  { id: "p8", label: "8 Knowledge Fusion", sub: "多来源冲突消解", kind: "fact", input: "多来源事实 + 权威性与时间戳", logic: "按来源权威性、时间新旧、证据数量消解冲突，保留 Provenance 与有效期", output: "权威事实 + 证据集 + 版本", tech: "规则引擎 + 版本表", pitfall: "把置信度当权威性；旧 CMDB 覆盖新工单", failure: "冲突无法自动判定则进入人工审核" },
  { id: "p9", label: "9 Validation", sub: "SHACL / Schema / ACL", kind: "ontology", input: "待写入事实", logic: "结构校验、枚举校验、基数校验、权限标签校验与人工抽检", output: "ValidationReport + 可写入事实", tech: "pyshacl / Pydantic / Neo4j Constraint", pitfall: "只校验字段不校验来源；忽略过期与重复事实", failure: "未通过的事实禁止写入生产图谱" },
  { id: "p10", label: "10 写入 + 增量更新", sub: "Graph DB / Search Index", kind: "store", input: "校验通过的事实 + Chunk", logic: "MERGE 写入图数据库、upsert 文档索引、变更检测、软删除与版本管理", output: "Neo4j 图 + AI Search Index + 审计日志", tech: "Cypher MERGE / Azure AI Search push", pitfall: "MERGE 只靠名称、关系重复、索引与图不一致", failure: "幂等重试 + 事务边界 + 对账任务，失败告警" },
];

export const pipelineDiagram: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = (() => {
  const xs = [0, 230, 460, 690, 920];
  const nodes: DiagramNode[] = pipelineSteps.map((s, i) => {
    const row = i < 5 ? 0 : 1;
    const col = i < 5 ? i : 9 - i;
    return {
      id: s.id, label: s.label, sub: s.sub, kind: s.kind,
      position: { x: xs[col], y: row * 190 },
      description: s.logic,
      details: [
        { label: "输入", value: s.input }, { label: "处理逻辑", value: s.logic }, { label: "输出", value: s.output },
        { label: "技术选择", value: s.tech }, { label: "常见问题", value: s.pitfall }, { label: "失败处理", value: s.failure },
      ],
    };
  });
  const edges: DiagramEdge[] = pipelineSteps.slice(0, -1).map((s, i) => ({
    id: `pe${i}`, source: s.id, target: pipelineSteps[i + 1].id,
    label: i === 4 ? "折返" : undefined, kind: i < 4 ? "process" : "fact", animated: true,
    description: `${s.output} → ${pipelineSteps[i + 1].input}`,
  }));
  return {
    nodes, edges,
    legend: [
      { kind: "source", label: "数据源" }, { kind: "process", label: "解析 / 切分" }, { kind: "llm", label: "LLM 抽取" },
      { kind: "ontology", label: "本体与校验" }, { kind: "graph", label: "消歧" }, { kind: "fact", label: "融合" }, { kind: "store", label: "写入" },
    ],
  };
})();

/* ---------- 6. Entity Resolution 流程 ---------- */
export interface ErStep {
  id: string;
  name: string;
  method: string;
  detail: string;
  risk: string;
}

export const erSteps: ErStep[] = [
  { id: "er1", name: "精确 ID 匹配", method: "serviceId / CMDB ID 完全一致", detail: "最高可信路径，例如 SVC-002 与 SVC-002 直接判定同一实体。", risk: "ID 体系不统一或跨系统重号" },
  { id: "er2", name: "Alias 匹配", method: "别名表：支付服务 / PaymentSvc / PaymentService", detail: "由领域专家维护的规范化别名，命中后进入高分候选。", risk: "别名过期、缩写歧义" },
  { id: "er3", name: "规则匹配", method: "类型一致 + 命名模式 + 环境一致", detail: "例如同为 Service、同属 Production、serviceId 符合 ^SVC-[0-9]{3}$。", risk: "规则过宽造成误合并" },
  { id: "er4", name: "Embedding 相似度", method: "名称 + 上下文向量的余弦相似度", detail: "捕捉语义相近但字面不同的表述，作为打分因子之一。", risk: "向量相似不等于同一实体" },
  { id: "er5", name: "LLM 上下文判断", method: "把原文片段与候选对交给模型判定", detail: "用于规则与向量无法决断的边界样本，输出判断理由与证据。", risk: "模型幻觉、输出不稳定、成本与延迟" },
  { id: "er6", name: "人工审核", method: "中分区间进入审核队列", detail: "记录审核人、决策、时间与证据，形成可复用标注数据。", risk: "队列积压影响知识新鲜度" },
  { id: "er7", name: "合并与回滚", method: "Canonical ID + 审计日志", detail: "自动合并必须可逆：保留原始实体、匹配分数与决策版本。", risk: "不可逆合并会污染全图并影响历史答案" },
];

export const erScoreWeights = [
  { key: "id", label: "ID Similarity", weight: 0.4, hint: "精确 ID 是否一致" },
  { key: "name", label: "Name / Alias Similarity", weight: 0.25, hint: "名称与别名字面相似度" },
  { key: "context", label: "Context Similarity", weight: 0.2, hint: "上下文词元重合度" },
  { key: "embedding", label: "Embedding Similarity", weight: 0.15, hint: "向量余弦相似度" },
];

/* ---------- 7. Knowledge Fusion 来源融合图 ---------- */
export const fusionDiagram: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    { id: "src-cmdb", label: "CMDB 导出", sub: "权威性：高 · 2026-04-12", kind: "source", position: { x: 0, y: 0 }, description: "结构化资产清单，是企业权威来源之一，但可能滞后于实际变更。", details: [{ label: "source_authority", value: "cmdb-export（示例：高）" }, { label: "observed_at", value: "2026-04-12" }, { label: "证据", value: "SVC-002 connectsTo DB-002" }] },
    { id: "src-runbook", label: "Runbook PDF", sub: "权威性：中 · 2025-11-03", kind: "document", position: { x: 0, y: 150 }, description: "运维手册中的描述性事实，可能使用旧名称。", details: [{ label: "source_authority", value: "runbook（示例：中）" }, { label: "observed_at", value: "2025-11-03" }, { label: "证据", value: "支付服务连接 PostgreSQL PaymentDB" }] },
    { id: "src-ticket", label: "Incident 工单", sub: "权威性：中 · 2026-04-13", kind: "incident", position: { x: 0, y: 300 }, description: "故障工单中的即时记录，时间最新但可能只描述临时状态。", details: [{ label: "source_authority", value: "incident-ticket（示例：中）" }, { label: "observed_at", value: "2026-04-13" }, { label: "证据", value: "支付库连接超时，切至备用实例" }] },
    { id: "f1", label: "事实 A：connectsTo PaymentDB", sub: "confidence 0.93 · CMDB", kind: "fact", position: { x: 280, y: 0 }, description: "来自 CMDB 的连接关系，带权威 ID。", details: [{ label: "confidence", value: "0.93（抽取把握）" }, { label: "权威性", value: "与 confidence 是不同维度" }] },
    { id: "f2", label: "事实 B：connectsTo PaymentDB", sub: "confidence 0.88 · Runbook", kind: "fact", position: { x: 280, y: 150 }, description: "手册描述与 CMDB 一致，但使用中文别名。", details: [{ label: "confidence", value: "0.88" }, { label: "问题", value: "需先完成 Entity Resolution" }] },
    { id: "f3", label: "事实 C：备用实例切换", sub: "confidence 0.76 · 工单", kind: "risk", position: { x: 280, y: 300 }, description: "临时状态，不应覆盖常态连接事实；应作为时态事件单独保存。", details: [{ label: "confidence", value: "0.76" }, { label: "时态", value: "valid_from / valid_to" }] },
    { id: "engine", label: "Knowledge Fusion 引擎", sub: "权威性 / 时间 / 冲突 / 证据数", kind: "orchestrator", position: { x: 560, y: 80 }, description: "按来源权威性、时间新旧、证据数量与人工审核结果消解冲突，并保留所有原始证据。", details: [{ label: "规则 1", value: "权威来源优先于描述性文档" }, { label: "规则 2", value: "临时事件不覆盖常态事实" }, { label: "规则 3", value: "冲突无法判定进入人工审核" }] },
    { id: "review", label: "人工审核队列", sub: "冲突 / 低置信 / 高风险", kind: "team", position: { x: 560, y: 300 }, description: "审核记录进入标注数据集，用于校准打分权重与规则。", details: [{ label: "记录", value: "审核人、时间、决策、证据" }] },
    { id: "canonical", label: "权威事实 + 证据集", sub: "含 Provenance、版本与有效期", kind: "app", position: { x: 840, y: 150 }, description: "最终写入图谱的事实保留多来源证据、版本号、有效期与审核状态，可随时回滚。", details: [{ label: "字段", value: "fact_id / sources[] / valid_from / valid_to / version" }, { label: "可追溯", value: "每个答案引用可回到原始 Chunk" }] },
  ],
  edges: [
    { id: "fu1", source: "src-cmdb", target: "f1", label: "抽取", kind: "source" },
    { id: "fu2", source: "src-runbook", target: "f2", label: "抽取", kind: "document" },
    { id: "fu3", source: "src-ticket", target: "f3", label: "抽取", kind: "incident" },
    { id: "fu4", source: "f1", target: "engine", label: "候选", kind: "fact", animated: true },
    { id: "fu5", source: "f2", target: "engine", label: "候选", kind: "fact", animated: true },
    { id: "fu6", source: "f3", target: "engine", label: "时态事件", kind: "risk", animated: true },
    { id: "fu7", source: "engine", target: "canonical", label: "采信", kind: "app", animated: true },
    { id: "fu8", source: "engine", target: "review", label: "冲突", kind: "team", description: "出现事实冲突或低置信度时拒绝自动合并。" },
    { id: "fu9", source: "review", target: "canonical", label: "人工裁定", kind: "team" },
  ],
  legend: [
    { kind: "source", label: "权威来源" }, { kind: "document", label: "文档" }, { kind: "incident", label: "事件" },
    { kind: "fact", label: "候选事实" }, { kind: "risk", label: "冲突 / 时态" }, { kind: "orchestrator", label: "融合引擎" }, { kind: "app", label: "权威事实" },
  ],
};

/* ---------- 8. Neo4j 数据模型图 ---------- */
export const neo4jModel: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    { id: "Business", label: ":Business", sub: "businessId, name", kind: "business", position: { x: 0, y: 0 }, description: "业务线节点，用于业务侧影响分析。", details: [{ label: "唯一键", value: "businessId" }] },
    { id: "System", label: ":System", sub: "systemId, name", kind: "system", position: { x: 220, y: 0 }, description: "系统节点。", details: [{ label: "唯一键", value: "systemId" }] },
    { id: "Service", label: ":Service", sub: "serviceId, serviceName, status", kind: "service", position: { x: 440, y: 0 }, description: "核心服务节点，绝大多数关系以其为起点。", details: [{ label: "唯一键", value: "serviceId（来自 CMDB）" }, { label: "枚举", value: "status ∈ Running/Stopped/Failed" }] },
    { id: "ServiceTarget", label: ":Service（被调用）", sub: "同一 Label 的另一节点", kind: "service", position: { x: 660, y: 0 }, description: "为展示 CALLS 的自环关系而绘制的第二个 Service 节点；实际是同一 Label。", details: [{ label: "唯一键", value: "serviceId" }] },
    { id: "Database", label: ":Database", sub: "dbId, dbType", kind: "database", position: { x: 0, y: 170 }, description: "数据库节点。", details: [{ label: "唯一键", value: "dbId" }] },
    { id: "Team", label: ":Team", sub: "teamId, name", kind: "team", position: { x: 220, y: 170 }, description: "责任团队节点。", details: [{ label: "唯一键", value: "teamId" }] },
    { id: "Environment", label: ":Environment", sub: "name, region", kind: "environment", position: { x: 440, y: 170 }, description: "环境节点。", details: [{ label: "唯一键", value: "name（示例简化）" }] },
    { id: "Infrastructure", label: ":Infrastructure", sub: "assetId, region", kind: "infrastructure", position: { x: 660, y: 170 }, description: "基础设施节点。", details: [{ label: "唯一键", value: "assetId" }] },
    { id: "Incident", label: ":Incident", sub: "incidentId, severity", kind: "incident", position: { x: 0, y: 340 }, description: "故障事件节点。", details: [{ label: "唯一键", value: "incidentId" }] },
    { id: "Runbook", label: ":Runbook", sub: "runbookId, title", kind: "runbook", position: { x: 220, y: 340 }, description: "运维手册节点。", details: [{ label: "唯一键", value: "runbookId" }] },
    { id: "Document", label: ":Document", sub: "documentId, source, ACL", kind: "document", position: { x: 440, y: 340 }, description: "原始文档节点，携带 security_groups。", details: [{ label: "唯一键", value: "documentId" }] },
    { id: "Chunk", label: ":Chunk", sub: "chunkId, page_number", kind: "chunk", position: { x: 660, y: 340 }, description: "文档分块节点，与 Azure AI Search 的 chunk_id 对齐。", details: [{ label: "唯一键", value: "chunkId" }] },
  ],
  edges: [
    { id: "n1", source: "Business", target: "System", label: "CONTAINS", kind: "business", description: "业务线包含系统（示例扩展关系）。" },
    { id: "n2", source: "System", target: "Service", label: "CONTAINS", kind: "system", description: "系统包含服务。" },
    { id: "n3", source: "Service", target: "ServiceTarget", label: "CALLS", kind: "service", description: "运行期调用关系；方向由调用方指向被调用方。" },
    { id: "n4", source: "Service", target: "Infrastructure", label: "DEPENDS_ON", kind: "process", description: "设计/部署依赖，不等价于 CALLS。" },
    { id: "n5", source: "Service", target: "Database", label: "CONNECTS_TO", kind: "database", description: "服务连接数据库。" },
    { id: "n6", source: "Service", target: "Team", label: "OWNED_BY", kind: "team", description: "责任团队，1..1。" },
    { id: "n7", source: "Service", target: "Environment", label: "DEPLOYED_IN", kind: "environment", description: "部署环境。" },
    { id: "n8", source: "Incident", target: "Service", label: "AFFECTS", kind: "incident", description: "故障影响服务，是传播路径起点。" },
    { id: "n9", source: "Incident", target: "Runbook", label: "RESOLVED_BY", kind: "runbook", description: "事件实际使用的处置手册。" },
    { id: "n10", source: "Service", target: "Runbook", label: "DOCUMENTED_BY", kind: "runbook", description: "服务对应的操作手册。" },
    { id: "n11", source: "Document", target: "Chunk", label: "HAS_CHUNK", kind: "document", description: "文档切分为 Chunk，保留页码与权限标签。" },
    { id: "n12", source: "Chunk", target: "Service", label: "MENTIONS", kind: "chunk", description: "Chunk 提及实体，用于把文档证据与图实体关联。" },
  ],
  legend: [
    { kind: "business", label: "业务" }, { kind: "system", label: "系统/服务" }, { kind: "database", label: "数据库" },
    { kind: "team", label: "团队" }, { kind: "incident", label: "事件" }, { kind: "runbook", label: "知识" }, { kind: "document", label: "文档/Chunk" },
  ],
};

/* ---------- 11. Traditional RAG vs GraphRAG ---------- */
export const ragComparisonDiagram: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: [
    { id: "t-doc", label: "企业文档", sub: "PDF / Wiki / 工单", kind: "source", position: { x: 0, y: 0 }, description: "两侧使用同一批原始文档，便于比较差异。" },
    { id: "t-chunk", label: "Chunk 切分", kind: "chunk", position: { x: 0, y: 125 }, description: "按章节/语义切块，生成 chunk_id。" },
    { id: "t-index", label: "向量 / 关键词索引", sub: "Azure AI Search", kind: "store", position: { x: 0, y: 250 }, description: "只保存文本与向量，不构建实体关系图。" },
    { id: "t-retrieve", label: "单路 / 混合检索", sub: "Top-K 文本片段", kind: "process", position: { x: 0, y: 375 }, description: "语义检索为主，可用 Metadata Filter 缩小范围。" },
    { id: "t-llm", label: "LLM 生成", sub: "基于片段回答", kind: "llm", position: { x: 0, y: 500 }, description: "上下文为文本片段，答案引用 chunk_id。" },
    { id: "t-answer", label: "答案", sub: "适合文档型问题", kind: "app", position: { x: 0, y: 625 }, description: "成本与延迟较低，但难以回答跨实体多跳影响分析。" },
    { id: "g-doc", label: "企业文档", sub: "同一批原始文档", kind: "source", position: { x: 380, y: 0 }, description: "GraphRAG 同样从文档出发，但增加抽取与建图层。" },
    { id: "g-extract", label: "实体 / 关系抽取", sub: "Ontology 白名单", kind: "llm", position: { x: 380, y: 125 }, description: "抽取候选事实，经 Ontology Mapping、ER、Fusion、Validation 后写图。" },
    { id: "g-graph", label: "Neo4j 图检索", sub: "路径 / 多跳关系", kind: "graph", position: { x: 380, y: 275 }, description: "提供结构化事实、路径与影响范围。" },
    { id: "g-index", label: "Azure AI Search", sub: "原文 / 向量证据", kind: "store", position: { x: 680, y: 275 }, description: "提供原文措辞、页码与语义证据。" },
    { id: "g-fusion", label: "Context Fusion", sub: "去重 / 裁剪 / ACL", kind: "orchestrator", position: { x: 530, y: 400 }, description: "把图事实与文档证据融合，绑定 evidence_id 并二次权限校验。" },
    { id: "g-llm", label: "LLM 生成", sub: "证据约束", kind: "llm", position: { x: 530, y: 525 }, description: "只允许基于给定证据回答，输出 citation_ids。" },
    { id: "g-answer", label: "答案 + 图路径 + 引用", sub: "适合多跳 / 影响分析", kind: "app", position: { x: 530, y: 650 }, description: "可解释性更强，但数据准备与维护成本更高、延迟更高。" },
  ],
  edges: [
    { id: "t1", source: "t-doc", target: "t-chunk", kind: "source", animated: true },
    { id: "t2", source: "t-chunk", target: "t-index", kind: "chunk", animated: true },
    { id: "t3", source: "t-index", target: "t-retrieve", kind: "store", animated: true },
    { id: "t4", source: "t-retrieve", target: "t-llm", kind: "process", animated: true },
    { id: "t5", source: "t-llm", target: "t-answer", kind: "app", animated: true },
    { id: "g1", source: "g-doc", target: "g-extract", kind: "source", animated: true },
    { id: "g2", source: "g-extract", target: "g-graph", label: "写图", kind: "llm", animated: true },
    { id: "g3", source: "g-extract", target: "g-index", label: "写索引", kind: "llm", animated: true },
    { id: "g4", source: "g-graph", target: "g-fusion", label: "图事实", kind: "graph", animated: true },
    { id: "g5", source: "g-index", target: "g-fusion", label: "文档证据", kind: "store", animated: true },
    { id: "g6", source: "g-fusion", target: "g-llm", kind: "orchestrator", animated: true },
    { id: "g7", source: "g-llm", target: "g-answer", kind: "app", animated: true },
  ],
  legend: [
    { kind: "source", label: "数据源" }, { kind: "llm", label: "抽取 / 生成" }, { kind: "graph", label: "图检索" },
    { kind: "store", label: "文档索引" }, { kind: "orchestrator", label: "上下文融合" }, { kind: "app", label: "答案" },
  ],
};

/* ---------- 10. GraphRAG 查询时序流程 ---------- */
export interface SequenceStep {
  id: string;
  no: number;
  lane: "user" | "orchestrator" | "retrieval" | "llm";
  title: string;
  input: string;
  output: string;
  detail: string;
}

export const querySequence: SequenceStep[] = [
  { id: "q1", no: 1, lane: "user", title: "用户提出问题", input: "自然语言问题", output: "raw_query", detail: "示例：PaymentService 故障会影响哪些系统？应该联系谁？有哪些处理手册？" },
  { id: "q2", no: 2, lane: "orchestrator", title: "Query Understanding", input: "raw_query + 会话上下文", output: "改写后问题、约束条件", detail: "补全省略、拆分多意图、识别时间范围与 as-of 时间。" },
  { id: "q3", no: 3, lane: "orchestrator", title: "Intent Classification", input: "改写后问题", output: "意图标签（影响分析 / 文档问答 / 混合）", detail: "决定是否需要图遍历、需要几路检索以及是否允许生成式回答。" },
  { id: "q4", no: 4, lane: "orchestrator", title: "Entity Linking", input: "问题中的实体提及", output: "Canonical Entity ID", detail: "把 PaymentService / 支付服务映射到 serviceId = SVC-002，记录匹配分数。" },
  { id: "q5", no: 5, lane: "retrieval", title: "Graph Retrieval", input: "entity_id + 深度/关系白名单 + ACL", output: "图事实与路径", detail: "参数化 Cypher，限制 1..2 跳，返回 CALLS / CONTAINS / OWNED_BY / DOCUMENTED_BY 等事实。" },
  { id: "q6", no: 6, lane: "retrieval", title: "Vector Retrieval", input: "query embedding + ACL filter", output: "语义相近 Chunk", detail: "Azure AI Search 向量检索，filter 下推 security_groups。" },
  { id: "q7", no: 7, lane: "retrieval", title: "Keyword Retrieval", input: "关键词 + 实体 ID + 文档类型", output: "精确命中 Chunk", detail: "BM25/Lucene 关键词检索保障 ID、错误码、版本号等精确词命中。" },
  { id: "q8", no: 8, lane: "orchestrator", title: "Hybrid Retrieval（RRF）", input: "多路候选结果", output: "融合排序候选集", detail: "按名次倒数融合多路检索结果，可叠加 Semantic Ranker；排序不等于事实正确性。" },
  { id: "q9", no: 9, lane: "orchestrator", title: "Context Fusion", input: "图事实 + 文档证据", output: "带 evidence_id 的上下文", detail: "去重、按相关性裁剪、注入来源与权限标签、控制 token 预算。" },
  { id: "q10", no: 10, lane: "orchestrator", title: "Evidence Validation", input: "融合上下文", output: "可引用证据集", detail: "二次 ACL 校验、时效性校验、冲突检测；剔除无来源与过期事实。" },
  { id: "q11", no: 11, lane: "llm", title: "LLM Answer", input: "证据集 + 生成约束", output: "答案草稿 + citation_ids", detail: "证据不足时拒答，禁止引用证据集之外的 ID。" },
  { id: "q12", no: 12, lane: "user", title: "Citation / Source 输出", input: "答案草稿", output: "带引用答案与审计记录", detail: "页面展示 chunk_id、document_id、页码、图事实 ID 与更新时间。" },
];

export const laneLabels: Record<SequenceStep["lane"], string> = {
  user: "用户 / 应用", orchestrator: "编排层", retrieval: "检索层", llm: "LLM 层",
};
