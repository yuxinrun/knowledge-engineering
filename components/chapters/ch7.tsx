import { Badge, Callout, Card, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { ComparisonMatrix } from "@/components/viz/comparison-matrix";
import { RagComparisonDiagram } from "@/components/viz/diagram-wrappers";
import { DecisionMaker } from "@/components/viz/decision-maker";
import { decisionPrinciples } from "@/data/selection";
import { chapters } from "@/data/site";

const meta = chapters[6];

export default function Chapter7() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">技术选型的核心不是「哪个更先进」，而是<strong>问题类型、数据形态、治理能力与成本预算</strong>是否匹配。本章给出六类方案、十一个维度、一个完全透明的决策器和一组止损原则。</p></Prose>

      <ChapterSection id="ch7-matrix" title="六方案 × 十一维度对比矩阵" first>
        <Prose><p>点击下方方案标签可以显示/隐藏列；表格可横向滚动。六类方案分别是 Traditional RAG、GraphRAG、Agentic RAG、Knowledge Graph + RAG、纯知识图谱查询、Ontology + Knowledge Graph + GraphRAG。</p></Prose>
        <ComparisonMatrix />
        <Prose className="mt-3">
          <p>读表时注意：<strong>Agentic RAG</strong> 的优势在于多步规划与工具编排，代价是延迟、成本与可复现性；<strong>纯知识图谱查询</strong> 完全确定、可审计，但不提供自然语言解释；<strong>全栈组合</strong> 能力最完整，但本体演进与数据治理成本最高。</p>
        </Prose>
      </ChapterSection>

      <ChapterSection id="ch7-compare-diagram" title="Traditional RAG 与 GraphRAG 对比图">
        <Prose><p>左侧是文档检索单链路；右侧多了抽取建图、图检索、文档证据融合与证据校验。点击节点查看职责，点击连线查看数据流。</p></Prose>
        <RagComparisonDiagram />
        <DataTable
          headers={["观察角度", "Traditional RAG", "GraphRAG", "何时差异真正重要"]}
          rows={[
            ["数据准备", "解析 + 切分 + 索引", "额外需要抽取、消歧、融合、校验", "关系型问题占比高时"],
            ["检索路径", "1 路或 keyword+vector", "图 + vector + keyword 多路", "需要跨实体路径时"],
            ["延迟与成本", "较低", "较高", "SLA 与预算紧张时需权衡"],
            ["可解释性", "文档引用", "图路径 + 文档引用", "审计、故障诊断、影响分析"],
            ["失败模式", "漏检、语义漂移", "图噪声、错误路径、引用失配", "图谱质量不足时 GraphRAG 反而更差"],
          ]}
          dense
        />
      </ChapterSection>

      <ChapterSection id="ch7-decision" title="交互式选型决策器">
        <Prose><p>回答 11 个问题后点击「生成推荐架构」。决策器会输出推荐方案（A–E）、逐项评分明细、生效的覆盖规则、实施复杂度、推荐/不推荐组件、风险与架构图。修改答案后可重新计算。</p></Prose>
        <DecisionMaker />
      </ChapterSection>

      <ChapterSection id="ch7-principles" title="选型关键原则">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {decisionPrinciples.map((p, i) => (
            <Card key={p.title} className="p-4">
              <div className="flex items-center gap-2"><Badge tone="blue">{String(i + 1).padStart(2, "0")}</Badge><span className="text-[12.5px] font-semibold text-ink">{p.title}</span></div>
              <p className="mt-2 text-[12px] leading-6 text-muted">{p.body}</p>
            </Card>
          ))}
        </div>
        <Callout type="principle" title="五条必须写进架构决策记录的结论">
          <p>① 不是所有 RAG 都需要 GraphRAG；② 不是所有知识图谱都需要完整 OWL 本体；③ 不是所有企业都需要 Neo4j；④ 如果问题主要是文档语义检索，传统 RAG 通常更经济；⑤ 如果问题需要复杂关系、多跳路径与影响分析，知识图谱和 GraphRAG 才更有价值。</p>
        </Callout>
        <Callout type="warning" title="不要跳过基线">
          <p>直接上 GraphRAG 而没有 Traditional RAG 基线，就无法证明多出来的抽取、建图与维护成本带来了什么增量。建议先用同一评估集建立基线，再按问题类型分组比较 Recall@K、Faithfulness、Citation Accuracy 与 P95 延迟。</p>
        </Callout>
        <Callout type="advice" title="团队能力是硬约束">
          <p>若没有图建模、Cypher、运维与数据治理能力，即使问题适合图方案，也应先选择托管服务、缩小 PoC 范围或与平台团队合作。决策器会在「无图数据库维护能力」时自动降级方案并给出风险提示。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
