"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Cpu, Pause, Play, RotateCcw, ShieldAlert, Sparkles,
} from "lucide-react";
import { Badge, Button, Callout, Card, PanelTitle, StepBadge } from "@/components/ui/primitives";
import {
  AGENTIC_CITATIONS, AGENTIC_FINAL_ANSWER, AGENTIC_PRESETS, AGENTIC_STEPS,
  DEFAULT_AGENTIC_QUERY, planAgenticQuery, simulationNotice, type AgenticStep,
} from "@/data/v2-simulations";
import { cn } from "@/lib/utils";

type StepState = AgenticStep & { skipped?: boolean };

/** 确定性推演：依据输入问题替换规划、工具输出与最终答案，不调用任何模型。 */
function buildSteps(query: string): { steps: StepState[]; plan: ReturnType<typeof planAgenticQuery>; answer: { text: string; citations: string[] }[]; note: string } {
  const plan = planAgenticQuery(query);
  const simple = plan.complexity === "single";
  const metric = plan.intent.includes("口径");
  const asset = plan.intent.includes("设备");

  const steps: StepState[] = AGENTIC_STEPS.map((s) => ({ ...s }));
  steps[0].output = `意图 = ${plan.intent}；复杂度 = ${simple ? "simple（单跳可答）" : "complex（需多步取证）"}；策略 = ${plan.strategy}`;
  steps[1].output = simple
    ? `无需分解：${plan.subTasks[0].label}。单次检索即可，避免不必要的 Agent 迭代。`
    : plan.subTasks.map((t) => `${t.id} ${t.label}（${t.tool}）`).join(" ／ ");
  steps[1].reason = simple
    ? "Planner 判定该问题可由单个结构化事实回答；这正是应该坚持单次检索的场景。"
    : "每个子问题绑定一种检索策略与可验证的产出类型，避免用一个模糊查询覆盖全部。";
  steps[2].output = plan.subTasks[0]?.result ?? steps[2].output;
  steps[3].output = plan.subTasks.find((t) => t.tool === "vector_search")?.result
    ?? (simple ? "未触发：简单问题无需文档向量检索。" : "未命中额外的叙述性证据（模拟）。");
  steps[4].output = plan.subTasks.find((t) => t.tool === "business_api" || t.tool === "semantic_query" || t.tool === "document_search")?.result
    ?? (simple ? "未触发：无需查询历史 Incident / 业务 API。" : "本轮未获得额外业务系统证据（模拟）。");
  steps[6].output = simple
    ? "证据已覆盖唯一子任务，充分度 0.95 → 直接进入答案综合。"
    : metric
      ? "指标口径版本已取得，但业务方尚未确认「与可用性报表是否可比」；判定为需人工确认。"
      : steps[6].output;

  if (simple) {
    steps[7].skipped = true;
    steps[7].output = "未触发：证据充分，停止条件命中（无需第二轮检索）。";
    steps[7].reason = "迭代检索只在证据不足时启用；简单问题不应承担额外延迟与成本。";
  }

  const answer = simple
    ? [{ text: `${plan.subTasks[0].result} 这是单跳事实查询，使用单次受控检索即可，无需 Agentic RAG。`, citations: ["E1"] }]
    : metric
      ? [
          { text: "MTTR 的演示定义为从 acknowledged_at 到 recovered_at 的均值（MET-002 v2.0，不含 MTTD）。", citations: ["E1"] },
          { text: "Service Availability 使用独立口径（MET-003 v3.1，按分钟探针，剔除维护窗口）。两者粒度与排除规则不同，不能直接比较。", citations: ["E2"] },
          { text: "待人工确认：业务方需明确「口径一致」是指定义一致还是数值可比；在没有审批结论前不给出合并结论。", citations: ["E3"] },
        ]
      : asset
        ? [
            { text: "Machine-001 当前为 Warning（模拟）：温度与振动趋势越过演示关注线，告警 MEV-001 已生成待审批工单 WO-001。", citations: ["E1", "E2"] },
            { text: "影响范围按资产层级：MCH-001 属于 LINE-01，LINE-01 属于 FAC-A；设备降载会影响该产线的演示吞吐。", citations: ["E3"] },
            { text: "历史维修记录显示 2026-02-11 曾更换轴承（模拟），可作为相似案例但不足以判定本次根因。", citations: ["E4"] },
            { text: "建议：降载运行并安排轴承检查；任何真实操作必须经过人工审批与安全验证。", citations: ["E5"] },
          ]
        : AGENTIC_FINAL_ANSWER.map((a) => ({ text: a.text, citations: a.citations }));

  return {
    steps, plan, answer,
    note: simple ? "本次为简单问题：模拟器按停止条件跳过了迭代检索，说明「不启用 Agent」也是一种正确决策。"
      : metric ? "本次为指标口径核对：数值类问题走语义查询工具，不自由拼 SQL。"
        : asset ? "本次为设备状态分析：使用统一 Manufacturing 资产 ID 与关系方向。"
          : "本次为默认 IT 故障调查：完整 10 步轨迹（含证据不足触发的第二轮检索）。",
  };
}

