export interface NodeDetail {
  label: string;
  value: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  kind: string;
  position: { x: number; y: number };
  description?: string;
  details?: NodeDetail[];
  badge?: string;
  emphasis?: boolean;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  kind?: string;
  description?: string;
  animated?: boolean;
}

export interface LegendItem {
  kind: string;
  label: string;
  color?: string;
}

/** 语义配色：Ontology 紫 / KG 青 / GraphRAG 蓝 / 数据源灰蓝 / 应用绿 */
export const KIND_COLORS: Record<string, string> = {
  source: "#64748B",
  ontology: "#A855F7",
  graph: "#06B6D4",
  rag: "#3B82F6",
  app: "#10B981",
  security: "#F43F5E",
  business: "#6366F1",
  system: "#3B82F6",
  service: "#06B6D4",
  database: "#8B5CF6",
  team: "#F59E0B",
  environment: "#10B981",
  incident: "#EF4444",
  runbook: "#EAB308",
  document: "#94A3B8",
  chunk: "#7C8DA6",
  infrastructure: "#0EA5E9",
  phase: "#8B5CF6",
  azure: "#3B82F6",
  llm: "#8B5CF6",
  store: "#0EA5E9",
  orchestrator: "#6366F1",
  concept: "#A855F7",
  fact: "#06B6D4",
  process: "#3B82F6",
  risk: "#EF4444",
  phase1: "#3B82F6",
  phase2: "#06B6D4",
  phase3: "#A855F7",
  phase4: "#10B981",
  person: "#F59E0B",
  device: "#0EA5E9",
  location: "#8B5CF6",
  order: "#F59E0B",
};

export const KIND_LABELS: Record<string, string> = {
  source: "企业数据源", ontology: "Ontology / 语义层", graph: "Knowledge Graph", rag: "GraphRAG / 检索",
  app: "企业 AI 应用", security: "安全与治理", business: "Business", system: "System",
  service: "Service", database: "Database", team: "Team", environment: "Environment",
  incident: "Incident", runbook: "Runbook", document: "Document", chunk: "Chunk",
  infrastructure: "Infrastructure", phase: "实施阶段", azure: "Azure 服务", llm: "LLM 服务",
  store: "存储 / 索引", orchestrator: "编排层", concept: "概念 / 类型", fact: "事实 / 证据",
  process: "处理步骤", risk: "风险 / 冲突", person: "人员 / 组织", device: "设备 / 资产",
  location: "地点 / 设施", order: "订单 / 交易",
};

export function nodeColor(kind: string): string {
  return KIND_COLORS[kind] ?? "#64748B";
}

export function nodeKindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
