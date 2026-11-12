import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { RoadmapTimeline } from "@/components/viz/roadmap-timeline";
import { deliverablesChecklist, roadmapPhases } from "@/data/roadmap";
import { chapters } from "@/data/site";

const meta = chapters[10];

const gates = [
  ["Phase 1 → 2", "问题可判定对错；数据源有 owner、ACL 与更新频率", "场景过大或数据无权访问", "缩小到单一业务线与单一系统"],
  ["Phase 2 → 3", "本体覆盖评估问题所需全部类型与关系；SHACL 能检出注入错误", "OWL 与属性图映射缺失", "先补齐映射与验证步骤"],
  ["Phase 3 → 4", "关键图路径人工核验通过；任意事实可回放来源", "自动合并不可回滚", "暂停扩展语料，先修治理链路"],
  ["Phase 4 → 5", "传统 RAG 基线指标可复现；文档检索无法回答的问题被明确记录", "没有基线，无法证明增量", "补建评估集与基线报告"],
  ["Phase 5 → 6", "多跳答案路径可复现，引用可点回证据", "多跳噪声或引用失配", "限制深度与关系白名单"],
  ["Phase 6 → 7", "回归可一键执行，关键指标达到团队自定门禁", "用演示数据当上线指标", "重建评估集并复测"],
  ["Phase 7 → 8", "越权用例 100% 拦截；故障注入可重放；运维责任明确", "图谱关联泄漏四层 ACL 未覆盖", "阻断上线，先修安全"],
];

export default function Chapter11() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />
      <Prose><p className="lead">路线图的目标不是「一次建完企业知识大脑」，而是让每个阶段都有<strong>可交付、可验收、可止损</strong>的成果。任何一个阶段的进入条件不满足，都应该停下而不是继续堆功能。</p></Prose>

      <ChapterSection id="ch11-phases" title="八阶段交互路线图" first>
        <Prose><p>点击甘特条或阶段名称，查看目标、交付物、技术栈、验收标准、常见风险与下一阶段进入条件。</p></Prose>
        <RoadmapTimeline />
      </ChapterSection>

      <ChapterSection id="ch11-timeline" title="示例排期与依赖关系">
        <DataTable
          headers={["阶段", "示例周次", "目标", "关键交付物", "进入条件（摘要）"]}
          rows={roadmapPhases.map((p) => [
            `${p.phase} ${p.title}`, `W${p.startWeek}–W${p.endWeek}`, p.goal,
            p.deliverables.slice(0, 2).join("；"), p.nextGate,
          ])}
          dense
        />
        <Prose className="mt-4">
          <p>阶段之间存在明确的依赖：<strong>本体范围</strong>决定抽取 Schema，<strong>图谱质量</strong>决定 GraphRAG 上限，<strong>传统 RAG 基线</strong>决定 GraphRAG 是否值得投入，<strong>安全与评估门禁</strong>决定能否上线。跳过中间阶段往往会在后期以返工形式付出更高成本。</p>
        </Prose>
        <Callout type="assumption" title="排期只是规划估算">
          <p>上表假设约 32 周、一个小型跨职能团队、数据源可获得且审批流程顺畅。它不是保证工期，也不代表任何真实项目计划；实际排期需按数据质量、团队规模、平台现状与合规流程重新估算。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="ch11-deliverables" title="交付物清单">
        <DataTable
          headers={["交付物", "建议责任人", "内容"]}
          rows={deliverablesChecklist.map((d) => [<span className="font-medium text-ink">{d.name}</span>, d.owner, d.desc])}
          dense
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {deliverablesChecklist.map((d) => <Badge key={d.name} tone="neutral">{d.name}</Badge>)}
        </div>
      </ChapterSection>

      <ChapterSection id="ch11-gates" title="阶段门禁与止损条件">
        <DataTable headers={["门禁", "通过条件", "典型失败信号", "止损动作"]} rows={gates} dense />
        <Prose className="mt-4">
          <p>建议设置三类止损线：</p>
          <ul>
            <li><strong>数据止损：</strong>抽取/消歧质量长期低于团队自定阈值，暂停扩量，回到标注与规则校准。</li>
            <li><strong>价值止损：</strong>GraphRAG 相对传统 RAG 基线在目标问题类型上没有可解释增量，停止扩大图链路。</li>
            <li><strong>安全止损：</strong>任何越权证据泄漏都视为阻断项，不进入试运行。</li>
          </ul>
        </Prose>
        <Callout type="advice" title="把路线图当作循环而不是一次性项目">
          <p>每接入一个新业务场景，都从 Phase 1（场景与数据盘点）重新开始一个小循环；本体、图谱、索引、Prompt 与评估集一起版本化演进，避免「大版本一次性重构」。</p>
        </Callout>
      </ChapterSection>
    </>
  );
}
