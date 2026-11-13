"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight, BookOpen, Check, ChevronDown, Compass, Layers3, Network, Search,
} from "lucide-react";
import { Badge, Card, PanelTitle, StepBadge } from "@/components/ui/primitives";
import { FlowCanvas, type DiagramSelection } from "@/components/viz/flow-canvas";
import { knowledgeNetworkDiagram, patternDiagram } from "@/data/v2-diagrams";
import { architecturePatterns } from "@/data/v2-patterns";
import { glossary } from "@/data/glossary";
import {
  knowledgeDomains, knowledgeEdges, knowledgeNodeById, knowledgeNodes,
  learningPaths, relationKinds, v2Glossary,
} from "@/data/v2-hub";
import { searchCategories, searchSite, type SearchCategory } from "@/data/search-index";
import { getPathProgress, getRecentVisits, togglePathStep } from "@/lib/v2-storage";
import { highlightText } from "@/components/ui/highlight";
import { cn } from "@/lib/utils";

/* ================================================================== *
 * 架构模式库浏览器（统一 14 项模板）
 * ================================================================== */
export function PatternLibrary() {
  const [id, setId] = useState(architecturePatterns[0].id);
  const [query, setQuery] = useState("");
  const [complexity, setComplexity] = useState<"全部" | "低" | "中" | "高">("全部");
  const pattern = architecturePatterns.find((p) => p.id === id) ?? architecturePatterns[0];
  const diagram = useMemo(() => patternDiagram(pattern), [pattern]);
  const filtered = architecturePatterns.filter((p) => (complexity === "全部" || p.complexity === complexity)
    && (!query || `${p.name} ${p.cn} ${p.problem}`.toLowerCase().includes(query.toLowerCase())));

  const sections: { label: string; items: string[]; tone?: "rose" | "amber" }[] = [
    { label: "适用场景", items: pattern.suitable },
    { label: "不适用场景", items: pattern.unsuitable, tone: "rose" },
    { label: "核心组件", items: pattern.components },
    { label: "数据流", items: pattern.dataFlow },
    { label: "查询流", items: pattern.queryFlow },
    { label: "技术选型", items: pattern.technologies },
    { label: "运行成本因素", items: pattern.costFactors },
    { label: "安全风险", items: pattern.risks, tone: "rose" },
    { label: "优点", items: pattern.pros },
    { label: "局限性", items: pattern.limits, tone: "amber" },
    { label: "替代方案", items: pattern.alternatives },
  ];

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Layers3 className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">{architecturePatterns.length} 个模式 · 统一模板</Badge>}>企业架构模式库</PanelTitle>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索模式名称或问题" className="h-9 w-full rounded-lg border border-line bg-elevated/50 pl-8 pr-2 text-[11.5px] text-ink outline-none focus:border-brand/60" />
          </div>
          {(["全部", "低", "中", "高"] as const).map((c) => (
            <button key={c} type="button" onClick={() => setComplexity(c)} className={cn("rounded-lg border px-2 py-1 text-[11px] transition-colors", complexity === c ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{c === "全部" ? "全部复杂度" : `复杂度 ${c}`}</button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
          <div className="max-h-[560px] space-y-1.5 overflow-y-auto pr-1">
            {filtered.length ? filtered.map((p) => (
              <button key={p.id} type="button" onClick={() => setId(p.id)} className={cn("w-full rounded-xl border px-2.5 py-2 text-left transition-colors", id === p.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
                <div className="flex items-center gap-1.5"><span className="font-mono text-[9.5px] text-brand">{p.id}</span><Badge tone={p.complexity === "高" ? "rose" : p.complexity === "中" ? "amber" : "green"}>{p.complexity}</Badge></div>
                <div className={cn("mt-1 text-[11.5px] font-semibold", id === p.id ? "text-brand" : "text-ink")}>{p.cn}</div>
                <div className="mt-0.5 truncate text-[10px] text-muted">{p.name}</div>
              </button>
            )) : <div className="rounded-xl border border-dashed border-line p-5 text-center text-[11px] text-muted">没有匹配的模式。</div>}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5"><Badge tone="blue">{pattern.id}</Badge><Badge tone="neutral">实施复杂度：{pattern.complexity}</Badge></div>
            <h3 className="mt-2 text-[17px] font-bold text-ink">{pattern.name} · {pattern.cn}</h3>
            <Card className="mt-2 p-3"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">解决的问题</div><p className="mt-1.5 text-[12.5px] leading-6 text-ink">{pattern.problem}</p></Card>

            <div className="mt-3" data-print="hide">
              <div className="mb-1.5 text-[11px] font-semibold text-ink">架构图（可拖动 / 缩放 / 点击节点）</div>
              <FlowCanvas key={pattern.id} nodes={diagram.nodes} edges={diagram.edges} legend={diagram.legend} height={340} minimap={false} caption="模式架构示意图，教学抽象，不代表真实部署拓扑。" />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sections.map((s) => (
                <Card key={s.label} className="p-3">
                  <div className={cn("text-[10px] font-semibold uppercase tracking-wider", s.tone === "rose" ? "text-rose-500" : s.tone === "amber" ? "text-accent" : "text-muted")}>{s.label}</div>
                  <ul className="mt-1.5 space-y-1 text-[11px] leading-5 text-muted">{s.items.map((x, i) => <li key={i} className="flex gap-1.5"><span className="text-brand">•</span><span>{x}</span></li>)}</ul>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ================================================================== *
 * 知识关系浏览器
 * ================================================================== */
export function KnowledgeNetwork() {
  const [focus, setFocus] = useState("ontology");
  const [hops, setHops] = useState<1 | 2 | 3>(2);
  const [domains, setDomains] = useState<Set<string>>(new Set());
  const [kinds, setKinds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("ontology");

  const visibleIds = useMemo(() => {
    const activeEdges = knowledgeEdges.filter((e) => !kinds.size || kinds.has(e.kind));
    const adj = new Map<string, string[]>();
    activeEdges.forEach((e) => {
      adj.set(e.source, [...(adj.get(e.source) ?? []), e.target]);
      adj.set(e.target, [...(adj.get(e.target) ?? []), e.source]);
    });
    const seen = new Map<string, number>([[focus, 0]]);
    const queue = [focus];
    while (queue.length) {
      const cur = queue.shift()!;
      const depth = seen.get(cur) ?? 0;
      if (depth >= hops) continue;
      for (const next of adj.get(cur) ?? []) {
        if (!seen.has(next)) { seen.set(next, depth + 1); queue.push(next); }
      }
    }
    let ids = Array.from(seen.keys());
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const direct = knowledgeNodes.filter((n) => `${n.label} ${n.summary} ${n.keywords.join(" ")}`.toLowerCase().includes(q)).map((n) => n.id);
      ids = direct.length ? direct : ids.filter((id) => `${knowledgeNodeById[id]?.label ?? ""}`.toLowerCase().includes(q));
    }
    if (domains.size) ids = ids.filter((id) => domains.has(knowledgeNodeById[id]?.domain ?? ""));
    if (!ids.includes(focus) && !query.trim() && !domains.size) ids = [focus, ...ids];
    return ids;
  }, [focus, hops, domains, kinds, query]);

  const diagram = useMemo(() => knowledgeNetworkDiagram(visibleIds, knowledgeNodes, knowledgeEdges, selected), [visibleIds, selected]);
  const node = knowledgeNodeById[selected];
  const related = knowledgeEdges.filter((e) => e.source === selected || e.target === selected).slice(0, 12);

  const toggleSet = (setter: (v: Set<string>) => void, current: Set<string>, value: string) => {
    const next = new Set(current);
    if (next.has(value)) next.delete(value); else next.add(value);
    setter(next);
  };

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Network className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">{visibleIds.length} 节点 · {diagram.edges.length} 连线</Badge>}>全站知识关系浏览器</PanelTitle>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索概念，例如 Semantic Layer / 血缘" className="h-9 w-full rounded-lg border border-line bg-elevated/50 pl-8 pr-2 text-[11.5px] text-ink outline-none focus:border-brand/60" />
          </div>
          <label className="text-[10.5px] text-muted">中心节点
            <select value={focus} onChange={(e) => { setFocus(e.target.value); setSelected(e.target.value); }} className="ml-1 rounded-lg border border-line bg-surface px-2 py-1.5 text-[11px] text-ink outline-none">
              {knowledgeNodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <span className="text-[10.5px] text-muted">跳数</span>
            {([1, 2, 3] as const).map((h) => <button key={h} type="button" onClick={() => setHops(h)} className={cn("rounded-lg border px-2 py-1 text-[11px]", hops === h ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{h} 跳</button>)}
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          <span className="text-[10px] text-muted">领域：</span>
          {knowledgeDomains.map((d) => <button key={d} type="button" onClick={() => toggleSet(setDomains, domains, d)} className={cn("rounded-md border px-1.5 py-0.5 text-[10px]", domains.has(d) ? "border-brand/60 bg-brand/10 text-brand" : "border-line text-muted hover:text-ink")}>{d}</button>)}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span className="text-[10px] text-muted">关系：</span>
          {relationKinds.map((k) => <button key={k} type="button" onClick={() => toggleSet(setKinds, kinds, k)} className={cn("rounded-md border px-1.5 py-0.5 text-[10px]", kinds.has(k) ? "border-violet/60 bg-violet/10 text-violet" : "border-line text-muted hover:text-ink")}>{k}</button>)}
          {(domains.size > 0 || kinds.size > 0) ? <button type="button" onClick={() => { setDomains(new Set()); setKinds(new Set()); }} className="text-[10px] text-muted hover:text-ink">清除过滤</button> : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
          <div data-print="hide">
            <FlowCanvas
              key={`${focus}-${hops}-${visibleIds.join(",")}`}
              nodes={diagram.nodes} edges={diagram.edges} legend={diagram.legend}
              height={470} showDetails={false} minimap={false}
              onSelect={(sel: DiagramSelection | null) => { if (sel?.type === "node") setSelected(sel.id.replace(/^KN-/, "")); }}
              caption="连线语义：依赖 / 关联 / 比较 / 应用 / 可选组合。「可选组合」不表示必须先有。"
            />
          </div>
          <div>
            {node ? (
              <Card className="p-3.5">
                <Badge tone="blue">{node.domain}</Badge>
                <h3 className="mt-2 text-[14px] font-bold text-ink">{node.label}</h3>
                <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{node.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1">{node.keywords.slice(0, 6).map((k) => <Badge key={k} tone="neutral">{k}</Badge>)}</div>
                <Link href={node.href} className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-brand hover:underline">打开对应章节 <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                <div className="mt-3 border-t border-line pt-3">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">上下游 / 关联概念</div>
                  <div className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
                    {related.map((e) => {
                      const other = e.source === selected ? e.target : e.source;
                      const n = knowledgeNodeById[other];
                      if (!n) return null;
                      return (
                        <button key={e.id} type="button" onClick={() => { setSelected(other); setFocus(other); }} className="flex w-full items-center gap-1.5 rounded-lg px-1.5 py-1 text-left text-[10.5px] text-muted hover:bg-elevated hover:text-ink">
                          <Badge tone={e.kind === "可选组合" ? "amber" : e.kind === "比较" ? "purple" : "neutral"}>{e.kind}</Badge><span className="min-w-0 flex-1 truncate">{n.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ================================================================== *
 * 学习路径 + 最近访问
 * ================================================================== */
export function LearningPaths() {
  const [active, setActive] = useState(learningPaths[0].id);
  const [progress, setProgress] = useState<string[]>([]);
  const path = learningPaths.find((p) => p.id === active) ?? learningPaths[0];

  useEffect(() => { setProgress(getPathProgress()); }, []);

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Compass className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">4 条路径 · 本地进度</Badge>}>学习路径</PanelTitle>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {learningPaths.map((p) => {
            const done = p.steps.filter((_, i) => progress.includes(`${p.id}:${i}`)).length;
            return (
              <button key={p.id} type="button" onClick={() => setActive(p.id)} className={cn("rounded-xl border px-3 py-2 text-left transition-colors", active === p.id ? "border-brand/60 bg-brand/[0.08]" : "border-line bg-surface hover:bg-elevated")}>
                <div className="flex items-center gap-1.5"><Badge tone={active === p.id ? "cyan" : "neutral"}>路径 {p.code}</Badge><span className={cn("text-[11.5px] font-semibold", active === p.id ? "text-brand" : "text-ink")}>{p.role}</span></div>
                <div className="mt-1 text-[10px] text-muted">{done}/{p.steps.length} 已完成</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2"><Badge tone="blue">{path.id}</Badge><h3 className="text-[16px] font-bold text-ink">{path.title}</h3></div>
          <Card className="mt-2 p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">学习目标</div><p className="mt-1.5 text-[12px] leading-6 text-ink">{path.goal}</p></Card>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Card className="p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">前置知识</div><ul className="mt-1.5 space-y-1 text-[11.5px] leading-5 text-muted">{path.prerequisites.map((x) => <li key={x}>• {x}</li>)}</ul></Card>
            <Card className="p-3.5"><div className="text-[10px] font-semibold uppercase tracking-wider text-muted">学习成果</div><ul className="mt-1.5 space-y-1 text-[11.5px] leading-5 text-muted">{path.outcomes.map((x) => <li key={x}>• {x}</li>)}</ul></Card>
          </div>

          <div className="mt-3 text-[11.5px] font-semibold text-ink">章节顺序与实践任务（勾选记录本地进度）</div>
          <div className="mt-2 space-y-1.5">
            {path.steps.map((s, i) => {
              const key = `${path.id}:${i}`;
              const done = progress.includes(key);
              return (
                <Card key={key} className={cn("flex items-start gap-2.5 p-3", done && "border-leaf/40 bg-leaf/[0.05]")}>
                  <button type="button" onClick={() => setProgress(togglePathStep(key))} aria-label={done ? "取消完成" : "标记完成"} className={cn("mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", done ? "border-leaf bg-leaf text-white" : "border-line text-muted hover:border-brand")}>
                    {done ? <Check className="h-3 w-3" /> : <StepBadge step={i + 1} tone="blue" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><Link href={s.href} className={cn("text-[12.5px] font-semibold hover:underline", done ? "text-leaf line-through" : "text-ink")}>{s.label}</Link><ArrowUpRight className="h-3 w-3 text-muted" /></div>
                    <p className="mt-1 text-[11px] leading-6 text-muted"><strong className="text-ink">实践任务：</strong>{s.task}</p>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-brand" style={{ width: `${(path.steps.filter((_, i) => progress.includes(`${path.id}:${i}`)).length / path.steps.length) * 100}%` }} /></div>
            <span className="font-mono text-[10.5px] text-muted">{path.steps.filter((_, i) => progress.includes(`${path.id}:${i}`)).length}/{path.steps.length}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function RecentVisits() {
  const [visits, setVisits] = useState<{ href: string; title: string; at: number }[]>([]);
  useEffect(() => { setVisits(getRecentVisits()); }, []);
  return (
    <Card className="p-4">
      <div className="text-[12px] font-semibold text-ink">最近访问</div>
      {visits.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visits.slice(0, 10).map((v) => <Link key={v.href} href={v.href}><Badge tone="neutral" className="cursor-pointer hover:underline">{v.title}</Badge></Link>)}
        </div>
      ) : <p className="mt-2 text-[11px] text-muted">浏览专题后，这里会显示最近访问记录（仅保存在当前浏览器）。</p>}
    </Card>
  );
}

/* ================================================================== *
 * 全站搜索（页内常驻）
 * ================================================================== */
export function GlobalSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory | "全部">("全部");
  const results = useMemo(() => searchSite(query, category, 60), [query, category]);

  const go = (target: string) => router.push(target.startsWith("#") ? `/${target}` : target);

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Search className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">{results.length} 条结果</Badge>}>全站搜索 · 新旧内容统一检索</PanelTitle>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].target); }} placeholder="搜索章节、专题、概念、术语、代码示例、架构模式、ADR、工具…" className="h-11 w-full rounded-xl border border-line bg-elevated/50 pl-10 pr-3 text-[13px] text-ink outline-none focus:border-brand/60" />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {searchCategories.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={cn("rounded-lg border px-2 py-1 text-[10.5px] transition-colors", category === c ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{c}</button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[10px] text-muted">快捷：</span>
          {[
            { label: "代码示例搜索", category: "代码", q: "" },
            { label: "架构模式搜索", category: "模式", q: "" },
            { label: "术语搜索", category: "术语", q: "" },
            { label: "Data Governance", category: "全部", q: "governance" },
            { label: "Agentic RAG", category: "全部", q: "Agentic" },
          ].map((x) => (
            <button key={x.label} type="button" onClick={() => { setCategory(x.category as SearchCategory | "全部"); setQuery(x.q); }} className="rounded-md bg-elevated px-2 py-1 text-[10.5px] text-muted hover:text-ink">{x.label}</button>
          ))}
        </div>

        <div className="mt-4 max-h-[520px] space-y-1 overflow-y-auto pr-1">
          {results.map((entry) => (
            <button key={entry.id} type="button" onClick={() => go(entry.target)} className="flex w-full items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-left transition-colors hover:border-brand/40 hover:bg-elevated/60">
              <Badge tone={entry.category === "代码" ? "cyan" : entry.category === "模式" ? "purple" : entry.category === "ADR" ? "rose" : entry.category === "工具" ? "green" : "blue"} className="mt-0.5 shrink-0">{entry.category}</Badge>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium text-ink">{highlightText(entry.title, query)}</span>
                <span className="mt-0.5 block line-clamp-2 text-[11px] leading-5 text-muted">{highlightText(entry.excerpt, query)}</span>
                <span className="mt-0.5 block font-mono text-[9.5px] text-muted/80">{entry.target}</span>
              </span>
              <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted" />
            </button>
          ))}
          {!results.length ? <div className="p-8 text-center text-[11.5px] text-muted">没有匹配结果，试试更短的关键词或切换类别。</div> : null}
        </div>
      </div>
    </Card>
  );
}

/* ================================================================== *
 * 扩展术语词典
 * ================================================================== */
interface TermRow { key: string; term: string; cn: string; category: string; plain: string; technical: string; related: string[]; href?: string }

export function GlossaryV2() {
  const allTerms: TermRow[] = useMemo(() => [
    ...v2Glossary.map((t) => ({ key: `v2-${t.term}`, term: t.term, cn: t.cn, category: t.category, plain: t.plain, technical: t.technical, related: t.related, href: t.href })),
    ...glossary.map((t) => ({ key: `v1-${t.term}`, term: t.term, cn: t.cn, category: `V1 · ${String(t.category)}`, plain: t.plain, technical: t.technical, related: t.related ?? [], href: "/#appendix-glossary" })),
  ], []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [open, setOpen] = useState<string | null>(null);
  const categories = ["全部", ...Array.from(new Set(allTerms.map((t) => t.category)))];
  const filtered = allTerms.filter((t) => (category === "全部" || t.category === category)
    && (!query || `${t.term} ${t.cn} ${t.plain} ${t.technical} ${t.related.join(" ")}`.toLowerCase().includes(query.toLowerCase())));

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<BookOpen className="h-4 w-4 text-brand" />} right={<Badge tone="cyan">{allTerms.length} 条术语（V1 36 + V2 {v2Glossary.length}）</Badge>}>术语词典（扩展版）</PanelTitle>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索术语、中文名、技术解释或关联概念" className="h-10 w-full rounded-xl border border-line bg-elevated/50 pl-10 pr-3 text-[12.5px] text-ink outline-none focus:border-brand/60" />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {categories.map((c) => <button key={c} type="button" onClick={() => setCategory(c)} className={cn("rounded-md border px-1.5 py-0.5 text-[10px]", category === c ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{c}</button>)}
        </div>
        <div className="mt-3 space-y-1.5">
          {filtered.map((t) => (
            <div key={t.key} className="rounded-xl border border-line bg-surface">
              <button type="button" onClick={() => setOpen(open === t.key ? null : t.key)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
                <span className="text-[12.5px] font-semibold text-ink">{highlightText(t.term, query)}</span>
                <span className="text-[11px] text-muted">{highlightText(t.cn, query)}</span>
                <Badge tone={t.key.startsWith("v2-") ? "cyan" : "neutral"} className="ml-auto shrink-0">{t.category}</Badge>
                <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted transition-transform", open === t.key && "rotate-180")} />
              </button>
              {open === t.key ? (
                <div className="border-t border-line px-3 py-2.5">
                  <p className="text-[11.5px] leading-6 text-muted"><strong className="text-ink">通俗解释：</strong>{t.plain}</p>
                  <p className="mt-1.5 text-[11.5px] leading-6 text-muted"><strong className="text-ink">技术解释：</strong>{t.technical}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {t.related.map((r) => <Badge key={r} tone="neutral">{r}</Badge>)}
                    {t.href ? <Link href={t.href} className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline">查看相关章节 <ArrowUpRight className="h-3 w-3" /></Link> : null}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
          {!filtered.length ? <div className="p-8 text-center text-[11.5px] text-muted">没有匹配术语。</div> : null}
        </div>
      </div>
    </Card>
  );
}

/* ================================================================== *
 * 工具中心清单
 * ================================================================== */
const TOOL_CARDS = [
  { tag: "V1", name: "企业知识图谱交互工具", href: "/#ch2-graph", desc: "搜索节点、切换中心实体、1–3 跳关系浏览、按类型过滤、重置视图。" },
  { tag: "V1", name: "GraphRAG 架构 / 查询流程交互工具", href: "/#ch6-architecture", desc: "12 组件架构图、12 步时序、7 步可播放查询演示与证据引用展开。" },
  { tag: "V1", name: "企业技术选型决策器", href: "/#ch7-decision", desc: "11 题问卷、透明评分规则、覆盖规则与结果架构图。" },
  { tag: "V2-1", name: "Agentic RAG 流程模拟器", href: "/hub/agentic-rag#ar-simulator", desc: "自定义问题、规划分解、10 步轨迹、证据检查与带引用答案。" },
  { tag: "V2-2", name: "Knowledge Agent 架构设计器", href: "/hub/knowledge-agent#ka-designer", desc: "角色/工具/权限/知识服务配置与联动架构图生成。" },
  { tag: "V2-3", name: "Enterprise Semantic Model Explorer", href: "/hub/semantic-layer#sl-explorer", desc: "指标↔实体双向浏览、映射链路、公式、权限与版本。" },
  { tag: "V2-4", name: "Knowledge Governance Explorer", href: "/hub/data-governance#dg-explorer", desc: "血缘交互图、生命周期、必答问题与质量评分仪表盘。" },
  { tag: "V2-5", name: "Digital Twin Simulator", href: "/hub/digital-twin#dt-simulator", desc: "资产树、状态、趋势、告警、故障传播路径与维护建议。" },
  { tag: "V2+", name: "知识关系浏览器", href: "/hub/knowledge-map#km-browser", desc: "搜索、按域/关系过滤、1–3 跳、上下游查看与章节跳转。" },
  { tag: "V2+", name: "全屏企业知识架构图", href: "/hub/architecture#ea-map", desc: "八层架构、三套视图、层过滤与八项详情面板。" },
  { tag: "V2+", name: "架构模式库浏览器", href: "/hub/patterns#pt-library", desc: "十个模式统一模板与联动架构图。" },
];

export function ToolsList() {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {TOOL_CARDS.map((t) => (
          <Link key={t.name} href={t.href} className="group rounded-xl border border-line bg-surface p-3.5 transition-colors hover:border-brand/50 hover:bg-elevated/50">
            <div className="flex items-center gap-1.5"><Badge tone={t.tag.startsWith("V1") ? "neutral" : "cyan"}>{t.tag}</Badge><span className="text-[12.5px] font-semibold text-ink group-hover:text-brand">{t.name}</span></div>
            <p className="mt-1.5 text-[11px] leading-6 text-muted">{t.desc}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
