/**
 * 企业知识工程总体架构：8 层 + 横切治理，三套视图共用一份组件定义。
 *
 * 「Azure 参考架构」视图只是把能力映射到一组 Azure 服务名称的**教学示例**，
 * 不代表唯一标准答案，也不描述任何产品功能承诺；产品能力具版本敏感性，
 * 请以官方文档为准（见站内附录「官方技术参考」）。
 */

export type ArchView = "logical" | "azure" | "neutral";

export interface ArchComponent {
  id: string;
  layer: number;
  kind: string;
  /** [技术逻辑视图, Azure 参考视图, 技术中立视图] */
  labels: [string, string, string];
  responsibility: string;
  inputs: string;
  outputs: string;
  technologies: string;
  upstream: string;
  downstream: string;
  decisions: string;
  antiPatterns: string;
  alternatives: string;
}

export interface ArchLayer {
  no: number;
  id: string;
  title: string;
  en: string;
  subtitle: string;
  kind: string;
  components: string[];
}

const c = (
  id: string, layer: number, kind: string, labels: [string, string, string],
  responsibility: string, inputs: string, outputs: string, technologies: string,
  upstream: string, downstream: string, decisions: string, antiPatterns: string, alternatives: string,
): ArchComponent => ({
  id, layer, kind, labels, responsibility, inputs, outputs, technologies,
  upstream, downstream, decisions, antiPatterns, alternatives,
});

export const archLayers: ArchLayer[] = [
  { no: 1, id: "L1", title: "Enterprise Data Sources", en: "企业数据源", subtitle: "结构化、半结构化、非结构化与实时数据来源", kind: "source", components: [] },
  { no: 2, id: "L2", title: "Data Ingestion and Processing", en: "数据接入与处理", subtitle: "连接器、解析、ETL/ELT、事件流、切分与规范化", kind: "process", components: [] },
  { no: 3, id: "L3", title: "Knowledge Modeling", en: "知识建模", subtitle: "本体、OWL、SHACL、业务术语与语义模型", kind: "ontology", components: [] },
  { no: 4, id: "L4", title: "Knowledge Storage", en: "知识存储", subtitle: "图、向量、文档、关系、时序与元数据目录", kind: "store", components: [] },
  { no: 5, id: "L5", title: "Knowledge Services", en: "知识服务", subtitle: "消歧、融合、图查询、混合检索、语义查询、血缘与治理", kind: "rag", components: [] },
  { no: 6, id: "L6", title: "Intelligence Layer", en: "智能层", subtitle: "RAG、GraphRAG、Agentic RAG、Knowledge Agent、推理与校验", kind: "llm", components: [] },
  { no: 7, id: "L7", title: "Enterprise Applications", en: "企业应用", subtitle: "Copilot、运维助手、风险、供应链、预测性维护与孪生应用", kind: "app", components: [] },
  { no: 8, id: "L8", title: "Cross-cutting Governance", en: "横切治理", subtitle: "身份、权限、审计、质量、监控、成本、安全、合规", kind: "security", components: [] },
];

