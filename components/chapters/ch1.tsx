import { AnchorHeading, Badge, Callout, Card, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreeLayerDiagram } from "@/components/viz/three-layer-diagram";
import { chapters } from "@/data/site";

const meta = chapters[0];

const ontologyTerms = [
  ["Class（类）", "一类事物的定义，如 Service；不是某个具体服务。"],
  ["Individual（个体）", "类的具体实例，如 PaymentService。OWL 中属于 ABox。"],
  ["Object Property", "连接两个个体的关系，如 PaymentService ownedBy PaymentTeam。"],
  ["Data Property", "连接个体与字面量的属性，如 status = Running。"],
  ["Axiom（公理）", "关于领域的逻辑断言，用于推理，如 Service 必须属于某个 System。"],
  ["Constraint（约束）", "数据必须满足的检查规则，可由 SHACL、数据库或应用层实现。"],
  ["OWL", "W3C 本体语言，表达概念、关系、公理与可推导语义；基于开放世界假设。"],
  ["SHACL", "W3C RDF 数据校验语言，以 Shape 描述必填、枚举、基数与类型。"],
];

const kgTerms = [
  ["Entity / Node", "具体实体及其在图数据库中的节点表示，携带 Label 与 Property。"],
  ["Relationship", "带方向、类型与属性的边，如 (OrderService)-[:CALLS]->(PaymentService)。"],
  ["Property", "节点或关系上的键值属性，如 serviceId、confidence、observedAt。"],
  ["Triple", "RDF 的基本事实单元 (subject, predicate, object)。"],
  ["Entity Resolution", "判断多个提及是否指向同一实体的消歧与合并流程。"],
  ["Knowledge Fusion", "多来源事实按权威性、时间与证据进行冲突消解。"],
  ["Provenance", "记录事实来自哪份文档、哪个 Chunk、哪次抽取与时间。"],
  ["Temporal Knowledge", "带有效期的事实，支持 as-of 时间查询，避免用过期知识回答。"],
];

const ragTerms = [
  ["Graph-based Retrieval", "按实体与关系检索结构化图事实、路径或邻接子图。"],
  ["Vector Retrieval", "基于 Embedding 的语义相似检索，适合找原文段落。"],
  ["Hybrid Retrieval", "关键词 + 向量（可再加图检索）多路召回并用 RRF 等融合。"],
  ["Context Fusion", "去重、裁剪、绑定证据 ID 与权限标签，构造有结构的上下文。"],
  ["LLM Generation", "在证据约束下组织自然语言答案，证据不足时拒答。"],
  ["Citation / Evidence", "每条结论可点回 chunk_id / document_id / 图事实 ID。"],
  ["Graph Traversal", "沿关系逐跳扩展，需限制深度与关系类型以控制噪声。"],
  ["Community Summary", "对紧密关联实体群生成摘要，适合全局主题型问题（适用时）。"],
];

