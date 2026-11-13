"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { Badge, Button, Card, PanelTitle } from "@/components/ui/primitives";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import type { DiagramEdge, DiagramNode, LegendItem } from "@/data/diagram-types";
import { agentRoles, simulationNotice, toolById, toolRegistry } from "@/data/v2-simulations";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "ontology", label: "Ontology Service", kind: "ontology" },
  { id: "kg", label: "Knowledge Graph", kind: "graph" },
  { id: "doc", label: "Document Search", kind: "store" },
  { id: "semantic", label: "Enterprise Semantic Layer", kind: "concept" },
  { id: "apis", label: "Business APIs", kind: "process" },
];

const ROLES = ["analyst", "sre-lead", "operator"] as const;
const CLASSIFICATIONS = ["Internal", "Confidential", "Restricted"] as const;
const TOOL_CATEGORIES = ["图", "文档", "语义", "业务", "治理", "本体"] as const;

function toggle(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}

export function KnowledgeAgentDesigner() {
  const [roles, setRoles] = useState<Set<string>>(new Set(["search-agent", "graph-agent", "governance-agent"]));
  const [tools, setTools] = useState<Set<string>>(new Set(["graph_query", "vector_search", "permission_check", "audit_write"]));
  const [services, setServices] = useState<Set<string>>(new Set(["ontology", "kg", "doc"]));
  const [subjectRole, setSubjectRole] = useState<(typeof ROLES)[number]>("analyst");
  const [classification, setClassification] = useState<(typeof CLASSIFICATIONS)[number]>("Internal");
  const [generated, setGenerated] = useState(false);

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (tools.has("actuation") && subjectRole !== "operator") list.push("已选择受控执行工具 Controlled Actuation，但当前主体角色不是 operator；模拟策略将拒绝该调用并转人工审批。");
    if (tools.has("approval_request") && !roles.has("governance-agent")) list.push("已启用人工审批工具，但未选择 Governance Agent；建议由治理角色统一发起审批。");
    if (classification === "Restricted" && !tools.has("permission_check")) list.push("最大密级为 Restricted，但未启用 Permission Check；四阶段权限执行点不完整。");
    if (roles.size === 0) list.push("尚未选择任何 Agent 角色。");
    if (tools.size === 0) list.push("尚未选择任何工具；Agent 将没有可执行能力。");
    if (!roles.has("governance-agent")) list.push("未包含 Governance Agent：逻辑上仍可由运行时治理模块承担，但必须在架构文档中明确执行点。");
    return list;
  }, [tools, roles, subjectRole, classification]);

  const diagram = useMemo(() => {
    const nodes: DiagramNode[] = [];
    const edges: DiagramEdge[] = [];
    const push = (id: string, label: string, kind: string, x: number, y: number, sub: string, description: string) => {
      nodes.push({ id, label, kind, position: { x, y }, sub, description, details: [{ label: "职责", value: sub }, { label: "说明", value: description }] });
    };
    push("DZ-user", "User", "app", 0, 180, "请求 + 身份", "企业用户发起知识服务请求");
    push("DZ-idp", "Identity & Permission", "security", 220, 180, `role: ${subjectRole} · max ${classification}`, "解析 subject、密级与用途约束");
    push("DZ-runtime", "Agent Runtime", "orchestrator", 440, 180, "会话 / 预算 / 轨迹", "管理会话、停止条件与审计轨迹");
    push("DZ-planner", "Planner", "llm", 660, 180, "规划与分解", "按意图分派任务");
    const roleIds = Array.from(roles);
    roleIds.forEach((id, i) => {
      const r = agentRoles.find((x) => x.id === id)!;
      push(`DZ-role-${id}`, r.cn, r.kind, 880, i * 130, r.name, r.responsibility);
      edges.push({ id: `DZE-role-${id}`, source: "DZ-planner", target: `DZ-role-${id}`, label: "分派" });
    });
    const svcIds = Array.from(services);
    svcIds.forEach((id, i) => {
      const s = SERVICES.find((x) => x.id === id)!;
      push(`DZ-svc-${id}`, s.label, s.kind, 1120, i * 130, "知识服务", "经策略校验后访问的受控知识服务");
    });
    const toolIds = Array.from(tools);
    toolIds.forEach((id, i) => {
      const t = toolById[id];
      if (!t) return;
      push(`DZ-tool-${id}`, t.name, t.category === "治理" ? "security" : "store", 1360, i * 110, `${t.category} · ${t.permission}`, t.description);
      edges.push({ id: `DZE-tool-${id}`, source: "DZ-runtime", target: `DZ-tool-${id}`, label: "白名单" });
    });
    push("DZ-validate", "Response Validation", "security", 1600, 100, "证据 / 引用 / 权限", "引用校验失败不出答案");
    push("DZ-audit", "Audit & Monitoring", "security", 1600, 280, "轨迹与告警", "记录全链路工具调用与回答");
    edges.push({ id: "DZE-1", source: "DZ-user", target: "DZ-idp", label: "认证" });
    edges.push({ id: "DZE-2", source: "DZ-idp", target: "DZ-runtime", label: "subject" });
    edges.push({ id: "DZE-3", source: "DZ-runtime", target: "DZ-planner", label: "规划" });
    svcIds.forEach((id) => edges.push({ id: `DZE-svc-${id}`, source: "DZ-runtime", target: `DZ-svc-${id}`, label: "受控访问" }));
    edges.push({ id: "DZE-4", source: "DZ-runtime", target: "DZ-validate", label: "候选答案" });
    edges.push({ id: "DZE-5", source: "DZ-validate", target: "DZ-audit", label: "轨迹" });
    const legend: LegendItem[] = [
      { kind: "app", label: "用户" }, { kind: "security", label: "权限 / 校验 / 审计" },
      { kind: "orchestrator", label: "运行时" }, { kind: "llm", label: "Planner / Agent" },
      { kind: "store", label: "工具 / 文档" }, { kind: "graph", label: "知识图谱" },
      { kind: "ontology", label: "本体" }, { kind: "concept", label: "语义层" },
      { kind: "process", label: "业务 API" }, { kind: "incident", label: "故障分析" },
    ];
    return { nodes, edges, legend };
  }, [roles, tools, services, subjectRole, classification]);

  const summary = `${roles.size} 个逻辑角色 · ${tools.size} 个白名单工具 · ${services.size} 类知识服务 · subject role=${subjectRole} · max classification=${classification}`;

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Cpu className="h-4 w-4 text-brand" />} right={<Badge tone="amber">模拟配置</Badge>}>Knowledge Agent 架构设计器</PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">模拟模式声明：</strong>{simulationNotice}。下方配置只在浏览器本地生效，不会生成真实部署文件或调用任何服务。角色是<strong>可选逻辑职责</strong>，不代表必须部署多个模型或微服务。
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold text-ink">① 选择 Agent 逻辑角色</div>
              <div className="flex flex-wrap gap-1.5">
                {agentRoles.map((r) => (
                  <button key={r.id} type="button" onClick={() => { setRoles((s) => toggle(s, r.id)); setGenerated(false); }} className={cn("inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] transition-colors", roles.has(r.id) ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>
                    {roles.has(r.id) ? <Check className="h-3 w-3" /> : null}{r.cn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold text-ink">② 选择白名单工具</div>
              {TOOL_CATEGORIES.map((cat) => (
                <div key={cat} className="mb-2">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-muted">{cat}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {toolRegistry.filter((t) => t.category === cat).map((t) => (
                      <button key={t.id} type="button" onClick={() => { setTools((s) => toggle(s, t.id)); setGenerated(false); }} title={`${t.description}｜权限：${t.permission}`} className={cn("rounded-lg border px-2 py-1 font-mono text-[10px] transition-colors", tools.has(t.id) ? "border-azure/60 bg-azure/10 font-semibold text-azure" : "border-line text-muted hover:text-ink")}>
                        {t.name}{t.requiresApproval ? " ⚠" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-[10px] leading-5 text-muted">⚠ 表示敏感工具，必须人工审批。鼠标悬停可查看工具描述与权限范围。</div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold text-ink">③ 配置权限边界</div>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-[10.5px] text-muted">主体角色
                  <select value={subjectRole} onChange={(e) => { setSubjectRole(e.target.value as (typeof ROLES)[number]); setGenerated(false); }} className="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[11.5px] text-ink outline-none focus:border-brand/60">
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
                <label className="text-[10.5px] text-muted">最大密级
                  <select value={classification} onChange={(e) => { setClassification(e.target.value as (typeof CLASSIFICATIONS)[number]); setGenerated(false); }} className="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-[11.5px] text-ink outline-none focus:border-brand/60">
                    {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold text-ink">④ 连接知识服务</div>
              <div className="flex flex-wrap gap-1.5">
                {SERVICES.map((s) => (
                  <button key={s.id} type="button" onClick={() => { setServices((v) => toggle(v, s.id)); setGenerated(false); }} className={cn("rounded-lg border px-2 py-1 text-[11px] transition-colors", services.has(s.id) ? "border-violet/60 bg-violet/10 font-semibold text-violet" : "border-line text-muted hover:text-ink")}>
                    {services.has(s.id) ? <Check className="mr-1 inline h-3 w-3" /> : null}{s.label}
                  </button>
                ))}
              </div>
            </div>

            <Button size="sm" onClick={() => setGenerated(true)}><Sparkles className="h-3.5 w-3.5" /> 生成 Agent 架构图</Button>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold text-ink">配置摘要与校验</div>
            <Card className="p-3.5">
              <div className="text-[12px] font-medium text-ink">{summary}</div>
              <div className="mt-3 space-y-1.5">
                {warnings.length ? warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-1.5 rounded-lg border border-accent/25 bg-accent/[0.06] px-2 py-1.5 text-[11px] leading-5 text-muted"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-accent" />{w}</div>
                )) : (
                  <div className="flex items-start gap-1.5 rounded-lg border border-leaf/25 bg-leaf/[0.06] px-2 py-1.5 text-[11px] leading-5 text-muted"><ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-leaf" />当前配置通过模拟策略检查：包含权限校验、审计与治理角色。</div>
                )}
              </div>
              <div className="mt-3 border-t border-line pt-3 text-[11px] leading-6 text-muted">
                <strong className="text-ink">安全边界（始终生效）：</strong>Agent 不允许绕过权限访问 Neo4j、Azure AI Search 或企业 API；工具采用白名单与最小权限；敏感操作必须人工审批；所有工具调用记录日志与审计。
              </div>
            </Card>

            <div className="mt-3 max-h-[330px] overflow-y-auto pr-1">
              <div className="mb-2 text-[11px] font-semibold text-ink">已选角色：职责 / 工具 / 输入输出 / 权限边界 / 失败处理</div>
              {Array.from(roles).length ? Array.from(roles).map((id) => {
                const r = agentRoles.find((x) => x.id === id)!;
                return (
                  <Card key={id} className="mb-2 p-3">
                    <div className="flex items-center gap-2"><Badge tone="cyan">{r.name}</Badge><span className="text-[12px] font-semibold text-ink">{r.cn}</span></div>
                    <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{r.responsibility}</p>
                    <div className="mt-2 grid grid-cols-1 gap-1 text-[10.5px] leading-5 text-muted sm:grid-cols-2">
                      <div><span className="font-semibold text-ink">工具：</span>{r.tools.join(" / ")}</div>
                      <div><span className="font-semibold text-ink">输入：</span>{r.inputs}</div>
                      <div><span className="font-semibold text-ink">输出：</span>{r.outputs}</div>
                      <div><span className="font-semibold text-ink">权限边界：</span>{r.permissions}；{r.boundary}</div>
                      <div className="sm:col-span-2"><span className="font-semibold text-ink">失败处理：</span>{r.failureHandling}</div>
                    </div>
                  </Card>
                );
              }) : <div className="rounded-xl border border-dashed border-line p-5 text-center text-[11px] text-muted">尚未选择角色。</div>}
            </div>
          </div>
        </div>

        {generated ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-ink"><Sparkles className="h-3.5 w-3.5 text-brand" /> 生成的 Agent 架构图（可拖动 / 缩放 / 点击节点）</div>
            <FlowCanvas nodes={diagram.nodes} edges={diagram.edges} legend={diagram.legend} height={470} caption="由当前配置确定性生成；节点可点击查看详情。模拟配置，不代表真实部署拓扑。" />
            <div className="mt-2 rounded-xl border border-line bg-elevated/40 p-3 text-[11.5px] leading-6 text-muted">
              <strong className="text-ink">架构说明：</strong>User 经 Identity & Permission 解析 subject 后进入 Agent Runtime，由 Planner 分派给 {roles.size} 个逻辑角色；所有工具调用必须来自 {tools.size} 项白名单，并在执行前经 permission_check；Response Validation 校验证据与引用，Audit & Monitoring 记录全链路轨迹。逻辑角色可以合并到同一运行时，不是必须拆成独立服务。
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-line p-6 text-center text-[11.5px] text-muted">调整左侧配置后点击「生成 Agent 架构图」，这里会生成与当前选择联动的架构图。</div>
        )}
      </div>
    </Card>
  );
}
