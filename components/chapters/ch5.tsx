import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeExample } from "@/components/ui/code-example";
import { Neo4jModelDiagram } from "@/components/viz/diagram-wrappers";
import { chapters } from "@/data/site";

const meta = chapters[4];

const pgConcepts = [
  ["Node", "实体节点，可带多个 Label", ":Service {serviceId:'SVC-002'}"],
  ["Relationship", "有类型、方向与属性的边", "-[:CONNECTS_TO {source:'config'} ]->"],
  ["Label", "节点分类，可多标签", ":Service:ProductionAsset"],
  ["Property", "节点或关系上的键值", "status='Running', confidence=0.93"],
  ["Direction", "关系的语义方向", "OrderService → CALLS → PaymentService"],
  ["Index", "加速按属性查找", "CREATE INDEX service_name ..."],
  ["Constraint", "存储层唯一性/存在性保证", "REQUIRE s.serviceId IS UNIQUE"],
];

const nodeLabels = [
  ["Business", "businessId", "业务线，业务侧影响分析"],
  ["System", "systemId", "系统边界"],
  ["Service", "serviceId", "核心服务节点"],
  ["Database", "dbId", "数据库实例"],
  ["Team", "teamId", "责任团队"],
  ["Incident", "incidentId", "故障事件"],
  ["Runbook", "runbookId", "处置手册"],
  ["Environment", "name", "部署环境（示例简化键）"],
  ["Document", "documentId", "原始文档，携带 ACL"],
  ["Chunk", "chunkId", "文档分块，与 AI Search 对齐"],
];

const relationTypes = [
  ["CONTAINS", "Business/System → System/Service", "包含关系"],
  ["CALLS", "Service → Service", "运行期调用"],
  ["DEPENDS_ON", "Service → Service/Database/Infrastructure", "设计或部署依赖"],
  ["CONNECTS_TO", "Service → Database", "数据库连接"],
  ["OWNED_BY", "Service/System → Team", "责任归属"],
  ["DEPLOYED_IN", "Service/Database → Environment", "部署环境"],
  ["AFFECTS", "Incident → Service/System", "故障影响"],
  ["RESOLVED_BY", "Incident → Runbook", "事件处置手册"],
  ["DOCUMENTED_BY", "Service/System → Runbook", "服务对应手册"],
  ["HAS_CHUNK", "Document → Chunk", "文档切分"],
  ["MENTIONS", "Chunk → Entity", "文本证据关联实体"],
];

const cypherIndex = [
  ["1", "创建唯一约束", "neo4j-schema", "所有 Label 的权威 ID 字段"],
  ["2", "创建节点", "neo4j-seed", "MERGE 以 ID 为键，SET 写入属性"],
  ["3", "MERGE 节点", "neo4j-seed", "幂等写入，避免重复节点"],
  ["4", "创建关系", "neo4j-seed", "7 条核心业务事实，方向统一"],
  ["5", "查询服务调用链", "cypher-queries", "谁调用了 PaymentService"],
  ["6", "查询影响范围", "cypher-queries", "反向 1..2 跳 CALLS|CONTAINS"],
  ["7", "查询故障涉及的团队", "cypher-queries", "AFFECTS → OWNED_BY"],
  ["8", "查询相关 Runbook", "cypher-queries", "服务文档 + 事件处置两条路径"],
  ["9", "多跳关系查询", "cypher-queries", "限制 1..3 跳与关系白名单"],
  ["10", "删除和更新策略", "cypher-write", "软删除、时态字段、DETACH DELETE"],
];

