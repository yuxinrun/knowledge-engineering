"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronRight, CircleDashed, FlaskConical, Pause, Play, RotateCcw, Terminal } from "lucide-react";
import { Badge, Button, Callout, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const DEFAULT_QUESTION = "PaymentService 故障会影响哪些系统？应该联系谁？有哪些处理手册？";

const evidence: { id: string; kind: string; text: string; source: string }[] = [
  { id: "E1", kind: "图事实", text: "PaymentService —CONNECTS_TO→ PaymentDB", source: "Neo4j · fact FACT-F3 · 配置文档" },
  { id: "E2", kind: "图事实", text: "OrderService —CALLS→ PaymentService", source: "Neo4j · fact FACT-F2 · 链路追踪" },
  { id: "E3", kind: "图事实", text: "OrderSystem —CONTAINS→ OrderService", source: "Neo4j · fact FACT-F1 · CMDB" },
  { id: "E4", kind: "图事实", text: "PaymentService —OWNED_BY→ PaymentTeam", source: "Neo4j · fact FACT-F4 · 值班表" },
  { id: "E5", kind: "图事实", text: "PaymentService —DOCUMENTED_BY→ Runbook-001", source: "Neo4j · fact FACT-F7 · Runbook" },
  { id: "E6", kind: "文档证据", text: "“支付服务连接 PostgreSQL PaymentDB，故障时先检查连接池与数据库状态……”", source: "Azure AI Search · CHK-001 · 支付服务故障处理手册.pdf · p3" },
  { id: "E7", kind: "文档证据", text: "“INC-001：支付服务 P1 故障，已通知 PaymentTeam 值班……”", source: "Azure AI Search · CHK-002 · INC-001 工单 · p1" },
  { id: "E8", kind: "图事实", text: "Incident-001 —RESOLVED_BY→ Runbook-001", source: "Neo4j · fact FACT-F9 · 工单关联" },
];

const steps: { title: string; tag: string; body: ReactNode }[] = [
  {
    title: "Step 1 · 解析用户问题", tag: "Query Understanding",
    body: <p>识别为 <strong>3 个子意图</strong>：① 影响范围（多跳依赖）② 责任团队（实体属性关系）③ 处置手册（文档证据）。问题实体提及：<code>PaymentService</code>。</p>,
  },
  {
    title: "Step 2 · 识别 PaymentService", tag: "Entity Linking",
    body: <p>别名表命中「支付服务」，CMDB ID 精确匹配 <code>SVC-002</code>；示例匹配分数 <code>0.96</code>（模拟）。同时注入权限上下文 <code>allowed_groups = [it-ops]</code>。</p>,
  },
  {
    title: "Step 3 · 查询 Neo4j", tag: "Graph Retrieval",
    body: (
      <div>
        <p>执行参数化只读 Cypher，关系白名单 <code>CALLS / CONTAINS / CONNECTS_TO / OWNED_BY / DOCUMENTED_BY / RESOLVED_BY</code>，深度上限 2 跳。</p>
        <code className="mt-2 block overflow-x-auto rounded-lg border border-line bg-elevated p-2 font-mono text-[10.5px] leading-5 text-cyan-700 dark:text-cyan-300">
          MATCH path = (s:Service &#123;serviceId: $serviceId&#125;)-[:CALLS|CONTAINS|CONNECTS_TO|OWNED_BY|DOCUMENTED_BY*1..2]-(n) RETURN path LIMIT $limit
        </code>
      </div>
    ),
  },
  {
    title: "Step 4 · 发现关联实体与路径", tag: "Graph Traversal",
    body: (
      <div>
        <p>命中核心实体：<strong>PaymentDB、OrderService、OrderSystem、PaymentTeam</strong>，以及 Production、Runbook-001、Incident-001。</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          {["Incident-001", "PaymentService", "OrderService", "OrderSystem"].map((n, i) => (
            <span key={n} className="flex items-center gap-1.5">
              <span className="rounded-md border border-line bg-elevated px-2 py-1 font-mono">{n}</span>
              {i < 3 ? <ChevronRight className="h-3 w-3 text-muted" /> : null}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">路径方向：AFFECTS → 反向 CALLS → 反向 CONTAINS（2 跳）。</p>
      </div>
    ),
  },
  {
    title: "Step 5 · 检索 Azure AI Search 文档", tag: "Hybrid Retrieval",
    body: (
      <div className="space-y-1.5">
        <p>Keyword + Vector + ACL filter（<code>security_groups/any(g: g eq 'it-ops')</code>），RRF 融合后取 Top-3：</p>
        {[
          { id: "CHK-001", title: "支付服务故障处理手册.pdf · p3", score: "0.91" },
          { id: "CHK-002", title: "INC-001 工单 · p1", score: "0.84" },
          { id: "CHK-003", title: "支付系统架构评审 · p7", score: "0.77" },
        ].map((hit) => (
          <div key={hit.id} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-elevated/60 px-2.5 py-1.5 text-[11px]">
            <span className="font-mono text-cyan-700 dark:text-cyan-300">{hit.id}</span>
            <span className="min-w-0 flex-1 truncate text-ink">{hit.title}</span>
            <span className="font-mono text-muted">score {hit.score}</span>
          </div>
        ))}
        <p className="text-[10.5px] text-muted">分数为演示排名示意，不代表任何真实检索服务输出。</p>
      </div>
    ),
  },
  {
    title: "Step 6 · 融合图谱事实和文档证据", tag: "Context Fusion + Validation",
    body: (
      <div>
        <p>图事实 <strong>6 条</strong> + 文档证据 <strong>3 条</strong> → 去重、相关性裁剪、绑定 <code>evidence_id</code> → 二次 ACL 与时效性校验 → 保留 <strong>8 条</strong>可引用证据。</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {evidence.map((e) => <Badge key={e.id} tone={e.kind === "图事实" ? "cyan" : "purple"}>{e.id} · {e.kind}</Badge>)}
        </div>
      </div>
    ),
  },
  {
    title: "Step 7 · 生成带引用的回答", tag: "LLM Answer + Citation",
    body: <p>模型仅基于给定证据作答；输出后校验所有 <code>citation_id</code> 均属于本轮允许的证据集合，否则丢弃引用或拒答。</p>,
  },
];

function CitationChip({ id, active, onClick }: { id: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("mx-0.5 inline-flex h-5 items-center rounded border px-1 align-baseline font-mono text-[10px] transition-colors", active ? "border-brand bg-brand text-white" : "border-brand/40 bg-brand/10 text-brand hover:bg-brand/20")}
    >
      [{id}]
    </button>
  );
}

export function QueryFlowDemo() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [visible, setVisible] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [openEvidence, setOpenEvidence] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setVisible((v) => {
        if (v >= steps.length) { setPlaying(false); return v; }
        return v + 1;
      });
    }, 750);
    return () => window.clearInterval(timer);
  }, [playing]);

  const reset = () => { setVisible(0); setPlaying(false); setOpenEvidence(null); };
  const activeEvidence = evidence.find((e) => e.id === openEvidence);

  return (
    <div className="my-5">
      <Callout type="assumption" title="全流程为本地模拟数据">
        <p>下面的实体、图事实、检索分数、模型输出均为<strong>教学用模拟数据</strong>，页面不会调用 Azure OpenAI、Azure AI Search、Neo4j 或任何后端服务，也不代表实时企业状态。</p>
      </Callout>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Terminal className="h-3.5 w-3.5 text-brand" /> 交互式查询流程演示 <Badge tone="amber"><FlaskConical className="h-3 w-3" /> 模拟数据</Badge></div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setVisible((v) => Math.min(steps.length, v + 1))}>逐步执行</Button>
            <Button variant="default" size="sm" onClick={() => { if (visible >= steps.length) setVisible(0); setPlaying((v) => !v); }}>
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{playing ? "暂停" : "自动播放"}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset}><RotateCcw className="h-3.5 w-3.5" /> 重置</Button>
          </div>
        </div>
        <div className="border-b border-line p-3">
          <label htmlFor="demo-question" className="mb-1 block text-[11px] font-medium text-muted">用户问题（可修改，演示逻辑使用同一场景数据）</label>
          <textarea
            id="demo-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            className="w-full resize-y rounded-lg border border-line bg-surface px-3 py-2 text-[12.5px] leading-6 text-ink outline-none focus:border-brand/60"
          />
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-muted">
            <span>进度 {visible}/{steps.length}</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(visible / steps.length) * 100}%` }} /></div>
            {!question.toLowerCase().includes("paymentservice") && question.trim() ? <span className="text-amber-600 dark:text-amber-300">演示数据集固定为 PaymentService 场景，其他问题仍按该场景模拟。</span> : null}
          </div>
        </div>
        <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
          {steps.map((step, i) => {
            const done = i < visible;
            const active = i === visible - 1;
            if (i >= visible) return null;
            return (
              <div key={step.title} className={cn("rounded-xl border p-3", active ? "border-brand/50 bg-brand/[0.04]" : "border-line bg-surface")}>
                <div className="flex flex-wrap items-center gap-2">
                  {done ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <CircleDashed className="h-3.5 w-3.5 text-muted" />}
                  <span className="text-[12.5px] font-semibold text-ink">{step.title}</span>
                  <Badge tone={active ? "blue" : "neutral"}>{step.tag}</Badge>
                </div>
                <div className="mt-2 text-[12px] leading-6 text-muted [&_code]:rounded [&_code]:bg-elevated [&_code]:px-1 [&_code]:font-mono [&_code]:text-[10.5px] [&_p]:mb-1.5">
                  {i === 0 ? <p>当前输入：<code>{question.trim() || "（未输入）"}</code></p> : null}
                  {step.body}
                </div>
              </div>
            );
          })}
          {visible === 0 ? <div className="rounded-lg border border-dashed border-line p-6 text-center text-xs text-muted">点击「逐步执行」或「自动播放」开始演示</div> : null}
        </div>
        {visible >= steps.length ? (
          <div className="border-t border-line bg-elevated/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink">生成结果（模拟）<Badge tone="green">Evidence Validated</Badge></div>
            <div className="rounded-xl border border-line bg-surface p-3 text-[12.5px] leading-7 text-ink">
              <p>
                根据当前图谱事实与文档证据：<strong>PaymentService 故障会沿调用链影响 OrderService，并进一步影响其所属系统 OrderSystem</strong>
                <CitationChip id="E2" active={openEvidence === "E2"} onClick={() => setOpenEvidence(openEvidence === "E2" ? null : "E2")} />
                <CitationChip id="E3" active={openEvidence === "E3"} onClick={() => setOpenEvidence(openEvidence === "E3" ? null : "E3")} />。
                同时 PaymentService 连接 PaymentDB，数据库连接相关操作也可能受到影响
                <CitationChip id="E1" active={openEvidence === "E1"} onClick={() => setOpenEvidence(openEvidence === "E1" ? null : "E1")} />。
              </p>
              <p>
                责任团队为 <strong>PaymentTeam</strong>
                <CitationChip id="E4" active={openEvidence === "E4"} onClick={() => setOpenEvidence(openEvidence === "E4" ? null : "E4")} />；
                可用处置资料包括 <strong>Runbook-001（支付服务故障处理手册）</strong>
                <CitationChip id="E5" active={openEvidence === "E5"} onClick={() => setOpenEvidence(openEvidence === "E5" ? null : "E5")} />
                <CitationChip id="E6" active={openEvidence === "E6"} onClick={() => setOpenEvidence(openEvidence === "E6" ? null : "E6")} />，
                以及 Incident-001 的历史处置关联
                <CitationChip id="E8" active={openEvidence === "E8"} onClick={() => setOpenEvidence(openEvidence === "E8" ? null : "E8")} />。
              </p>
              <p className="mt-2 text-[11.5px] text-muted">注意：上述结论仅覆盖演示图谱中的已知关系；未包含实时监控状态、变更窗口或当前事件进展。点击引用标记查看证据详情。</p>
            </div>
            {activeEvidence ? (
              <div className="mt-3 rounded-xl border border-brand/40 bg-brand/[0.05] p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Badge tone="blue">{activeEvidence.id}</Badge>{activeEvidence.kind}</div>
                <div className="mt-1.5 text-[12px] text-ink">{activeEvidence.text}</div>
                <div className="mt-1 font-mono text-[10.5px] text-muted">{activeEvidence.source}</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
