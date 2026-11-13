"use client";

import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { Activity, ChevronDown, GitBranch, ShieldCheck } from "lucide-react";
import { Badge, Card, PanelTitle, StepBadge } from "@/components/ui/primitives";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import type { DiagramEdge, DiagramNode, LegendItem } from "@/data/diagram-types";
import {
  governanceLifecycle, governanceQuestions, simulationNotice,
} from "@/data/v2-simulations";
import { lineageNodes as lineageData, qualityMetrics } from "@/data/v2-model";
import { cn } from "@/lib/utils";

const KIND_BY_STAGE: Record<string, string> = {
  Source: "source", Ingestion: "process", Extraction: "llm", "Entity Resolution": "concept",
  "Knowledge Fusion": "process", Publication: "graph", Indexing: "store", Consumption: "app",
};

function lineageDiagram() {
  const nodes: DiagramNode[] = lineageData.map((n, i) => ({
    id: `LN-${n.id}`, label: n.label, kind: KIND_BY_STAGE[n.stage] ?? "process",
    position: { x: (i % 4) * 250, y: Math.floor(i / 4) * 175 },
    sub: n.stage, description: n.description,
    details: [
      { label: "Source ID", value: n.sourceId }, { label: "Version", value: n.version },
      { label: "Created At", value: n.createdAt }, { label: "Updated At", value: n.updatedAt },
      { label: "Evidence", value: n.evidence }, { label: "Confidence", value: String(n.confidence) },
      { label: "Approval Status", value: n.approvalStatus }, { label: "Access Policy", value: n.accessPolicy },
    ],
  }));
  const edges: DiagramEdge[] = lineageData.slice(1).map((n, i) => ({
    id: `LNE-${i}`, source: `LN-${n.parent ?? lineageData[i].id}`, target: `LN-${n.id}`, label: "derived from",
  }));
  const legend: LegendItem[] = [
    { kind: "source", label: "Source" }, { kind: "process", label: "处理阶段" },
    { kind: "llm", label: "抽取" }, { kind: "concept", label: "规范实体" },
    { kind: "graph", label: "图记录" }, { kind: "store", label: "索引" }, { kind: "app", label: "生成答案" },
  ];
  return { nodes, edges, legend };
}