export function AgenticRagSimulator() {
  const [query, setQuery] = useState(DEFAULT_AGENTIC_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_AGENTIC_QUERY);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [openCitation, setOpenCitation] = useState<string | null>(null);

  const built = useMemo(() => buildSteps(activeQuery), [activeQuery]);
  const steps = built.steps;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCursor((c) => {
        if (c >= steps.length - 1) { setPlaying(false); setShowAnswer(true); return c; }
        setSelected(c + 1);
        return c + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const run = useCallback(() => {
    setActiveQuery(query.trim() || DEFAULT_AGENTIC_QUERY);
    setCursor(0);
    setSelected(0);
    setPlaying(false);
    setShowAnswer(false);
    setOpenCitation(null);
  }, [query]);

  const step = steps[selected];
  const totalLatency = steps.slice(0, cursor + 1).filter((s) => !s.skipped).reduce((a, s) => a + s.latencyMs, 0);
  const totalTokens = steps.slice(0, cursor + 1).filter((s) => !s.skipped).reduce((a, s) => a + s.tokens, 0);

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Cpu className="h-4 w-4 text-brand" />} right={<Badge tone="amber">模拟执行</Badge>}>
        Agentic RAG 流程模拟器
      </PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">模拟模式声明：</strong>{simulationNotice}。输入相同的问题必然得到相同的轨迹；规划由关键词规则确定，不是模型推理结果。
        </div>

        <div className="mt-4">
          <label htmlFor="agentic-query" className="mb-1.5 block text-[11px] font-semibold text-ink">输入一个复杂问题</label>
          <textarea
            id="agentic-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
            className="w-full resize-y rounded-xl border border-line bg-elevated/50 px-3 py-2.5 text-[12.5px] leading-6 text-ink outline-none focus:border-brand/60"
            placeholder="例如：PaymentService 最近故障的原因是什么？影响哪些业务？是否存在类似历史故障？"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AGENTIC_PRESETS.map((p) => (
              <button key={p.id} type="button" onClick={() => { setQuery(p.query); setActiveQuery(p.query); setCursor(0); setSelected(0); setShowAnswer(false); setPlaying(false); }} className={cn("rounded-lg border px-2 py-1 text-[10.5px] transition-colors", activeQuery === p.query && query === p.query ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={run}><Sparkles className="h-3.5 w-3.5" /> 生成执行计划</Button>
            <Button size="sm" variant="outline" onClick={() => { setPlaying((v) => !v); setShowAnswer(false); }}>
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{playing ? "暂停" : "自动播放"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setCursor(0); setSelected(0); setPlaying(false); setShowAnswer(false); }}><RotateCcw className="h-3.5 w-3.5" /> 重置</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowAnswer(true)}>查看最终答案</Button>
            <span className="ml-auto font-mono text-[10px] text-muted">已执行 {cursor + 1}/{steps.length} 步 · 累计 {totalLatency} ms · {totalTokens} tokens（模拟）</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-line bg-elevated/40 p-3 sm:grid-cols-2">
          <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">意图 / 复杂度</div><div className="mt-1 text-[12px] font-medium text-ink">{built.plan.intent} · {built.plan.complexity}</div></div>
          <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">检索策略</div><div className="mt-1 text-[11.5px] leading-5 text-muted">{built.plan.strategy}</div></div>
          <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">停止条件</div><div className="mt-1 text-[11.5px] leading-5 text-muted">{built.plan.stopRule}</div></div>
          <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">子任务</div><div className="mt-1 flex flex-wrap gap-1">{built.plan.subTasks.map((t) => <Badge key={t.id} tone="cyan">{t.id} · {t.tool}</Badge>)}</div></div>
        </div>
        <div className="mt-2 text-[11px] leading-5 text-muted">{built.note}</div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <div className="mb-2 text-[11px] font-semibold text-ink">执行轨迹（点击任一步查看输入 / 输出 / 执行理由）</div>
            <div className="max-h-[430px] space-y-1.5 overflow-y-auto pr-1">
              {steps.map((s, i) => {
                const reached = i <= cursor;
                const active = i === selected;
                return (
                  <button
                    key={s.no}
                    type="button"
                    onClick={() => { setSelected(i); if (i > cursor) setCursor(i); }}
                    className={cn("flex w-full items-start gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors", active ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated", s.skipped && "opacity-70")}
                  >
                    <StepBadge step={s.no} tone={s.skipped ? "green" : reached ? "cyan" : "blue"} />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[12px] font-semibold", active ? "text-brand" : "text-ink")}>{s.title}</span>
                      <span className="mt-0.5 block truncate text-[10.5px] text-muted">{s.phase} · {s.tool}</span>
                    </span>
                    {s.skipped ? <Badge tone="green">跳过</Badge> : s.status === "conditional" ? <CircleHelp className="h-3.5 w-3.5 shrink-0 text-accent" /> : s.status === "hitl" ? <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-500" /> : reached ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-leaf" /> : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={selected === 0} onClick={() => setSelected((v) => Math.max(0, v - 1))}><ChevronLeft className="h-3.5 w-3.5" /> 上一步</Button>
              <Button size="sm" variant="outline" disabled={selected === steps.length - 1} onClick={() => { setSelected((v) => Math.min(steps.length - 1, v + 1)); setCursor((c) => Math.max(c, selected + 1)); }}>下一步 <ChevronRight className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-ink">Step {step.no} 详情</div>
            <Card className="min-h-[430px] p-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="blue">{step.phase}</Badge>
                <Badge tone="neutral">{step.tool}</Badge>
                <Badge tone={step.status === "hitl" ? "rose" : step.status === "conditional" ? "amber" : "green"}>
                  {step.status === "hitl" ? "需人工确认" : step.status === "conditional" ? "条件分支" : step.skipped ? "未触发" : "已完成"}
                </Badge>
              </div>
              <div className="mt-3 space-y-3">
                {[
                  { label: "输入 Input", value: step.input },
                  { label: "输出 Output", value: step.output },
                  { label: "执行理由 Reason", value: step.reason },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{row.label}</div>
                    <p className="mt-1 whitespace-pre-wrap text-[12px] leading-6 text-ink">{row.value}</p>
                  </div>
                ))}
                {step.branchNote ? <Callout type="note" title="分支说明"><p>{step.branchNote}</p></Callout> : null}
                <div className="grid grid-cols-2 gap-2 border-t border-line pt-3 text-[11px] text-muted">
                  <div><span className="font-semibold text-ink">证据：</span>{step.evidence.join(" / ")}</div>
                  <div><span className="font-semibold text-ink">耗时 / Token：</span>{step.latencyMs} ms / {step.tokens}（模拟）</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {showAnswer ? (
          <div className="mt-5 rounded-xl border border-brand/30 bg-brand/[0.05] p-4">
            <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink"><Sparkles className="h-4 w-4 text-brand" /> 最终答案（带引用）</div>
            <div className="mt-3 space-y-2.5">
              {built.answer.map((a, i) => (
                <p key={i} className="text-[12.5px] leading-7 text-ink">
                  {a.text}{" "}
                  {a.citations.map((c) => <button key={c} type="button" onClick={() => setOpenCitation(openCitation === c ? null : c)} className="mx-0.5 inline-flex rounded border border-brand/40 bg-brand/10 px-1 font-mono text-[10px] text-brand hover:bg-brand/20">[{c}]</button>)}
                </p>
              ))}
            </div>
            {openCitation ? (
              <div className="mt-3 rounded-lg border border-line bg-surface p-3 text-[11.5px] leading-6 text-muted">
                {(() => {
                  const c = AGENTIC_CITATIONS.find((x) => x.id === openCitation) ?? AGENTIC_CITATIONS[0];
                  return <><strong className="text-ink">[{c.id}] {c.text}</strong><br />来源：{c.source} · 审批状态：{c.status}</>;
                })()}
              </div>
            ) : null}
            <div className="mt-3 border-t border-line pt-3 text-[11.5px] leading-6 text-muted">
              <strong className="text-ink">不确定性与待人工确认事项：</strong>变更 CHK-001 与事件仅存在时间关联，不能判定因果；部分证据审批状态为 Pending；DOC-001 尚未完成审核；任何处置动作需值班经理审批。
            </div>
            <div className="mt-2 text-[10.5px] font-mono text-muted">{simulationNotice}</div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
