"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw, Search, X } from "lucide-react";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { itopsGraph } from "@/data/itops";
import { nodeColor } from "@/data/diagram-types";
import { cn } from "@/lib/utils";

function computeDistances(root: string): Map<string, number> {
  const dist = new Map<string, number>([[root, 0]]);
  const queue: string[] = [root];
  while (queue.length) {
    const current = queue.shift()!;
    const d = dist.get(current)!;
    for (const edge of itopsGraph.edges) {
      const next = edge.source === current ? edge.target : edge.target === current ? edge.source : null;
      if (next && !dist.has(next)) {
        dist.set(next, d + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

export function KnowledgeGraphExplorer() {
  const [root, setRoot] = useState("payment-service");
  const [hops, setHops] = useState<1 | 2 | 3>(3);
  const [hiddenKinds, setHiddenKinds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<string | null>(null);
  const [fitKey, setFitKey] = useState(0);

  const distances = useMemo(() => computeDistances(root), [root]);
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return itopsGraph.nodes.filter((n) => `${n.label} ${n.sub ?? ""} ${n.id}`.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const visibleNodes = useMemo(
    () => itopsGraph.nodes.filter((n) => n.id === root || ((distances.get(n.id) ?? Infinity) <= hops && !hiddenKinds.has(n.kind))),
    [distances, hops, hiddenKinds, root]
  );
  const visibleEdges = useMemo(() => {
    const ids = new Set(visibleNodes.map((n) => n.id));
    return itopsGraph.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
  }, [visibleNodes]);

  const toggleKind = (kind: string) => {
    setHiddenKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind); else next.add(kind);
      return next;
    });
    setFitKey((k) => k + 1);
  };

  const resetAll = () => {
    setRoot("payment-service");
    setHops(3);
    setHiddenKinds(new Set());
    setQuery("");
    setFocus(null);
    setFitKey((k) => k + 1);
  };

  const rootLabel = itopsGraph.nodes.find((n) => n.id === root)?.label ?? root;

  return (
    <div>
      <Card className="mb-4 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_auto_auto]">
          <div className="relative">
            <label className="mb-1 block text-[11px] font-medium text-muted" htmlFor="kg-search">搜索节点</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                id="kg-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="PaymentService / 支付 / RB-001"
                className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-7 text-xs text-ink outline-none focus:border-brand/60"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="清空搜索" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
            {matches.length ? (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-line bg-surface shadow-float">
                {matches.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setRoot(m.id); setFocus(m.id); setQuery(""); setFitKey((k) => k + 1); }}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs hover:bg-elevated"
                  >
                    <span className="font-medium text-ink">{m.label}</span>
                    <span className="text-[10px] text-muted">{m.sub}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-muted" htmlFor="kg-root">遍历中心实体</label>
            <select
              id="kg-root"
              value={root}
              onChange={(e) => { setRoot(e.target.value); setFocus(e.target.value); setFitKey((k) => k + 1); }}
              className="h-9 w-full rounded-lg border border-line bg-surface px-2 text-xs text-ink outline-none focus:border-brand/60"
            >
              {itopsGraph.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <span className="mb-1 block text-[11px] font-medium text-muted">关系跳数</span>
            <div className="flex h-9 items-center rounded-lg border border-line bg-elevated p-0.5">
              {([1, 2, 3] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => { setHops(h); setFitKey((k) => k + 1); }}
                  className={cn("h-8 rounded-md px-2.5 text-xs font-medium transition-colors", hops === h ? "bg-surface text-brand shadow-card" : "text-muted hover:text-ink")}
                >
                  {h} 跳
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={resetAll} className="h-9 w-full sm:w-auto">
              <RotateCcw className="h-3.5 w-3.5" /> 重置全部
            </Button>
          </div>
        </div>
        <div className="mt-3 border-t border-line pt-3">
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted">
            <Filter className="h-3.5 w-3.5" /> 显示 / 隐藏节点类型（点击切换）
          </div>
          <div className="flex flex-wrap gap-1.5">
            {itopsGraph.legend.map((item) => {
              const hidden = hiddenKinds.has(item.kind);
              return (
                <button
                  key={item.kind}
                  type="button"
                  onClick={() => toggleKind(item.kind)}
                  aria-pressed={!hidden}
                  className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-opacity", hidden ? "border-line bg-elevated text-muted opacity-45 line-through" : "border-line bg-surface text-ink")}
                >
                  <span className="h-2 w-2 rounded-sm" style={{ background: item.color ?? nodeColor(item.kind) }} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
      <FlowCanvas
        nodes={visibleNodes}
        edges={visibleEdges}
        legend={itopsGraph.legend}
        height={520}
        fitKey={`${root}-${hops}-${fitKey}`}
        focusNodeId={focus}
        edgeType="default"
        toolbar={
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
            <Badge tone="cyan">交互图谱</Badge>
            <span>显示 <b className="text-ink">{visibleNodes.length}</b> 个节点 / <b className="text-ink">{visibleEdges.length}</b> 条关系</span>
            <span>· 中心：<b className="text-ink">{rootLabel}</b> · ≤ {hops} 跳</span>
          </div>
        }
        caption="节点可拖动；点击节点查看属性与关联，点击连线查看关系定义；支持缩放、平移、搜索、类型过滤与 1/2/3 跳切换。核心 7 条事实与扩展演示节点均为教学示例数据。"
      />
    </div>
  );
}
