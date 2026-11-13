/**
 * V2 图表数据：统一复用 V1 的 { nodes, edges, legend } 契约与 FlowCanvas 渲染。
 * 所有图都是教学示意，节点详情来自各 data/v2-*.ts 的单一真相源。
 */

import type { DiagramEdge, DiagramNode, LegendItem, NodeDetail } from "@/data/diagram-types";
import { archComponents, archEdges, archLabel, archLayers, type ArchComponent, type ArchView } from "@/data/v2-architecture";
import { knowledgeAgentFlow } from "@/data/v2-simulations";
import type { ArchitecturePattern } from "@/data/v2-patterns";

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  legend: LegendItem[];
}

const d = (label: string, value: string): NodeDetail => ({ label, value });
const legend = (pairs: [string, string][]): LegendItem[] => pairs.map(([kind, label]) => ({ kind, label }));

const node = (
  id: string, label: string, kind: string, x: number, y: number,
  sub?: string, description?: string, details?: NodeDetail[], badge?: string, emphasis?: boolean,
): DiagramNode => ({ id, label, kind, position: { x, y }, sub, description, details, badge, emphasis });

const edge = (id: string, source: string, target: string, label?: string, description?: string, animated?: boolean): DiagramEdge => ({
  id, source, target, label, description, animated,
});

/* ------------------------------------------------------------------ *
 * Agentic RAG 十步架构
 * ------------------------------------------------------------------ */
export const agenticFlowDiagram: DiagramData = (() => {
  const steps: [string, string, string][] = [
    ["q", "User Query", "app"], ["planner", "Agent Planner", "llm"],
    ["decomp", "Query Decomposition", "process"], ["strategy", "Retrieval Strategy Selection", "orchestrator"],
    ["search", "Vector / Graph / SQL / API", "store"], ["eval", "Evidence Evaluation", "security"],
    ["again", "Additional Retrieval if Needed", "process"], ["synth", "Answer Synthesis", "llm"],
    ["verify", "Citation Verification", "security"], ["answer", "Final Answer", "app"],
  ];
  const detailMap: Record<string, string[]> = {
    q: ["输入：复杂问题 + 用户身份 + 预算上限", "输出：原始查询与会话上下文"],
    planner: ["判断问题是否需要多步处理", "输出意图、约束与停止条件"],
    decomp: ["拆为可独立取证的子问题", "每个子问题绑定检索策略"],
    strategy: ["为子问题选择 graph / vector / SQL / API", "避免用一种工具硬套所有问题"],
    search: ["四种工具均来自白名单", "权限在检索阶段执行"],
    eval: ["检查覆盖度、冲突、引用可回溯性", "区分置信度与来源权威性"],
    again: ["证据不足且有预算时进入下一轮", "达到轮次/成本上限则退出循环"],
    synth: ["只基于已验证证据组织答案", "每条论断附 Evidence ID"],
    verify: ["引用校验失败则该论断删除", "权限复核不通过不出答案"],
    answer: ["输出结论 + 引用 + 不确定性 + 待人工确认项", "敏感动作转人工审批"],
  };
  const nodes = steps.map(([id, label, kind], i) =>
    node(`AF-${id}`, label, kind, (i % 5) * 250, Math.floor(i / 5) * 190,
      `Step ${i + 1} · ${["输入", "规划", "分解", "选路", "取证", "评估", "迭代", "综合", "校验", "输出"][i]}`,
      detailMap[id][1], detailMap[id].map((x, j) => d(j === 0 ? "职责" : "说明", x)), `S${i + 1}`, i === 0 || i === 9),
  );
  const edges: DiagramEdge[] = [];
  for (let i = 0; i < steps.length - 1; i += 1) {
    if (i === 6) continue;
    edges.push(edge(`AFE-${i}`, nodes[i].id, nodes[i + 1].id, i === 3 ? "选择工具" : undefined));
  }
  edges.push(edge("AFE-EVAL-AGAIN", nodes[5].id, nodes[6].id, "证据不足", "Reflection 判定证据不充分时进入下一轮检索", true));
  edges.push(edge("AFE-AGAIN-SEARCH", nodes[6].id, nodes[4].id, "再次检索", "有界循环：最大轮次与成本上限生效", true));
  edges.push(edge("AFE-EVAL-SYNTH", nodes[5].id, nodes[7].id, "证据充分"));
  return {
    nodes, edges,
    legend: legend([["app", "输入 / 输出"], ["llm", "Agent / 模型"], ["process", "规划与迭代"], ["orchestrator", "策略选择"], ["store", "检索工具"], ["security", "评估与验证"]]),
  };
})();

