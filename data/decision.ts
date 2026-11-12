export interface DecisionOption {
  label: string;
  value: string;
  points: number;
  reason?: string;
}

export interface DecisionQuestion {
  id: string;
  title: string;
  hint: string;
  options: DecisionOption[];
}

/** 完全透明的规则表：每个选项对应固定分值，最终结论由分值区间与两条覆盖规则推导。 */
export const decisionQuestions: DecisionQuestion[] = [
  {
    id: "dataShape", title: "1. 文档占比高还是结构化数据占比高？", hint: "决定是否需要以文档索引为主路径。",
    options: [
      { label: "以非结构化文档为主", value: "docs", points: 0, reason: "文档语义检索为主，降低图结构需求" },
      { label: "文档与结构化数据各半", value: "mixed", points: 1, reason: "需要同时处理文本证据与结构化事实" },
      { label: "以结构化/资产数据为主", value: "structured", points: 2, reason: "结构化事实更适合图查询或确定性查询" },
    ],
  },
  {
    id: "relations", title: "2. 实体之间的关系是否复杂？", hint: "例如多对多依赖、跨系统归属关系。",
    options: [
      { label: "关系简单，基本按文档组织", value: "simple", points: 0, reason: "关系简单，无需图遍历" },
      { label: "有一定关系，但单跳为主", value: "medium", points: 1, reason: "单跳关系可用 Metadata / 轻量图补充" },
      { label: "复杂多对多、强依赖网络", value: "complex", points: 2, reason: "复杂关系网络是图结构的核心适用场景" },
    ],
  },
  {
    id: "crossSystem", title: "3. 是否需要跨多个系统追踪依赖？", hint: "例如 CMDB、部署、调用链、工单跨系统关联。",
    options: [
      { label: "不需要", value: "no", points: 0, reason: "单系统内检索不需要跨系统图对齐" },
      { label: "需要", value: "yes", points: 2, reason: "跨系统依赖需要统一的实体 ID 与关系白名单" },
    ],
  },
  {
    id: "multiHop", title: "4. 是否需要多跳关系查询？", hint: "例如“故障 → 服务 → 系统 → 业务线”。",
    options: [
      { label: "不需要", value: "no", points: 0, reason: "无多跳要求，传统检索足够" },
      { label: "偶尔需要（1~2 跳）", value: "sometimes", points: 1, reason: "有限跳数可用轻量图检索" },
      { label: "核心需求（2 跳以上）", value: "core", points: 3, reason: "多跳路径是图检索的关键价值点，权重最高" },
    ],
  },
  {
    id: "rules", title: "5. 是否需要业务规则或语义约束验证？", hint: "例如类型白名单、基数、枚举、OWL/SHACL 公理。",
    options: [
      { label: "不需要", value: "no", points: 0, reason: "可用应用层轻量校验" },
      { label: "需要部分数据校验", value: "some", points: 1, reason: "建议 SHACL / Schema 校验" },
      { label: "需要强语义约束与跨系统对齐", value: "strict", points: 2, reason: "强语义治理需要显式 Ontology" },
    ],
  },
  {
    id: "nlq", title: "6. 是否需要自然语言问答？", hint: "若不需要，生成式 RAG 的直接价值有限。",
    options: [
      { label: "不需要（报表/API 即可）", value: "no", points: 0, reason: "优先确定性查询与工具编排" },
      { label: "需要", value: "yes", points: 1, reason: "需要检索增强生成与证据引用" },
    ],
  },
  {
    id: "evidence", title: "7. 是否需要精确证据引用？", hint: "每条结论可点回原文或图事实。",
    options: [
      { label: "一般即可", value: "loose", points: 0, reason: "引用要求较宽松" },
      { label: "必须逐条可追溯", value: "exact", points: 1, reason: "需要 evidence_id / chunk_id / Citation Accuracy" },
    ],
  },
  {
    id: "acl", title: "8. 是否需要严格的权限隔离？", hint: "涉及多部门、多密级文档或图谱关联泄漏风险。",
    options: [
      { label: "无特殊要求", value: "no", points: 0, reason: "权限模型较简单" },
      { label: "需要 RBAC/ABAC 与权限继承", value: "strict", points: 1, reason: "四层 ACL 过滤会显著增加实现复杂度" },
    ],
  },
  {
    id: "volume", title: "9. 数据规模与更新频率如何？", hint: "影响增量更新、索引重建与成本策略。",
    options: [
      { label: "小规模、低频更新", value: "small", points: 0, reason: "可全量重建" },
      { label: "中等规模、定期更新", value: "medium", points: 1, reason: "需要批次化与变更检测" },
      { label: "大规模、高频更新", value: "large", points: 2, reason: "必须设计增量更新、时态知识和对账" },
    ],
  },
  {
    id: "team", title: "10. 团队是否有图数据库维护能力？", hint: "能力不足时，高复杂度方案的落地风险会显著上升。",
    options: [
      { label: "暂无图数据库经验", value: "no", points: 0, reason: "缺少图运维能力时建议降级方案复杂度" },
      { label: "有（或可获得平台支持）", value: "yes", points: 2, reason: "具备图建模、Cypher 与运维能力" },
    ],
  },
  {
    id: "crossDoc", title: "11. 是否需要跨文档关联同一实体？", hint: "例如同一服务在 Runbook、工单、架构文档中的不同表述。",
    options: [
      { label: "不需要", value: "no", points: 0, reason: "无需 Entity Resolution 与知识融合" },
      { label: "需要", value: "yes", points: 1, reason: "需要实体消歧、别名表与多来源融合" },
    ],
  },
];

