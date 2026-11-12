import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeExample } from "@/components/ui/code-example";
import { chapters } from "@/data/site";

const meta = chapters[11];

const dirRows = [
  ["frontend/", "Web UI / Enterprise Copilot，展示答案、引用、图路径与反馈入口"],
  ["backend/api/", "FastAPI 路由、认证中间件、DTO、限流与审计"],
  ["backend/ingestion/", "文档解析、Chunk 切分、内容哈希与变更检测"],
  ["backend/extraction/", "LLM 抽取、Pydantic Schema、Prompt 版本管理"],
  ["backend/ontology/", "OWL/SHACL 加载、Ontology Mapping 与校验"],
  ["backend/entity_resolution/", "候选生成、打分、审核队列与回滚"],
  ["backend/graph/", "Neo4j Driver、Cypher 模板、写入与图检索"],
  ["backend/search/", "Azure AI Search Index 与 Keyword/Vector/Hybrid 检索"],
  ["backend/retrieval/", "意图识别、混合检索、Context Fusion、Evidence Validation"],
  ["backend/evaluation/", "评估数据集、指标脚本与回归报告"],
  ["ontology/", "enterprise.owl、service-shapes.ttl"],
  ["cypher/", "schema.cypher、seed-data.cypher、queries.cypher"],
  ["configs/ · tests/ · docker/ · docs/", "环境配置、测试、容器与部署文档"],
];

const boundaryRows = [
  ["OWL / SHACL", "教学用最小片段，未覆盖完整类层次、推理性能测试与所有约束", "OWL 2 / SHACL 标准稳定，但验证器（pyshacl / Jena）版本不同行为可能不同"],
  ["Python 抽取", "单 Chunk 调用；缺少批处理、限流重试、内容安全、成本控制与落库", "openai SDK、Pydantic v2、Azure OpenAI API 版本与模型支持范围均需核对"],
  ["Entity Resolution", "标准库实现的打分示意；缺少阻断策略、别名表服务与审核系统", "权重与阈值必须用真实标注数据校准"],
  ["Neo4j Cypher / Driver", "只读查询与写入片段；缺少迁移框架、连接池调优与故障注入测试", "Neo4j 5.x 与 driver 5.x 语法；4.x 不兼容"],
  ["Azure AI Search", "Index Schema 与单次混合检索；缺少索引器、技能集、私有网络与容量规划", "REST api-version、向量维度、Semantic Ranker 可用性随服务层级变化"],
  ["FastAPI Orchestrator", "编排骨架；未实现认证、超时、限流、审计与可观测性", "FastAPI 0.110+ / Pydantic v2；具体 SDK 版本见各示例"],
  ["答案生成", "单次生成与引用校验；缺少流式输出、多轮会话、内容安全与审计持久化", "Structured Outputs / json_object 支持随模型与 API 版本变化"],
];

export default function Chapter12() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">本章汇总建议的项目结构与关键代码示例。所有代码块都支持复制，并标注依赖、配置、适用范围与版本注意事项。<strong>它们是教学用简化实现，不是可直接上线的完整生产代码。</strong></p></Prose>

      <ChapterSection id="ch12-structure" title="建议项目目录" first>
        <CodeExample id="project-tree" />
        <DataTable headers={["目录", "职责"]} rows={dirRows} dense />
        <Prose className="mt-4"><p>本地开发环境变量模板（不含任何真实凭证）：</p></Prose>
        <CodeExample id="env-config" />
        <Callout type="warning" title="密钥管理">
          <p>生产环境应使用托管身份 / Key Vault 与私有终结点；不要把 API Key 写进 .env 或代码库，也不要把日志中的正文、令牌与证据原文混在一起。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch12-owl" title="Ontology：OWL 与 SHACL">
        <CodeExample id="owl-core" title="OWL Turtle（第 3 章同款，可复制）" />
        <CodeExample id="shacl-core" title="SHACL Shapes（第 3 章同款，可复制）" />
        <CodeExample id="shacl-validate" title="把 SHACL 校验接入 Pipeline" />
      </ChapterSection>

      <ChapterSection id="ch12-extraction" title="抽取与 Entity Resolution">
        <CodeExample id="extraction-production-json" title="生产级抽取记录字段" />
        <CodeExample id="pydantic" title="Pydantic 实体模型（类型白名单）" />
        <CodeExample id="azure-openai-structured" title="Azure OpenAI Structured Outputs 抽取" />
        <CodeExample id="entity-resolution" title="Entity Resolution 打分示例" />
      </ChapterSection>

      <ChapterSection id="ch12-graph" title="Neo4j：Schema、Driver 与图检索">
        <CodeExample id="neo4j-schema" title="唯一约束与索引" />
        <CodeExample id="neo4j-seed" title="MERGE 节点与 7 条业务事实" />
        <CodeExample id="cypher-queries" title="调用链 / 影响范围 / 团队 / Runbook / 多跳 / ACL" />
        <CodeExample id="cypher-write" title="更新与删除策略" />
        <CodeExample id="neo4j-driver" title="Python Driver：只读、参数化、限制深度" />
        <CodeExample id="graph-retrieval" title="Graph Retrieval：返回带 fact_id 的图事实" />
      </ChapterSection>

      <ChapterSection id="ch12-search" title="Azure AI Search：Index 与检索">
        <CodeExample id="search-index" title="Chunk Index Schema" />
        <CodeExample id="hybrid-search" title="Hybrid Search + Semantic Ranker + ACL Filter" />
      </ChapterSection>

      <ChapterSection id="ch12-api" title="FastAPI 编排与带引用答案">
        <CodeExample id="fastapi" title="GraphRAG Orchestrator（简化版）" />
        <CodeExample id="answer-generation" title="Answer Generation with Citations" />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["OWL", "SHACL", "Pydantic v2", "Azure OpenAI", "Neo4j 5.x", "Azure AI Search", "FastAPI", "Citations"].map((t) => <Badge key={t} tone="blue">{t}</Badge>)}
        </div>
      </ChapterSection>

      <ChapterSection id="ch12-disclaimer" title="示例代码边界与版本敏感性">
        <DataTable headers={["示例", "缺失的生产能力", "版本 / 配置注意事项"]} rows={boundaryRows} dense />
        <Callout type="warning" title="不要把简化示例伪装成生产代码">
          <p>示例省略了认证中间件、多租户隔离、限流、幂等重试、审计持久化、内容安全、灾备、监控与回归评估。要上线，必须补齐第 9 章的 20 项生产议题与第 10 章的评估门禁。</p>
        </Callout>
        <Callout type="advice" title="API 版本敏感，避免杜撰接口">
          <p>本书避免描述具体厂商 SDK 中不存在的接口；涉及 Structured Outputs、向量检索、Semantic Ranker、Neo4j GraphRAG Retriever 时，均注明「以官方文档当前版本为准」。请在实现前按附录链接核对 API 版本、模型部署名、服务层级与配额限制。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