export const archComponents: ArchComponent[] = [
  // Layer 1 — Enterprise Data Sources
  c("L1-PDF", 1, "source", ["PDF 文档", "Blob Storage 中的 PDF（映射示例）", "对象存储中的 PDF 文件"],
    "提供合同、复盘、手册等非结构化原文，是引用与证据的起点。", "业务系统导出、人工上传", "原始二进制 + 来源登记", "对象存储 / 文档库", "外部业务方", "Document Parsing",
    "保留原始文件哈希与来源 ID，避免只存切分片段。", "解析后丢弃原文，导致引用不可验证。", "直接读取受控文档库 API。"),
  c("L1-WORD", 1, "source", ["Word 文档", "SharePoint 文档库（映射示例）", "协作文档库中的 Word 文件"],
    "承载带样式与表格的制度、流程文档。", "协作平台文档", "原始文件 + 版本", "文档协作平台", "业务部门", "Document Parsing",
    "记录文档版本与生效日期，供时态治理使用。", "忽略版本，用旧制度回答新问题。", "导出为 PDF 后统一解析。"),
  c("L1-EXCEL", 1, "source", ["Excel 表格", "Excel / SharePoint 列表（映射示例）", "电子表格文件"],
    "提供参数表、资产台账等半结构化数据。", "人工维护表格", "行列数据 + 表头", "电子表格", "业务团队", "ETL / ELT",
    "把表头视为契约并版本化，禁止隐式推断。", "把合并单元格直接当关系表读取。", "迁入关系库后由连接器读取。"),
  c("L1-SPO", 1, "source", ["SharePoint", "SharePoint（映射示例）", "企业文档协作平台"],
    "企业文档协作与权限继承的源头之一。", "团队文档与站点权限", "文档 + ACL + 修改时间", "文档协作平台", "企业内容管理", "Connectors",
    "接入时同步 ACL，不能只复制文本。", "导出纯文本导致权限标签丢失。", "其他文档管理系统，能力等价即可。"),
  c("L1-CONF", 1, "source", ["Confluence", "等效 Wiki（映射示例）", "企业 Wiki / 知识库"],
    "架构决策、Runbook 与运维知识的常见载体。", "页面与空间", "页面内容 + 页面树 + 更新时间", "Wiki 平台", "工程团队", "Connectors",
    "把页面 ID 作为稳定证据 ID 并保留修订历史。", "把 Wiki 页面当作永久权威而不设复核周期。", "Git 托管的 Markdown 文档。"),
  c("L1-SQL", 1, "source", ["SQL 数据库", "Azure SQL / PostgreSQL（映射示例）", "关系型数据库"],
    "承载交易与配置等结构化业务数据。", "业务系统写入", "表、视图、变更日志", "RDBMS", "业务系统", "ETL / ELT / Business APIs",
    "通过受控视图暴露，避免 Agent 直连生产库。", "允许 LLM 生成任意 SQL 访问生产表。", "数据仓库中的落地表。"),
  c("L1-ERP", 1, "source", ["ERP", "ERP 系统（映射示例）", "企业资源计划系统"],
    "提供物料、订单、财务主数据等业务事实。", "企业业务交易", "主数据与事务数据", "ERP 接口", "企业运营", "Connectors / ETL",
    "以主数据 ID 作为跨系统对齐锚点。", "在知识层另造一套物料编码。", "通过主数据管理平台间接接入。"),
  c("L1-CRM", 1, "source", ["CRM", "CRM 系统（映射示例）", "客户关系管理系统"],
    "提供客户、商机与互动记录，常涉及高敏感数据。", "销售与服务流程", "客户实体与活动", "CRM 接口", "销售 / 服务", "Connectors",
    "接入前完成数据分类与最小字段集审批。", "把完整客户档案同步进向量索引。", "经脱敏的客户主数据视图。"),
  c("L1-ITSM", 1, "source", ["ITSM", "ITSM 工单系统（映射示例）", "IT 服务管理系统"],
    "提供 Incident / Change / Problem 等运维事实与时间线。", "事件与变更流程", "工单、状态流转、关联 CI", "ITSM 接口", "IT 运维", "ETL / Graph Extraction",
    "以工单 ID 与状态时间线支撑双时态建模。", "只同步当前状态，丢失历史流转。", "事件数据湖中的落地表。"),
  c("L1-IOT", 1, "source", ["IoT / Sensors", "IoT Hub / Event Hubs（映射示例）", "物联网设备与消息网关"],
    "提供设备遥测事件流，是数字孪生状态同步的输入。", "传感器采样", "带时间戳的事件", "IoT 网关 / 消息总线", "物理设备", "Event Streaming",
    "事件携带稳定资产 ID 与采集时间，避免后补对齐。", "把时序遥测全部塞进知识图谱。", "批量导入的历史遥测文件（仅适合离线分析）。"),

  // Layer 2 — Ingestion & Processing
  c("L2-CONN", 2, "process", ["Connectors", "Data Factory 连接器（映射示例）", "数据源连接器"],
    "统一接入认证、增量拉取、失败重试与来源登记。", "L1 各类数据源", "标准化原始载荷 + Source ID", "连接器框架 / CDC", "L1 数据源", "Document Parsing / ETL",
    "每个连接器声明密级默认值与重试幂等键。", "各业务线自写脚本导致来源不可追溯。", "由源系统推送到事件总线。"),
  c("L2-PARSE", 2, "process", ["Document Parsing", "Document Intelligence（映射示例）", "文档解析服务"],
    "把 PDF / Word / 表格解析为带结构与页码的文本。", "原始文档", "结构化文本 + 表格 + 页码", "OCR / 版面分析 / 解析器", "Connectors", "Chunking / Extraction",
    "保留页码与段落边界，供引用定位。", "把整篇文档压成一段纯文本。", "纯文本解析 + 规则化表格抽取。"),
  c("L2-ETL", 2, "process", ["ETL / ELT", "Data Factory / Fabric 管道（映射示例）", "数据集成管道"],
    "把结构化数据规整为可建模的数据集并记录批次。", "SQL / ERP / CRM / ITSM", "规范化数据集 + 批次元数据", "批流处理 / SQL 转换", "L1 结构化源", "Knowledge Modeling / Storage",
    "批次可重放、可回滚，转换逻辑版本化。", "在管道里硬编码业务口径（应交给语义层）。", "以视图替代物理落地。"),
  c("L2-EVENT", 2, "process", ["Event Streaming", "Event Hubs / Kafka（映射示例）", "事件流平台"],
    "承接实时事件，支持重放、分区与背压。", "IoT / 业务事件", "有序事件流", "消息总线 / 流处理", "IoT / 业务系统", "Time-series Store / Twin State",
    "以资产 ID + 事件时间作为分区与去重依据。", "用事件流直接驱动真实设备控制而无审批。", "定时批量拉取（牺牲实时性）。"),
  c("L2-CHUNK", 2, "process", ["Chunking", "切分与嵌入管道（映射示例）", "文档切分步骤"],
    "按标题与语义边界切分，产出可引用的片段。", "结构化文本", "Chunk + 偏移 + 来源指针", "切分策略 / Token 计数", "Document Parsing", "Vector Index / Extraction",
    "每个 Chunk 继承原文密级、版本与证据 ID。", "按固定字符数切断表格与代码块。", "按章节整体索引（适合短文档）。"),
  c("L2-NORM", 2, "process", ["Data Normalization", "数据规范化步骤（映射示例）", "规范化与单位统一"],
    "统一编码、时间格式、单位与枚举，降低融合冲突。", "异构原始数据", "规范化记录 + 转换日志", "Schema 映射 / 规则引擎", "Connectors / ETL", "Extraction / Validation",
    "转换规则必须可逆并记录原值。", "静默改写数值导致事实不可复核。", "在语义层做展示层换算（不改变底层事实）。"),

  // Layer 3 — Knowledge Modeling
  c("L3-ONTO", 3, "ontology", ["Ontology", "领域模型 / Ontology 服务（映射示例）", "领域概念模型"],
    "定义概念、类型、关系、方向与基数，约束什么事实可以存在。", "Competency Questions", "类层次、属性定义、约束", "OWL 2 / 轻量领域模型", "业务与建模团队", "SHACL / Mapping / KG",
    "形式化程度与推理需求匹配，不必一律 OWL。", "把本体当数据库表设计或直接当图谱实例。", "仅用代码中的类型定义 + 校验测试。"),
  c("L3-OWL", 3, "ontology", ["OWL", "OWL 公理（映射示例）", "形式化公理（可选）"],
    "在需要自动分类与一致性推理时表达形式化语义。", "领域概念模型", "公理集合与推理结果", "OWL 2 / 推理机", "Ontology", "Validation / KG",
    "仅在出现真实推理需求时引入，并评估运维能力。", "为「看起来专业」引入推理机。", "SHACL + 应用层规则。"),
  c("L3-SHACL", 3, "ontology", ["SHACL", "数据形状校验（映射示例）", "约束与校验规则"],
    "校验必填属性、类型、基数与关系方向。", "候选知识对象", "通过/失败报告", "SHACL / JSON Schema / 规则", "Ontology / OWL", "Validation CI",
    "把校验放进 CI 与入库前流水线。", "只在生成答案时才发现数据形状错误。", "数据库约束 + 应用断言。"),
  c("L3-GLOSS", 3, "concept", ["Business Glossary", "业务术语登记（映射示例）", "业务术语表"],
    "登记业务术语、定义、责任人与同义词，是语义层输入。", "业务方定义", "经审批的术语与版本", "术语字典 / 审批流", "业务与数据治理", "Semantic Model",
    "术语与指标定义必须由业务方审批，不能由 LLM 推断。", "把术语表当成自动生成的同义词列表。", "直接使用数据目录中的业务描述（需补充审批）。"),
  c("L3-SEM", 3, "ontology", ["Semantic Model", "语义模型（映射示例）", "业务语义模型"],
    "把业务概念、维度、度量与规则组织成可查询模型。", "Business Glossary / 物理表", "指标定义 + 维度 + 映射", "语义建模 / 指标层", "Business Glossary", "Semantic Query / AI",
    "口径版本化并与物理映射绑定。", "让每个应用自行解释指标公式。", "把口径直接写进 BI 工具（复用性差）。"),

  // Layer 4 — Knowledge Storage
  c("L4-KG", 4, "graph", ["Knowledge Graph", "图数据库（映射示例）", "图存储"],
    "保存实体与关系事实，支持多跳路径与影响分析。", "抽取与融合结果", "规范实体、关系、来源、时态", "属性图 / RDF", "Extraction / ER", "Graph Query / GraphRAG",
    "事实必须带来源、证据、有效时间与版本。", "把无来源的 LLM 生成关系直接写图。", "关系数据库 + 递归查询（受限场景）。"),
  c("L4-VEC", 4, "store", ["Vector Index", "AI Search 向量索引（映射示例）", "向量 / 混合索引"],
    "保存 Chunk embedding 与可过滤 metadata，支持语义检索。", "Chunk + embedding", "TopK 候选 + ACL 过滤", "向量索引 / 倒排索引", "Chunking", "Hybrid Retrieval / RAG",
    "权限过滤发生在检索阶段，而非答案阶段。", "索引项不继承密级，靠提示词遮掩。", "纯关键词索引。"),
  c("L4-DOC", 4, "store", ["Document Store", "Blob Storage（映射示例）", "对象存储"],
    "保存原文与解析产物，支撑引用回放与重解析。", "原始文档 / 解析结果", "文件、版本、哈希", "对象存储", "Connectors", "Document Retrieval / Audit",
    "原文保留期与删除联动策略必须先定义。", "删除原文后向量与图谱仍长期残留。", "数据库大字段存储（不适合大文件）。"),
  c("L4-RDB", 4, "store", ["Relational Database", "Azure SQL / PostgreSQL（映射示例）", "关系型数据库"],
    "保存结构化业务数据、任务状态与审计记录。", "ETL / 业务系统", "表与视图", "RDBMS", "ETL / ELT", "Semantic Query / Business APIs",
    "只经受控视图暴露，避免任意 SQL。", "允许 Agent 直连生产库执行生成式 SQL。", "数据仓库/湖仓中的落地表。"),
  c("L4-TS", 4, "store", ["Time-series Database", "Azure Data Explorer（映射示例）", "时序数据库"],
    "保存随时间变化的状态与遥测，支撑趋势与回放。", "Event Streaming", "时间序列与聚合", "时序库 / 列式存储", "Event Streaming", "Twin State / Simulation",
    "以资产 ID + 时间对齐，不与图谱混存。", "把每个采样点写成图节点。", "对象存储中的分区文件 + 查询引擎。"),
  c("L4-CAT", 4, "store", ["Metadata Catalog", "Purview（映射示例）", "元数据目录"],
    "登记数据资产、责任人、密级、血缘与生命周期状态。", "Connectors / 治理流程", "资产清单与血缘记录", "元数据目录 / 血缘存储", "Ingestion / Governance", "Data Lineage / Access Control",
    "目录是发现入口，不替代指标口径定义。", "把 Data Catalog 当 Semantic Layer 使用。", "自建轻量元数据库。"),

  // Layer 5 — Knowledge Services
  c("L5-ER", 5, "process", ["Entity Resolution", "实体消歧服务（映射示例）", "实体消歧服务"],
    "把多来源提及合并为规范实体并保留候选与裁决依据。", "抽取提及 / 主数据", "Canonical ID + 合并轨迹", "规则 + 向量相似 + 人工复核", "Extraction / MDM", "Knowledge Fusion / KG",
    "合并决策可回滚，LLM 置信度不替代主数据权威。", "自动合并后删除原提及，无法审计。", "仅做确定性 ID 映射。"),
  c("L5-FUSION", 5, "process", ["Knowledge Fusion", "知识融合服务（映射示例）", "知识融合服务"],
    "按来源权威性与时态裁决冲突事实，生成待审知识对象。", "多来源候选事实", "统一事实 + 冲突记录", "规则引擎 / 版本管理", "Entity Resolution", "Approval / KG",
    "冲突必须显式记录，不能简单取最新或取多数。", "静默覆盖旧事实导致审计回放失真。", "仅保留多版本不做裁决（由查询时选择）。"),
  c("L5-GQ", 5, "rag", ["Graph Query", "受控图查询服务（映射示例）", "图查询服务"],
    "提供参数化、限深、带权限剪枝的图查询能力。", "实体锚点 + 跳数 + subject", "路径与子图", "图查询语言 / 查询模板", "Knowledge Graph", "GraphRAG / Knowledge Agent",
    "只读、参数化、限深，禁止拼接任意查询。", "暴露原始图查询接口给 Agent。", "预计算的影响分析视图。"),
  c("L5-HR", 5, "rag", ["Hybrid Retrieval", "AI Search 混合检索（映射示例）", "混合检索服务"],
    "融合关键词与向量召回并重排，输出带引用的候选证据。", "Query + ACL 过滤", "TopK Chunk + 分数", "倒排 / 向量 / 重排", "Vector Index / Document Store", "RAG / GraphRAG / Agentic RAG",
    "检索阶段应用安全过滤并与图侧权限一致。", "先检索后过滤导致越权内容进入上下文。", "单路向量检索。"),
  c("L5-SQ", 5, "orchestrator", ["Semantic Query", "语义查询服务（映射示例）", "语义查询服务"],
    "把业务概念与指标翻译为受权限约束的物理查询。", "业务指标 + 维度 + subject", "带口径版本的结果", "语义模型 / SQL 生成 / 策略", "Semantic Model", "AI / BI / Business APIs",
    "AI 不得绕过语义层直接拼物理字段。", "让 LLM 自由写 SQL 造成口径漂移。", "预定义指标 API。"),
  c("L5-LINEAGE", 5, "security", ["Data Lineage Service", "血缘服务（映射示例）", "血缘服务"],
    "维护 Source → Chunk → Entity → Graph → Index → Answer 的链路。", "每阶段产出与元数据", "血缘记录与影响分析", "血缘图 / 事件日志", "Metadata Catalog", "Governance / Audit",
    "每个节点都带 Source ID、Version、Created/Updated、Evidence、Confidence、Approval、Policy。", "只有入库日志，无法从答案反查原文。", "仅记录来源文档 ID 的最小血缘。"),
  c("L5-GOV", 5, "security", ["Governance Services", "策略与治理服务（映射示例）", "治理策略服务"],
    "统一执行分类、审批、权限、保留与过期策略。", "策略定义与请求上下文", "允许/拒绝 + 审计事件", "RBAC / ABAC / 脱敏 / 审批流", "Identity / Policy", "所有上层服务",
    "权限贯穿向量检索、图遍历、上下文融合与最终回答四阶段。", "只在最终答案做字符串遮掩。", "各服务各自实现权限（一致性风险高）。"),

  // Layer 6 — Intelligence Layer
  c("L6-RAG", 6, "rag", ["RAG", "RAG 编排（映射示例）", "检索增强生成"],
    "单次检索 + 生成基线，是所有升级方案的对照基准。", "Query + TopK 证据", "带引用答案", "编排框架 / LLM", "Hybrid Retrieval", "Enterprise Applications",
    "必须先建立评估集与基线，再考虑复杂方案。", "直接上复杂架构而没有基线。", "纯搜索（不生成，只返回文档）。"),
  c("L6-GRAG", 6, "rag", ["GraphRAG", "GraphRAG 编排（映射示例）", "图增强检索"],
    "用图路径组织上下文并与文档证据融合。", "锚实体 + 图路径 + 文档片段", "结构化上下文 + 引用", "图查询 / 证据融合 / LLM", "Graph Query / Hybrid Retrieval", "Enterprise Applications",
    "图是上下文组织方法，不是 Agent 工作流。", "把 GraphRAG 说成「带 Agent 的 RAG」。", "纯图查询 + 模板化说明。"),
  c("L6-ARAG", 6, "llm", ["Agentic RAG", "Agentic RAG 运行时（映射示例）", "多步检索工作流"],
    "由 Agent 规划、分解、迭代检索、评估证据并验证引用。", "复杂 Query + 工具集", "带引用、不确定性与待确认项的答案", "Agent Runtime / 结构化输出", "Hybrid Retrieval / Graph Query / Semantic Query / APIs", "Knowledge Agent / Applications",
    "必须定义最大轮次、成本预算与停止条件。", "无停止条件导致成本失控与错误传播。", "PAT-01 / PAT-03（简单问题坚持单次检索）。"),
  c("L6-KA", 6, "orchestrator", ["Knowledge Agent", "Knowledge Agent 运行时（映射示例）", "企业知识智能体"],
    "带身份、权限、工具白名单、证据校验与审计的知识服务。", "User + Identity + Knowledge Context", "受控回答 + 审计轨迹", "Agent Runtime / Tool Registry", "L5 全部服务", "Enterprise Copilot",
    "逻辑角色按需拆分，不等于必须部署多个模型或服务。", "绕过权限直接访问 Neo4j / 搜索服务 / 企业 API。", "PAT-05（仅检索，无企业工具治理）。"),
  c("L6-MA", 6, "llm", ["Multi-Agent", "多 Agent 编排（映射示例）", "多智能体协作"],
    "按职责分工并行取证并相互校验。", "Router 分派任务", "共享证据池中的结果", "任务编排 / 分布式追踪", "Knowledge Agent", "Applications",
    "以职责与权限边界决定是否拆分，而非以 Agent 数量为目标。", "把七个逻辑角色硬拆成七个微服务。", "单运行时多工具（PAT-06）。"),
  c("L6-VAL", 6, "security", ["Reasoning and Validation", "答案校验服务（映射示例）", "推理与校验"],
    "检查证据充分性、引用有效性、口径一致性与权限合规。", "候选答案 + 证据集", "通过 / 拒绝 / 转人工", "规则 + 引用校验 + 人工审批", "所有检索与生成组件", "Enterprise Applications",
    "引用校验失败不出答案；敏感操作必须人工审批。", "把「模型自信」当作事实正确。", "仅做格式校验。"),

  // Layer 7 — Enterprise Applications
  c("L7-COPILOT", 7, "app", ["Enterprise Copilot", "企业 Copilot（映射示例）", "企业 AI 助手"],
    "面向员工统一入口，聚合多类知识能力。", "用户请求 + 身份", "带引用与权限边界的答案", "前端 / 会话服务", "L6 智能层", "业务用户",
    "统一入口不等于统一权限，权限仍按 subject 逐层执行。", "用统一服务账号绕过个人权限。", "各业务线独立助手。"),
  c("L7-ITOPS", 7, "app", ["IT Operations Assistant", "IT 运维助手（映射示例）", "IT 运维助手"],
    "支持故障原因、影响范围、历史相似与处置建议的多步分析。", "Incident ID / 服务名", "证据链 + 建议 + 待确认项", "Agentic RAG / Graph Query", "L5 / L6", "值班工程师",
    "建议与执行分离，处置动作需人工确认。", "自动执行重启、回滚等敏感操作。", "静态 Runbook 检索。"),
  c("L7-RISK", 7, "app", ["Risk Analysis", "风险分析应用（映射示例）", "风险分析应用"],
    "基于关联网络与规则引擎给出可解释的风险线索。", "实体与关系查询", "关系路径 + 规则命中说明", "图查询 / 规则引擎", "Knowledge Graph", "风控人员",
    "规则与模型结论分离，保留可审计的命中条件。", "用 LLM 自由判断替代合规规则。", "纯报表分析。"),
  c("L7-SUPPLY", 7, "app", ["Supply Chain Intelligence", "供应链洞察（映射示例）", "供应链分析应用"],
    "分析中断事件沿供应关系的影响传播。", "节点与中断事件", "受影响路径与候选替代方案", "图遍历 / 仿真", "Knowledge Graph", "供应链计划员",
    "明确区分「图上的可能路径」与「已确认的业务影响」。", "把图上可达直接等同于实际断供。", "人工表格推演。"),
  c("L7-PDM", 7, "app", ["Predictive Maintenance", "预测性维护应用（映射示例）", "预测性维护应用"],
    "结合状态趋势、历史维修与资产关系给出维护建议。", "Twin State + 维护记录", "建议工单 + 依据", "时序分析 / 规则 / 仿真", "Digital Twin / KG", "维护团队（人工审批）",
    "输出建议而非控制指令；所有数据为模拟演示。", "Agent 直接下发设备控制命令。", "定期保养计划。"),
  c("L7-TWINAPP", 7, "app", ["Digital Twin Applications", "孪生应用（映射示例）", "数字孪生应用"],
    "展示资产状态、依赖、告警与故障传播路径。", "Twin State / Event Stream", "状态视图 + 仿真结果", "前端 / 可视化", "Digital Twin / KG", "运维与管理人员",
    "有现实对象、状态数据与持续同步机制才称孪生。", "把普通监控大屏称为数字孪生。", "仅时序看板。"),

  // Layer 8 — Cross-cutting Governance
  c("L8-ID", 8, "security", ["Identity", "Microsoft Entra ID（映射示例）", "企业身份服务"],
    "提供统一身份、组与令牌，是权限判定前提。", "企业目录", "subject / 组 / 声明", "IdP / SSO", "企业 IdP", "所有层",
    "下游使用用户身份，不使用共享高权限账号。", "服务账号越权代查后返回给无权用户。", "应用内自建账号体系（不推荐）。"),
  c("L8-AC", 8, "security", ["Access Control", "RBAC / ABAC 策略（映射示例）", "访问控制"],
    "按角色与属性在检索、遍历、融合、生成四阶段一致鉴权。", "subject + 资源密级 + 用途", "允许/拒绝/脱敏", "RBAC / ABAC / ACL", "Identity", "所有层",
    "策略执行点覆盖向量索引、图遍历与上下文融合。", "只在提示词里写「不要泄露敏感信息」。", "静态白名单（无法表达动态属性）。"),
  c("L8-AUDIT", 8, "security", ["Audit", "审计日志（映射示例）", "审计与追踪"],
    "记录工具调用、检索条件、证据、回答与审批。", "全链路事件", "不可篡改的审计记录", "日志平台 / 轨迹 ID", "所有层", "合规与调查",
    "轨迹可回放，包含模型与工具版本信息。", "只记录最终答案，无法复盘。", "仅应用访问日志。"),
  c("L8-QUALITY", 8, "security", ["Quality", "质量监控（映射示例）", "质量管理"],
    "监控来源覆盖、完整度、有效率、重复率、血缘覆盖与过期率。", "校验结果 / 血缘 / 反馈", "质量评分与告警", "规则引擎 / 指标", "Ingestion / Validation", "治理闭环",
    "区分来源权威性与 LLM 抽取置信度。", "把高置信度抽取误认为来源可信。", "仅人工抽检。"),
  c("L8-MON", 8, "security", ["Monitoring", "Azure Monitor（映射示例）", "可观测平台"],
    "监控延迟、错误率、工具失败、检索质量与漂移。", "指标 / 日志 / 链路", "告警与看板", "Metrics / Logs / Traces", "所有层", "SRE / 治理",
    "对 Agent 轨迹设置轮次与成本异常告警。", "只看最终成功率，忽略中间步骤退化。", "仅基础设施监控。"),
  c("L8-COST", 8, "security", ["Cost", "成本治理（映射示例）", "成本管理"],
    "跟踪索引、存储、模型调用、工具调用与重抽取成本。", "用量与账单", "预算、配额与归因", "成本分析 / 配额", "所有层", "架构决策",
    "把延迟与成本作为 Agent 停止条件的一部分。", "无上限的迭代检索循环。", "固定预算不分摊。"),
  c("L8-SEC", 8, "security", ["Security", "安全控制（映射示例）", "安全体系"],
    "覆盖注入防护、密钥管理、网络隔离、脱敏与工具白名单。", "威胁模型 / 策略", "安全控制与拦截记录", "WAF / 密钥库 / 策略引擎", "Identity / Access Control", "所有层",
    "生产系统不能只依赖提示词作为安全边界。", "把提示词约束当成权限控制。", "仅边界防火墙。"),
  c("L8-COMP", 8, "security", ["Compliance", "合规管理（映射示例）", "合规管理"],
    "落实保留策略、删除联动、数据主体请求与监管证据。", "法规与内部政策", "策略、报告与删除证明", "保留策略 / 审批流", "Governance / Audit", "所有层",
    "文档删除后同步清理向量、图谱派生事实与缓存答案。", "只删原文，派生知识长期残留。", "仅定期人工清理。"),
];