export interface Recommendation {
  id: "A" | "B" | "C" | "D" | "E";
  title: string;
  subtitle: string;
  complexity: number;
  cost: string;
  components: string[];
  notRecommended: string[];
  risks: string[];
  baseReason: string;
  flow: string[];
}

export const recommendations: Record<Recommendation["id"], Recommendation> = {
  A: {
    id: "A", title: "传统 RAG", subtitle: "文档分块 + 向量/关键词检索 + LLM 生成", complexity: 1, cost: "低",
    components: ["文档解析与 Chunk 切分", "Azure AI Search（Vector / Keyword）", "Embedding 部署", "LLM 生成 + Chunk 引用", "基础 Metadata Filter"],
    notRecommended: ["完整 OWL 本体", "Neo4j 图数据库", "Entity Resolution 流水线", "Agent 多轮规划"],
    risks: ["无法回答多跳影响分析", "文档间实体别名不一致导致漏检", "答案缺少结构化路径解释"],
    baseReason: "关系简单、无多跳需求，图的构建与维护成本无法带来对应收益。",
    flow: ["文档", "Chunk 切分", "向量/关键词索引", "Top-K 检索", "LLM + 文档引用"],
  },
  B: {
    id: "B", title: "Traditional RAG + Metadata", subtitle: "在传统 RAG 上增加结构化过滤与轻量实体标签", complexity: 2, cost: "低到中",
    components: ["文档解析与 Chunk 切分", "元数据字段（system / version / 部门 / 时间 / ACL）", "Hybrid Search + Filter", "entity_ids 标记", "LLM 生成 + 引用"],
    notRecommended: ["完整 OWL 推理", "复杂多跳图遍历", "社区摘要", "自建图集群（若无运维能力）"],
    risks: ["Metadata 质量不足", "跨文档实体无法可靠对齐", "复杂关系问题仍回答不了"],
    baseReason: "以文档检索为主，但存在过滤、版本与实体标签需求；用元数据即可覆盖大部分场景。",
    flow: ["文档", "Chunk + Metadata", "Hybrid Search + Filter", "RRF 融合", "LLM + 引用"],
  },
  C: {
    id: "C", title: "Knowledge Graph + RAG", subtitle: "图事实与文档证据互补的混合检索", complexity: 3, cost: "中",
    components: ["轻量领域模型 / 关系白名单", "实体关系抽取 + Entity Resolution", "Neo4j 或其他图存储", "Azure AI Search 文档索引", "Graph Retrieval + Hybrid Retrieval + Context Fusion"],
    notRecommended: ["完整 OWL 公理体系（除非确需推理）", "无限制多跳遍历", "让 LLM 直接生成 Cypher"],
    risks: ["图质量决定答案上限", "图与索引不同步", "多跳噪声与越权路径", "缺少基线难以证明增量"],
    baseReason: "存在跨系统依赖与多跳查询，但仍以文档证据为主要引用来源，因此图与文档索引组合更合适。",
    flow: ["文档/资产数据", "抽取 + 消歧 + 校验", "Neo4j 图 + 文档索引", "图检索 + 混合检索", "Context Fusion", "LLM + 图路径/文档引用"],
  },
  D: {
    id: "D", title: "Ontology + Knowledge Graph + GraphRAG", subtitle: "语义治理完备的全栈组合", complexity: 5, cost: "高",
    components: ["OWL / SHACL / Domain Model", "Ontology Mapping 与 Validation", "Entity Resolution + Knowledge Fusion", "Neo4j + Azure AI Search", "GraphRAG Orchestrator + Evidence Validation", "RBAC/ABAC 与审计"],
    notRecommended: ["无治理的小规模 PoC", "仅靠名称 MERGE 的写入脚本", "未限制跳数的自由图遍历", "单一 Prompt 打天下的评估方式"],
    risks: ["本体演进与版本迁移成本", "跨团队数据治理工作量", "高延迟与高运行成本", "权限模型复杂"],
    baseReason: "强语义约束、跨系统依赖、多跳查询与严格证据/权限要求同时存在，需要完整语义层与全链路治理。",
    flow: ["企业数据源", "OWL/SHACL 语义层", "抽取 + ER + Fusion + Validation", "Neo4j 图 + AI Search", "GraphRAG 编排 + 证据校验", "带引用答案"],
  },
  E: {
    id: "E", title: "结构化查询 + Agent", subtitle: "确定性查询为主，Agent 负责工具编排", complexity: 3, cost: "中",
    components: ["结构化数据模型 / API", "参数化 Cypher 或 SQL 查询模板", "工具白名单与权限上下文", "Agent 规划（可选多步调用）", "结果表 / 看板 / 结构化输出"],
    notRecommended: ["为不需要的问答引入生成式 RAG", "无限制工具调用", "把生成文本当作审计结论"],
    risks: ["Agent 迭代次数不可控导致延迟与成本", "工具权限过大", "结果缺乏自然语言解释（如业务方确实需要则需另加摘要层）"],
    baseReason: "不需要自然语言问答时，确定性查询与工具化编排通常比生成式 RAG 更可控、可审计。",
    flow: ["结构化数据", "查询模板 / API", "Agent 工具编排", "参数化查询（只读）", "确定性结果 + 审计"],
  },
};