export default function Chapter5() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">Neo4j 使用 Labeled Property Graph 模型。它擅长精确路径查询，但<strong>不会自动执行 OWL 推理或 SHACL 校验</strong>：语义约束需要在图谱设计、写入流程与查询层分别落实。</p></Prose>

      <ChapterSection id="ch5-model" title="属性图模型与数据模型图" first>
        <DataTable headers={["概念", "说明", "示例"]} rows={pgConcepts} dense />
        <Neo4jModelDiagram />
        <Prose className="mt-4">
          <p>从第 3 章的 OWL 到属性图的映射要点：</p>
          <ul>
            <li><code>owl:Class</code> → Node Label；<code>Individual</code> → Node；<code>Object Property</code> → Relationship；<code>Data Property</code> → Property。</li>
            <li>类层次不会自动变成 Label 继承，必要时在应用层显式写入多个 Label。</li>
            <li>OWL Axiom 与 SHACL Shape 需要独立推理/验证步骤；数据库约束只覆盖存储层唯一性等问题。</li>
          </ul>
        </Prose>
      </ChapterSection>

      <ChapterSection id="ch5-schema" title="完整 Schema：节点、关系、约束">
        <Prose><p>节点 Label 与唯一键（与第 2 章示例数据一致）：</p></Prose>
        <DataTable headers={["Label", "唯一键", "用途"]} rows={nodeLabels} dense />
        <Prose className="mt-4"><p>关系类型与方向（写入脚本必须严格遵守）：</p></Prose>
        <DataTable headers={["关系", "方向", "语义"]} rows={relationTypes} dense />
        <Prose className="mt-4"><p>唯一约束与索引（Neo4j 5.x 语法）：</p></Prose>
        <CodeExample id="neo4j-schema" />
        <Callout type="warning" title="MERGE 需要可靠唯一键">
          <p>不要只依靠节点名称做 MERGE。企业里存在同名服务、重命名、多环境实例与历史遗留缩写；唯一键应来自 CMDB 等权威系统的稳定 ID，并配合唯一约束与写入前校验。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch5-cypher" title="10 组可执行 Cypher 示例">
        <DataTable headers={["#", "主题", "所在代码块", "要点"]} rows={cypherIndex} dense caption="下方三段代码覆盖全部 10 组示例，均可复制；参数化变量需由 driver 注入。" />
        <Prose className="mt-4"><p>① 创建节点、MERGE 节点与创建关系（第 2 章 7 条业务事实）：</p></Prose>
        <CodeExample id="neo4j-seed" />
        <Prose className="mt-4"><p>② 调用链、影响范围、团队、Runbook、多跳路径与 ACL 下推查询：</p></Prose>
        <CodeExample id="cypher-queries" />
        <Prose className="mt-4"><p>③ 更新与删除策略：优先软删除保留审计与时态信息；物理删除只用于明确合规或测试数据清理。</p></Prose>
        <CodeExample id="cypher-write" />
        <Prose className="mt-3">
          <p>查询影响范围时尤其要注意方向：<code>(upstream)-[:CALLS|CONTAINS*1..2]-&gt;(svc)</code> 表示「谁依赖该服务」，而 <code>(incident)-[:AFFECTS]-&gt;(svc)</code> 表示「故障从哪里开始」。方向写反会得出完全相反的业务结论。</p>
        </Prose>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Neo4j 5.x", "Cypher", "MERGE", "Constraint", "Index", "参数化查询"].map((t) => <Badge key={t} tone="cyan">{t}</Badge>)}
        </div>
      </ChapterSection>

      <ChapterSection id="ch5-safety" title="生产安全边界">
        <Prose>
          <ul>
            <li><strong>MERGE 需要可靠唯一键：</strong>使用 CMDB ID 等内容无关的稳定标识，并建立唯一约束。</li>
            <li><strong>关系方向必须统一：</strong>把方向写入关系字典与校验规则，跨团队共用同一份脚本。</li>
            <li><strong>不要把 CALLS 和 DEPENDS_ON 随意混用：</strong>前者是可观测的运行时调用，后者是设计/部署依赖；混用会让影响分析同时产生漏报与误报。</li>
            <li><strong>不要让 LLM 无限制生成和执行 Cypher：</strong>模型输出可能包含 DETACH DELETE、全图扫描或无界变长路径。</li>
            <li><strong>最小权限：</strong>检索服务使用只读账号；写入账号与检索账号分离；所有查询参数化，杜绝字符串拼接。</li>
            <li><strong>白名单与深度限制：</strong>关系类型白名单、最大跳数、返回条数上限、查询超时与资源配额。</li>
            <li><strong>权限下推：</strong>在 Cypher 中按节点/关系 ACL 过滤，而不是等结果返回后再在前端隐藏。</li>
            <li><strong>多跳噪声控制：</strong>跳数增加会带来组合爆炸与弱相关事实；按意图限制深度并做路径打分与裁剪。</li>
          </ul>
        </Prose>
        <Callout type="warning" title="允许 LLM 直连写库是重大风险">
          <p>正确模式是：LLM 只产出受限的结构化意图或参数，服务端从预定义的查询模板库中选择 Cypher，并用参数化查询、只读事务、白名单与审计日志执行。任何「让模型自己写查询」的设计都必须先经过安全评审。</p>
        </Callout>
        <Callout type="advice" title="版本敏感性">
          <p>Neo4j 4.x 与 5.x 的约束语法不同；<code>neo4j</code> Python Driver 4.x 与 5.x 的事务 API 也不同。示例代码按 Neo4j 5.x 与 driver 5.x 编写，升级时请以官方文档迁移说明为准。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
