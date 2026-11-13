"use client";

import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  Handle, MarkerType, Position, ReactFlow, useNodesState,
  type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import { Database, Layers3, Pause, Play, RefreshCw, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { palette } from "@/data/palette";
import { cn } from "@/lib/utils";

interface Phase {
  id: string;
  label: string;
  cn: string;
  desc: string;
  color: string;
  position: { x: number; y: number };
}

const phases: Phase[] = [
  { id: "ontology", label: "ONTOLOGY", cn: "定义语义", desc: "用 Class、Property、Axiom 约定企业世界里什么可以被陈述。", color: palette.violet, position: { x: 200, y: 0 } },
  { id: "kg", label: "KNOWLEDGE GRAPH", cn: "组织事实", desc: "把真实实体、关系与来源组织成可查询的图数据。", color: palette.brand, position: { x: 400, y: 170 } },
  { id: "graphrag", label: "GRAPHRAG", cn: "检索与生成", desc: "图检索 + 文档/向量检索 + 证据约束下的答案生成。", color: palette.azure, position: { x: 200, y: 340 } },
  { id: "evidence", label: "EVIDENCE", cn: "验证与迭代", desc: "引用、权限、时效与评估回流，驱动知识持续演进。", color: palette.accent, position: { x: 0, y: 170 } },
];

const ICONS: Record<string, LucideIcon> = {
  ontology: Layers3, kg: Database, graphrag: Sparkles, evidence: ShieldCheck,
};

type PhaseData = { label: string; cn: string; iconKey: string; color: string; active: boolean };
type CoreData = { note: string };
type PhaseNode = Node<PhaseData, "loopPhase">;
type CoreNode = Node<CoreData, "loopCore">;
type AnyNode = PhaseNode | CoreNode;

const HANDLE_STYLE = { width: 5, height: 5, opacity: 0.35, border: "1px solid rgba(255,255,255,.8)" };

function LoopHandles({ color }: { color: string }) {
  return (
    <>
      <Handle type="target" position={Position.Top} id="t-t" style={{ ...HANDLE_STYLE, background: color, left: "32%" }} />
      <Handle type="source" position={Position.Top} id="s-t" style={{ ...HANDLE_STYLE, background: color, left: "68%" }} />
      <Handle type="target" position={Position.Left} id="t-l" style={{ ...HANDLE_STYLE, background: color, top: "32%" }} />
      <Handle type="source" position={Position.Left} id="s-l" style={{ ...HANDLE_STYLE, background: color, top: "68%" }} />
      <Handle type="target" position={Position.Right} id="t-r" style={{ ...HANDLE_STYLE, background: color, top: "32%" }} />
      <Handle type="source" position={Position.Right} id="s-r" style={{ ...HANDLE_STYLE, background: color, top: "68%" }} />
      <Handle type="source" position={Position.Bottom} id="s-b" style={{ ...HANDLE_STYLE, background: color, left: "32%" }} />
      <Handle type="target" position={Position.Bottom} id="t-b" style={{ ...HANDLE_STYLE, background: color, left: "68%" }} />
    </>
  );
}

function LoopPhaseNode({ data, selected }: NodeProps<PhaseNode>) {
  const Icon = ICONS[data.iconKey] ?? Layers3;
  return (
    <div
      className={cn(
        "relative flex h-[96px] w-[138px] flex-col items-center justify-center rounded-2xl border bg-surface px-2 text-center transition-all duration-300",
        "shadow-card",
        data.active || selected ? "scale-[1.05] border-brand ring-2 ring-brand/40" : "border-line"
      )}
    >
      <LoopHandles color={data.color} />
      <span className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ background: `${data.color}1A`, color: data.color }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-[11.5px] font-bold leading-4 text-ink">{data.cn}</span>
      <span className="mt-0.5 font-mono text-[8.5px] leading-3 text-muted">{data.label}</span>
    </div>
  );
}

