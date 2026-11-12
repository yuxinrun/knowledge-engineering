"use client";

import { useState } from "react";
import { Boxes, MousePointerClick } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { FlowCanvas, type DiagramSelection } from "@/components/viz/flow-canvas";
import { azureArchitecture, azureComponents } from "@/data/azure";
import { cn } from "@/lib/utils";

export function AzureArchitectureDiagram() {
  const [selection, setSelection] = useState<DiagramSelection | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const component = selection?.type === "node" ? azureComponents.find((c) => c.id === selection.id) : undefined;

  const quickSelect = (id: string) => {
    const c = azureComponents.find((x) => x.id === id);
    if (!c) return;
    setFocusId(id);
    setSelection({
      type: "node", id, title: c.name, subtitle: c.layer, description: c.responsibility,
      details: [
        { label: "组件职责", value: c.responsibility }, { label: "输入", value: c.input }, { label: "输出", value: c.output },
        { label: "技术选型", value: c.tech }, { label: "常见故障", value: c.failure }, { label: "实施注意事项", value: c.caution },
      ],
    });
  };

  return (
    <div className="my-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <FlowCanvas
        className="!my-0"
        nodes={azureArchitecture.nodes}
        edges={azureArchitecture.edges}
        legend={azureArchitecture.legend}
        height={520}
        showDetails={false}
        onSelect={setSelection}
        focusNodeId={focusId}
        caption="Azure 企业级 GraphRAG 参考架构：Neo4j 存实体关系，Azure AI Search 存 Chunk / 向量，Azure OpenAI 负责抽取、Embedding 与生成，Python/FastAPI 负责编排、权限与业务逻辑。点击组件查看右侧详情。"
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="blue"><Boxes className="h-3 w-3" /> 12 个组件 · 14 条数据流</Badge>
            <label htmlFor="azure-quick" className="sr-only">快速定位组件</label>
            <select
              id="azure-quick"
              value=""
              onChange={(e) => { if (e.target.value) quickSelect(e.target.value); }}
              className="h-7 rounded-md border border-line bg-surface px-2 text-[11px] text-ink outline-none focus:border-brand/60"
            >
              <option value="">快速定位组件…</option>
              {azureComponents.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <span className="text-[10.5px] text-muted">节点可拖动 · 点击连线查看数据流</span>
          </div>
        }
      />
      <Card className="h-fit overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><MousePointerClick className="h-3.5 w-3.5 text-brand" /> 组件详情</div>
          {selection ? <Badge tone="neutral">{selection.type === "node" ? "节点" : "数据流"}</Badge> : null}
        </div>
        {component ? (
          <div className="max-h-[560px] overflow-y-auto p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">{component.layer}</div>
            <h4 className="mt-1 text-sm font-bold leading-5 text-ink">{component.name}</h4>
            <div className="mt-3 space-y-2.5">
              {[
                ["组件职责", component.responsibility], ["输入", component.input], ["输出", component.output],
                ["技术选型", component.tech], ["常见故障", component.failure], ["实施注意事项", component.caution],
              ].map(([label, value], i) => (
                <div key={label} className={cn("rounded-lg border border-line p-2.5", i === 4 ? "bg-rose-50/60 dark:bg-rose-500/[0.06]" : "bg-elevated/50")}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{label}</div>
                  <div className="mt-1 text-[11.5px] leading-5 text-ink">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : selection?.type === "edge" ? (
          <div className="p-4">
            <h4 className="text-sm font-bold text-ink">{selection.title}</h4>
            <div className="mt-1 text-[11px] text-muted">{selection.subtitle}</div>
            <p className="mt-3 text-[12px] leading-6 text-ink">{selection.description}</p>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-[12px] leading-6 text-muted">点击架构图中的任一组件，这里会展示<strong className="text-ink">组件职责、输入、输出、技术选型、常见故障与实施注意事项</strong>；点击连线可查看数据流说明。</p>
            <div className="mt-4 space-y-1.5">
              {["数据接入", "知识构建", "知识存储", "横切治理", "检索与编排", "应用层"].map((layer) => (
                <div key={layer} className="flex items-center justify-between rounded-lg border border-line bg-elevated/40 px-2.5 py-1.5 text-[11px]">
                  <span className="text-muted">{layer}</span>
                  <span className="font-mono text-ink">{azureComponents.filter((c) => c.layer === layer).length} 个组件</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
      <div className="hidden text-[10.5pt] leading-6 print:block lg:col-span-2">
        架构（打印版）：Blob Storage → Document Intelligence → Python Pipeline → Azure OpenAI 抽取/Embedding → Ontology/SHACL 校验 → Neo4j + Azure AI Search → GraphRAG Orchestrator（Entra ID/ACL）→ Azure OpenAI 生成 → Web UI / Copilot。
      </div>
    </div>
  );
}
