"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, Compass, Layers3, Network, Search, ShieldCheck, Workflow } from "lucide-react";
import { Badge, Card, PanelTitle, StepBadge } from "@/components/ui/primitives";
import { adrExamples } from "@/data/v2-patterns";
import { hubNavGroups, hubPages } from "@/data/v2-hub";
import { enterpriseRelations, entityById } from "@/data/v2-model";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Agentic RAG 状态机
 * ------------------------------------------------------------------ */
const STATE_MACHINE = [
  { id: "idle", label: "Idle", next: "Plan", enter: "收到 User Query + subject + 预算", action: "校验身份与输入格式", exit: "进入 Plan" },
  { id: "plan", label: "Plan", next: "Act", enter: "Planner 判定复杂度与工具集", action: "Query Decomposition；绑定子任务与检索策略", exit: "子任务队列非空" },
  { id: "act", label: "Act", next: "Observe", enter: "有待执行子任务且未达预算", action: "白名单 Tool Calling；执行时 permission_check", exit: "工具返回或超时" },
  { id: "observe", label: "Observe", next: "Evaluate", enter: "收到工具输出", action: "写入轨迹；归一化证据与 Evidence ID", exit: "证据进入评估队列" },
  { id: "evaluate", label: "Evaluate", next: "Decide", enter: "候选证据齐备", action: "覆盖度 / 冲突 / 权威性 / 密级 / 引用可回溯性检查", exit: "输出充分度与缺口清单" },
  { id: "decide", label: "Decide", next: "Plan / Stop", enter: "充分度与停止条件同时可用", action: "充分 → Synthesis；不足且有预算 → 下一轮 Plan；否则 Stop", exit: "命中任一停止条件" },
  { id: "stop", label: "Stop", next: "—", enter: "证据充分 / 轮次上限 / 成本上限 / 延迟 SLA / 连续失败 / 权限不足 / 需人工审批", action: "输出答案 + 不确定性 + 待确认项；写审计", exit: "轨迹关闭" },
];

