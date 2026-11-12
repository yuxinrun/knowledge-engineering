export interface FaqItem { q: string; a: string; tags: string[] }

export const faq: FaqItem[] = [
  {
    q: "Ontology 和 Knowledge Graph 是同一个东西吗？",
    a: "不是。Ontology 是语义模型（Class、Property、Axiom、Constraint），回答“什么类型、允许什么关系”；Knowledge Graph 是按该模型（或其他模型）组织的具体实体与事实数据，回答“谁和谁有关系”。可以没有完整 Ontology 就建图，也可以有 Ontology 但没有实例化图谱数据。",
    tags: ["Ontology", "Knowledge Graph"],
  },
  {
    q: "GraphRAG 一定要用 Neo4j 吗？",
    a: "不一定。GraphRAG 是一种检索增强架构，图检索可以由 Neo4j、RDF Store、内存图、关系数据库的递归查询或专用图服务承担。Neo4j 只是常见的属性图实现选择，是否采用取决于团队能力、数据规模、运维成本与查询模式。",
    tags: ["GraphRAG", "Neo4j"],
  },
  {
    q: "所有知识图谱都需要 OWL 吗？",
    a: "不需要。很多企业图谱用属性图 + 数据库约束 + 应用层校验就足够。OWL 适合需要明确语义、跨系统对齐和推理的场景；SHACL 适合 RDF 数据的结构校验。是否引入完整本体应由业务语义复杂度与治理要求决定。",
    tags: ["OWL", "SHACL"],
  },
  {
    q: "GraphRAG 一定比传统 RAG 更好吗？",
    a: "不是。传统 RAG 在“以文档语义检索为主”的问题上通常更经济、延迟更低、维护更简单。GraphRAG 的价值主要体现在多跳关系、影响分析、跨系统依赖追踪等场景；其代价是抽取、消歧、融合、校验和图谱维护成本。",
    tags: ["GraphRAG", "Traditional RAG"],
  },
  {
    q: "LLM 抽取出来的实体和关系能直接写入生产图谱吗？",
    a: "不应直接写入。抽取结果是带置信度的候选事实，必须经过本体类型白名单、Schema 校验、Entity Resolution、冲突消解、来源记录，高风险事实还需人工审核。置信度只表示模型对抽取的把握，不代表来源权威性，更不代表事实为真。",
    tags: ["Entity Extraction", "Validation"],
  },
  {
    q: "为什么不能只检索图数据库？",
    a: "图数据库擅长精确的结构化关系与路径查询，但用户常需要原文措辞、操作手册步骤、上下文段落和页码证据，这些属于文档索引的职责。生产系统一般同时做 Graph Retrieval 与 Vector/Keyword Retrieval，再做 Context Fusion 与 Evidence Validation。",
    tags: ["Azure AI Search", "Hybrid Search"],
  },
  {
    q: "OWL 导入 Neo4j 后会自动推理和校验吗？",
    a: "不会。Neo4j 是属性图数据库，不原生执行 OWL 推理或 SHACL 验证。需要设计 RDF → 属性图的映射（Class→Label、Object Property→Relationship、Data Property→Property），并用独立的推理器/验证器或应用层规则实现约束。",
    tags: ["OWL", "SHACL", "Neo4j"],
  },
  {
    q: "Microsoft GraphRAG 和 Neo4j GraphRAG 有什么区别？",
    a: "两者不是同一个项目。Microsoft GraphRAG 是微软开源项目，核心思路是从文本构建实体图、做社区检测与分层摘要以支持全局性问题；Neo4j GraphRAG（neo4j-graphrag-python）是 Neo4j 官方 Python 包，围绕已有的 Neo4j 图与向量索引提供 Retriever / GraphRAG 抽象。它们的索引结构、依赖栈和适用问题不同。",
    tags: ["Microsoft GraphRAG", "Neo4j GraphRAG"],
  },
  {
    q: "多跳查询为什么容易出错？",
    a: "跳数增加会带来路径组合爆炸、弱相关实体被引入上下文、错误关系被放大、以及越权路径风险。工程上需要限制最大跳数、关系类型白名单、路径置信度、相关度裁剪，并在融合阶段做证据验证。",
    tags: ["Graph Traversal", "噪声"],
  },
  {
    q: "为什么图谱权限比文档权限更难？",
    a: "因为实体关联本身可能泄漏信息：即使某个节点无权访问，它的名称、与有权节点的关系、或从多跳推断出的结论也可能出现在上下文或答案里。必须在图检索阶段按节点/关系 ACL 过滤，并在融合和生成前再次校验。",
    tags: ["ACL", "安全"],
  },
  {
    q: "本体约束和数据库约束是一回事吗？",
    a: "不是。OWL 公理描述语义与可推导结论（开放世界假设），SHACL 校验数据结构（闭世界式验证），Neo4j Constraint 保障存储层的唯一性与存在性。三者层次不同，通常需要组合使用。",
    tags: ["OWL", "SHACL", "Constraint"],
  },
  {
    q: "什么时候 Traditional RAG + Metadata 就够了？",
    a: "当问题主要是“找某份文档里的某段内容”、实体关系简单、不需要跨实体多跳推理，且文档元数据（系统、版本、部门、时间、权限）足以支撑过滤时，带 Metadata Filter 的传统 RAG 往往足够。",
    tags: ["Traditional RAG", "Metadata"],
  },
  {
    q: "图谱质量差会有什么后果？",
    a: "图谱质量决定 GraphRAG 上限：错误实体、错向关系、未消歧的重复节点、过期事实会直接变成错误的图检索证据，并可能以非常“确定”的语气出现在答案里。应把抽取/消歧质量与 Citation Accuracy、ACL Leakage Rate 一同纳入上线门禁。",
    tags: ["质量", "评估"],
  },
  {
    q: "企业项目里最难的部分通常是模型调用吗？",
    a: "通常不是。更大工作量在数据治理：文档权限继承、来源权威性、实体 ID 对齐、版本与有效期、删除与过期、冲突消解、审计与回滚。模型调用往往只是 Pipeline 中较小的一环。",
    tags: ["数据治理", "实施"],
  },
  {
    q: "网站里的数据是真实企业数据吗？",
    a: "不是。OrderSystem / PaymentService / Incident-001 等均为教学用示例实体；评估仪表盘、成本、延迟、排期均为演示数据或规划估算，不代表任何真实客户、真实项目或行业标准。",
    tags: ["示例假设", "数据声明"],
  },
  {
    q: "如何打印这本白皮书？",
    a: "点击顶部导航的打印按钮（或使用浏览器 Ctrl+P）。打印样式会隐藏导航、侧栏、搜索与交互控件，保留正文、表格与代码，并按章节分页；交互式图表建议以屏幕模式查看。",
    tags: ["打印", "使用说明"],
  },
];
