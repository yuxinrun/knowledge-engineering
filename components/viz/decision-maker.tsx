"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Calculator, Check, RefreshCw, Sparkles } from "lucide-react";
import { Badge, Button, Callout, Card } from "@/components/ui/primitives";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { decisionQuestions, overrideRules, recommendations, scoreBands, type Recommendation } from "@/data/decision";
import { cn } from "@/lib/utils";

const DEFAULTS: Record<string, string> = {
  dataShape: "mixed", relations: "medium", crossSystem: "yes", multiHop: "sometimes",
  rules: "some", nlq: "yes", evidence: "exact", acl: "strict", volume: "medium", team: "no", crossDoc: "yes",
};

interface DecisionResult {
  score: number;
  id: Recommendation["id"];
  breakdown: { label: string; points: number; reason: string }[];
  appliedRules: string[];
  warnings: string[];
}

function evaluate(answers: Record<string, string>): DecisionResult {
  const breakdown = decisionQuestions.map((q) => {
    const option = q.options.find((o) => o.value === answers[q.id]) ?? q.options[0];
    return { label: q.title, points: option.points, reason: option.reason ?? "该项不增加复杂度分值" };
  });
  const score = breakdown.reduce((sum, item) => sum + item.points, 0);
  let id: Recommendation["id"] = score <= 4 ? "A" : score <= 8 ? "B" : score <= 12 ? "C" : "D";
  const appliedRules: string[] = [];
  const warnings: string[] = [];

  if (answers.nlq === "no" && (answers.dataShape !== "docs" || answers.multiHop !== "no" || answers.relations !== "simple")) {
    id = "E";
    appliedRules.push("r1");
  }
  if (answers.multiHop === "core" && (id === "A" || id === "B")) {
    id = "C";
    appliedRules.push("r2");
  }
  if (id === "D" && answers.team === "no") {
    id = "C";
    appliedRules.push("r3");
    warnings.push("原分值落在 D 区间，但团队缺少图数据库维护能力，按透明规则降级为 C；建议先补平台能力或缩小 PoC 范围。");
  }
  if (answers.evidence === "exact") appliedRules.push("r4");
  if (answers.acl === "strict") appliedRules.push("r5");
  if (answers.volume === "large") {
    appliedRules.push("r6");
    warnings.push("大规模高频更新意味着增量更新、时态知识与索引/图谱对账是必做项，不是可选项。");
  }
  if (answers.crossDoc === "yes") warnings.push("跨文档关联同一实体需要 Alias 表、Entity Resolution 与可回滚的合并审计。");
  return { score, id, breakdown, appliedRules, warnings };
}

