"use client";

import { useState } from "react";
import { Card, Badge, StepBadge } from "@/components/ui/primitives";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import {
  fusionDiagram, neo4jModel, objectPropertyGraph, pipelineDiagram, pipelineSteps, ragComparisonDiagram,
} from "@/data/diagrams";
import { cn } from "@/lib/utils";

/** 可视化 4：Object Property 关系图 */
export function ObjectPropertyGraph() {
  return (
    <FlowCanvas
      nodes={objectPropertyGraph.nodes}
      edges={objectPropertyGraph.edges}
      legend={objectPropertyGraph.legend}
      height={460}
      edgeType="default"
      caption="点击任意连线查看 Domain / Range / Cardinality 与语义边界。calls 与 dependsOn 不可混用；关系方向必须与写入脚本一致。"
    />
  );
}

/** 可视化 5：文档到知识图谱 Pipeline */
export function PipelineDiagram() {
  const [stepId, setStepId] = useState("p4");
  const step = pipelineSteps.find((s) => s.id === stepId) ?? pipelineSteps[0];
  return (
    <div>
      <FlowCanvas
        nodes={pipelineDiagram.nodes}
        edges={pipelineDiagram.edges}
        legend={pipelineDiagram.legend}
        height={430}
        caption="10 个步骤构成可回放 Pipeline。点击节点查看输入 / 输出 / 技术选择 / 常见问题 / 失败处理；连线可点击查看数据交接。"
        toolbar={<Badge tone="blue">离线构建链路 · 点击节点查看详情</Badge>}
      />
      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-line bg-elevated/60 px-3 py-2 text-xs font-semibold text-ink">逐步查看处理契约</div>
        <div className="flex flex-wrap gap-1.5 border-b border-line px-3 py-2.5">
          {pipelineSteps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStepId(s.id)}
              className={cn("rounded-md border px-2 py-1 text-[11px] transition-colors", stepId === s.id ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}
            >
              {i + 1}. {s.label.replace(/^\d+\s/, "").slice(0, 8)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-2">
            <StepBadge step={pipelineSteps.indexOf(step) + 1} />
            <span className="text-sm font-semibold text-ink">{step.label}</span>
            <Badge tone="neutral">{step.sub}</Badge>
          </div>
          {[
            ["输入", step.input], ["处理逻辑", step.logic], ["输出", step.output],
            ["技术选择", step.tech], ["常见问题", step.pitfall], ["失败处理", step.failure],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-line bg-elevated/50 p-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">{label}</div>
              <div className="mt-1 text-[12px] leading-5 text-ink">{value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** 可视化 7：Knowledge Fusion 来源融合图 */
export function FusionDiagram() {
  return (
    <FlowCanvas
      nodes={fusionDiagram.nodes}
      edges={fusionDiagram.edges}
      legend={fusionDiagram.legend}
      height={420}
      caption="三份来源给出不同表述：权威性、时间新旧、证据数量与人工审核共同决定采信结果；置信度与来源权威性是两个不同维度。"
    />
  );
}

/** 可视化 8：Neo4j 数据模型图 */
export function Neo4jModelDiagram() {
  return (
    <FlowCanvas
      nodes={neo4jModel.nodes}
      edges={neo4jModel.edges}
      legend={neo4jModel.legend}
      height={450}
      edgeType="default"
      caption="Label → Property → Relationship 的属性图模型。:Service（被调用）是为展示 CALLS 自环关系绘制的第二个节点，实际为同一 Label。"
    />
  );
}

/** 可视化 11：Traditional RAG 与 GraphRAG 对比图 */
export function RagComparisonDiagram() {
  return (
    <FlowCanvas
      nodes={ragComparisonDiagram.nodes}
      edges={ragComparisonDiagram.edges}
      legend={ragComparisonDiagram.legend}
      height={620}
      minimap={false}
      caption="左：文档检索单链路；右：抽取建图后形成图检索 + 文档检索双路证据，再融合生成。右侧成本、延迟与维护复杂度更高，仅对特定问题类型更优。"
    />
  );
}
