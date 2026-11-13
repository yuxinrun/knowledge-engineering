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

import { palette } from "@/data/palette";

/** 语义配色：Ontology 紫 / KG 青绿 / GraphRAG 蓝 / 数据源暖灰 / 应用绿 */
export const KIND_COLORS: Record<string, string> = {
  source: palette.slate,
  ontology: palette.violet,
  graph: palette.brand,
  rag: palette.azure,
  app: palette.leaf,
  security: palette.rose,
  business: palette.azure,
  system: palette.azure,
  service: palette.brand,
  database: palette.violet,
  team: palette.amber,
  environment: palette.leaf,
  incident: palette.rose,
  runbook: palette.amber,
  document: palette.slate,
  chunk: palette.slate,
  infrastructure: palette.brandSoft,
  phase: palette.violet,
  azure: palette.azure,
  llm: palette.violet,
  store: palette.brandSoft,
  orchestrator: palette.azure,
  concept: palette.violet,
  fact: palette.brand,
  process: palette.azure,
  risk: palette.rose,
  phase1: palette.azure,
  phase2: palette.brand,
  phase3: palette.violet,
  phase4: palette.leaf,
  person: palette.amber,
  device: palette.brandSoft,
  location: palette.violet,
  order: palette.amber,
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
  return KIND_COLORS[kind] ?? palette.slate;
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
