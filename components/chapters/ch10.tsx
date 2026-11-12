import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { CodeBlock } from "@/components/ui/code-block";
import { MetricsDashboard } from "@/components/viz/metrics-dashboard";
import { metricItems } from "@/data/metrics";
import { chapters } from "@/data/site";

const meta = chapters[9];

const datasetSteps = [
  ["1. 定义问题类型", "按意图分组：单文档问答、跨文档关联、多跳影响分析、证据不足拒答、越权用例。", "避免用一个总体分数掩盖某类问题退化"],
  ["2. 采样真实问题", "从值班记录、搜索日志与业务访谈中采样，脱敏后入库。", "问题分布要接近线上"],
  ["3. 标注标准证据", "标注必须出现的 Chunk / 图事实 ID，以及可接受的有效期与权限上下文。", "没有标准证据就算不出 Recall@K / Citation Accuracy"],
  ["4. 标注标准答案要点", "拆成可判定的要点（影响系统、团队、手册），而非一整段主观文本。", "支撑 Answer Completeness"],
  ["5. 构造反例", "故意注入冲突事实、过期事实、错误关系方向、无权文档与不存在实体。", "检验拒答、冲突处理与 ACL"],
  ["6. 划分集合", "按时间或文档切分 dev / test，避免同一文档同时出现在训练与测试。", "防止数据泄漏造成虚高指标"],
  ["7. 版本化与回归", "评估集随本体/Schema/Prompt/索引变更一起版本化，CI 中一键回归。", "每次改动可对比"],
];

export default function Chapter10() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">「回答看起来不错」不是指标。GraphRAG 必须分层评估：<strong>抽取质量 → 检索质量 → 回答质量 → 系统性能 → 权限安全</strong>，并用同一份评估集做回归。</p></Prose>

      <ChapterSection id="ch10-metrics" title="完整指标体系与定义" first>
        <DataTable
          headers={["分组", "指标", "定义", "关注点"]}
          rows={metricItems.map((m) => [
            <Badge key={`${m.name}-g`} tone={m.group === "抽取质量" ? "blue" : m.group === "检索质量" ? "cyan" : m.group === "回答质量" ? "purple" : m.group === "系统性能" ? "amber" : "rose"}>{m.group}</Badge>,
            m.name, m.definition, m.note,
          ])}
          dense
          caption="共 20 项演示指标，覆盖实体抽取 Precision/Recall/F1、关系抽取 Precision/Recall/F1、ER Accuracy、Validation Pass Rate、Recall@K、MRR/NDCG、Graph Path Accuracy、Faithfulness、Citation Accuracy、Completeness、ACL Leakage Rate、P50/P95、Cost per Query、Indexing Latency。"
        />
        <Callout type="advice" title="指标必须按问题类型分组">
          <p>总体 Faithfulness 达标不代表多跳影响分析问题达标。建议至少按「单文档 / 跨文档 / 多跳 / 证据不足 / 越权」五组分别报告，并对每组设置独立门禁。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch10-dashboard" title="交互式评估仪表盘（演示数据）">
        <Prose><p>切换标签查看雷达图、柱状图、趋势图与指标明细表；所有数值均可点击查看定义。</p></Prose>
        <MetricsDashboard />
      </ChapterSection>

      <ChapterSection id="ch10-dataset" title="评估数据集构建方法">
        <DataTable headers={["步骤", "做法", "为什么"]} rows={datasetSteps} dense />
        <Prose className="mt-4"><p>一条评估记录的建议结构（演示）：</p></Prose>
        <CodeBlock
          id="code-eval-dataset"
          title="evaluation/records/itops-001.json（示例结构）"
          language="json"
          code={`{
  "case_id": "ITOPS-001",
  "question": "PaymentService 故障会影响哪些系统？应该联系谁？有哪些处理手册？",
  "intent": ["impact_analysis", "owner_lookup", "document_lookup"],
  "expected_answer_points": ["OrderService", "OrderSystem", "PaymentTeam", "Runbook-001"],
  "expected_evidence_ids": ["E1", "E2", "E3", "E4", "E5", "E6"],
  "expected_graph_paths": ["Incident-001 -AFFECTS-> PaymentService <-CALLS- OrderService <-CONTAINS- OrderSystem"],
  "allowed_groups": ["it-ops"],
  "denied_evidence_ids": ["CHK-RESTRICTED-01"],
  "as_of": "2026-04-13T00:00:00Z",
  "dataset_version": "1.2.0"
}`}
          scope="数据结构示例；不含标注工具、抽样策略与评分脚本。"
          note="denied_evidence_ids 用于 ACL Leakage Rate；as_of 用于时态正确性检查。"
        />
        <Callout type="warning" title="不要只用模型自评">
          <p>用 LLM 给自己的答案打 Faithfulness 分数，容易与生成风格共谋。关键指标应由人工标注集与确定性校验共同支撑，模型判定最多作为辅助分桶工具。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch10-interpret" title="如何解读与避免误用指标">
        <Prose>
          <ul>
            <li><strong>Recall@K 高不代表答案好：</strong>只是证据进入了候选集，还要看 Context Fusion 是否裁剪错误、答案是否引用正确证据。</li>
            <li><strong>Faithfulness 与 Completeness 要一起看：</strong>只写一句有依据但信息不足的答案，前者会很高。</li>
            <li><strong>Citation Accuracy 必须校验「存在」与「支持」：</strong>引用 ID 存在但指向不支持该结论的 Chunk，仍然是错误引用。</li>
            <li><strong>ACL Leakage Rate 是上线门禁：</strong>演示仪表盘中的 0.4% 仅用于展示指标形态；生产门禁应为 0。</li>
            <li><strong>成本与延迟要按问题类型分层：</strong>多跳/Agentic 问题天然更贵，不能与简单文档问答混在一个平均值里。</li>
            <li><strong>图谱质量是上限：</strong>Entity Resolution Accuracy 与 Graph Path Accuracy 下降时，优先修数据，而不是调 Prompt。</li>
          </ul>
        </Prose>
        <Callout type="assumption" title="演示数据不是行业标准">
          <p>本章所有数值、目标阈值、趋势与成本单位均为<strong>演示数据或团队自定示例</strong>，不是行业基准、真实客户成绩或云厂商报价。上线前必须用企业自己的评估集重新设定门禁。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