/* ------------------------------------------------------------------ *
 * Knowledge Agent 参考架构与工具调用关系
 * ------------------------------------------------------------------ */
export const knowledgeAgentDiagram: DiagramData = (() => {
  const layout: Record<string, [number, number]> = {
    user: [0, 220], identity: [220, 220], runtime: [440, 220], planner: [660, 220],
    context: [660, 20], registry: [880, 220], validation: [1100, 220], audit: [1320, 220],
    ontology: [880, 0], graph: [880, 150], doc: [880, 300], semantic: [880, 450], apis: [880, 600],
  };
  const nodes = knowledgeAgentFlow.map((n) => {
    const [x, y] = layout[n.id] ?? [0, 0];
    return node(`KA-${n.id}`, n.label, n.kind, x, y, n.sub,
      `${n.label}：参考架构中的能力节点。`, [d("职责", n.sub), d("边界", "所有调用经 Tool Registry 与 Governance 校验")], undefined,
      n.id === "runtime" || n.id === "registry");
  });
  const links: [string, string, string][] = [
    ["user", "identity", "认证"], ["identity", "runtime", "subject"], ["runtime", "planner", "规划"],
    ["planner", "context", "读取上下文"], ["planner", "registry", "查工具"], ["registry", "ontology", "白名单"],
    ["registry", "graph", "白名单"], ["registry", "doc", "白名单"], ["registry", "semantic", "白名单"],
    ["registry", "apis", "白名单"], ["graph", "validation", "证据"], ["doc", "validation", "引用"],
    ["semantic", "validation", "口径"], ["apis", "validation", "业务事实"], ["ontology", "validation", "类型约束"],
    ["validation", "audit", "轨迹"], ["runtime", "audit", "会话轨迹"],
  ];
  return {
    nodes,
    edges: links.map(([a, b, label], i) => edge(`KAE-${i}`, `KA-${a}`, `KA-${b}`, label)),
    legend: legend([["app", "用户"], ["security", "权限 / 校验 / 审计"], ["orchestrator", "运行时"], ["llm", "Planner"], ["concept", "知识上下文"], ["store", "工具注册表"], ["ontology", "本体 / 语义层"], ["graph", "知识图谱"], ["process", "业务 API"]]),
  };
})();

/* ------------------------------------------------------------------ *
 * 语义层：业务术语 → 业务答案
 * ------------------------------------------------------------------ */
export const semanticChainDiagram: DiagramData = (() => {
  const chain: [string, string, string, string][] = [
    ["term", "业务术语", "Incident Count / MTTR / Availability", "concept"],
    ["def", "语义定义", "纳入范围、时间归属、排除规则", "ontology"],
    ["metric", "指标定义", "Measure / Dimension / Grain / Formula", "concept"],
    ["map", "数据映射", "itsm.fact_incident → dim_service", "store"],
    ["query", "查询接口", "Semantic Query（受权限约束）", "orchestrator"],
    ["ai", "AI 理解", "按业务概念提问，不拼物理字段", "llm"],
    ["answer", "业务答案", "数值 + 口径版本 + 引用", "app"],
  ];
  const nodes = chain.map(([id, label, sub, kind], i) =>
    node(`SC-${id}`, label, kind, i * 220, 60, sub, sub, [d("阶段", `${i + 1} / 7`), d("说明", sub)], undefined, i === 0 || i === 6));
  return {
    nodes,
    edges: chain.slice(0, -1).map((c, i) => edge(`SCE-${i}`, nodes[i].id, nodes[i + 1].id, i === 3 ? "翻译" : undefined)),
    legend: legend([["concept", "业务概念"], ["ontology", "语义定义"], ["store", "物理映射"], ["orchestrator", "查询接口"], ["llm", "AI"], ["app", "业务答案"]]),
  };
})();

/* ------------------------------------------------------------------ *
 * 治理：12 步生命周期
 * ------------------------------------------------------------------ */
