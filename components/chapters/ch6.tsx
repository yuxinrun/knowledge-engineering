import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeExample } from "@/components/ui/code-example";
import { AzureArchitectureDiagram } from "@/components/viz/azure-architecture";
import { QuerySequenceDiagram } from "@/components/viz/query-sequence";
import { QueryFlowDemo } from "@/components/viz/query-flow-demo";
import { azureComponents } from "@/data/azure";
import { querySequence } from "@/data/diagrams";
import { chapters } from "@/data/site";

const meta = chapters[5];

const indexFields = [
  ["id", "Edm.String（key）", "Chunk 唯一键，幂等 upsert"],
  ["document_id", "Edm.String（filterable）", "回链原始文档与权限继承"],
  ["chunk_id", "Edm.String（filterable）", "与图谱 MENTIONS / Citation 对齐"],
  ["title", "Edm.String（searchable）", "语义重排的标题字段"],
  ["content", "Edm.String（searchable）", "原文证据与关键词检索"],
  ["content_vector", "Collection(Edm.Single)", "Embedding 向量；维度必须与模型一致"],
  ["entity_ids", "Collection(Edm.String)", "与图实体关联，支持实体过滤"],
  ["source", "Edm.String（facetable）", "来源类型：CMDB / Runbook / 工单"],
  ["page_number", "Edm.Int32", "引用页码，支持证据定位"],
  ["security_groups", "Collection(Edm.String)（filterable）", "ACL 下推的核心字段"],
  ["updated_at", "Edm.DateTimeOffset", "时效性过滤与增量更新"],
];

const searchConcepts = [
  ["Index Schema", "定义字段、类型、可检索/可过滤/可排序属性与向量配置", "字段设计错误会导致过滤或引用无法落地"],
  ["Vector Field", "保存 Embedding 的浮点向量字段", "维度、模型版本必须与生成端一致"],
  ["Embedding", "把文本映射为向量", "换模型通常意味着重建索引与回归评估"],
  ["Keyword Search", "BM25 / Lucene 词法检索", "保障服务 ID、错误码、版本号等精确词命中"],
  ["Vector Search", "近似最近邻语义检索", "语义相近不等于实体关系正确"],
  ["Hybrid Search", "关键词 + 向量多路召回", "兼顾精确词与语义相关"],
  ["RRF", "按名次倒数融合多路排序", "融合的是排名，不是事实正确性"],
  ["Semantic Ranker", "对候选集做语义重排序", "服务层级与 API 版本敏感；会增加延迟与成本"],
  ["Metadata Filter", "按 source / entity_ids / updated_at 等过滤", "避免跨版本、跨系统混入不相关证据"],
  ["Security Filter", "security_groups ACL 下推到检索阶段", "绝不能只在前端隐藏敏感信息"],
];

