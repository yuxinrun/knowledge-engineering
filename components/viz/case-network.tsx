"use client";

import { useState } from "react";
import { Badge, Card } from "@/components/ui/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { caseNetworks, caseStudies } from "@/data/itops";

export function CaseNetworkSingle({ caseId, height = 380 }: { caseId: string; height?: number }) {
  const network = caseNetworks[caseId];
  if (!network) return null;
  return (
    <FlowCanvas
      nodes={network.nodes}
      edges={network.edges}
      legend={network.legend}
      height={height}
      edgeType="default"
      fitKey={caseId}
      caption={network.caption}
    />
  );
}

export function CaseNetworkDiagram() {
  const [tab, setTab] = useState("itops");
  const study = caseStudies.find((c) => c.id === tab) ?? caseStudies[0];

  return (
    <div className="my-5">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {caseStudies.map((c) => <TabsTrigger key={c.id} value={c.id}>{c.title.replace(/^重点案例[一二三四]：/, "")}</TabsTrigger>)}
        </TabsList>
        {caseStudies.map((c) => {
          const network = caseNetworks[c.networkId];
          return (
            <TabsContent key={c.id} value={c.id} className="mt-4">
              <Card className="mb-3 flex flex-wrap items-center gap-2 p-3">
                <Badge tone="blue">{c.title}</Badge>
                <span className="text-[11.5px] text-muted">{c.subtitle}</span>
                <span className="ml-auto text-[10.5px] text-muted">教学场景模型 · 点击节点/连线查看定义</span>
              </Card>
              <FlowCanvas
                nodes={network.nodes}
                edges={network.edges}
                legend={network.legend}
                height={430}
                edgeType="default"
                fitKey={c.id}
                caption={network.caption}
              />
            </TabsContent>
          );
        })}
      </Tabs>
      <p className="mt-1 text-[10.5px] leading-5 text-muted">当前案例：{study.title} · 图谱与业务描述均为教学场景模型，不含真实客户名称、真实项目数据或效果指标。</p>
    </div>
  );
}
