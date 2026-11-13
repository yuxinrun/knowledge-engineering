"use client";

import { useMemo, useState } from "react";
import { Database, Layers3, LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, PanelTitle, StepBadge } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/code-block";
import { semanticEntities, semanticMetrics, simulationNotice, type SemanticMetric } from "@/data/v2-model";
import { cn } from "@/lib/utils";

const CHAIN_STEPS = ["业务术语", "语义定义", "指标定义", "数据映射", "查询接口", "AI 理解", "业务答案"];

/** 企业实例 ID → 语义层业务实体（用于双向关联跳转）。 */
function entityForInstanceId(id: string): string {
  if (id.startsWith("INC")) return "SEM-INCIDENT";
  if (id.startsWith("SVC")) return "SEM-SERVICE";
  if (id.startsWith("SYS")) return "SEM-SYSTEM";
  if (id.startsWith("TEAM")) return "SEM-TEAM";
  if (id.startsWith("ENV")) return "SEM-ENV";
  if (id.startsWith("BIZ")) return "SEM-PROCESS";
  return semanticEntities[0].id;
}

function chainDetail(step: number, metric: SemanticMetric): string {
  return [
    `${metric.name}｜${metric.cn}：由 ${metric.owner} 登记并审批的演示业务术语。`,
    metric.businessDefinition,
    `公式：${metric.formula}；粒度：${metric.grain}；版本：${metric.version}。`,
    `物理映射：${metric.physicalMapping}；来源表：${metric.sourceTable}；字段：${metric.sourceField}。`,
    `Semantic Query 接收业务概念 + 维度 + subject，翻译为受权限约束的查询；权限：${metric.permission}。`,
    "AI 按业务概念提问，不得绕过语义层直接拼物理字段；答案必须携带口径版本。",
    `业务答案 = 数值 + 单位 + 口径版本（${metric.version}）+ 数据更新时间（${metric.updatedAt}）+ 引用 + 权限说明。`,
  ][step];
}