export default function Chapter1() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose>
        <p className="lead">企业知识工程里最容易出现的错误，是把三个不同层次的东西当成同一个项目：<strong>Ontology 是语义模型，Knowledge Graph 是知识数据，GraphRAG 是检索增强生成架构</strong>。本章先建立统一语言，再进入工程细节。</p>
      </Prose>

      <ChapterSection id="ch1-concepts" title="三个概念：通俗解释与技术解释" first>
        <Prose><p>下面三个视角分别回答「什么叫什么」「谁和谁有关系」「如何基于这些知识回答人的问题」。点击标签切换，每个视角都包含通俗解释、技术解释、企业案例、最小示例与边界。</p></Prose>
        <Tabs defaultValue="ontology" className="mt-4">
          <TabsList>
            <TabsTrigger value="ontology">Ontology 本体</TabsTrigger>
            <TabsTrigger value="kg">Knowledge Graph</TabsTrigger>
            <TabsTrigger value="graphrag">GraphRAG</TabsTrigger>
          </TabsList>
          <TabsContent value="ontology" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="purple">语义模型层</Badge><span className="text-xs font-semibold text-ink">Ontology：企业共同遵守的业务词汇表与语法规则</span></div>
              <Prose className="mt-3">
                <p><strong>通俗解释：</strong>先约定「系统、服务、数据库、团队、故障、手册」分别是什么，哪些关系允许存在，比如一个 Service 必须由一个 Team 负责。它不记录「PaymentService 今天是不是挂了」。</p>
                <p><strong>技术解释：</strong>用 Class / Class Hierarchy / Object Property / Data Property / Domain / Range / Cardinality / Axiom 描述领域语义；RDF 场景下常用 OWL 2 表达公理与推理，用 SHACL 校验数据结构。OWL 遵循开放世界假设，SHACL 是闭世界式校验，两者不可互相替代。</p>
                <p><strong>企业案例：</strong>IT 运维中统一 CMDB、部署清单、工单里的「服务」定义，避免同一个对象在三个系统里被写成三种类型。</p>
                <p><strong>与另外两者的区别：</strong>本体定义「允许说什么」，知识图谱保存「实际说了什么」，GraphRAG 决定「如何检索并据此回答」。本体可以独立用于数据契约与主数据治理。</p>
              </Prose>
            </Card>
            <DataTable headers={["OWL / 建模术语", "简明定义"]} rows={ontologyTerms} dense />
            <CodeBlock id="code-ch1-owl" title="最小本体片段（Turtle）" language="turtle" code={`ex:Service a owl:Class ; rdfs:subClassOf ex:TechnicalAsset .
ex:ownedBy a owl:ObjectProperty ; rdfs:domain ex:Service ; rdfs:range ex:Team .
ex:serviceName a owl:DatatypeProperty ; rdfs:domain ex:Service ; rdfs:range xsd:string .
ex:PaymentService a ex:Service ; ex:serviceName "PaymentService" .`} scope="仅展示类、属性与实例的最小形态；完整示例见第 3、12 章。" />
          </TabsContent>
          <TabsContent value="kg" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="cyan">知识数据层</Badge><span className="text-xs font-semibold text-ink">Knowledge Graph：把真实实体与事实关系组织成一张可查询的图</span></div>
              <Prose className="mt-3">
                <p><strong>通俗解释：</strong>把「OrderService 调用 PaymentService」「PaymentService 连接 PaymentDB」这些真实事实画成节点和连线，之后就能沿连线做影响分析。</p>
                <p><strong>技术解释：</strong>属性图用 Node / Relationship / Label / Property / Direction；RDF 用 Triple。生产系统还需要 Entity Resolution、Knowledge Fusion、Provenance、时态知识与校验，否则图会迅速被重复实体与过期事实污染。</p>
                <p><strong>企业案例：</strong>把 CMDB、调用链、部署清单、工单与 Runbook 中的实体对齐到同一套 ID，形成 IT 运维知识图谱。</p>
                <p><strong>与另外两者的区别：</strong>图谱是数据，不是模型；它可以遵循完整 OWL 本体，也可以只遵循轻量 Schema。图谱可直接用 Cypher 查询，不必然接入 LLM。</p>
              </Prose>
            </Card>
            <DataTable headers={["图谱术语", "简明定义"]} rows={kgTerms} dense />
            <CodeBlock id="code-ch1-kg" title="最小图事实（Cypher）" language="cypher" code={`MERGE (o:Service {serviceId: "SVC-001"})
MERGE (p:Service {serviceId: "SVC-002"})
MERGE (o)-[:CALLS]->(p);
MATCH path = (n)-[:CALLS|CONTAINS*1..2]->(p:Service {serviceId: "SVC-002"})
RETURN path;`} scope="教学片段；生产环境应使用参数化查询、唯一约束与只读账号（见第 5 章）。" />
          </TabsContent>
          <TabsContent value="graphrag" className="mt-4 space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="blue">检索与生成层</Badge><span className="text-xs font-semibold text-ink">GraphRAG：把图结构证据与文本证据一起检索，再交给 LLM 组织答案</span></div>
              <Prose className="mt-3">
                <p><strong>通俗解释：</strong>用户问「支付服务故障会影响哪些系统」，系统先沿图找路径，再去文档里找原文证据，最后把两类证据合并，生成带引用的回答。</p>
                <p><strong>技术解释：</strong>由 Query Understanding、Entity Linking、Graph Retrieval、Vector / Keyword Retrieval、Hybrid Retrieval、Context Fusion、Evidence Validation、LLM Generation 与 Citation 组成。Community Summary 是部分实现（如 Microsoft GraphRAG）用于全局主题型问题的可选机制，不是所有 GraphRAG 的必备环节。</p>
                <p><strong>企业案例：</strong>把「图事实：影响路径与责任团队」与「文档证据：Runbook 原文与工单记录」融合，回答运维问答。</p>
                <p><strong>与另外两者的区别：</strong>GraphRAG 是一种架构，不等于 Neo4j 或任何数据库；它不要求完整 Ontology，也不一定优于传统 RAG。</p>
              </Prose>
            </Card>
            <DataTable headers={["GraphRAG 术语", "简明定义"]} rows={ragTerms} dense />
            <CodeBlock id="code-ch1-rag" title="最小答案结构（JSON）" language="json" code={`{
  "answer": "PaymentService 故障会影响 OrderService 与 OrderSystem；责任团队为 PaymentTeam。",
  "citation_ids": ["E2", "E3", "E4"],
  "abstained": false,
  "evidence_count": 8
}`} scope="演示数据结构；citation_ids 必须在生成后校验是否属于本轮允许的证据集合。" />
          </TabsContent>
        </Tabs>
      </ChapterSection>

      <ChapterSection id="ch1-compare" title="核心对比表与产物边界">
        <DataTable
          headers={["维度", "Ontology", "Knowledge Graph", "GraphRAG"]}
          rows={[
            ["解决的问题", "定义业务语义", "保存实体事实关系", "基于知识检索和生成答案"],
            ["核心对象", "Class、Property、Axiom", "Node、Edge、Entity", "Query、Retriever、Context、LLM"],
            ["主要产物", "OWL、SHACL、领域模型", "图数据库中的知识数据", "检索增强问答系统"],
            ["典型技术", "Protégé、OWL、SHACL", "Neo4j、RDF Store", "Neo4j GraphRAG、Azure AI Search、LLM"],
          ]}
          caption="对比表描述典型形态，不构成强制技术绑定：GraphRAG 可用其他图存储，知识图谱也不必须使用 OWL。"
        />
        <Prose className="mt-4">
          <p><strong>一句话记住：</strong>Ontology 是「语义模型」，不等于知识图谱；Knowledge Graph 是「知识表示与组织方式」，不等于某一种数据库；GraphRAG 是「检索增强生成架构」，不等于 Neo4j 或某个框架。</p>
        </Prose>
        <Callout type="conclusion" title="三者是三个独立的架构决策">
          <p>是否需要完整 Ontology、是否构建图结构、是否引入 GraphRAG，应由业务问题、数据形态、治理能力与成本预算分别决定。把它们描述成所有项目都必须严格串联的固定流水线，是常见的架构误导。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch1-diagram" title="三层关系总览（可交互）">
        <Prose><p>下图切换「常见组合视图」与「独立使用视图」。节点可拖动，点击节点查看定义，点击连线查看语义；连线动画可以在工具栏开关。</p></Prose>
        <ThreeLayerDiagram variant="chapter" />
        <Prose className="mt-3">
          <ul>
            <li><strong>组合：</strong>语义模型约束抽取与建图，图谱提供多跳事实，GraphRAG 融合文档证据生成答案。</li>
            <li><strong>独立：</strong>本体制订数据契约、图谱支撑确定性查询、传统 RAG 直接服务文档问答，均可单独创造价值。</li>
            <li><strong>部分组合：</strong>Knowledge Graph + RAG 但不用完整 OWL；或 Ontology + 结构化查询但不用 LLM，都是合理架构。</li>
          </ul>
        </Prose>
      </ChapterSection>

      <ChapterSection id="ch1-boundary" title="常见误解与组合方式">
        <DataTable
          headers={["常见说法", "问题所在", "更准确的表述"]}
          rows={[
            ["「有了 OWL 就有知识图谱」", "OWL 是模型与公理，实例数据可以为空。", "本体 + 实例断言（ABox）或属性图数据，才构成可用的图谱。"],
            ["「GraphRAG 就是 Neo4j」", "把架构与具体产品混为一谈。", "GraphRAG 的图检索可由 Neo4j、RDF Store、内存图或其他服务承担。"],
            ["「所有知识图谱都要 OWL」", "忽略轻量 Schema 也能支撑生产图谱。", "OWL 适合强语义对齐与推理；很多属性图项目用约束 + 应用层校验即可。"],
            ["「GraphRAG 一定比 RAG 好」", "忽略构建成本、延迟与错误关联风险。", "多跳关系与影响分析场景更有价值；纯文档检索场景传统 RAG 常更经济。"],
            ["「LLM 抽出来的就是事实」", "把生成结果当成已验证知识。", "抽取结果是候选事实，需保留来源、置信度、版本并通过校验与审核。"],
            ["「置信度等于来源权威性」", "两个维度被混用。", "confidence 表示模型抽取把握；source_authority 表示数据源可信等级。"],
            ["「图数据库可以替代文档索引」", "结构化关系无法提供原文措辞与页码证据。", "图检索与文档/向量检索互补，生产系统通常两者都要。"],
            ["「本体约束 = 数据库约束」", "语义推理、数据校验与存储约束层次不同。", "OWL 表达语义，SHACL 校验结构，Neo4j Constraint 保障唯一性/存在性。"],
          ]}
          dense
        />
        <Callout type="principle" title="行业通用原则">
          <p>语义层、知识层、检索生成层解耦，是让系统可演进的前提。任何一层都可以被替换或省略，但每次替换都应重新验证<strong>权限、证据链与评估指标</strong>是否仍然成立。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch1-code" title="最小对照示例：同一条知识的三种形态">
        <Prose><p>以「PaymentService 由 PaymentTeam 负责」为例，观察它在本体、图谱、问答系统中的不同形态：</p></Prose>
        <DataTable
          headers={["层次", "表达形态", "示例", "回答问题"]}
          rows={[
            ["Ontology", "类与属性定义", "ex:ownedBy rdfs:domain ex:Service ; rdfs:range ex:Team", "哪些关系允许存在？"],
            ["Knowledge Graph", "具体事实（带来源）", "(PaymentService)-[:OWNED_BY {source:'CMDB'}]->(PaymentTeam)", "谁负责这个服务？"],
            ["GraphRAG", "证据 + 引用答案", "答案句 + [E4] → Neo4j fact / 文档 Chunk", "答案依据是什么？"],
          ]}
          dense
        />
        <AnchorHeading id="ch1-code-summary" level={4}>为什么必须区分这三层</AnchorHeading>
        <Prose>
          <ul>
            <li>改了本体（例如允许多个 Team）不等于历史图谱数据自动合规，需要迁移与校验。</li>
            <li>图谱里没有关联边时，LLM 不应该凭语言常识「补」出一条责任关系。</li>
            <li>答案中的引用必须能回到具体 Chunk 或图事实 ID，而不是只给一个文档标题。</li>
          </ul>
        </Prose>
        <Callout type="assumption" title="本书统一示例数据">
          <p>从第 2 章起，OrderSystem / PaymentService / PaymentDB / Incident-001 / Runbook-001 等均为<strong>教学用示例实体</strong>；评估指标、延迟、成本与排期均为演示或规划估算，不代表任何真实企业、真实项目数据或行业统计。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
