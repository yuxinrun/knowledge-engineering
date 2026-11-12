"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Badge, Button, Callout, Card, Formula } from "@/components/ui/primitives";
import { erScoreWeights, erSteps } from "@/data/diagrams";
import { cn } from "@/lib/utils";

const WEIGHTS: Record<string, number> = Object.fromEntries(erScoreWeights.map((w) => [w.key, w.weight]));
const AUTO_MERGE = 0.9;
const REVIEW = 0.7;
const EXAMPLE = { id: 1, name: 0.92, context: 0.8, embedding: 0.94 };

export function EntityResolutionFlow() {
  const [active, setActive] = useState("er4");
  const [values, setValues] = useState<Record<string, number>>(EXAMPLE);
  const step = erSteps.find((s) => s.id === active) ?? erSteps[0];
  const total = useMemo(
    () => erScoreWeights.reduce((sum, w) => sum + w.weight * (values[w.key] ?? 0), 0),
    [values]
  );
  const decision = total >= AUTO_MERGE ? "自动合并（仍需审计日志）" : total >= REVIEW ? "进入人工审核" : "拒绝合并";
  const decisionTone = total >= AUTO_MERGE ? "green" : total >= REVIEW ? "amber" : "rose";

  return (
    <div>
      <Card className="my-5 overflow-hidden">
        <div className="border-b border-line bg-elevated/60 px-3 py-2 text-xs font-semibold text-ink">
          Entity Resolution 匹配流程（点击阶段查看方法、输出与风险）
        </div>
        <div className="flex flex-wrap items-center gap-1.5 p-3">
          {erSteps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                  active === s.id ? "border-brand/60 bg-brand/10 text-brand" : "border-line bg-surface text-muted hover:text-ink"
                )}
              >
                <span className="mr-1 font-mono">{i + 1}</span>{s.name}
              </button>
              {i < erSteps.length - 1 ? <ArrowRight className="h-3 w-3 shrink-0 text-muted" /> : null}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 border-t border-line p-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-2">
            <Badge tone="blue">阶段 {erSteps.indexOf(step) + 1}</Badge>
            <span className="text-sm font-semibold text-ink">{step.name}</span>
            <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[10.5px] text-cyan-600 dark:text-cyan-300">{step.method}</code>
          </div>
          <div className="rounded-lg border border-line bg-elevated/50 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">处理说明</div>
            <p className="mt-1 text-[12px] leading-6 text-ink">{step.detail}</p>
          </div>
          <div className="rounded-lg border border-line bg-elevated/50 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">主要风险</div>
            <p className="mt-1 text-[12px] leading-6 text-ink">{step.risk}</p>
          </div>
        </div>
      </Card>

      <Card className="my-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Sparkles className="h-3.5 w-3.5 text-brand" /> 示例评分计算器（可调相似度）</div>
          <Button variant="outline" size="sm" onClick={() => setValues({ id: 0, name: 0, context: 0, embedding: 0 })}>
            <RotateCcw className="h-3.5 w-3.5" /> 清零
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <Formula expression={"\\text{Entity Score} = 0.4 \\cdot S_{id} + 0.25 \\cdot S_{name} + 0.2 \\cdot S_{context} + 0.15 \\cdot S_{embedding}"} />
            <div className="space-y-3">
              {erScoreWeights.map((w) => (
                <div key={w.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="font-medium text-ink">{w.label} <span className="text-muted">× {w.weight}</span></span>
                    <span className="font-mono text-brand">{((values[w.key] ?? 0)).toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min={0} max={1} step={0.01}
                    value={values[w.key] ?? 0}
                    onChange={(e) => setValues((prev) => ({ ...prev, [w.key]: Number(e.target.value) }))}
                    aria-label={w.label}
                    className="h-1.5 w-full cursor-pointer accent-blue-600"
                  />
                  <div className="mt-0.5 text-[10px] text-muted">{w.hint} · 贡献 {((values[w.key] ?? 0) * WEIGHTS[w.key]).toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-elevated/60 p-4">
            <div className="text-[11px] font-medium text-muted">Entity Score（示例）</div>
            <div className="mt-1 text-4xl font-bold tracking-tight text-brand">{total.toFixed(3)}</div>
            <div className="mt-3"><Badge tone={decisionTone as "green" | "amber" | "rose"}>{decision}</Badge></div>
            <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-[11px] leading-5 text-muted">
              <div>自动合并阈值 ≥ {AUTO_MERGE.toFixed(2)}（演示值）</div>
              <div>人工审核区间 {REVIEW.toFixed(2)} ~ {AUTO_MERGE.toFixed(2)}（演示值）</div>
              <div>低于 {REVIEW.toFixed(2)} 拒绝合并</div>
            </div>
            <Button variant="subtle" size="sm" className="mt-4 w-full" onClick={() => setValues(EXAMPLE)}>载入示例候选</Button>
          </div>
        </div>
      </Card>
      <Callout type="assumption" title="权重与阈值必须由真实数据校准">
        <p>0.4 / 0.25 / 0.2 / 0.15 只是用于讲解打分结构的<strong>初始示例权重</strong>，0.90 / 0.70 也只是演示阈值，不是行业推荐值。生产环境应使用标注数据集拟合权重与阈值，并按实体类型分层评估误合并代价。</p>
      </Callout>
    </div>
  );
}