export function DecisionMaker() {
  const [answers, setAnswers] = useState<Record<string, string>>(DEFAULTS);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [dirty, setDirty] = useState(false);

  const change = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setDirty(true);
  };
  const generate = () => { setResult(evaluate(answers)); setDirty(false); };
  const rec = result ? recommendations[result.id] : null;
  const band = result ? scoreBands.find((b) => result.score >= b.min && result.score <= b.max) : null;

  const flow = useMemo(() => {
    if (!rec) return { nodes: [], edges: [] };
    const nodes = rec.flow.map((label, i) => ({
      id: `flow-${i}`, label,
      kind: i === 0 ? "source" : i === rec.flow.length - 1 ? "app" : "process",
      position: { x: i * 215, y: 0 },
      description: `推荐架构「${rec.title}」的第 ${i + 1} 个环节：${label}`,
    }));
    const edges = rec.flow.slice(0, -1).map((_, i) => ({
      id: `flow-e${i}`, source: `flow-${i}`, target: `flow-${i + 1}`, kind: "process", animated: true,
      description: "数据流：上一环节产物进入下一环节",
    }));
    return { nodes, edges };
  }, [rec]);

  return (
    <div className="my-5">
      <Callout type="principle" title="规则透明，不是 AI 自动判断">
        <p>本决策器使用<strong>固定分值 + 区间映射 + 6 条覆盖规则</strong>，所有权重与规则都在下方公开可查。结果只反映你选择的输入条件，不代表自动智能判断，也不构成采购建议。</p>
      </Callout>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Calculator className="h-3.5 w-3.5 text-brand" /> 企业技术选型问卷（{decisionQuestions.length} 项）</div>
          <Button variant="outline" size="sm" onClick={() => { setAnswers(DEFAULTS); setDirty(true); }}><RefreshCw className="h-3.5 w-3.5" /> 恢复默认</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
          {decisionQuestions.map((q) => (
            <div key={q.id} className="rounded-xl border border-line bg-elevated/30 p-3">
              <div className="text-[12px] font-semibold text-ink">{q.title}</div>
              <div className="mt-0.5 text-[10.5px] leading-5 text-muted">{q.hint}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.options.map((o) => {
                  const active = answers[q.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => change(q.id, o.value)}
                      aria-pressed={active}
                      className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors", active ? "border-brand/60 bg-brand/10 font-semibold text-ink" : "border-line bg-surface text-muted hover:text-ink")}
                    >
                      {active ? <Check className="h-3 w-3 text-brand" /> : null}
                      {o.label}
                      <span className="font-mono text-[9.5px] text-muted">+{o.points}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line bg-elevated/50 px-4 py-3">
          <Button onClick={generate} size="lg"><Sparkles className="h-4 w-4" /> {result ? "重新生成推荐架构" : "生成推荐架构"}</Button>
          {dirty && result ? <span className="inline-flex items-center gap-1.5 text-[11.5px] text-amber-600 dark:text-amber-300"><AlertCircle className="h-3.5 w-3.5" /> 答案已修改，请重新生成</span> : null}
          <span className="text-[10.5px] text-muted">分值区间：0~4=A · 5~8=B · 9~12=C · ≥13=D；另有 6 条覆盖规则。</span>
        </div>
      </Card>

      {result && rec ? (
        <div className="mt-4 space-y-4">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-gradient-to-r from-brand/10 to-cyan-500/10 px-4 py-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">推荐架构 · 方案 {result.id}</div>
                <h4 className="mt-0.5 text-lg font-bold text-ink">{rec.title}</h4>
                <p className="text-[11.5px] text-muted">{rec.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-brand">{result.score}<span className="text-xs text-muted"> 分</span></div>
                <div className="text-[10.5px] text-muted">原始区间 {band?.label} → 方案 {result.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">实施复杂度</div>
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => <span key={n} className={cn("h-2.5 w-6 rounded-sm", n <= rec.complexity ? "bg-brand" : "bg-elevated")} />)}
                </div>
                <div className="mt-1 text-[11px] text-muted">{rec.complexity} / 5 · 运行成本 {rec.cost}</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">推荐组件</div>
                <ul className="mt-1 space-y-0.5 text-[11px] leading-5 text-ink">{rec.components.map((c) => <li key={c}>· {c}</li>)}</ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">不推荐的技术</div>
                <ul className="mt-1 space-y-0.5 text-[11px] leading-5 text-muted">{rec.notRecommended.map((c) => <li key={c}>· {c}</li>)}</ul>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">主要风险</div>
                <ul className="mt-1 space-y-0.5 text-[11px] leading-5 text-amber-700 dark:text-amber-300">{rec.risks.map((c) => <li key={c}>· {c}</li>)}</ul>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="mb-2 text-xs font-semibold text-ink">推荐架构图（节点可拖动 / 点击查看说明）</div>
            <FlowCanvas
              nodes={flow.nodes}
              edges={flow.edges}
              height={210}
              minimap={false}
              showDetails
              caption={`方案 ${result.id} 的组件链路：${rec.flow.join(" → ")}`}
            />
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="p-4">
              <div className="mb-2 text-xs font-semibold text-ink">逐项评分明细（可解释）</div>
              <div className="space-y-1.5">
                {result.breakdown.map((b) => (
                  <div key={b.label} className="flex items-start justify-between gap-2 rounded-lg border border-line bg-elevated/40 px-2.5 py-1.5">
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-medium text-ink">{b.label}</div>
                      <div className="text-[10px] leading-4 text-muted">{b.reason}</div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] font-semibold text-brand">+{b.points}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-line pt-2 text-xs font-semibold text-ink"><span>合计</span><span className="font-mono text-brand">{result.score} 分</span></div>
            </Card>
            <Card className="p-4">
              <div className="mb-2 text-xs font-semibold text-ink">选型原因与生效规则</div>
              <div className="space-y-2">
                <div className="rounded-lg border border-brand/30 bg-brand/[0.05] p-2.5 text-[11.5px] leading-6 text-ink"><strong>基础理由：</strong>{rec.baseReason}</div>
                {result.appliedRules.map((ruleId) => {
                  const rule = overrideRules.find((r) => r.id === ruleId);
                  if (!rule) return null;
                  return (
                    <div key={ruleId} className="rounded-lg border border-line bg-elevated/40 p-2.5 text-[11px] leading-5">
                      <div className="font-semibold text-ink"><Badge tone="purple">{ruleId.toUpperCase()}</Badge> {rule.effect}</div>
                      <div className="mt-1 text-muted">条件：{rule.condition}。理由：{rule.reason}</div>
                    </div>
                  );
                })}
                {result.warnings.map((w, i) => (
                  <div key={i} className="flex gap-2 rounded-lg border border-amber-300/60 bg-amber-50/60 p-2.5 text-[11px] leading-5 text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/[0.07] dark:text-amber-200">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{w}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      <details className="mt-4 rounded-xl border border-line bg-surface p-3">
        <summary className="cursor-pointer text-xs font-semibold text-ink">查看完整规则逻辑（分值区间 + 覆盖规则）</summary>
        <div className="mt-3 space-y-2">
          <div className="text-[11px] font-semibold text-ink">分值区间映射</div>
          <div className="flex flex-wrap gap-2">
            {scoreBands.map((b) => <Badge key={b.id} tone="blue">{b.label} → 方案 {b.id}：{recommendations[b.id].title}</Badge>)}
          </div>
          <div className="mt-3 text-[11px] font-semibold text-ink">覆盖规则</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[11px]">
              <thead className="bg-elevated text-[10px] uppercase text-muted"><tr><th className="px-2 py-2">ID</th><th className="px-2 py-2">条件</th><th className="px-2 py-2">效果</th><th className="px-2 py-2">理由</th></tr></thead>
              <tbody>{overrideRules.map((r) => (
                <tr key={r.id} className="border-t border-line/60"><td className="px-2 py-2 font-mono text-brand">{r.id.toUpperCase()}</td><td className="px-2 py-2 text-ink">{r.condition}</td><td className="px-2 py-2 text-muted">{r.effect}</td><td className="px-2 py-2 text-muted">{r.reason}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <p className="text-[10.5px] leading-5 text-muted">问卷每个选项的分值直接显示在选项右侧；以上规则均在浏览器本地计算，不调用任何模型或后端服务。</p>
        </div>
      </details>
    </div>
  );
}