export function GovernanceExplorer() {
  const diagram = useMemo(lineageDiagram, []);
  const [selectedId, setSelectedId] = useState(lineageData[3].id);
  const selected = lineageData.find((n) => n.id === selectedId) ?? lineageData[0];

  const fields = [
    ["Source ID", selected.sourceId], ["Version", selected.version],
    ["Created At", selected.createdAt], ["Updated At", selected.updatedAt],
    ["Evidence", selected.evidence], ["Confidence", String(selected.confidence)],
    ["Approval Status", selected.approvalStatus], ["Access Policy", selected.accessPolicy],
  ];

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<GitBranch className="h-4 w-4 text-brand" />} right={<Badge tone="amber">模拟数据</Badge>}>Knowledge Governance Explorer · 知识血缘</PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">模拟模式声明：</strong>{simulationNotice}。血缘节点、版本、时间与置信度均为教学示例。点击图中节点或下方按钮查看八项治理字段。
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {lineageData.map((n, i) => (
            <button key={n.id} type="button" onClick={() => setSelectedId(n.id)} className={cn("flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10.5px] transition-colors", selectedId === n.id ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
              <StepBadge step={i + 1} tone="blue" />{n.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          <div data-print="hide">
            <FlowCanvas
              nodes={diagram.nodes} edges={diagram.edges} legend={diagram.legend} height={420}
              showDetails={false} minimap={false}
              onSelect={(sel) => { if (sel?.type === "node") { const id = sel.id.replace(/^LN-/, ""); if (lineageData.some((n) => n.id === id)) setSelectedId(id); } }}
              caption="Document → Chunk → Extracted Entity → Canonical Entity → Relationship → Graph Record → Search Index → Generated Answer"
            />
          </div>
          <div>
            <Card className="p-3.5">
              <div className="flex flex-wrap items-center gap-1.5"><Badge tone="blue">{selected.stage}</Badge><Badge tone={selected.approvalStatus === "Approved" ? "green" : "amber"}>{selected.approvalStatus}</Badge></div>
              <h3 className="mt-2 text-[14px] font-bold text-ink">{selected.label}</h3>
              <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{selected.description}</p>
              <div className="mt-3 border-t border-line pt-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">治理字段</div>
                <div className="space-y-1.5">
                  {fields.map(([label, value]) => (
                    <div key={label} className="flex items-start gap-2 text-[11px]">
                      <span className="w-[110px] shrink-0 text-muted">{label}</span>
                      <span className="min-w-0 break-all font-mono text-[10.5px] text-ink">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <div className="mt-3 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-3 text-[11px] leading-6 text-muted">
              <strong className="text-ink">LLM 置信度 ≠ 来源权威性。</strong>高置信度抽取结果也可能来自过期、未审批或错误的文档；本节点 Confidence={selected.confidence} 仅描述抽取过程。
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

const tooltipStyle = { background: "#0B1220", border: "1px solid #334155", borderRadius: 10, color: "#E2E8F0", fontSize: 11 };

export function QualityDashboard() {
  const [selected, setSelected] = useState(qualityMetrics[0].id);
  const [showTarget, setShowTarget] = useState(true);
  const metric = qualityMetrics.find((m) => m.id === selected) ?? qualityMetrics[0];
  const chartData = qualityMetrics.map((m) => ({ name: m.cn, value: m.value, target: m.target }));

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Activity className="h-4 w-4 text-brand" />} right={<Badge tone="amber">不是行业基准</Badge>}>知识质量评分仪表盘</PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">演示数据：</strong>下列 8 项数值与目标值均为教学示例，<strong>不是行业基准</strong>，不可用于对比任何真实系统。{simulationNotice}。
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setShowTarget((v) => !v)} className={cn("rounded-lg border px-2 py-1 text-[11px] transition-colors", showTarget ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
            {showTarget ? "隐藏目标线" : "显示目标值"}
          </button>
          <span className="ml-auto text-[10.5px] text-muted">点击柱状或下方指标查看定义与计算公式</span>
        </div>

        <Card className="mt-3 p-3">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 44 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "rgb(var(--muted))" }} angle={-28} textAnchor="end" interval={0} height={60} />
                <YAxis tick={{ fontSize: 10, fill: "rgb(var(--muted))" }} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="value" name="演示实测值" radius={[4, 4, 0, 0]} onClick={(data: unknown) => { const name = (data as { name?: string })?.name; const found = qualityMetrics.find((m) => m.cn === name); if (found) setSelected(found.id); }} cursor="pointer">
                  {chartData.map((_, i) => <Cell key={i} fill={qualityMetrics[i].direction === "lower" ? "#E2683C" : "#0E9F8A"} />)}
                </Bar>
                {showTarget ? <Bar dataKey="target" name="演示目标值" fill="#7C5CD6" radius={[4, 4, 0, 0]} /> : null}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {qualityMetrics.map((m) => (
            <button key={m.id} type="button" onClick={() => setSelected(m.id)} className={cn("rounded-xl border px-2.5 py-2 text-left transition-colors", selected === m.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
              <div className="truncate text-[10.5px] text-muted">{m.cn}</div>
              <div className={cn("mt-0.5 text-[16px] font-bold", m.direction === "lower" ? "text-accent" : "text-brand")}>{m.value}<span className="ml-0.5 text-[10px] font-normal">{m.unit}</span></div>
              <div className="text-[9.5px] text-muted">目标 {m.target}{m.unit} · {m.direction === "lower" ? "越低越好" : "越高越好"}</div>
            </button>
          ))}
        </div>

        <Card className="mt-3 p-3.5">
          <div className="flex flex-wrap items-center gap-1.5"><Badge tone="blue">{metric.id}</Badge><span className="text-[12.5px] font-semibold text-ink">{metric.name} · {metric.cn}</span></div>
          <p className="mt-2 text-[11.5px] leading-6 text-muted">{metric.definition}</p>
          <div className="mt-2 grid grid-cols-1 gap-1.5 text-[11px] text-muted sm:grid-cols-2">
            <div><span className="font-semibold text-ink">公式：</span><code className="font-mono text-[10.5px]">{metric.formula}</code></div>
            <div><span className="font-semibold text-ink">数据来源：</span>{metric.source}</div>
          </div>
        </Card>
        <div className="mt-2 text-[10.5px] leading-5 text-muted">方向说明：Duplicate Entity Rate 与 Stale Knowledge Rate 越低越好（橙色），其余越高越好（青绿）。目标值为演示假设。</div>
      </div>
    </Card>
  );
}

export function GovernanceLifecycleDetail() {
  const [open, setOpen] = useState(0);
  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<GitBranch className="h-4 w-4 text-brand" />} right={<Badge tone="neutral">12 阶段</Badge>}>知识治理生命周期（点击查看控制点）</PanelTitle>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
        <div className="space-y-1">
          {governanceLifecycle.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setOpen(i)} className={cn("flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[11.5px] transition-colors", open === i ? "border-brand/60 bg-brand/[0.08] font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
              <StepBadge step={i + 1} tone="blue" /><span className="flex-1">{s.label}</span><span className="font-mono text-[9.5px]">{s.id}</span>
            </button>
          ))}
        </div>
        <Card className="p-3.5">
          {(() => {
            const s = governanceLifecycle[open];
            return (
              <>
                <div className="flex items-center gap-1.5"><Badge tone="cyan">{s.id}</Badge><span className="text-[13px] font-semibold text-ink">{s.label} · {s.en}</span></div>
                <p className="mt-2 text-[12px] leading-6 text-muted">{s.detail}</p>
                <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-[11px] text-muted">
                  <div><span className="font-semibold text-ink">责任方：</span>{s.owner}</div>
                  <div><span className="font-semibold text-ink">关键控制点：</span>{s.control}</div>
                </div>
              </>
            );
          })()}
        </Card>
      </div>
    </Card>
  );
}

export function GovernanceQuestions() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<ShieldCheck className="h-4 w-4 text-brand" />} right={<Badge tone="neutral">10 个必答问题</Badge>}>知识可信度：治理必须能回答的问题</PanelTitle>
      <div className="space-y-1.5 p-4">
        {governanceQuestions.map((item, i) => (
          <div key={item.q} className="rounded-xl border border-line bg-surface">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
              <span className="text-[12.5px] font-semibold text-ink">{item.q}</span>
              <Badge tone="neutral" className="ml-auto shrink-0 font-mono">{item.field}</Badge>
              <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i ? <p className="border-t border-line px-3 py-2.5 text-[11.5px] leading-6 text-muted">{item.a}</p> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
