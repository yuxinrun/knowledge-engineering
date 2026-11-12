"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Flag, GanttChartSquare } from "lucide-react";
import { Badge, Button, Callout, Card } from "@/components/ui/primitives";
import { roadmapPhases } from "@/data/roadmap";
import { cn } from "@/lib/utils";

const TOTAL_WEEKS = 32;
const TICKS = [1, 5, 9, 13, 17, 21, 25, 29, 32];
const COLORS: Record<string, string> = {
  blue: "#3B82F6", cyan: "#06B6D4", purple: "#A855F7", green: "#10B981",
  amber: "#F59E0B", rose: "#EF4444", neutral: "#64748B",
};

export function RoadmapTimeline() {
  const [selected, setSelected] = useState(0);
  const phase = roadmapPhases[selected];
  const color = COLORS[phase.tone];

  return (
    <div className="my-5">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><GanttChartSquare className="h-3.5 w-3.5 text-brand" /> 八阶段实施路线图（点击阶段查看验收与门禁）</div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected((v) => Math.max(0, v - 1))} aria-label="上一阶段"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="font-mono text-[11px] text-muted">{selected + 1} / {roadmapPhases.length}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected((v) => Math.min(roadmapPhases.length - 1, v + 1))} aria-label="下一阶段"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px] p-3">
            <div className="grid grid-cols-[168px_1fr] items-center gap-2 border-b border-line pb-2 text-[10px] font-medium text-muted">
              <div>阶段 / 示例周次</div>
              <div className="relative h-4">
                {TICKS.map((w) => (
                  <span key={w} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((w - 1) / TOTAL_WEEKS) * 100}%` }}>W{w}</span>
                ))}
              </div>
            </div>
            <div className="mt-2 space-y-1.5">
              {roadmapPhases.map((p, i) => (
                <div key={p.id} className="grid grid-cols-[168px_1fr] items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className={cn("truncate rounded-lg border px-2 py-1.5 text-left text-[11px] transition-colors", selected === i ? "border-brand/60 bg-brand/10 font-semibold text-ink" : "border-transparent text-muted hover:bg-elevated hover:text-ink")}
                  >
                    <span className="font-mono">{p.phase}</span> · {p.title}
                  </button>
                  <div className="relative h-8 rounded-lg border border-line/60 bg-elevated/40">
                    {TICKS.map((w) => <span key={w} className="absolute top-0 h-full border-l border-dashed border-line/70" style={{ left: `${((w - 1) / TOTAL_WEEKS) * 100}%` }} />)}
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-label={`查看 ${p.title}`}
                      className={cn("absolute top-1 h-6 rounded-md px-2 text-left text-[10px] font-medium text-white transition-all", selected === i ? "ring-2 ring-offset-1 ring-offset-[rgb(var(--canvas))]" : "opacity-85 hover:opacity-100")}
                      style={{
                        left: `${((p.startWeek - 1) / TOTAL_WEEKS) * 100}%`,
                        width: `${((p.endWeek - p.startWeek + 1) / TOTAL_WEEKS) * 100}%`,
                        background: COLORS[p.tone],
                        boxShadow: selected === i ? `0 0 0 2px ${COLORS[p.tone]}55` : undefined,
                      }}
                    >
                      W{p.startWeek}–W{p.endWeek}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-elevated/60 px-4 py-3">
          <span className="inline-flex h-6 items-center rounded-md px-2 font-mono text-[11px] font-bold text-white" style={{ background: color }}>{phase.phase}</span>
          <h4 className="text-sm font-bold text-ink">{phase.title}</h4>
          <Badge tone="neutral">W{phase.startWeek} – W{phase.endWeek}（估算）</Badge>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-lg border border-line bg-elevated/50 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand"><Flag className="h-3 w-3" /> 阶段目标</div>
            <p className="mt-1 text-[12.5px] leading-6 text-ink">{phase.goal}</p>
          </div>
          {[
            ["交付物", phase.deliverables], ["技术栈", phase.stack], ["验收标准", phase.acceptance], ["常见风险", phase.risks],
          ].map(([label, items]) => (
            <div key={label as string} className="rounded-lg border border-line bg-elevated/40 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label as string}</div>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[11.5px] leading-5 text-ink">
                {(items as string[]).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-lg border border-emerald-300/60 bg-emerald-50/60 p-3 dark:border-emerald-500/25 dark:bg-emerald-500/[0.06]">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">进入下一阶段的条件</div>
            <p className="mt-1 text-[12px] leading-6 text-ink">{phase.nextGate}</p>
          </div>
        </div>
      </Card>
      <Callout type="assumption" title="排期是规划估算，不是保证工期">
        <p>上表以 32 周、一个小型跨职能团队为假设进行阶段化排期，用于说明依赖关系与门禁，不代表任何真实项目工期或交付承诺。实际周期受数据质量、权限审批、团队规模与现有平台能力影响。</p>
      </Callout>
      <div className="hidden text-[10.5pt] leading-6 print:block">
        路线图（打印版）：{roadmapPhases.map((p) => `${p.phase} ${p.title}（W${p.startWeek}–W${p.endWeek}，验收：${p.acceptance[0]}）`).join("；")}。
      </div>
    </div>
  );
}
