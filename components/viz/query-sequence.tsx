"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { laneLabels, querySequence, type SequenceStep } from "@/data/diagrams";
import { cn } from "@/lib/utils";

const LANES: SequenceStep["lane"][] = ["user", "orchestrator", "retrieval", "llm"];
const laneColors: Record<SequenceStep["lane"], string> = {
  user: "#F59E0B", orchestrator: "#6366F1", retrieval: "#06B6D4", llm: "#A855F7",
};

export function QuerySequenceDiagram() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = querySequence[active];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((prev) => {
        if (prev >= querySequence.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="my-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">GraphRAG 查询时序流程（12 步）</div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => { setPlaying((v) => !v); }} disabled={active >= querySequence.length - 1 && !playing}>
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{playing ? "暂停" : "播放"}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActive((v) => Math.max(0, v - 1))} aria-label="上一步"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActive((v) => Math.min(querySequence.length - 1, v + 1))} aria-label="下一步"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setActive(0); setPlaying(false); }} aria-label="重置"><RotateCcw className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="sticky top-0 z-10 grid grid-cols-[36px_repeat(4,1fr)] border-b border-line bg-surface/95 px-3 py-2 backdrop-blur">
              <div className="text-[10px] font-semibold text-muted">#</div>
              {LANES.map((lane) => (
                <div key={lane} className="flex items-center gap-1.5 text-[10.5px] font-semibold text-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: laneColors[lane] }} />{laneLabels[lane]}
                </div>
              ))}
            </div>
            <div className="max-h-[460px] overflow-y-auto px-3 py-2">
              {querySequence.map((s, i) => (
                <div key={s.id} className="grid grid-cols-[36px_repeat(4,1fr)] items-center border-b border-line/50 py-1.5 last:border-b-0">
                  <div className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</div>
                  {LANES.map((lane) => (
                    <div key={lane} className="px-1">
                      {s.lane === lane ? (
                        <button
                          type="button"
                          onClick={() => { setActive(i); setPlaying(false); }}
                          className={cn(
                            "w-full rounded-lg border px-2 py-1.5 text-left text-[11px] font-medium transition-all",
                            active === i ? "border-brand/70 bg-brand/10 text-ink shadow-card" : "border-line bg-elevated/60 text-muted hover:text-ink"
                          )}
                          style={active === i ? { borderLeft: `3px solid ${laneColors[lane]}` } : undefined}
                        >
                          {s.title}
                        </button>
                      ) : <div className="h-[1px] bg-line/60" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card className="h-fit p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">Step {step.no} / 12 · {laneLabels[step.lane]}</div>
        <h4 className="mt-1 text-sm font-bold text-ink">{step.title}</h4>
        <div className="mt-3 space-y-2.5">
          {[["输入", step.input], ["输出", step.output], ["处理说明", step.detail]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-line bg-elevated/50 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{k}</div>
              <div className="mt-1 text-[11.5px] leading-5 text-ink">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge tone="blue">进度</Badge>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((active + 1) / querySequence.length) * 100}%` }} />
          </div>
          <span className="font-mono text-[10px] text-muted">{active + 1}/{querySequence.length}</span>
        </div>
      </Card>
      <div className="hidden text-[10.5pt] leading-6 print:block lg:col-span-2">
        查询流程（打印版）：用户问题 → Query Understanding → Intent Classification → Entity Linking → Graph Retrieval → Vector Retrieval → Keyword Retrieval → Hybrid Retrieval(RRF) → Context Fusion → Evidence Validation → LLM Answer → Citation / Source。
      </div>
    </div>
  );
}