export function AgenticStateMachine() {
  const [active, setActive] = useState(1);
  const s = STATE_MACHINE[active];
  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Workflow className="h-4 w-4 text-brand" />} right={<Badge tone="amber">确定性模拟</Badge>}>Agent Loop 状态机</PanelTitle>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-1">
          {STATE_MACHINE.map((x, i) => (
            <span key={x.id} className="flex items-center gap-1">
              <button type="button" onClick={() => setActive(i)} className={cn("rounded-lg border px-2 py-1 font-mono text-[11px] transition-colors", active === i ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{x.label}</button>
              {i < STATE_MACHINE.length - 1 ? <span className="text-[10px] text-muted">→</span> : null}
            </span>
          ))}
        </div>
        <Card className="mt-3 p-3.5">
          <div className="flex items-center gap-2"><Badge tone="cyan">状态 {active + 1} / {STATE_MACHINE.length}</Badge><span className="text-[13px] font-bold text-ink">{s.label}</span></div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-[11.5px] leading-6 text-muted sm:grid-cols-3">
            <div><span className="font-semibold text-ink">进入条件：</span>{s.enter}</div>
            <div><span className="font-semibold text-ink">动作：</span>{s.action}</div>
            <div><span className="font-semibold text-ink">退出 / 后继：</span>{s.exit} · 下一状态 {s.next}</div>
          </div>
        </Card>
        <div className="mt-2 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-3 text-[11px] leading-6 text-muted">
          <strong className="text-ink">停止条件是硬约束：</strong>最大轮次、工具调用次数、Token/成本预算、延迟 SLA、连续失败次数与人工升级路径必须写在运行时，而不是提示词里。任何一项命中都要退出循环并说明证据缺口。
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * ADR 示例
 * ------------------------------------------------------------------ */
export function AdrList() {
  const [open, setOpen] = useState<string | null>(adrExamples[0].id);
  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<BookOpen className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">{adrExamples.length} 份示例 ADR</Badge>}>Architecture Decision Records</PanelTitle>
      <div className="space-y-1.5 p-4">
        {adrExamples.map((a) => (
          <div key={a.id} className="rounded-xl border border-line bg-surface">
            <button type="button" onClick={() => setOpen(open === a.id ? null : a.id)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
              <span className="font-mono text-[10px] text-brand">{a.id}</span>
              <span className="min-w-0 flex-1 text-[12.5px] font-semibold text-ink">{a.title}</span>
              <Badge tone="neutral" className="hidden shrink-0 sm:inline-flex">{a.status}</Badge>
              <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted transition-transform", open === a.id && "rotate-180")} />
            </button>
            {open === a.id ? (
              <div className="space-y-2.5 border-t border-line px-3.5 py-3">
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">业务问题</div><p className="mt-1 text-[11.5px] leading-6 text-ink">{a.businessQuestion}</p></div>
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Context</div><p className="mt-1 text-[11.5px] leading-6 text-muted">{a.context}</p></div>
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Decision</div><p className="mt-1 text-[11.5px] leading-6 text-ink">{a.decision}</p></div>
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Rationale</div><ul className="mt-1 space-y-1 text-[11.5px] leading-6 text-muted">{a.rationale.map((r, i) => <li key={i}>• {r}</li>)}</ul></div>
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">未选方案</div><div className="mt-1 space-y-1">{a.alternatives.map((x) => <div key={x.option} className="rounded-lg bg-elevated px-2.5 py-1.5 text-[11px] leading-5 text-muted"><strong className="text-ink">{x.option}</strong>：{x.whyNot}</div>)}</div></div>
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Consequences</div><ul className="mt-1 space-y-1 text-[11.5px] leading-6 text-muted">{a.consequences.map((c, i) => <li key={i}>• {c}</li>)}</ul></div>
                <div className="rounded-lg border border-brand/25 bg-brand/[0.06] px-2.5 py-2 text-[11px] leading-5 text-muted"><strong className="text-ink">Revisit When：</strong>{a.revisitWhen}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * 技术准确性声明
 * ------------------------------------------------------------------ */
const NOT_EQUAL = [
  ["Ontology", "Knowledge Graph", "定义层 vs 实例层"],
  ["Knowledge Graph", "GraphRAG", "存储事实 vs 检索组织方法"],
  ["GraphRAG", "Agentic RAG", "上下文组织 vs Agent 工作流"],
  ["Agentic RAG", "Knowledge Agent", "检索工作流 vs 企业知识智能体"],
  ["Ontology", "Enterprise Semantic Layer", "概念类型 vs 指标口径与映射"],
  ["Knowledge Graph", "Digital Twin", "关系事实 vs 现实对象状态映射"],
  ["Digital Twin", "普通设备监控大屏", "状态模型与同步 vs 指标展示"],
  ["Data Governance", "单纯的数据库权限管理", "全生命周期体系 vs 单一控制点"],
];

const PRINCIPLES = [
  "不同技术之间可以组合，但不存在必须采用的固定流水线。",
  "技术选型必须基于业务问题、数据特征、准确性、安全和维护成本。",
  "GraphRAG 不一定优于传统 RAG；图谱质量不足时可能更差。",
  "Agent 数量不是系统能力的直接指标。",
  "多 Agent 可能引入更多通信、协调、延迟和调试成本。",
  "Semantic Layer 的核心价值是统一业务语义和指标口径。",
  "Data Governance 是贯穿全生命周期的管理体系。",
  "Digital Twin 需要现实对象、状态数据和持续同步机制。",
  "知识图谱中的事实需要来源、时间和证据。",
  "LLM 生成的知识需要校验和治理。",
  "企业权限必须贯穿整个检索和生成链路。",
  "生产系统不能只依赖提示词作为安全边界。",
];

export function PrinciplesList() {
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-[12.5px] font-semibold text-ink">八组必须分清的边界</div>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {NOT_EQUAL.map(([a, b, why]) => (
            <div key={a} className="rounded-lg border border-line bg-elevated/40 px-2.5 py-2">
              <div className="text-[11.5px] font-semibold text-ink">{a} <span className="mx-1 text-rose-500">≠</span> {b}</div>
              <div className="mt-0.5 text-[10.5px] text-muted">{why}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink"><ShieldCheck className="h-4 w-4 text-brand" /> 十二条技术准确性声明</div>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <div key={p} className="flex items-start gap-2 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] leading-5 text-muted"><StepBadge step={i + 1} tone="blue" /><span>{p}</span></div>
          ))}
        </div>
      </Card>
      <Card className="border-accent/30 bg-accent/[0.06] p-4 text-[11.5px] leading-6 text-muted">
        <strong className="text-ink">版本敏感性与引用规范：</strong>技术文档、API 与产品能力随版本变化，站内代码示例仅表达结构，不承诺具体接口可用；引用官方文档时使用可点击链接（见 V1 附录「官方技术参考」）。不要杜撰产品功能、接口、性能数据和企业案例。所有示例数据必须明确标记为模拟数据，不是行业基准。
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 首页组件
 * ------------------------------------------------------------------ */
const DOMAIN_CARDS = [
  { code: "A", label: "知识建模", href: "/#ch3-ontology", tone: "purple" },
  { code: "B", label: "知识检索", href: "/hub/retrieval", tone: "blue" },
  { code: "C", label: "知识智能体", href: "/hub/knowledge-agent", tone: "cyan" },
  { code: "D", label: "企业语义体系", href: "/hub/semantic-layer", tone: "green" },
  { code: "E", label: "数据治理", href: "/hub/data-governance", tone: "amber" },
  { code: "F", label: "数字孪生", href: "/hub/digital-twin", tone: "rose" },
  { code: "G", label: "企业架构", href: "/hub/architecture", tone: "blue" },
  { code: "H", label: "企业实践", href: "/hub/solutions", tone: "neutral" },
] as const;

export function HomeDomainMap() {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink"><Network className="h-4 w-4 text-brand" /> 全站知识地图（点击域名进入）</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DOMAIN_CARDS.map((d) => (
          <Link key={d.code} href={d.href} className="group rounded-xl border border-line bg-surface p-3 transition-colors hover:border-brand/50 hover:bg-elevated/50">
            <Badge tone={d.tone}>{d.code}</Badge>
            <div className="mt-2 text-[12px] font-semibold text-ink group-hover:text-brand">{d.label}</div>
            <div className="mt-1 text-[10px] text-muted">{hubNavGroups.find((g) => g.label.includes(d.label.slice(0, 2)))?.items.length ?? 6} 个导航条目</div>
          </Link>
        ))}
      </div>
      <div className="mt-3 text-[11px] leading-6 text-muted">知识网络不是单一目录树：同一个概念可以在不同路径里处于上游、下游或完全缺席。<Link href="/hub/knowledge-map" className="text-brand hover:underline">打开知识关系浏览器 ↗</Link></div>
    </Card>
  );
}

const QUICK = [
  { icon: Compass, label: "四条学习路径", desc: "按角色组织，含实践任务与本地进度", href: "/hub/learn" },
  { icon: Network, label: "知识关系浏览器", desc: "搜索 / 过滤 / 1–3 跳 / 上下游", href: "/hub/knowledge-map" },
  { icon: Layers3, label: "八层总体架构", desc: "全屏交互图 + 三套视图", href: "/hub/architecture" },
  { icon: Search, label: "全站搜索", desc: "新旧章节、代码、模式、ADR", href: "/hub/search" },
  { icon: Workflow, label: "交互工具中心", desc: "V1 三个 + V2 五个核心工具", href: "/hub/tools" },
  { icon: BookOpen, label: "架构模式库 / ADR", desc: "10 个统一模板模式 + 6 份 ADR", href: "/hub/patterns" },
];

export function HomeQuickLinks() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {QUICK.map((q) => (
        <Link key={q.label} href={q.href} className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-brand/50 hover:bg-elevated/50">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"><q.icon className="h-4 w-4" /></span>
          <span className="min-w-0"><span className="block text-[12.5px] font-semibold text-ink group-hover:text-brand">{q.label}</span><span className="mt-0.5 block text-[11px] leading-5 text-muted">{q.desc}</span></span>
          <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted" />
        </Link>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 检索模式对比（页内小组件）
 * ------------------------------------------------------------------ */
const RETRIEVAL_MODES = [
  { id: "single", name: "A · 单次 RAG", summary: "一次检索 + 生成", detail: "延迟与成本最低、可复现性高；复杂问题容易漏检。适合单文档可答的事实查询。", tone: "green" },
  { id: "graph", name: "B · GraphRAG", summary: "图路径 + 文档证据", detail: "知识检索与上下文组织方法，擅长多跳关系与影响分析；需要抽取、消歧与治理成本。", tone: "blue" },
  { id: "agentic", name: "C · Agentic RAG", summary: "Agent 控制的多步工作流", detail: "规划、分解、迭代、反思与引用验证；可调用 GraphRAG、传统 RAG、SQL、API，但不必然需要知识图谱。", tone: "purple" },
] as const;

export function RetrievalCompare() {
  const [active, setActive] = useState<string>("agentic");
  const mode = RETRIEVAL_MODES.find((m) => m.id === active)!;
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {RETRIEVAL_MODES.map((m) => (
          <button key={m.id} type="button" onClick={() => setActive(m.id)} className={cn("rounded-xl border p-3 text-left transition-colors", active === m.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
            <Badge tone={m.tone}>{m.name}</Badge><div className="mt-1.5 text-[11.5px] font-semibold text-ink">{m.summary}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-line bg-elevated/40 p-3 text-[11.5px] leading-6 text-muted"><strong className="text-ink">{mode.name}：</strong>{mode.detail}</div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
        <Link href="/hub/agentic-rag" className="text-brand hover:underline">完整 Agentic RAG 专题 ↗</Link>
        <Link href="/#ch7-matrix" className="text-brand hover:underline">V1 六方案对比矩阵 ↗</Link>
        <Link href="/hub/retrieval#rt-evaluation" className="text-brand hover:underline">检索评估 ↗</Link>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * IT 运维解决方案详情（复用统一数据模型）
 * ------------------------------------------------------------------ */
export function SolutionDetailItops() {
  const ids = ["BIZ-001", "SYS-001", "SVC-002", "DB-001", "INC-001", "RB-001", "CHK-001"];
  return (
    <Card className="p-4">
      <div className="text-[12px] font-semibold text-ink">统一 IT Operations 场景实体（与全站共用稳定 ID）</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ids.map((id) => {
          const e = entityById[id];
          return e ? <Badge key={id} tone="neutral" className="font-mono">{id} · {e.label}</Badge> : null;
        })}
      </div>
      <div className="mt-3 text-[12px] font-semibold text-ink">关系方向（主语 → 宾语）</div>
      <div className="mt-2 space-y-1">
        {enterpriseRelations.filter((r) => ["REL-IT-004", "REL-IT-009", "REL-IT-011", "REL-IT-014", "REL-IT-016"].includes(r.id)).map((r) => (
          <div key={r.id} className="rounded-lg border border-line bg-elevated/40 px-2.5 py-1.5 font-mono text-[10.5px] text-muted">{r.source} -[:{r.predicate}]→ {r.target} <span className="ml-1 font-sans">· {r.note ?? r.approvalStatus}</span></div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <Link href="/hub/agentic-rag#ar-simulator" className="text-brand hover:underline">在模拟器中调查 INC-001 ↗</Link>
        <Link href="/#ch2-scenario" className="text-brand hover:underline">V1 场景 7 条业务事实 ↗</Link>
        <Link href="/hub/data-governance#dg-explorer" className="text-brand hover:underline">查看知识血缘 ↗</Link>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * 工程实践 → 模式库入口
 * ------------------------------------------------------------------ */
export function EngineeringPatternLink() {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link href="/hub/patterns#pt-library" className="group rounded-xl border border-line bg-surface p-3.5 hover:border-brand/50">
          <div className="text-[12.5px] font-semibold text-ink group-hover:text-brand">架构模式库（10 个统一模板）</div>
          <p className="mt-1 text-[11px] leading-5 text-muted">问题 / 场景 / 反场景 / 架构图 / 数据流 / 查询流 / 选型 / 复杂度 / 成本 / 风险 / 优点 / 局限 / 替代方案。</p>
        </Link>
        <Link href="/hub/patterns#pt-adr" className="group rounded-xl border border-line bg-surface p-3.5 hover:border-brand/50">
          <div className="text-[12.5px] font-semibold text-ink group-hover:text-brand">ADR 示例（6 份）</div>
          <p className="mt-1 text-[11px] leading-5 text-muted">从业务问题出发记录取舍：为什么选属性图、什么时候需要 OWL、什么时候坚持传统 RAG。</p>
        </Link>
      </div>
      <div className="mt-3 text-[11px] text-muted">全站共 {hubPages.length} 个 V2 页面；V1 的 12 章与附录保持原有链接。</div>
    </Card>
  );
}