export const governanceLifecycleDiagram: DiagramData = (() => {
  const steps: [string, string][] = [
    ["Source", "来源登记"], ["Ingestion", "接入"], ["Validation", "校验"], ["Classification", "分类分级"],
    ["Transformation", "转换"], ["Knowledge Extraction", "知识抽取"], ["Entity Resolution", "实体消歧"],
    ["Knowledge Fusion", "知识融合"], ["Approval", "审核"], ["Publication", "发布"],
    ["Monitoring", "监控"], ["Expiration / Deletion", "过期 / 删除"],
  ];
  const nodes = steps.map(([label, cn], i) =>
    node(`GL-${i}`, label, i >= 8 && i <= 9 ? "security" : i === 11 ? "risk" : "process",
      (i % 4) * 260, Math.floor(i / 4) * 175, cn, cn,
      [d("阶段", `GL-${String(i + 1).padStart(2, "0")}`), d("控制点", "来源 / 版本 / 审批 / 策略")]));
  const edges: DiagramEdge[] = [];
  for (let i = 0; i < steps.length - 1; i += 1) edges.push(edge(`GLE-${i}`, nodes[i].id, nodes[i + 1].id));
  edges.push(edge("GLE-LOOP", nodes[10].id, nodes[2].id, "质量回退", "监控发现质量或口径问题时触发重新校验与重抽取", true));
  return { nodes, edges, legend: legend([["process", "处理阶段"], ["security", "审核与发布"], ["risk", "过期与删除"]]) };
})();

/* ------------------------------------------------------------------ *
 * 数字孪生十层架构
 * ------------------------------------------------------------------ */
export const twinArchitectureDiagram: DiagramData = (() => {
  const chain: [string, string, string][] = [
    ["physical", "Physical World", "device"], ["sensors", "Sensors / IoT", "device"],
    ["ingest", "Event Ingestion", "process"], ["ts", "Time-series Storage", "store"],
    ["asset", "Asset Model", "ontology"], ["state", "Digital Twin State", "process"],
    ["kg", "Knowledge Graph", "graph"], ["analytics", "Analytics / Simulation", "llm"],
    ["agent", "AI Agent", "orchestrator"], ["human", "Human / Controlled Actuation", "security"],
  ];
  const nodes = chain.map(([id, label, kind], i) =>
    node(`TW-${id}`, label, kind, (i % 5) * 260, Math.floor(i / 5) * 200,
      `Layer ${i + 1}`, label, [d("层级", `${i + 1} / 10`), d("说明", label)]));
  const links: [number, number, string][] = [
    [0, 1, "遥测"], [1, 2, "事件"], [2, 3, "写入"], [2, 5, "状态同步"],
    [3, 5, "历史"], [4, 6, "关系建模"], [6, 5, "关联"], [5, 7, "假设分析"],
    [7, 8, "建议"], [8, 9, "人工审批"],
  ];
  return {
    nodes,
    edges: links.map(([a, b, label], i) => edge(`TWE-${i}`, nodes[a].id, nodes[b].id, label)),
    legend: legend([["device", "物理世界"], ["process", "接入 / 状态"], ["store", "时序存储"], ["ontology", "资产模型"], ["graph", "知识图谱"], ["llm", "分析与仿真"], ["orchestrator", "Agent"], ["security", "人工审批"]]),
  };
})();

/* ------------------------------------------------------------------ *
 * 企业知识工程总体架构（8 层 + 横切治理，支持三视图与按层过滤）
 * ------------------------------------------------------------------ */