export const archComponentById: Record<string, ArchComponent> = Object.fromEntries(
  archComponents.map((comp) => [comp.id, comp]),
);

archLayers.forEach((layer) => {
  layer.components = archComponents.filter((comp) => comp.layer === layer.no).map((comp) => comp.id);
});

export const archViews: { key: ArchView; label: string; description: string }[] = [
  { key: "logical", label: "A · 技术逻辑架构", description: "按能力与技术职责命名组件，不绑定厂商；用于平台团队讨论分层与接口契约。" },
  { key: "azure", label: "B · Azure 参考架构", description: "把同一组能力映射到一组 Azure 服务名称的教学示例，仅表示一种可行映射，不是唯一标准答案；产品能力具版本敏感性。" },
  { key: "neutral", label: "C · 技术中立架构", description: "完全去掉产品与实现名称，只描述「需要什么能力」，适合跨云与混合环境对齐。" },
];

export function archLabel(comp: ArchComponent, view: ArchView): string {
  return comp.labels[view === "logical" ? 0 : view === "azure" ? 1 : 2];
}

/** 组件之间的上下游连线（按能力流，不按视图变化）。 */
export const archEdges: { from: string; to: string; label: string }[] = [
  { from: "L1-PDF", to: "L2-CONN", label: "接入" }, { from: "L1-WORD", to: "L2-CONN", label: "接入" },
  { from: "L1-EXCEL", to: "L2-CONN", label: "接入" }, { from: "L1-SPO", to: "L2-CONN", label: "接入 + ACL" },
  { from: "L1-CONF", to: "L2-CONN", label: "接入 + 版本" }, { from: "L1-SQL", to: "L2-ETL", label: "抽取" },
  { from: "L1-ERP", to: "L2-ETL", label: "抽取" }, { from: "L1-CRM", to: "L2-ETL", label: "抽取" },
  { from: "L1-ITSM", to: "L2-ETL", label: "抽取" }, { from: "L1-IOT", to: "L2-EVENT", label: "事件" },
  { from: "L2-CONN", to: "L2-PARSE", label: "解析" }, { from: "L2-PARSE", to: "L2-CHUNK", label: "片段" },
  { from: "L2-CHUNK", to: "L4-VEC", label: "索引" }, { from: "L2-CONN", to: "L4-DOC", label: "原文留存" },
  { from: "L2-ETL", to: "L4-RDB", label: "落地" }, { from: "L2-EVENT", to: "L4-TS", label: "时序" },
  { from: "L2-NORM", to: "L3-SEM", label: "规范化数据" }, { from: "L3-ONTO", to: "L3-SHACL", label: "约束" },
  { from: "L3-OWL", to: "L3-SHACL", label: "公理" }, { from: "L3-GLOSS", to: "L3-SEM", label: "术语" },
  { from: "L3-SEM", to: "L5-SQ", label: "指标定义" }, { from: "L3-SHACL", to: "L5-FUSION", label: "校验" },
  { from: "L2-CHUNK", to: "L5-ER", label: "抽取提及" }, { from: "L5-ER", to: "L5-FUSION", label: "规范实体" },
  { from: "L5-FUSION", to: "L4-KG", label: "写入事实" }, { from: "L4-KG", to: "L5-GQ", label: "查询" },
  { from: "L4-VEC", to: "L5-HR", label: "召回" }, { from: "L4-DOC", to: "L5-HR", label: "原文引用" },
  { from: "L4-RDB", to: "L5-SQ", label: "物理查询" }, { from: "L4-CAT", to: "L5-LINEAGE", label: "元数据" },
  { from: "L5-LINEAGE", to: "L5-GOV", label: "血缘证据" }, { from: "L5-GOV", to: "L5-HR", label: "策略" },
  { from: "L5-GOV", to: "L5-GQ", label: "策略" }, { from: "L5-HR", to: "L6-RAG", label: "TopK" },
  { from: "L5-GQ", to: "L6-GRAG", label: "图路径" }, { from: "L5-HR", to: "L6-GRAG", label: "文档证据" },
  { from: "L6-RAG", to: "L6-VAL", label: "候选答案" }, { from: "L6-GRAG", to: "L6-VAL", label: "候选答案" },
  { from: "L5-SQ", to: "L6-ARAG", label: "指标工具" }, { from: "L5-GQ", to: "L6-ARAG", label: "图工具" },
  { from: "L5-HR", to: "L6-ARAG", label: "文档工具" }, { from: "L6-ARAG", to: "L6-VAL", label: "答案 + 证据" },
  { from: "L6-VAL", to: "L6-KA", label: "校验通过" }, { from: "L6-KA", to: "L6-MA", label: "可选拆分" },
  { from: "L6-KA", to: "L7-COPILOT", label: "知识能力" }, { from: "L6-ARAG", to: "L7-ITOPS", label: "多步分析" },
  { from: "L5-GQ", to: "L7-RISK", label: "关联网络" }, { from: "L5-GQ", to: "L7-SUPPLY", label: "影响路径" },
  { from: "L4-TS", to: "L7-PDM", label: "趋势" }, { from: "L4-TS", to: "L7-TWINAPP", label: "状态" },
  { from: "L8-ID", to: "L8-AC", label: "subject" }, { from: "L8-AC", to: "L5-GOV", label: "策略执行" },
  { from: "L8-AUDIT", to: "L6-KA", label: "轨迹记录" }, { from: "L8-QUALITY", to: "L5-FUSION", label: "质量门禁" },
  { from: "L8-MON", to: "L6-ARAG", label: "轮次 / 成本告警" }, { from: "L8-COST", to: "L6-ARAG", label: "预算上限" },
  { from: "L8-SEC", to: "L5-GOV", label: "白名单" }, { from: "L8-COMP", to: "L5-GOV", label: "保留 / 删除" },
];
