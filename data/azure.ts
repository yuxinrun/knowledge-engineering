import type { DiagramEdge, DiagramNode, LegendItem } from "@/data/diagram-types";

export interface AzureComponentDetail {
  id: string;
  name: string;
  layer: string;
  responsibility: string;
  input: string;
  output: string;
  tech: string;
  failure: string;
  caution: string;
}

export const azureComponents: AzureComponentDetail[] = [
  { id: "blob", name: "Azure Blob Storage", layer: "数据接入", responsibility: "保存原始文档、解析中间产物与版本快照，作为可回放的数据底座。", input: "CMDB 导出、PDF/Word/Excel、Confluence/SharePoint 导出、工单", output: "原始文件 URI、内容哈希、密级与权限元数据", tech: "Blob Storage + 生命周期管理 + 私有终结点", failure: "文件被覆盖导致版本丢失；权限元数据与正文不同步", caution: "按内容哈希与 document_id 幂等登记；禁止下游直接修改原始对象。" },
  { id: "docintel", name: "Azure Document Intelligence", layer: "数据接入", responsibility: "复杂版面解析：OCR、表格结构还原、标题层级与页码定位。", input: "原始文件 URI", output: "结构化文本、表格、页码坐标与 parse_quality", tech: "Document Intelligence（预定义/自定义模型，按文档类型选择）", failure: "扫描件无文本层、跨页表格断裂、合并单元格语义丢失", caution: "保留原文件与页码坐标；parse_quality 低于阈值时降级或转人工。" },
  { id: "python", name: "Python Processing Pipeline", layer: "数据接入", responsibility: "Chunk 切分、任务编排、重试、幂等与增量检测。", input: "结构化文本与文档元数据", output: "Chunk（chunk_id / page_number / ACL 标签）与任务状态", tech: "Python / FastAPI + 任务队列（队列产品按企业标准选择）", failure: "切分过碎使关系跨 Chunk 丢失；重复写入；任务失败无回放", caution: "Chunk 切分器与切分版本纳入版本控制；所有写入以内容哈希做幂等键。" },
  { id: "extract", name: "Azure OpenAI（抽取 / Embedding）", layer: "知识构建", responsibility: "结构化实体/关系抽取，以及 Chunk 的 Embedding 生成。", input: "Chunk + Prompt + Pydantic/Structured Outputs Schema", output: "候选 Entity / Relationship JSON、content_vector", tech: "Azure OpenAI Structured Outputs + text-embedding 部署", failure: "模型补全未出现的事实、输出拒绝、限流与 token 成本失控", caution: "Embedding 模型版本与向量维度必须固定；更换模型需重建索引；抽取结果一律视为候选事实。" },
  { id: "ontology", name: "Ontology / SHACL", layer: "知识构建", responsibility: "提供类型、关系白名单、基数与枚举约束，统一语义。", input: "OWL / SHACL / Domain Model", output: "类型映射规则、校验形状与 ValidationReport", tech: "OWL 2、SHACL、pyshacl / Protégé（建模期）", failure: "把 OWL Domain/Range 当成强制校验；本体版本与抽取 Schema 漂移", caution: "Neo4j 不会自动执行 OWL/SHACL；需显式设计 RDF → 属性图映射与独立验证步骤。" },
  { id: "validation", name: "Validation / ER / Fusion", layer: "知识构建", responsibility: "实体消歧、多来源融合、结构与权限校验、人工审核队列。", input: "候选事实 + 权威 ID 表 + 别名表 + 来源权威性", output: "可写入事实（带 Provenance、confidence、有效期、ACL）", tech: "规则引擎 + 打分函数 + 审核队列 + pyshacl", failure: "自动误合并不可逆；置信度被误当来源权威性；旧数据覆盖新事实", caution: "保留原始实体与匹配日志，支持回滚；冲突无法自动判定必须转人工。" },
  { id: "neo4j", name: "Neo4j（图数据库）", layer: "知识存储", responsibility: "存储实体、关系与图事实，提供多跳路径与影响分析查询。", input: "校验通过的事实与关系", output: "图事实、路径、实体邻接子图", tech: "Neo4j 5.x + Cypher + 唯一约束/索引", failure: "MERGE 只靠名称、关系方向不统一、无约束导致重复节点", caution: "检索账号只读、参数化查询、限制路径深度；不要让 LLM 无限制生成并执行 Cypher。" },
  { id: "search", name: "Azure AI Search（文档索引）", layer: "知识存储", responsibility: "保存 Chunk 原文、向量与元数据，提供关键词/向量/混合检索与语义重排。", input: "Chunk + content_vector + entity_ids + security_groups", output: "带 chunk_id / page_number / source 的文档证据", tech: "Azure AI Search：Hybrid Search、RRF、Semantic Ranker、Metadata Filter", failure: "向量维度与模型不匹配；ACL filter 未下推；索引与图谱不同步", caution: "Index Schema 与 API 版本敏感；security_groups 必须 filterable；建立索引/图谱对账任务。" },
  { id: "entra", name: "Entra ID / RBAC·ABAC", layer: "横切治理", responsibility: "身份认证、角色/属性授权、文档权限继承与权限标签下发。", input: "企业身份与组、文档密级、资源属性", output: "allowed_groups / principal / 审计上下文", tech: "Microsoft Entra ID + OIDC + RBAC/ABAC 策略", failure: "只在前端隐藏敏感信息；权限继承链断裂；组膨胀", caution: "安全过滤必须覆盖向量检索、图谱检索、上下文融合与最终答案生成四层。" },
  { id: "orchestrator", name: "GraphRAG Orchestrator", layer: "检索与编排", responsibility: "意图识别、Entity Linking、三路检索、RRF 融合、Context Fusion、证据校验。", input: "用户问题 + principal + 图/索引检索结果", output: "带 evidence_id 的上下文与生成请求", tech: "Python / FastAPI + 可观测性 + 查询预算与超时控制", failure: "多跳噪声、token 预算失控、上下文重复、越权证据混入", caution: "图事实与文档证据都要绑定 evidence_id；融合后必须做第二次 ACL 与时效性校验。" },
  { id: "generate", name: "Azure OpenAI（答案生成）", layer: "检索与编排", responsibility: "在证据约束下生成答案并输出 citation_ids，证据不足时拒答。", input: "融合上下文 + 生成约束 Prompt", output: "答案草稿 + citation_ids + abstained", tech: "Azure OpenAI Chat Completions / Structured Outputs", failure: "引用不存在的证据、幻觉、把冲突事实合并成确定结论", caution: "输出后校验 citation_ids 是否属于本轮允许的证据集；拒答是正常结果而非失败。" },
  { id: "webui", name: "Web UI / Enterprise Copilot", layer: "应用层", responsibility: "呈现答案、引用、图路径与权限提示，收集反馈供评估闭环。", input: "带引用答案与证据列表", output: "用户可追溯的回答、反馈信号与审计日志", tech: "React / Next.js 前端 + 企业门户集成", failure: "引用链接失效、只展示答案不展示来源、反馈无法回流", caution: "展示证据来源与更新时间；对不确定的结论提供反馈入口与人工升级路径。" },
];