export function architectureDiagram(view: ArchView, layerFilter?: number | null): DiagramData {
  const comps = archComponents.filter((comp) => !layerFilter || comp.layer === layerFilter);
  const byLayer = new Map<number, ArchComponent[]>();
  comps.forEach((comp) => {
    const list = byLayer.get(comp.layer) ?? [];
    list.push(comp);
    byLayer.set(comp.layer, list);
  });
  const CELL_W = 232;
  const ROW_H = 148;
  const nodes: DiagramNode[] = [];
  byLayer.forEach((list, layerNo) => {
    const layer = archLayers.find((l) => l.no === layerNo);
    list.forEach((comp, i) => {
      nodes.push(node(
        `EA-${comp.id}`, archLabel(comp, view), comp.kind,
        i * CELL_W, (layerNo - 1) * ROW_H,
        `L${layerNo} · ${layer?.en ?? ""}`,
        comp.responsibility,
        [
          d("职责", comp.responsibility), d("输入", comp.inputs), d("输出", comp.outputs),
          d("关键技术", comp.technologies), d("上游", comp.upstream), d("下游", comp.downstream),
          d("设计决策", comp.decisions), d("常见反模式", comp.antiPatterns), d("可替代方案", comp.alternatives),
        ],
        comp.id, comp.layer === 8,
      ));
    });
  });
  const ids = new Set(nodes.map((n) => n.id.replace(/^EA-/, "")));
  const edges = archEdges
    .filter((e) => ids.has(e.from) && ids.has(e.to))
    .map((e, i) => edge(`EAE-${i}`, `EA-${e.from}`, `EA-${e.to}`, e.label));
  return {
    nodes, edges,
    legend: legend([
      ["source", "L1 企业数据源"], ["process", "L2 接入处理 / L5 服务"], ["ontology", "L3 知识建模"],
      ["store", "L4 知识存储"], ["rag", "L5 检索服务"], ["llm", "L6 智能层"],
      ["orchestrator", "L5/L6 编排"], ["app", "L7 企业应用"], ["security", "L8 横切治理"],
      ["concept", "概念与上下文"], ["graph", "知识图谱"],
    ]),
  };
}

/* ------------------------------------------------------------------ *
 * 架构模式图（统一模板的小型架构图）
 * ------------------------------------------------------------------ */
export function patternDiagram(pattern: ArchitecturePattern): DiagramData {
  const nodes = pattern.diagram.nodes.map((n, i) =>
    node(`PD-${pattern.id}-${i}`, n.label, n.kind, (i % 4) * 245, Math.floor(i / 4) * 180,
      `组件 ${i + 1}`, n.label, [d("组件", n.label), d("模式", pattern.name)]));
  return {
    nodes,
    edges: pattern.diagram.edges.map((e, i) => edge(`PDE-${pattern.id}-${i}`, nodes[e.from].id, nodes[e.to].id, e.label)),
    legend: legend([["source", "来源"], ["process", "处理"], ["store", "存储 / 工具"], ["graph", "图"], ["rag", "检索"], ["llm", "模型 / Agent"], ["orchestrator", "编排"], ["security", "治理"], ["app", "应用"], ["concept", "概念"], ["ontology", "本体"]]),
  };
}

/* ------------------------------------------------------------------ *
 * 知识关联浏览器：按 hop / domain / relation 过滤后的子图
 * ------------------------------------------------------------------ */
export function knowledgeNetworkDiagram(
  visibleNodeIds: string[],
  allNodes: { id: string; label: string; domain: string; href: string; summary: string; keywords: string[] }[],
  allEdges: { id: string; source: string; target: string; kind: string; note: string }[],
  focusId?: string | null,
): DiagramData {
  const byId = new Map(allNodes.map((n) => [n.id, n]));
  const domainKind: Record<string, string> = {
    建模: "ontology", 检索: "rag", 智能体: "llm", 语义: "concept", 治理: "security",
    数字孪生: "device", 架构: "orchestrator", 实践: "app", 基础设施: "store",
  };
  // 简单的确定性分层布局：按域分组，避免随机抖动。
  const groups = new Map<string, string[]>();
  visibleNodeIds.forEach((id) => {
    const domain = byId.get(id)?.domain ?? "基础设施";
    const list = groups.get(domain) ?? [];
    list.push(id);
    groups.set(domain, list);
  });
  const nodes: DiagramNode[] = [];
  let col = 0;
  Array.from(groups.entries()).forEach(([domain, ids]) => {
    ids.forEach((id, row) => {
      const n = byId.get(id);
      if (!n) return;
      nodes.push(node(
        `KN-${id}`, n.label, domainKind[domain] ?? "concept", col * 250, row * 130,
        domain, n.summary,
        [d("领域", domain), d("说明", n.summary), d("关键词", n.keywords.slice(0, 5).join(" / "))],
        undefined, focusId === id,
      ));
    });
    col += 1;
  });
  const visible = new Set(visibleNodeIds);
  return {
    nodes,
    edges: allEdges
      .filter((e) => visible.has(e.source) && visible.has(e.target))
      .map((e) => edge(`KNE-${e.id}`, `KN-${e.source}`, `KN-${e.target}`, e.kind, e.note)),
    legend: legend(Object.entries(domainKind).map(([label, kind]) => [kind, label]) as [string, string][]),
  };
}
