"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import {
  Background, BackgroundVariant, Controls, Handle, MarkerType, MiniMap, Panel, Position,
  ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow,
  type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import { Activity, RotateCcw, X } from "lucide-react";
import { hexToRgba, nodeColor, nodeKindLabel, type DiagramEdge, type DiagramNode, type LegendItem, type NodeDetail } from "@/data/diagram-types";
import { cn } from "@/lib/utils";

type CanvasNodeData = {
  label: string;
  sub?: string;
  kind: string;
  description?: string;
  details?: NodeDetail[];
  badge?: string;
  emphasis?: boolean;
};
type CanvasNode = Node<CanvasNodeData, "semantic">;

export interface DiagramSelection {
  type: "node" | "edge";
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  details?: NodeDetail[];
  relations?: string[];
}

const HANDLE_STYLE = { width: 6, height: 6, opacity: 0.45, border: "1px solid rgba(255,255,255,.75)" };

function SemanticNode({ data, selected }: NodeProps<CanvasNode>) {
  const color = nodeColor(data.kind);
  return (
    <div
      className={cn(
        "relative min-w-[150px] max-w-[210px] rounded-xl border bg-surface px-3 py-2.5 shadow-card transition-shadow",
        selected ? "ring-2 ring-offset-2 ring-offset-[rgb(var(--canvas))]" : "hover:shadow-float"
      )}
      style={{ borderColor: hexToRgba(color, 0.65), boxShadow: selected ? `0 0 0 3px ${hexToRgba(color, 0.24)}` : undefined }}
    >
      <Handle type="target" position={Position.Top} id="t-t" style={{ ...HANDLE_STYLE, background: color, left: "32%" }} />
      <Handle type="source" position={Position.Top} id="s-t" style={{ ...HANDLE_STYLE, background: color, left: "68%" }} />
      <Handle type="target" position={Position.Left} id="t-l" style={{ ...HANDLE_STYLE, background: color, top: "32%" }} />
      <Handle type="source" position={Position.Left} id="s-l" style={{ ...HANDLE_STYLE, background: color, top: "68%" }} />
      <Handle type="target" position={Position.Right} id="t-r" style={{ ...HANDLE_STYLE, background: color, top: "32%" }} />
      <Handle type="source" position={Position.Right} id="s-r" style={{ ...HANDLE_STYLE, background: color, top: "68%" }} />
      <Handle type="source" position={Position.Bottom} id="s-b" style={{ ...HANDLE_STYLE, background: color, left: "32%" }} />
      <Handle type="target" position={Position.Bottom} id="t-b" style={{ ...HANDLE_STYLE, background: color, left: "68%" }} />
      <div className="flex items-start gap-2">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
        <div className="min-w-0">
          <div className="truncate text-[12.5px] font-semibold leading-5 text-ink">{data.label}</div>
          {data.sub ? <div className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted">{data.sub}</div> : null}
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="rounded px-1.5 py-0.5 text-[9px] font-medium" style={{ color, background: hexToRgba(color, 0.12) }}>
          {nodeKindLabel(data.kind)}
        </span>
        {data.badge ? <span className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[9px] text-muted">{data.badge}</span> : null}
      </div>
    </div>
  );
}

const nodeTypes = { semantic: SemanticNode };

function pickHandles(a?: DiagramNode, b?: DiagramNode) {
  if (!a || !b) return { sourceHandle: "s-b", targetHandle: "t-t" };
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  if (Math.abs(dx) > Math.abs(dy) * 1.15) {
    return dx > 0 ? { sourceHandle: "s-r", targetHandle: "t-l" } : { sourceHandle: "s-l", targetHandle: "t-r" };
  }
  return dy >= 0 ? { sourceHandle: "s-b", targetHandle: "t-t" } : { sourceHandle: "s-t", targetHandle: "t-b" };
}

export interface FlowCanvasProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  height?: number;
  toolbar?: ReactNode;
  legend?: LegendItem[];
  showDetails?: boolean;
  onSelect?: (selection: DiagramSelection | null) => void;
  focusNodeId?: string | null;
  fitKey?: string;
  edgeType?: "smoothstep" | "default" | "straight";
  defaultAnimated?: boolean;
  minimap?: boolean;
  caption?: string;
  className?: string;
}

function CanvasInner({
  nodes, edges, height = 440, toolbar, legend, showDetails = true, onSelect,
  focusNodeId, fitKey = "", edgeType = "smoothstep", defaultAnimated = true, minimap = true, caption, className,
}: FlowCanvasProps) {
  const { fitView, setCenter } = useReactFlow();
  const [animated, setAnimated] = useState(defaultAnimated);
  const [selection, setSelection] = useState<DiagramSelection | null>(null);

  const rfNodes = useMemo<CanvasNode[]>(
    () => nodes.map((n) => ({
      id: n.id, type: "semantic", position: n.position,
      data: {
        label: n.label, sub: n.sub, kind: n.kind, description: n.description,
        details: n.details, badge: n.badge, emphasis: n.emphasis,
      },
    })), [nodes]
  );

  const rfEdges = useMemo<Edge[]>(() => {
    const map = new Map(nodes.map((n) => [n.id, n]));
    return edges.map((e) => {
      const color = nodeColor(e.kind ?? "source");
      const handles = pickHandles(map.get(e.source), map.get(e.target));
      return {
        id: e.id, source: e.source, target: e.target,
        sourceHandle: handles.sourceHandle, targetHandle: handles.targetHandle,
        type: edgeType,
        label: e.label,
        animated: animated && (e.animated ?? false),
        data: { detail: e.description },
        style: { stroke: color, strokeWidth: 1.7, opacity: 0.85 },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
        labelStyle: { fill: "rgb(var(--muted))", fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: "rgb(var(--surface))", fillOpacity: 0.92 },
        labelBgPadding: [5, 2] as [number, number],
        labelBgBorderRadius: 4,
      } as Edge;
    });
  }, [nodes, edges, edgeType, animated]);

  const [renderNodes, setRenderNodes, onNodesChange] = useNodesState<CanvasNode>(rfNodes);
  const [renderEdges, setRenderEdges, onEdgesChange] = useEdgesState<Edge>(rfEdges);

  useEffect(() => { setRenderNodes(rfNodes); }, [rfNodes, setRenderNodes]);
  useEffect(() => { setRenderEdges(rfEdges); }, [rfEdges, setRenderEdges]);

  useEffect(() => {
    const timer = window.setTimeout(() => fitView({ padding: 0.18, duration: 350, maxZoom: 1.25 }), 90);
    return () => window.clearTimeout(timer);
  }, [fitKey, fitView]);

  useEffect(() => {
    if (!focusNodeId) return;
    const target = nodes.find((n) => n.id === focusNodeId);
    if (target) {
      setCenter(target.position.x + 90, target.position.y + 30, { zoom: 1.15, duration: 500 });
      setSelection({
        type: "node", id: target.id, title: target.label,
        subtitle: nodeKindLabel(target.kind), description: target.description, details: target.details,
        relations: edges.filter((e) => e.source === target.id || e.target === target.id).map((e) => {
          const other = nodes.find((n) => n.id === (e.source === target.id ? e.target : e.source));
          return `${e.source === target.id ? "→" : "←"} ${e.label ?? "关联"} ${other?.label ?? ""}`;
        }),
      });
    }
  }, [focusNodeId, nodes, edges, setCenter]);

  const select = useCallback((next: DiagramSelection | null) => {
    setSelection(next);
    onSelect?.(next);
  }, [onSelect]);

  const onNodeClick = useCallback((_: ReactMouseEvent, node: Node) => {
    const source = nodes.find((n) => n.id === node.id);
    if (!source) return;
    const relations = edges.filter((e) => e.source === source.id || e.target === source.id).map((e) => {
      const other = nodes.find((n) => n.id === (e.source === source.id ? e.target : e.source));
      return `${e.source === source.id ? "→" : "←"} ${e.label ?? "关联"} ${other?.label ?? ""}`;
    });
    select({
      type: "node", id: source.id, title: source.label, subtitle: nodeKindLabel(source.kind),
      description: source.description, details: source.details, relations,
    });
  }, [nodes, edges, select]);

  const onEdgeClick = useCallback((_: ReactMouseEvent, edge: Edge) => {
    const source = edges.find((e) => e.id === edge.id);
    if (!source) return;
    const a = nodes.find((n) => n.id === source.source);
    const b = nodes.find((n) => n.id === source.target);
    select({
      type: "edge", id: source.id, title: source.label ?? "关系",
      subtitle: `${a?.label ?? source.source} → ${b?.label ?? source.target}`,
      description: source.description,
      details: [{ label: "起点", value: a?.label ?? source.source }, { label: "终点", value: b?.label ?? source.target }],
    });
  }, [nodes, edges, select]);

  const reset = () => {
    setSelection(null);
    onSelect?.(null);
    fitView({ padding: 0.18, duration: 450, maxZoom: 1.25 });
  };

  const printSummary = useMemo(() => {
    const nodeText = nodes.map((n) => n.label).join("、");
    const edgeText = edges.slice(0, 14).map((e) => {
      const a = nodes.find((n) => n.id === e.source)?.label ?? e.source;
      const b = nodes.find((n) => n.id === e.target)?.label ?? e.target;
      return `${a} —${e.label ?? "关联"}→ ${b}`;
    }).join("；");
    return { nodeText, edgeText };
  }, [nodes, edges]);

  return (
    <div className={cn("my-5 overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2" data-print="hide">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{toolbar}</div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAnimated((v) => !v)}
              aria-pressed={animated}
              title="切换连线数据流动动画"
              className={cn("inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] transition-colors", animated ? "border-brand/50 bg-brand/10 text-brand" : "border-line text-muted hover:bg-surface")}
            >
              <Activity className="h-3.5 w-3.5" /> 数据流
            </button>
            <button
              type="button"
              onClick={reset}
              title="重置视图"
              className="inline-flex h-7 items-center gap-1 rounded-md border border-line px-2 text-[11px] text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 重置
            </button>
          </div>
      </div>
      <div className="relative" style={{ height }} data-print="hide">
        <ReactFlow
          nodes={renderNodes}
          edges={renderEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={() => select(null)}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18, maxZoom: 1.25 }}
          minZoom={0.25}
          maxZoom={2}
          nodesConnectable={false}
          nodesDraggable
          proOptions={{ hideAttribution: true }}
          className="bg-[rgb(var(--canvas))]"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(100,116,139,.28)" />
          <Controls showInteractive={false} position="bottom-left" />
          {minimap ? (
            <MiniMap pannable zoomable nodeColor={(n) => nodeColor((n.data as CanvasNodeData).kind)} maskColor="rgba(100,116,139,.12)" position="bottom-right" />
          ) : null}
          {showDetails && selection ? (
            <Panel position="top-right" className="!m-2 w-[230px] max-w-[62vw] sm:w-[250px]">
              <div className="max-h-[260px] overflow-y-auto rounded-xl border border-line bg-surface/95 p-3 shadow-float backdrop-blur">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                      {selection.type === "node" ? "节点详情" : "关系定义"}
                    </div>
                    <div className="mt-0.5 text-sm font-bold leading-5 text-ink">{selection.title}</div>
                    {selection.subtitle ? <div className="text-[10px] text-muted">{selection.subtitle}</div> : null}
                  </div>
                  <button type="button" onClick={() => select(null)} aria-label="关闭详情" className="rounded p-1 text-muted hover:bg-elevated">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {selection.description ? <p className="mb-2 text-[11.5px] leading-5 text-muted">{selection.description}</p> : null}
                {selection.details?.length ? (
                  <dl className="mb-2 space-y-1">
                    {selection.details.map((d, i) => (
                      <div key={i} className="grid grid-cols-[64px_1fr] gap-1 text-[10.5px] leading-4">
                        <dt className="font-medium text-muted">{d.label}</dt>
                        <dd className="text-ink">{d.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {selection.relations?.length ? (
                  <div className="border-t border-line pt-2">
                    <div className="mb-1 text-[10px] font-semibold text-muted">关联关系（{selection.relations.length}）</div>
                    <ul className="space-y-0.5">
                      {selection.relations.slice(0, 8).map((r, i) => (
                        <li key={i} className="truncate font-mono text-[10px] text-cyan-600 dark:text-cyan-300">{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Panel>
          ) : null}
        </ReactFlow>
      </div>
      {legend?.length ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line px-3 py-2" data-print="hide">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">图例</span>
          {legend.map((item) => (
            <span key={item.kind} className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color ?? nodeColor(item.kind) }} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
      {caption ? <div className="border-t border-line bg-elevated/50 px-3 py-2 text-[11px] leading-5 text-muted">{caption}</div> : null}
      <div className="hidden border-t border-line px-4 py-3 text-[10.5pt] leading-6 print:block">
        <div className="font-semibold">图（打印版摘要）</div>
        <div>节点：{printSummary.nodeText}</div>
        <div>关系：{printSummary.edgeText}{edges.length > 14 ? " 等" : ""}</div>
        {caption ? <div>说明：{caption}</div> : null}
      </div>
    </div>
  );
}

export function FlowCanvas(props: FlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