export default function Chapter6() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">GraphRAG 不是「把 Neo4j 接到 LLM」。生产系统的核心是<strong>职责分离</strong>：图数据库管结构化事实，文档索引管原文与语义证据，模型服务管抽取/Embedding/生成，编排层管意图、权限、融合与证据校验。</p></Prose>

      <ChapterSection id="ch6-architecture" title="Azure 企业级完整架构图（可交互）" first>
        <Prose><p>点击任一组件，右侧展示组件职责、输入、输出、技术选型、常见故障与实施注意事项；点击连线查看数据流。节点可拖动，工具栏可快速定位组件并开关数据流动画。</p></Prose>
        <AzureArchitectureDiagram />
        <Prose className="mt-3">
          <p>数据链路：<strong>Azure Blob Storage → Azure Document Intelligence → Python Processing Pipeline → Azure OpenAI（抽取/Embedding）→ Ontology/SHACL 校验 → Neo4j + Azure AI Search → GraphRAG Orchestrator → Azure OpenAI（生成）→ Web UI / Enterprise Copilot</strong>。Entra ID / RBAC·ABAC 是横切治理层，贯穿所有检索与生成环节。</p>
        </Prose>
        <Callout type="advice" title="版本敏感性提示">
          <p>Azure AI Search 的 REST <code>api-version</code>、向量检索与 Semantic Ranker 能力、Azure OpenAI Structured Outputs 的模型/API 版本、Neo4j GraphRAG Python 包的 Retriever API 都会演进。本章给出的是架构与字段设计，不是对某个 SDK 固定版本的承诺；实现前请核对附录中的官方文档。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch6-components" title="组件职责与数据边界">
        <DataTable
          headers={["组件", "层次", "核心职责", "技术选型"]}
          rows={azureComponents.map((c) => [c.name, c.layer, c.responsibility, c.tech])}
          dense
        />
        <Prose className="mt-4">
          <ul>
            <li><strong>Neo4j 存实体和关系：</strong>路径、依赖、责任归属等结构化事实，适合精确查询与多跳遍历。</li>
            <li><strong>Azure AI Search 存文档 Chunk、文本和向量：</strong>原文措辞、页码、语义证据与 Metadata / ACL Filter。</li>
            <li><strong>Azure OpenAI 负责抽取、Embedding、问题理解和回答生成：</strong>模型版本、部署名与 Prompt/Schema 版本都必须纳入配置管理。</li>
            <li><strong>Python/FastAPI 负责检索编排、权限和业务逻辑：</strong>意图识别、Entity Linking、多路检索、RRF 融合、Context Fusion、Evidence Validation 与 Citation 校验。</li>
            <li><strong>Blob Storage / Document Intelligence：</strong>保存原始文档并提供可回放的解析结果；复杂表格与扫描件尤其依赖版面解析质量。</li>
          </ul>
        </Prose>
        <Callout type="conclusion" title="Microsoft GraphRAG 与 Neo4j GraphRAG 不是同一个项目">
          <p><strong>Microsoft GraphRAG</strong>（GitHub: microsoft/graphrag）侧重从文本构建实体图、做社区检测与分层摘要，以支持全局主题型问题；<strong>Neo4j GraphRAG</strong>（neo4j-graphrag-python）是 Neo4j 官方 Python 包，围绕已有 Neo4j 图与向量索引提供 Retriever / GraphRAG 抽象。两者的索引结构、依赖栈、检索 API 与适用问题均不同，选型时不要混为一谈。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch6-search" title="Azure AI Search Index 与 Hybrid Search">
        <Prose><p>示例字段设计（与第 12 章的 Index JSON 完全一致）：</p></Prose>
        <DataTable headers={["字段", "类型 / 属性", "作用"]} rows={indexFields} dense />
        <CodeExample id="search-index" />
        <Prose className="mt-4"><p>十个关键概念与工程注意点：</p></Prose>
        <DataTable headers={["概念", "说明", "注意点"]} rows={searchConcepts} dense />
        <Prose className="mt-4"><p>Hybrid Search 调用示例（Keyword + Vector + Semantic Ranker + ACL Filter）：</p></Prose>
        <CodeExample id="hybrid-search" />
        <Callout type="warning" title="ACL filter 必须写在检索请求里">
          <p>示例中的 <code>filter</code> 把 <code>security_groups</code> 下推到检索阶段。若先取回全部结果再在应用层过滤，无权内容仍可能进入日志、缓存、上下文或模型提示词，形成越权泄漏。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch6-query-flow" title="GraphRAG 查询时序流程">
        <Prose><p>用户问题 → Query Understanding → Intent Classification → Entity Linking → Graph Retrieval → Vector Retrieval → Keyword Retrieval → Hybrid Retrieval → Context Fusion → Evidence Validation → LLM Answer → Citation / Source。下图可点击、可播放、可逐步查看每步输入与输出。</p></Prose>
        <QuerySequenceDiagram />
        <DataTable
          headers={["阶段", "关键输入", "关键输出", "主要风险"]}
          rows={querySequence.map((s) => [s.title, s.input, s.output, s.detail.slice(0, 56) + "…"])}
          dense
          caption="完整说明见交互时序图右侧详情面板。"
        />
      </ChapterSection>

      <ChapterSection id="ch6-demo" title="交互式查询演示（模拟数据）">
        <Prose><p>输入问题（默认即本章示例问题），点击「逐步执行」或「自动播放」观察 7 步处理过程，最后查看带引用答案。引用标记可点击展开证据详情。</p></Prose>
        <QueryFlowDemo />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["模拟数据", "无后端调用", "Graph Retrieval", "Hybrid Search", "Evidence Validation", "Citation"].map((t) => <Badge key={t} tone="amber">{t}</Badge>)}
        </div>
      </ChapterSection>

      <ChapterSection id="ch6-boundary" title="为什么不能只检索图数据库">
        <DataTable
          headers={["能力", "Neo4j / 图检索", "Azure AI Search / 文档索引", "GraphRAG 中的分工"]}
          rows={[
            ["精确关系与路径", "强：Cypher、变长路径、影响分析", "弱：文本共现不等于关系", "提供图事实与路径证据"],
            ["原文措辞与步骤", "弱：节点属性不适合长文本", "强：Chunk、页码、表格与语义检索", "提供可引用原文证据"],
            ["语义相似问题", "弱：没有 Embedding 语义检索", "强：向量检索", "召回候选文档"],
            ["精确词/ID/错误码", "中：需属性完全匹配", "强：Keyword Search + Filter", "补齐精确命中"],
            ["权限过滤", "按节点/关系 ACL 下推", "按 security_groups 下推", "两路都要在检索阶段过滤"],
            ["答案可解释性", "路径确定但缺原文", "有原文但缺结构化路径", "融合后同时给出路径与引用"],
          ]}
          dense
        />
        <Prose className="mt-4">
          <p>图数据库回答「谁依赖谁」「责任团队是谁」；文档索引回答「手册第 3 页怎么写的」「工单里记录了什么」。用户问题往往同时需要两类证据：既要有确定性的关系路径，也要有可点击的原文引用。只检索图数据库会丢掉措辞、上下文、步骤与页码；只检索文档索引则难以可靠完成多跳影响分析。</p>
        </Prose>
        <Callout type="principle" title="行业通用原则">
          <p>检索源的选择由问题类型决定，而不是由架构潮流决定。结构化关系查询、语义相似检索与精确词匹配各自不可替代；生产系统应保留每一路证据 ID，并在 Context Fusion 阶段统一去重、裁剪与权限复核。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
