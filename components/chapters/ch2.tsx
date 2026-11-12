import { Badge, Callout, Card, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { KnowledgeGraphExplorer } from "@/components/viz/knowledge-graph-explorer";
import { businessFacts, itopsEntities } from "@/data/itops";
import { chapters } from "@/data/site";

const meta = chapters[1];

export default function Chapter2() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />

      <ChapterSection id="ch2-facts" title="场景设定与 7 条业务事实" first>
        <Prose>
          <p className="lead">本书统一使用企业 IT 运维场景。示例企业有 8 个核心对象：OrderSystem、OrderService、PaymentService、PaymentDB、PaymentTeam、Production、Incident-001、Runbook-001。下面 7 条业务事实会在全书所有图、表、代码和问答示例中保持一致。</p>
        </Prose>
        <DataTable
          headers={["#", "业务事实", "图表达（Triple / Cypher 模式）", "示例来源"]}
          rows={businessFacts.map((f) => [String(f.no), f.text, <code className="font-mono text-[11px] text-cyan-700 dark:text-cyan-300">{f.triple}</code>, f.source])}
          caption="示例来源用于说明 Provenance 的必要性，不代表真实系统记录。"
          dense
        />
        <Callout type="assumption" title="教学场景模型">
          <p>所有实体、ID、状态与来源均为教学示例。第 2 章的交互图谱还加入了 Business、API、Infrastructure、Document、Chunk 等<strong>扩展演示节点</strong>，用于展示 1/2/3 跳关系；它们会在节点清单中明确标注，不会被伪装成核心业务事实。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch2-views" title="Ontology / KG / GraphRAG 三个视角">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="p-4">
            <Badge tone="purple">Ontology 视角</Badge>
            <h4 className="mt-2 text-sm font-bold text-ink">先问：有哪些类型？允许什么关系？</h4>
            <Prose className="mt-2 text-[13px]">
              <ul>
                <li>Class：System、Service、Database、Team、Environment、Incident、Runbook、Business、Document、Infrastructure。</li>
                <li>Object Property：contains、calls、dependsOn、connectsTo、ownedBy、deployedIn、affects、resolvedBy、documentedBy。</li>
                <li>Data Property：systemId、serviceId、serviceName、status、severity、dbType、environmentName。</li>
                <li>约束：Service 必须有 serviceName 与 1 个 ownedBy Team；status 只能取 Running / Stopped / Failed。</li>
              </ul>
            </Prose>
            <p className="mt-2 text-[11.5px] leading-5 text-muted">这里不关心「PaymentService 现在是否故障」，只规定可以如何描述它。</p>
          </Card>
          <Card className="p-4">
            <Badge tone="cyan">Knowledge Graph 视角</Badge>
            <h4 className="mt-2 text-sm font-bold text-ink">再问：具体有哪些对象与事实？</h4>
            <Prose className="mt-2 text-[13px]">
              <ul>
                <li>节点：具体实体，如 <code>:Service &#123;serviceId: &quot;SVC-002&quot;&#125;</code>。</li>
                <li>边：具体事实，如 <code>(PaymentService)-[:CONNECTS_TO]-&gt;(PaymentDB)</code>。</li>
                <li>属性：serviceName、status、dbType、severity、version、observedAt。</li>
                <li>治理：唯一 ID、来源、置信度、有效期与权限标签。</li>
              </ul>
            </Prose>
            <p className="mt-2 text-[11.5px] leading-5 text-muted">图谱可以直接用 Cypher 回答「哪些系统依赖 PaymentService」，无需 LLM。</p>
          </Card>
          <Card className="p-4">
            <Badge tone="blue">GraphRAG 视角</Badge>
            <h4 className="mt-2 text-sm font-bold text-ink">最后问：如何形成有依据的答案？</h4>
            <Prose className="mt-2 text-[13px]">
              <ul>
                <li>问题：「支付服务故障会影响哪些系统？应该联系哪个团队？有哪些处理手册？」</li>
                <li>图检索：反向 CALLS → OrderService → CONTAINS → OrderSystem；OWNED_BY → PaymentTeam。</li>
                <li>文档检索：Runbook 原文、Incident 工单、架构文档 Chunk。</li>
                <li>融合与生成：绑定 evidence_id，输出答案与可点击引用。</li>
              </ul>
            </Prose>
            <p className="mt-2 text-[11.5px] leading-5 text-muted">第 6 章提供可逐步播放的完整交互演示（模拟数据）。</p>
          </Card>
        </div>
        <DataTable
          headers={["比较维度", "Ontology 视角", "Knowledge Graph 视角", "GraphRAG 视角"]}
          rows={[
            ["关注对象", "类型、属性、公理、约束", "具体实体、关系、属性、来源", "Query、Retriever、Context、Citation"],
            ["典型提问", "什么算 Service？允许谁拥有它？", "PaymentService 连接哪个库？谁调用它？", "故障影响哪些系统？依据是什么？"],
            ["输出形态", "OWL / SHACL / 领域模型", "可查询的图数据", "带引用的自然语言答案"],
            ["出错后果", "语义不一致、跨系统无法对齐", "错误事实进入影响分析", "幻觉、错误引用、越权泄漏"],
          ]}
          dense
        />
      </ChapterSection>

      <ChapterSection id="ch2-graph" title="交互式企业 IT 运维知识图谱">
        <Prose>
          <p>下图实现：节点拖动、按类型着色、点击节点查看属性与关联、点击边查看关系定义、缩放平移、节点搜索、按类型隐藏/显示、1/2/3 跳过滤、图例与重置视图。默认以 PaymentService 为中心；切换「遍历中心实体」可从任意节点重新计算跳数。</p>
        </Prose>
        <KnowledgeGraphExplorer />
        <Prose className="mt-4"><p>图谱节点清单（与上图数据完全一致）：</p></Prose>
        <DataTable
          headers={["实体名称", "类型", "唯一 ID", "关键属性（示例）", "距 PaymentService", "范围"]}
          rows={itopsEntities.map((e) => [
            <span className="font-medium text-ink">{e.name}</span>, e.type,
            <code className="font-mono text-[10.5px]">{e.id}</code>, e.properties,
            `${e.hop} 跳`, e.scope === "核心示例" ? <Badge tone="blue">核心</Badge> : <Badge tone="neutral">扩展演示</Badge>,
          ])}
          caption="跳数按无向邻接最短路径计算，仅用于演示过滤；生产图查询应区分关系方向与类型白名单。"
          dense
        />
        <Callout type="advice" title="为什么图中要有扩展节点">
          <p>只有 7 条核心事实时，以 PaymentService 为中心最多只能扩展 2 跳。加入 Business、Document、Chunk、Infrastructure 等扩展演示节点后，才能真实演示「跳数越大、噪声与权限风险越高」的工程现象。这些扩展事实在图中和表格中均被标记。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch2-answer" title="一次有依据的问答">
        <Prose>
          <p>用户问题：<strong>「PaymentService 故障会影响哪些系统？应该联系哪个团队？有哪些处理手册？」</strong></p>
          <p>一个合格的答案不是把三段文字拼起来，而是把每个结论绑定到可验证证据：</p>
        </Prose>
        <Card className="my-4 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">示例答案（静态对照，交互演示见第 6 章）</div>
          <Prose className="mt-2">
            <p>根据演示图谱，PaymentService 被 OrderService 调用，而 OrderService 属于 OrderSystem，因此故障会影响 <strong>OrderService 与 OrderSystem</strong> 相关链路 [E2][E3]；PaymentService 同时连接 PaymentDB，数据库连接相关操作也可能受影响 [E1]。责任团队为 <strong>PaymentTeam</strong> [E4]。可用处置资料包括 <strong>Runbook-001</strong>（支付服务故障处理手册）[E5][E6]，以及 Incident-001 的历史处置关联 [E8]。</p>
          </Prose>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["E1 · Neo4j CONNECTIONS_TO", "E2 · Neo4j CALLS", "E3 · Neo4j CONTAINS", "E4 · Neo4j OWNED_BY", "E5 · Neo4j DOCUMENTED_BY", "E6 · Runbook PDF p3", "E8 · Incident-001 RESOLVED_BY"].map((e) => <Badge key={e} tone="cyan">{e}</Badge>)}
          </div>
        </Card>
        <DataTable
          headers={["结论片段", "必须绑定的证据", "若缺少证据会怎样"]}
          rows={[
            ["影响 OrderSystem", "CALLS + CONTAINS 两条图事实及来源", "只能说「资料未覆盖」，不能凭常识推断调用链"],
            ["联系 PaymentTeam", "OWNED_BY 关系 + 值班表更新时间", "可能给出已解散或轮值错误的团队"],
            ["使用 Runbook-001", "DOCUMENTED_BY / RESOLVED_BY + 文档版本与页码", "可能引用过期手册或错误机型/环境"],
          ]}
          dense
        />
        <Callout type="warning" title="图谱质量决定 GraphRAG 上限">
          <p>如果 CALLS 方向写反、PaymentService 被错误合并到同名旧服务、或 Runbook 版本已过期，检索与生成环节再精巧也只会给出「看起来很有依据」的错误答案。第 4、10 章会分别处理构建质量与评估门禁。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
