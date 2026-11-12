export type GlossaryCategory = "Ontology" | "Knowledge Graph" | "GraphRAG / RAG" | "工程与平台";

export interface GlossaryTerm {
  term: string;
  cn: string;
  category: GlossaryCategory;
  plain: string;
  technical: string;
  related?: string[];
}

export const glossary: GlossaryTerm[] = [
  { term: "Ontology", cn: "本体", category: "Ontology", plain: "企业共同遵守的“业务词汇表 + 语法规则”：哪些东西算什么类型，它们之间允许发生什么关系。", technical: "对领域概念、关系、公理与约束的形式化规约；在 RDF/OWL 语境下通常以 TBox（术语层）与 ABox（断言层）区分。", related: ["OWL", "Class", "Axiom"] },
  { term: "Class", cn: "类", category: "Ontology", plain: "一类事物的定义，例如 Service 是所有服务的类型，而不是某一个具体服务。", technical: "OWL 中个体的集合；可通过 rdfs:subClassOf 建立层次，通过 OWL 约束表达必要条件与充分条件。", related: ["Individual", "Class Hierarchy"] },
  { term: "Individual", cn: "个体 / 实例", category: "Ontology", plain: "类的一个具体成员，例如 PaymentService 是 Service 的一个实例。", technical: "ABox 中的具体断言对象；在属性图中通常映射为带 Label 的 Node。", related: ["Class", "Entity"] },
  { term: "Object Property", cn: "对象属性", category: "Ontology", plain: "连接两个对象的关系，例如 PaymentService 由 PaymentTeam 负责。", technical: "OWL 中连接两个 Individual 的关系，可定义 Domain / Range、传递性、对称性与基数。", related: ["Domain / Range", "Data Property"] },
  { term: "Data Property", cn: "数据属性", category: "Ontology", plain: "对象的字面值字段，例如 status = Running。", technical: "OWL 中连接 Individual 与字面量（xsd:string、xsd:integer 等）的属性。", related: ["Object Property", "SHACL"] },
  { term: "Axiom", cn: "公理", category: "Ontology", plain: "关于领域恒真的陈述，例如“每个 Service 必须属于一个 System”。", technical: "OWL 中用于推理的逻辑断言（subClassOf、equivalentClass、disjointWith、property restriction 等）。", related: ["OWL", "Constraint"] },
  { term: "Constraint", cn: "约束", category: "Ontology", plain: "数据必须满足的检查规则，例如 status 只允许三个枚举值。", technical: "可为 SHACL Shape、数据库 Constraint 或应用层校验；三者作用层次不同，不能互相替代。", related: ["SHACL", "Cardinality"] },
  { term: "OWL", cn: "Web Ontology Language", category: "Ontology", plain: "W3C 的本体描述语言，用机器可理解的方式表达概念、关系与推理规则。", technical: "W3C OWL 2 标准，基于描述逻辑；常见序列化为 Turtle / RDF/XML。适合语义表达与推理，不等于数据校验工具。", related: ["SHACL", "Protégé"] },
  { term: "SHACL", cn: "Shapes Constraint Language", category: "Ontology", plain: "给 RDF 数据“验格式”的语言：必填字段、枚举、基数、类型。", technical: "W3C 标准，以 NodeShape / PropertyShape 描述验证条件，输出 ValidationReport；属于闭世界校验语义。", related: ["OWL", "Constraint"] },
  { term: "Class Hierarchy", cn: "类层次", category: "Ontology", plain: "从抽象到具体的类型树，例如 TechnicalAsset → Service。", technical: "rdfs:subClassOf 构成的类型继承结构；继承应表达 is-a 关系，不应表达“运行状态”或“所属组织”。", related: ["Class"] },
  { term: "Domain / Range", cn: "定义域 / 值域", category: "Ontology", plain: "规定一条关系的起点和终点分别应该是什么类型。", technical: "OWL/RDFS 中属性的 Domain、Range；注意 OWL 的 Domain/Range 是推理语义而非强校验，不应误当作拒绝写入的约束。", related: ["Object Property", "SHACL"] },
  { term: "Cardinality", cn: "基数", category: "Ontology", plain: "一条关系允许出现几次，例如一个 Service 必须恰好有一个负责团队。", technical: "OWL 的 min/max/exactCardinality 或 SHACL 的 sh:minCount / sh:maxCount；在属性图中需由应用层或数据库约束落实。", related: ["SHACL"] },
  { term: "Knowledge Graph", cn: "知识图谱", category: "Knowledge Graph", plain: "把真实世界的对象及其事实关系组织成一张可查询的图。", technical: "以 Entity / Relationship / Property（或 RDF Triple）表示的知识数据；可存储于属性图数据库、RDF Store 或其他图结构。", related: ["Triple", "Neo4j"] },
  { term: "Triple", cn: "三元组", category: "Knowledge Graph", plain: "一条最小事实：主语 - 谓语 - 宾语，例如 PaymentService connectsTo PaymentDB。", technical: "RDF 的基本数据单元 (subject, predicate, object)，可附带 Named Graph、Provenance 与时间戳。", related: ["RDF", "Provenance"] },
  { term: "Entity Resolution", cn: "实体消歧 / 实体对齐", category: "Knowledge Graph", plain: "判断“支付服务”“PaymentSvc”“SVC-002”是不是同一个东西。", technical: "结合精确 ID、Alias、规则、Embedding 相似度与 LLM 上下文判断的候选匹配与合并流程；自动合并需保留审计与回滚。", related: ["Knowledge Fusion"] },
  { term: "Knowledge Fusion", cn: "知识融合", category: "Knowledge Graph", plain: "多个来源说法不一致时，决定采信哪一条、保留哪些证据。", technical: "按来源权威性、时间新旧、置信度与证据数量进行冲突消解，保留多来源证据、版本与有效期。", related: ["Provenance", "Entity Resolution"] },
  { term: "Provenance", cn: "数据血缘", category: "Knowledge Graph", plain: "这条知识从哪份文档、哪个 Chunk、哪一次抽取来的。", technical: "记录 source_document、chunk_id、evidence_span、extractor_version、observed_at 等元数据，用于审计、回滚与引用。", related: ["Citation"] },
  { term: "Temporal Knowledge", cn: "时态知识", category: "Knowledge Graph", plain: "事实会随时间变化，例如某服务上周属于 A 团队，本周属于 B 团队。", technical: "以 valid_from / valid_to、双时态或事件化关系建模；查询时必须指定 as-of 时间，避免用过期事实回答。", related: ["Provenance"] },
  { term: "Neo4j", cn: "属性图数据库", category: "Knowledge Graph", plain: "以节点、关系、标签和属性存储图的数据库，用 Cypher 查询。", technical: "Labeled Property Graph 模型；提供 Cypher、Index、Constraint；不会因导入 OWL 就自动执行 OWL 推理或 SHACL 校验。", related: ["Cypher", "Knowledge Graph"] },
  { term: "Cypher", cn: "图查询语言", category: "Knowledge Graph", plain: "用类似“模式匹配”的语法查询节点与路径。", technical: "Neo4j 声明式图查询语言；生产环境应参数化、只读、限制路径深度与查询超时。", related: ["Neo4j", "Graph Traversal"] },
  { term: "RAG", cn: "检索增强生成", category: "GraphRAG / RAG", plain: "先查资料，再让 LLM 基于查到的资料回答，减少凭空编造。", technical: "Retrieval + Context Construction + LLM Generation 的架构范式；检索源可以是全文/向量索引、数据库或图。", related: ["Vector Search", "GraphRAG"] },
  { term: "GraphRAG", cn: "图检索增强生成", category: "GraphRAG / RAG", plain: "把图结构中的实体关系与文本证据一起检索，再交给 LLM 组织答案。", technical: "一类检索增强架构，不是数据库产品；实现可基于 Neo4j GraphRAG Python 包、Microsoft GraphRAG 或自研编排。", related: ["Graph Traversal", "Hybrid Search"] },
  { term: "Hybrid Search", cn: "混合检索", category: "GraphRAG / RAG", plain: "关键词检索与向量检索一起用，兼顾精确词命中与语义相近。", technical: "在 Azure AI Search 中组合 keyword / vector 查询并用 RRF 融合排序结果，可叠加 Semantic Ranker 与 metadata filter。", related: ["RRF", "Vector Search"] },
  { term: "Vector Search", cn: "向量检索", category: "GraphRAG / RAG", plain: "把文本转成向量，按语义相似度找相近内容。", technical: "基于 Embedding 的近似最近邻检索；适合语义相关文本，但不保证实体 ID、数值与多跳关系的精确性。", related: ["Embedding", "Hybrid Search"] },
  { term: "Embedding", cn: "向量表示", category: "GraphRAG / RAG", plain: "把一段文字表示成一串数字，用于计算语义相似度。", technical: "由 Embedding 模型生成的固定维度浮点向量；维度、模型版本与归一化方式会影响索引兼容性与相似度分布。", related: ["Vector Search"] },
  { term: "RRF", cn: "Reciprocal Rank Fusion", category: "GraphRAG / RAG", plain: "把多路检索的排名合成一个排名，避免直接比较不同量纲的分数。", technical: "基于各路结果名次倒数求和的融合方法（score = Σ 1/(k + rank)），常用于混合检索结果融合。", related: ["Hybrid Search"] },
  { term: "Semantic Ranker", cn: "语义重排序", category: "GraphRAG / RAG", plain: "对初筛结果再按语义相关性重新排序。", technical: "Azure AI Search 提供的 L2 重排序能力，作用于候选结果集；是否可用、计费与配置随服务层级和 API 版本变化。", related: ["Hybrid Search"] },
  { term: "Context Fusion", cn: "上下文融合", category: "GraphRAG / RAG", plain: "把图事实和文档原文整理成一份有结构、可引用的上下文。", technical: "去重、按相关性裁剪、注入 provenance 与 ACL 标签、控制 token 预算，并保留可追溯的证据 ID。", related: ["Citation", "Evidence Validation"] },
  { term: "Graph Traversal", cn: "图遍历", category: "GraphRAG / RAG", plain: "沿关系一跳一跳往外找，例如从支付服务找到订单系统。", technical: "路径查询 / BFS / 变长模式匹配；跳数增加会放大噪声、组合爆炸与越权路径风险，必须限制深度和过滤条件。", related: ["Cypher", "GraphRAG"] },
  { term: "Community Summary", cn: "社区摘要", category: "GraphRAG / RAG", plain: "先给图中的一群紧密关联实体生成摘要，回答全局性问题时用摘要。", technical: "Microsoft GraphRAG 等方法使用图社区检测与分层摘要支持全局问题；适合主题型问答，不替代精确路径查询。", related: ["Microsoft GraphRAG"] },
  { term: "Agentic RAG", cn: "智能体式 RAG", category: "GraphRAG / RAG", plain: "让 Agent 自己决定分几步、调用哪些工具、是否需要继续查。", technical: "在检索流程外增加规划、工具调用与迭代循环；能力更强但延迟、成本、可复现性与权限面更复杂。", related: ["GraphRAG", "Tool Calling"] },
  { term: "Microsoft GraphRAG", cn: "微软 GraphRAG 项目", category: "工程与平台", plain: "微软开源的研究/工具项目，侧重从文本构建实体图、社区摘要并回答全局性问题。", technical: "GitHub microsoft/graphrag；与 Neo4j 官方 GraphRAG Python 包不是同一个项目，索引结构、检索 API 与依赖栈均不同。", related: ["Neo4j GraphRAG"] },
  { term: "Neo4j GraphRAG", cn: "Neo4j GraphRAG Python 包", category: "工程与平台", plain: "Neo4j 官方提供的 Python 工具包，帮助把 Neo4j 图检索与 LLM/向量检索组合。", technical: "neo4j-graphrag-python，提供 Retriever、GraphRAG 等抽象；API 随版本演进，请以官方文档当前版本为准。", related: ["Microsoft GraphRAG", "Neo4j"] },
  { term: "ACL", cn: "访问控制列表", category: "工程与平台", plain: "谁可以看哪些数据。", technical: "在检索阶段以 security_groups / ACL filter 下推到每一路检索，并在融合与生成前再次校验，防止越权路径泄漏。", related: ["RBAC / ABAC"] },
  { term: "RBAC / ABAC", cn: "基于角色 / 属性的访问控制", category: "工程与平台", plain: "按角色，或按部门、地区、密级等属性决定权限。", technical: "RBAC 依据角色授权；ABAC 依据主体/资源/环境属性策略判定。图谱场景常需两者结合并支持文档权限继承。", related: ["ACL"] },
  { term: "Citation", cn: "引用 / 证据链接", category: "工程与平台", plain: "答案中的每句话能点回原始文档或图事实。", technical: "答案生成阶段绑定 evidence_id、chunk_id、document_id、页码与图谱事实 ID，输出前做 Citation Accuracy 校验。", related: ["Provenance", "Answer Faithfulness"] },
];

export const glossaryCategories: GlossaryCategory[] = ["Ontology", "Knowledge Graph", "GraphRAG / RAG", "工程与平台"];
