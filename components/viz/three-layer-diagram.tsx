"use client";

import { useState } from "react";
import { Layers3, Split } from "lucide-react";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { heroDiagram, independentLayers } from "@/data/diagrams";
import { cn } from "@/lib/utils";

export function ThreeLayerDiagram({ variant = "hero" }: { variant?: "hero" | "chapter" }) {
  const [mode, setMode] = useState<"combined" | "independent">("combined");
  const isHero = variant === "hero";
  const data = isHero || mode === "combined"
    ? heroDiagram
    : { ...independentLayers, legend: heroDiagram.legend };

  return (
    <div>
      {!isHero ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("combined")}
            className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors", mode === "combined" ? "border-brand/50 bg-brand/10 text-brand" : "border-line bg-surface text-muted hover:text-ink")}
          >
            <Layers3 className="h-3.5 w-3.5" /> 常见组合视图
          </button>
          <button
            type="button"
            onClick={() => setMode("independent")}
            className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors", mode === "independent" ? "border-brand/50 bg-brand/10 text-brand" : "border-line bg-surface text-muted hover:text-ink")}
          >
            <Split className="h-3.5 w-3.5" /> 独立使用视图
          </button>
          <span className="text-[11px] text-muted">切换视图可验证：三者不是必须串联的固定流水线。</span>
        </div>
      ) : null}
      <FlowCanvas
        nodes={data.nodes}
        edges={data.edges}
        legend={data.legend}
        height={isHero ? 470 : 480}
        fitKey={`${variant}-${mode}`}
        defaultAnimated
        caption={mode === "independent" && !isHero
          ? "独立视图：Ontology、Knowledge Graph、GraphRAG 各自可以单独创造价值。是否组合取决于业务问题与治理成本。"
          : "概念性常见架构，不是强制流水线：可直接做传统 RAG，也可只用知识图谱做确定性查询。点击节点或连线查看定义，节点可拖动。"}
      />
    </div>
  );
}
