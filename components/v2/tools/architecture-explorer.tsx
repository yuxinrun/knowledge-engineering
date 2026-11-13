"use client";

import { useMemo, useState } from "react";
import { Maximize2, Minimize2, Network, Search } from "lucide-react";
import { Badge, Button, Card, PanelTitle } from "@/components/ui/primitives";
import { FlowCanvas, type DiagramSelection } from "@/components/viz/flow-canvas";
import { architectureDiagram } from "@/data/v2-diagrams";
import { archComponentById, archLayers, archViews, type ArchView } from "@/data/v2-architecture";
import { cn } from "@/lib/utils";

export function ArchitectureExplorer() {
  const [view, setView] = useState<ArchView>("logical");
  const [layer, setLayer] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("L5-HR");
  const [fullscreen, setFullscreen] = useState(false);

  const diagram = useMemo(() => {
    const base = architectureDiagram(view, layer);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    const matched = new Set(base.nodes.filter((n) => `${n.label} ${n.sub ?? ""} ${n.description ?? ""}`.toLowerCase().includes(q)).map((n) => n.id));
    if (!matched.size) return base;
    const keep = new Set(matched);
    base.edges.forEach((e) => { if (matched.has(e.source) || matched.has(e.target)) { keep.add(e.source); keep.add(e.target); } });
    return { ...base, nodes: base.nodes.filter((n) => keep.has(n.id)), edges: base.edges.filter((e) => keep.has(e.source) && keep.has(e.target)) };
  }, [view, layer, query]);

  const comp = selectedId ? archComponentById[selectedId] : undefined;
  const viewInfo = archViews.find((v) => v.key === view)!;

  const onSelect = (sel: DiagramSelection | null) => {
    if (sel?.type === "node") setSelectedId(sel.id.replace(/^EA-/, ""));
  };

  const detailFields = comp ? [
    ["职责", comp.responsibility], ["输入", comp.inputs], ["输出", comp.outputs],
    ["关键技术", comp.technologies], ["上下游关系", `${comp.upstream} → 【本组件】 → ${comp.downstream}`],
    ["设计决策", comp.decisions], ["常见反模式", comp.antiPatterns], ["可替代方案", comp.alternatives],
  ] : [];

  return (
    <div className={cn(fullscreen && "fixed inset-0 z-[70] overflow-y-auto bg-canvas p-3 sm:p-5")}>
      <Card className={cn("overflow-hidden", fullscreen && "mx-auto max-w-[1600px] shadow-float")}>
        <PanelTitle
          icon={<Network className="h-4 w-4 text-brand" />}
          right={<div className="flex items-center gap-1.5"><Badge tone="cyan">{diagram.nodes.length} 节点 / {diagram.edges.length} 连线</Badge><Button size="sm" variant="outline" onClick={() => setFullscreen((v) => !v)}>{fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}{fullscreen ? "退出全屏" : "全屏"}</Button></div>}
        >
          全屏可交互企业知识工程总体架构图
        </PanelTitle>
        <div className="p-4">
          <div className="rounded-xl border border-line bg-elevated/40 px-3 py-2 text-[11px] leading-5 text-muted">
            点击任意层或组件，右侧显示<strong className="text-ink">职责 / 输入 / 输出 / 关键技术 / 上下游关系 / 设计决策 / 常见反模式 / 可替代方案</strong>。支持节点拖动、缩放、按层过滤、按名称过滤与三套架构视图切换。
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-semibold text-muted">视图：</span>
            {archViews.map((v) => (
              <button key={v.key} type="button" onClick={() => setView(v.key)} className={cn("rounded-lg border px-2.5 py-1 text-[11px] transition-colors", view === v.key ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{v.label}</button>
            ))}
          </div>
          <div className="mt-1.5 text-[10.5px] leading-5 text-muted">{viewInfo.description}</div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-semibold text-muted">层过滤：</span>
            <button type="button" onClick={() => setLayer(null)} className={cn("rounded-lg border px-2 py-1 text-[10.5px] transition-colors", layer === null ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>全部 8 层</button>
            {archLayers.map((l) => (
              <button key={l.id} type="button" onClick={() => setLayer(l.no)} title={`${l.title} · ${l.subtitle}`} className={cn("rounded-lg border px-2 py-1 text-[10.5px] transition-colors", layer === l.no ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{l.id} · {l.en}</button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="过滤组件名称，例如 图 / 权限 / 语义 / Agent" className="h-9 w-full rounded-lg border border-line bg-elevated/50 pl-8 pr-2 text-[11.5px] text-ink outline-none focus:border-brand/60" />
            </div>
            {query ? <button type="button" onClick={() => setQuery("")} className="text-[11px] text-muted hover:text-ink">清除</button> : null}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
            <div data-print="hide">
              <FlowCanvas
                key={`${view}-${layer ?? "all"}-${query}`}
                nodes={diagram.nodes} edges={diagram.edges} legend={diagram.legend}
                height={fullscreen ? 640 : 520} showDetails={false} minimap
                onSelect={onSelect} caption="节点可拖动 / 缩放；点击节点在右侧查看八项设计详情。架构图为教学模型，不代表真实部署拓扑。"
              />
            </div>
            <div className="min-w-0">
              <div className="mb-2 text-[11px] font-semibold text-ink">组件详情面板</div>
              {comp ? (
                <Card className="max-h-[560px] overflow-y-auto p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5"><Badge tone="blue">L{comp.layer} · {archLayers[comp.layer - 1]?.en}</Badge><Badge tone="neutral">{comp.id}</Badge></div>
                  <h3 className="mt-2 text-[14px] font-bold text-ink">{comp.labels[view === "logical" ? 0 : view === "azure" ? 1 : 2]}</h3>
                  <div className="mt-3 space-y-2.5">
                    {detailFields.map(([label, value]) => (
                      <div key={label} className="border-t border-line pt-2.5 first:border-t-0 first:pt-0">
                        <div className={cn("text-[10px] font-semibold uppercase tracking-wider", label === "常见反模式" ? "text-rose-500" : "text-muted")}>{label}</div>
                        <p className="mt-1 text-[11.5px] leading-6 text-ink/90">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 text-center text-[11.5px] text-muted">点击左侧任意组件节点查看详情。</Card>
              )}
              <div className="mt-3 rounded-xl border border-line bg-elevated/40 p-3 text-[10.5px] leading-5 text-muted">
                <strong className="text-ink">视图说明：</strong>三套视图共用同一份组件定义与连线，只替换命名。Azure 视图仅为能力映射示例，不是唯一标准答案；产品能力具版本敏感性，请以官方文档为准。
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