const positionMap: Record<string, { x: number; y: number }> = {
  blob: { x: 0, y: 0 }, docintel: { x: 255, y: 0 }, python: { x: 510, y: 0 }, extract: { x: 765, y: 0 },
  ontology: { x: 0, y: 185 }, validation: { x: 255, y: 185 }, neo4j: { x: 510, y: 185 }, search: { x: 765, y: 185 },
  entra: { x: 0, y: 370 }, orchestrator: { x: 255, y: 370 }, generate: { x: 510, y: 370 }, webui: { x: 765, y: 370 },
};

const kindMap: Record<string, string> = {
  blob: "source", docintel: "source", python: "process", extract: "llm", ontology: "ontology", validation: "orchestrator",
  neo4j: "graph", search: "store", entra: "security", orchestrator: "rag", generate: "llm", webui: "app",
};

export const azureArchitecture: { nodes: DiagramNode[]; edges: DiagramEdge[]; legend: LegendItem[] } = {
  nodes: azureComponents.map((c) => ({
    id: c.id, label: c.name, sub: c.layer, kind: kindMap[c.id], position: positionMap[c.id],
    description: c.responsibility,
    badge: c.layer,
    details: [
      { label: "组件职责", value: c.responsibility }, { label: "输入", value: c.input }, { label: "输出", value: c.output },
      { label: "技术选型", value: c.tech }, { label: "常见故障", value: c.failure }, { label: "实施注意事项", value: c.caution },
    ],
  })),
  edges: [
    { id: "a1", source: "blob", target: "docintel", label: "原始文档", kind: "source", animated: true, description: "原始文件 URI + 内容哈希 + 权限元数据" },
    { id: "a2", source: "docintel", target: "python", label: "结构化文本", kind: "source", animated: true, description: "文本、表格、页码坐标与 parse_quality" },
    { id: "a3", source: "python", target: "extract", label: "Chunk + Prompt", kind: "process", animated: true, description: "带 chunk_id 与 ACL 标签的切分文本" },
    { id: "a4", source: "extract", target: "validation", label: "候选事实 JSON", kind: "llm", animated: true, description: "候选 Entity/Relationship + confidence + evidence" },
    { id: "a5", source: "ontology", target: "validation", label: "类型/关系白名单", kind: "ontology", description: "OWL/SHACL 提供的映射与校验约束" },
    { id: "a6", source: "validation", target: "neo4j", label: "写图", kind: "graph", animated: true, description: "校验通过的事实（MERGE，带 Provenance）" },
    { id: "a7", source: "validation", target: "search", label: "写索引", kind: "store", animated: true, description: "Chunk + vector + entity_ids + security_groups" },
    { id: "a8", source: "python", target: "search", label: "Chunk 直写", kind: "chunk", description: "即使抽取失败，文档 Chunk 仍可进入文本索引（降级路径）" },
    { id: "a9", source: "entra", target: "orchestrator", label: "身份 / ACL", kind: "security", description: "allowed_groups 由认证中间件注入，禁止信任客户端声明" },
    { id: "a10", source: "neo4j", target: "orchestrator", label: "图事实 / 路径", kind: "graph", animated: true, description: "参数化 Cypher 返回的结构化事实与多跳路径" },
    { id: "a11", source: "search", target: "orchestrator", label: "文档证据", kind: "store", animated: true, description: "Hybrid Search 返回的 Chunk 与页码/来源" },
    { id: "a12", source: "orchestrator", target: "generate", label: "融合上下文", kind: "rag", animated: true, description: "带 evidence_id、来源与权限标签的上下文" },
    { id: "a13", source: "generate", target: "webui", label: "答案 + 引用", kind: "app", animated: true, description: "答案、citation_ids、证据列表与 abstained 标记" },
    { id: "a14", source: "webui", target: "orchestrator", label: "用户问题", kind: "app", description: "自然语言问题与会话上下文回流到编排层" },
  ],
  legend: [
    { kind: "source", label: "数据接入" }, { kind: "llm", label: "LLM / Embedding" }, { kind: "ontology", label: "Ontology / 校验" },
    { kind: "graph", label: "Neo4j 图" }, { kind: "store", label: "文档索引" }, { kind: "security", label: "安全治理" },
    { kind: "rag", label: "检索编排" }, { kind: "app", label: "应用" },
  ],
};
