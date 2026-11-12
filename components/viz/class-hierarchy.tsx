"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, GitBranch, Search, X } from "lucide-react";
import { Card, Badge } from "@/components/ui/primitives";
import { highlightText } from "@/components/ui/highlight";
import { classTree, type TreeNode } from "@/data/diagrams";
import { nodeColor, nodeKindLabel } from "@/data/diagram-types";
import { cn } from "@/lib/utils";

function collectIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((n) => [n.id, ...collectIds(n.children ?? [])]);
}

function findPath(nodes: TreeNode[], id: string, trail: TreeNode[] = []): TreeNode[] | null {
  for (const node of nodes) {
    const next = [...trail, node];
    if (node.id === id) return next;
    const found = findPath(node.children ?? [], id, next);
    if (found) return found;
  }
  return null;
}

function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes;
  const q = query.toLowerCase();
  return nodes
    .map((n) => ({ ...n, children: filterTree(n.children ?? [], query) }))
    .filter((n) => `${n.label} ${n.description} ${(n.properties ?? []).join(" ")}`.toLowerCase().includes(q) || (n.children?.length ?? 0) > 0);
}

export function ClassHierarchy() {
  const allIds = useMemo(() => collectIds(classTree), []);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(allIds));
  const [selected, setSelected] = useState("service");
  const [query, setQuery] = useState("");

  const tree = useMemo(() => filterTree(classTree, query), [query]);
  const path = useMemo(() => findPath(classTree, selected), [selected]);
  const current = path?.[path.length - 1];

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isOpen = expanded.has(node.id) || Boolean(query.trim());
    const isSelected = selected === node.id;
    return (
      <li key={node.id} className="my-1">
        <div className="flex items-center gap-1.5">
          {hasChildren ? (
            <button type="button" onClick={() => toggle(node.id)} aria-label={isOpen ? "折叠" : "展开"} className="rounded p-0.5 text-muted hover:bg-elevated">
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : <span className="w-5" />}
          <button
            type="button"
            onClick={() => setSelected(node.id)}
            className={cn(
              "flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors",
              isSelected ? "border-brand/60 bg-brand/10 font-semibold text-ink" : "border-line bg-surface text-ink hover:bg-elevated"
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: nodeColor(node.kind) }} />
            <span className="truncate">{highlightText(node.label, query)}</span>
            {depth === 0 ? <Badge tone="purple">root</Badge> : null}
          </button>
        </div>
        {hasChildren && isOpen ? (
          <ul className="ml-3 mt-1 border-l border-dashed border-line pl-3">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <div className="my-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink"><GitBranch className="h-3.5 w-3.5 text-brand" /> Ontology Class Hierarchy（可点击 / 可折叠）</div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setExpanded(new Set(allIds))} className="rounded-md border border-line px-2 py-1 text-[10px] text-muted hover:text-ink">全部展开</button>
            <button type="button" onClick={() => setExpanded(new Set())} className="rounded-md border border-line px-2 py-1 text-[10px] text-muted hover:text-ink">全部折叠</button>
          </div>
        </div>
        <div className="border-b border-line px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索 Class，例如 Service / Runbook"
              className="h-8 w-full rounded-lg border border-line bg-surface pl-8 pr-7 text-xs text-ink outline-none focus:border-brand/60"
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="清空" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"><X className="h-3.5 w-3.5" /></button> : null}
          </div>
        </div>
        <div className="max-h-[430px] overflow-auto px-3 py-3">
          <ul>{tree.map((n) => renderNode(n, 0))}</ul>
        </div>
      </Card>
      <Card className="h-fit p-4">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">Class 详情</div>
        <h4 className="mt-1 text-base font-bold text-ink">{current?.label ?? "请选择节点"}</h4>
        {current ? (
          <>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone="purple">{nodeKindLabel(current.kind)}</Badge>
              <Badge tone="neutral">层级 {path?.length ?? 0}</Badge>
              {current.children?.length ? <Badge tone="blue">子类 {current.children.length}</Badge> : null}
            </div>
            <p className="mt-3 text-[12.5px] leading-6 text-muted">{current.description}</p>
            {current.properties?.length ? (
              <div className="mt-3">
                <div className="text-[11px] font-semibold text-ink">Data Property</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {current.properties.map((p) => <code key={p} className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[10.5px] text-cyan-600 dark:text-cyan-300">{p}</code>)}
                </div>
              </div>
            ) : null}
            {current.example ? (
              <div className="mt-3 rounded-lg border border-line bg-elevated p-2.5 text-[11.5px] leading-5 text-muted">
                <span className="font-semibold text-ink">示例个体：</span>{current.example}
              </div>
            ) : null}
            {path && path.length > 1 ? (
              <div className="mt-3 text-[11px] leading-5 text-muted">
                <span className="font-semibold text-ink">继承路径：</span>
                {path.map((p) => p.label.split("（")[0]).join(" → ")}
              </div>
            ) : null}
          </>
        ) : null}
      </Card>
      <div className="hidden text-[10.5pt] leading-6 print:block lg:col-span-2">
        类层次（打印版）：owl:Thing → BusinessEntity(Business)、TechnicalAsset(System/Service/Database/Infrastructure)、Organization(Team)、Event(Incident)、KnowledgeAsset(Runbook/Document)、Context(Environment)。
      </div>
    </div>
  );
}