function LoopCoreNode(_: NodeProps<CoreNode>) {
  return (
    <div className="flex h-[168px] w-[168px] flex-col items-center justify-center rounded-full border border-dashed border-brand/70 bg-surface/90 text-center shadow-card">
      <div className="font-mono text-[8.5px] tracking-[0.2em] text-brand">KNOWLEDGE LOOP</div>
      <div className="mt-1.5 font-mono text-[11px] font-semibold text-ink">while (evidence)</div>
      <div className="mt-1 text-[9px] leading-4 text-muted">语义 → 事实 → 答案<br />→ 校验 → 迭代</div>
    </div>
  );
}

const nodeTypes = { loopPhase: LoopPhaseNode, loopCore: LoopCoreNode };

const initialNodes: AnyNode[] = [
  ...phases.map((p) => ({
    id: p.id, type: "loopPhase" as const, position: p.position,
    data: { label: p.label, cn: p.cn, iconKey: p.id, color: p.color, active: false },
  })),
  { id: "core", type: "loopCore" as const, position: { x: 185, y: 134 }, data: { note: "" } },
];

const edgeDefs = [
  { id: "loop-e1", source: "ontology", target: "kg", sourceHandle: "s-r", targetHandle: "t-l" },
  { id: "loop-e2", source: "kg", target: "graphrag", sourceHandle: "s-b", targetHandle: "t-t" },
  { id: "loop-e3", source: "graphrag", target: "evidence", sourceHandle: "s-l", targetHandle: "t-r" },
  { id: "loop-e4", source: "evidence", target: "ontology", sourceHandle: "s-t", targetHandle: "t-b" },
];

export function KnowledgeLoop() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<AnyNode>(initialNodes);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActiveIdx((i) => (i + 1) % phases.length), 2200);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    setNodes((current) => current.map((node) => (
      node.type === "loopPhase"
        ? { ...node, data: { ...node.data, active: node.id === phases[activeIdx].id } }
        : node
    )));
  }, [activeIdx, setNodes]);

  const edges = useMemo<Edge[]>(() => edgeDefs.map((def, i) => {
    const active = i === activeIdx;
    const color = active ? palette.brand : palette.brandSoft;
    return {
      ...def,
      type: "default",
      animated: true,
      style: { stroke: color, strokeWidth: active ? 2.4 : 1.5, opacity: active ? 1 : 0.75 },
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 12, height: 12 },
    } as Edge;
  }), [activeIdx]);

  const onNodeClick = (_: ReactMouseEvent, node: Node) => {
    const idx = phases.findIndex((p) => p.id === node.id);
    if (idx >= 0) {
      setActiveIdx(idx);
      setPlaying(false);
    }
  };

  const current = phases[activeIdx];

  return (
    <div>
      <div className="relative h-[330px] w-full sm:h-[400px]" data-print="hide">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, maxZoom: 1.05 }}
          minZoom={0.45}
          maxZoom={1.5}
          nodesConnectable={false}
          nodesDraggable
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          className="bg-transparent"
        />
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 border-t border-line pt-2.5" data-print="hide">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand">CONTEXT → ACTION → VERIFY → LOOP</div>
          <div className="mt-0.5 truncate text-[11px] text-muted">
            <b className="text-ink">{current.cn}</b> · {current.desc}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "暂停循环动画" : "播放循环动画"}
            title={playing ? "暂停" : "播放"}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-ink hover:bg-elevated"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => { setActiveIdx(0); setPlaying(true); }}
            aria-label="重置循环"
            title="重置"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-ink hover:bg-elevated"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-1 text-[10px] text-muted" data-print="hide">节点可拖动 · 点击查看阶段说明 · 连线动画表示知识持续迭代</div>
      <div className="hidden text-[10.5pt] leading-6 print:block">
        知识工程循环（打印版）：Ontology 定义语义 → Knowledge Graph 组织事实 → GraphRAG 检索与生成 → Evidence 验证与迭代 → 回到 Ontology 持续演进。
      </div>
    </div>
  );
}