export function SemanticModelExplorer() {
  const [tab, setTab] = useState<"metrics" | "entities">("metrics");
  const [metricId, setMetricId] = useState(semanticMetrics[0].id);
  const [entityId, setEntityId] = useState(semanticEntities[0].id);
  const [chainStep, setChainStep] = useState(3);
  const [section, setSection] = useState<"definition" | "mapping" | "governance">("definition");

  const metric = useMemo(() => semanticMetrics.find((m) => m.id === metricId) ?? semanticMetrics[0], [metricId]);
  const entity = useMemo(() => semanticEntities.find((e) => e.id === entityId) ?? semanticEntities[0], [entityId]);

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Layers3 className="h-4 w-4 text-brand" />} right={<Badge tone="amber">演示定义</Badge>}>Enterprise Semantic Model Explorer</PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">指标口径声明：</strong>下列 5 个指标均为本站<strong>演示定义</strong>，不是任何真实企业的标准口径或行业基准；表名字段、公式与阈值均为教学示例。{simulationNotice}。
        </div>

        <div className="mt-4 flex gap-1.5">
          <Button size="sm" variant={tab === "metrics" ? "default" : "outline"} onClick={() => setTab("metrics")}>业务指标（{semanticMetrics.length}）</Button>
          <Button size="sm" variant={tab === "entities" ? "default" : "outline"} onClick={() => setTab("entities")}>业务实体（{semanticEntities.length}）</Button>
        </div>

        {tab === "metrics" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-1.5">
              {semanticMetrics.map((m) => (
                <button key={m.id} type="button" onClick={() => { setMetricId(m.id); setChainStep(3); }} className={cn("w-full rounded-xl border px-3 py-2.5 text-left transition-colors", metricId === m.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
                  <div className={cn("text-[12px] font-semibold", metricId === m.id ? "text-brand" : "text-ink")}>{m.name}</div>
                  <div className="mt-0.5 text-[10.5px] text-muted">{m.cn} · {m.version}</div>
                </button>
              ))}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="blue">{metric.id}</Badge>
                <Badge tone="neutral">{metric.version}</Badge>
                <Badge tone="amber">演示定义</Badge>
                <Badge tone="neutral">Owner: {metric.owner}</Badge>
              </div>
              <h3 className="mt-2 text-[16px] font-bold text-ink">{metric.name} · {metric.cn}</h3>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {([
                  ["definition", "业务定义"], ["mapping", "数据映射链路"], ["governance", "权限与版本"],
                ] as const).map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setSection(key)} className={cn("rounded-lg border px-2.5 py-1 text-[11px] transition-colors", section === key ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{label}</button>
                ))}
              </div>

              {section === "definition" ? (
                <div className="mt-3 space-y-3">
                  <Card className="p-3.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">业务定义 Business Definition</div>
                    <p className="mt-1.5 text-[12.5px] leading-7 text-ink">{metric.businessDefinition}</p>
                  </Card>
                  <CodeBlock title={`${metric.name} · 计算公式（演示）`} language="sql" code={metric.formula} note="公式与字段均为教学演示定义，不是任何真实企业的标准口径。" />
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Card className="p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">维度 Dimensions</div><div className="mt-2 flex flex-wrap gap-1">{metric.dimensions.map((x) => <Badge key={x} tone="cyan">{x}</Badge>)}</div></Card>
                    <Card className="p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">度量 Measures / Grain</div><div className="mt-2 flex flex-wrap gap-1">{metric.measures.map((x) => <Badge key={x} tone="purple">{x}</Badge>)}</div><div className="mt-2 text-[11px] text-muted">粒度：{metric.grain}</div></Card>
                  </div>
                  <Card className="p-3.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">业务规则 Business Rules</div>
                    <ul className="mt-2 space-y-1 text-[11.5px] leading-6 text-muted">{metric.businessRules.map((r, i) => <li key={i} className="flex gap-2"><span className="text-brand">•</span>{r}</li>)}</ul>
                  </Card>
                </div>
              ) : null}

              {section === "mapping" ? (
                <div className="mt-3">
                  <div className="text-[11.5px] font-semibold text-ink">从业务定义到物理数据的映射链路（点击任一段）</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {CHAIN_STEPS.map((s, i) => (
                      <button key={s} type="button" onClick={() => setChainStep(i)} className={cn("flex items-center gap-1 rounded-lg border px-2 py-1 text-[10.5px] transition-colors", chainStep === i ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
                        <StepBadge step={i + 1} tone="blue" />{s}
                      </button>
                    ))}
                  </div>
                  <Card className="mt-3 p-3.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">阶段 {chainStep + 1} / 7 · {CHAIN_STEPS[chainStep]}</div>
                    <p className="mt-1.5 text-[12px] leading-7 text-ink">{chainDetail(chainStep, metric)}</p>
                  </Card>
                  <CodeBlock title="物理映射（演示）" language="sql" code={`-- ${metric.name} (${metric.id}, ${metric.version})\n-- 业务定义: ${metric.businessDefinition.slice(0, 40)}…\nSELECT ${metric.measures[0]}\nFROM ${metric.sourceTable}\n-- fields: ${metric.sourceField}\n-- mapping: ${metric.physicalMapping}\n-- policy: ${metric.permission}\nWHERE valid_time BETWEEN :from AND :to\n  AND subject_has_access(:subject, classification)`} note="示意 SQL，不对应任何真实数据库；权限过滤必须由语义层强制执行。" />
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Card className="p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted"><Database className="mr-1 inline h-3 w-3" />数据来源</div><div className="mt-1 font-mono text-[11px] text-ink">{metric.sourceTable}</div><div className="mt-1 text-[10.5px] leading-5 text-muted">{metric.sourceField}</div></Card>
                    <Card className="p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">关联业务实体（点击切换）</div><div className="mt-1.5 flex flex-wrap gap-1">{metric.entities.map((id) => <button key={id} type="button" onClick={() => { setEntityId(entityForInstanceId(id)); setTab("entities"); }} className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-brand hover:bg-brand/10">{id}</button>)}</div></Card>
                  </div>
                </div>
              ) : null}

              {section === "governance" ? (
                <div className="mt-3 space-y-2.5">
                  <Card className="p-3.5"><div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink"><LockKeyhole className="h-3.5 w-3.5 text-brand" /> 权限</div><p className="mt-1.5 font-mono text-[11.5px] text-muted">{metric.permission}</p></Card>
                  <Card className="p-3.5"><div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink"><ShieldCheck className="h-3.5 w-3.5 text-brand" /> 版本与更新时间</div><p className="mt-1.5 text-[11.5px] leading-6 text-muted">定义版本 {metric.version} · 数据更新时间 {metric.updatedAt}（模拟）· 口径变更需业务方审批并保留历史版本。</p></Card>
                  <Card className="border-accent/30 bg-accent/[0.06] p-3.5"><div className="text-[11px] font-semibold text-ink">演示定义边界</div><p className="mt-1.5 text-[11.5px] leading-6 text-muted">{metric.caveat}</p></Card>
                  <Card className="p-3.5"><div className="text-[11px] font-semibold text-ink">口径冲突提示</div><p className="mt-1.5 text-[11.5px] leading-6 text-muted">AI 不得绕过语义层直接拼物理 SQL。若不同报表的口径版本不一致，Semantic Query 应返回版本差异并转人工裁决，而不是自动选一个数字。</p></Card>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="space-y-1.5">
              {semanticEntities.map((e) => (
                <button key={e.id} type="button" onClick={() => setEntityId(e.id)} className={cn("w-full rounded-xl border px-3 py-2.5 text-left transition-colors", entityId === e.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
                  <div className={cn("text-[12px] font-semibold", entityId === e.id ? "text-brand" : "text-ink")}>{e.name}</div>
                  <div className="mt-0.5 text-[10.5px] text-muted">{e.cn} · {e.classification}</div>
                </button>
              ))}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5"><Badge tone="purple">{entity.id}</Badge><Badge tone="neutral">{entity.classification}</Badge></div>
              <h3 className="mt-2 text-[16px] font-bold text-ink">{entity.name} · {entity.cn}</h3>
              <Card className="mt-3 p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">语义定义</div><p className="mt-1.5 text-[12.5px] leading-7 text-ink">{entity.definition}</p><div className="mt-2 font-mono text-[11px] text-muted">业务主键：{entity.keys}</div></Card>
              <div className="mt-3 text-[11.5px] font-semibold text-ink">关联指标（点击返回指标详情）</div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {entity.relatedMetrics.map((id) => {
                  const m = semanticMetrics.find((x) => x.id === id);
                  if (!m) return null;
                  return (
                    <button key={id} type="button" onClick={() => { setMetricId(id); setTab("metrics"); setSection("definition"); }} className="rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-brand/50">
                      <div className="text-[12px] font-semibold text-ink">{m.name}</div>
                      <div className="mt-1 text-[10.5px] text-muted">{m.cn} · {m.version} · {m.grain}</div>
                      <div className="mt-1.5 truncate font-mono text-[10px] text-brand">{m.sourceTable}</div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 rounded-xl border border-line bg-elevated/40 p-3 text-[11px] leading-6 text-muted">业务实体定义属于语义层概念模型；它们与知识图谱中的实体实例（如 SVC-002 / INC-001）可以对齐，但不是同一层对象。</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