export const scoreBands = [
  { min: 0, max: 4, id: "A" as const, label: "0 ~ 4 分" },
  { min: 5, max: 8, id: "B" as const, label: "5 ~ 8 分" },
  { min: 9, max: 12, id: "C" as const, label: "9 ~ 12 分" },
  { min: 13, max: 99, id: "D" as const, label: "13 分以上" },
];

export const overrideRules = [
  { id: "r1", condition: "不需要自然语言问答，且存在结构化数据或多跳需求", effect: "覆盖为方案 E：结构化查询 + Agent", reason: "生成式 RAG 在没有问答需求时缺少直接价值。" },
  { id: "r2", condition: "需要 2 跳以上路径（multiHop = core）", effect: "结果不低于方案 C", reason: "多跳路径是图检索的核心价值点。" },
  { id: "r3", condition: "得分进入 D，但团队无图数据库维护能力", effect: "降级为方案 C，并提示能力风险", reason: "避免推荐超出团队运维能力的架构。" },
  { id: "r4", condition: "需要精确证据引用", effect: "强制加入 Citation / Evidence Validation 组件", reason: "引用是输出层校验，不是可选的 UI 装饰。" },
  { id: "r5", condition: "需要严格权限隔离", effect: "强制四层 ACL：向量检索 / 图检索 / 上下文融合 / 答案生成", reason: "图谱关联可能泄漏无权访问的知识。" },
  { id: "r6", condition: "大规模高频更新", effect: "强制增量更新、时态知识与索引/图谱对账", reason: "全量重建在高更新频率下不可持续。" },
];
