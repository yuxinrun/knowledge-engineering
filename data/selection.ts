export interface SolutionOption {
  id: string;
  label: string;
  short: string;
  color: string;
}

export const solutionOptions: SolutionOption[] = [
  { id: "traditional", label: "Traditional RAG", short: "传统 RAG", color: "#3B82F6" },
  { id: "graphrag", label: "GraphRAG", short: "GraphRAG", color: "#6366F1" },
  { id: "agentic", label: "Agentic RAG", short: "Agentic RAG", color: "#A855F7" },
  { id: "kgRag", label: "Knowledge Graph + RAG", short: "KG + RAG", color: "#06B6D4" },
  { id: "pureKg", label: "纯知识图谱查询", short: "纯图查询", color: "#10B981" },
  { id: "full", label: "Ontology + KG + GraphRAG", short: "全栈组合", color: "#F59E0B" },
];

export interface ComparisonRow {
  dimension: string;
  values: Record<string, string>;
}

export const comparisonRows: ComparisonRow[] = [
  {
    dimension: "数据结构",
    values: {
      traditional: "文档 Chunk + 向量，元数据可选", graphrag: "文档 Chunk + 向量 + 实体图/社区摘要",
      agentic: "多路异构数据源 + 工具描述", kgRag: "图结构事实 + 文档 Chunk", pureKg: "仅图结构（Node/Edge/Property）",
      full: "OWL/SHACL 语义层 + 图数据 + 文档索引",
    },
  },
  {
    dimension: "检索机制",
    values: {
      traditional: "关键词 / 向量 / Hybrid", graphrag: "图检索 + 向量 + 关键词 + 融合",
      agentic: "Agent 规划后动态调用多检索器", kgRag: "Cypher 图查询 + 文档检索", pureKg: "Cypher / 图算法 / 遍历",
      full: "约束驱动的图检索 + 混合检索 + 证据融合",
    },
  },
  {
    dimension: "多跳关系能力",
    values: {
      traditional: "弱：依赖文本共现", graphrag: "强：显式路径与社区结构", agentic: "中到强：取决于工具与迭代",
      kgRag: "强：结构化多跳", pureKg: "最强：确定性路径", full: "强：语义约束下的多跳",
    },
  },
  {
    dimension: "复杂问题能力",
    values: {
      traditional: "适合单文档/少文档语义问题", graphrag: "适合影响分析、全局主题型问题", agentic: "适合多步骤、跨工具任务",
      kgRag: "适合关系+证据混合问题", pureKg: "适合精确拓扑与路径", full: "适合跨系统、强治理的复杂问题",
    },
  },
  {
    dimension: "可解释性",
    values: {
      traditional: "中：文档引用", graphrag: "高：图路径 + 文档证据", agentic: "中：需完整工具调用轨迹",
      kgRag: "高：路径与来源均可追溯", pureKg: "最高：结果完全确定", full: "最高：语义、路径、证据、版本齐全",
    },
  },
  {
    dimension: "数据准备成本",
    values: {
      traditional: "低：解析 + 切分 + 索引", graphrag: "高：抽取、消歧、融合、校验", agentic: "中到高：工具与权限治理",
      kgRag: "高：建图 + 文档索引", pureKg: "中到高：建图与数据治理", full: "最高：本体 + 图谱 + 检索 + 治理",
    },
  },
  {
    dimension: "运行成本",
    values: {
      traditional: "低", graphrag: "中到高（多路检索 + 更长上下文）", agentic: "高（多轮 LLM 与工具调用）",
      kgRag: "中", pureKg: "低（无 LLM 生成）", full: "中到高",
    },
  },
  {
    dimension: "延迟",
    values: {
      traditional: "低", graphrag: "中到高", agentic: "最高（迭代次数不确定）", kgRag: "中", pureKg: "最低", full: "中到高",
    },
  },
  {
    dimension: "维护复杂度",
    values: {
      traditional: "低", graphrag: "高（图质量、索引一致性）", agentic: "高（工具契约、可复现性）",
      kgRag: "高", pureKg: "中", full: "最高（本体演进 + 全链路治理）",
    },
  },
  {
    dimension: "适合场景",
    values: {
      traditional: "制度问答、产品手册、单文档检索", graphrag: "影响分析、跨实体推理、全局摘要",
      agentic: "需要计划/多工具/多步核验的任务", kgRag: "关系明确 + 需要原文证据", pureKg: "依赖查询、拓扑分析、审计报表",
      full: "跨系统语义不一致、强合规与审计要求",
    },
  },
  {
    dimension: "不适合场景",
    values: {
      traditional: "多跳影响分析、精确拓扑", graphrag: "纯文档语义问答（性价比低）", agentic: "低延迟、强确定性、严格预算",
      kgRag: "几乎没有结构化关系的文档库", pureKg: "需要自然语言解释与文档原文", full: "小型 PoC、数据治理尚未就绪",
    },
  },
];

export const decisionPrinciples = [
  { title: "不是所有 RAG 都需要 GraphRAG", body: "文档语义检索占主导、实体关系简单时，传统 RAG（配合 Metadata Filter）通常更经济、延迟更低。" },
  { title: "不是所有知识图谱都需要完整 OWL 本体", body: "属性图 + 数据库约束 + 应用层校验，对很多工程场景已足够；OWL 的价值在跨系统语义一致性与推理。" },
  { title: "不是所有企业都需要 Neo4j", body: "图能力也可由 RDF Store、关系数据库递归查询或专用图服务承担，选型取决于团队能力与运维成本。" },
  { title: "关系复杂度决定图方案价值", body: "多跳路径、影响分析、跨系统依赖追踪是图的强项；单纯找一段文档原文不是。" },
  { title: "先建基线再谈增量", body: "先用传统 RAG 建立可复现的评估基线，再判断 GraphRAG 是否对目标问题类型真正带来提升。" },
  { title: "治理能力是前置条件", body: "没有权限继承、实体 ID 体系、版本与审计机制时，先补数据治理，再扩大图检索范围。" },
];
