"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { highlightText } from "@/components/ui/highlight";
import { glossary, glossaryCategories, type GlossaryCategory } from "@/data/glossary";
import { cn } from "@/lib/utils";

export function GlossaryBrowser({ initialQuery = "", compact = false }: { initialQuery?: string; compact?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<GlossaryCategory | "全部">("全部");
  const [open, setOpen] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter((term) => {
      const inCategory = category === "全部" || term.category === category;
      const inQuery = !q || `${term.term} ${term.cn} ${term.plain} ${term.technical} ${(term.related ?? []).join(" ")}`.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索术语，例如 SHACL / RRF / GraphRAG"
            className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-8 text-xs text-ink outline-none focus:border-brand/60"
          />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="清空" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"><X className="h-3.5 w-3.5" /></button> : null}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as GlossaryCategory | "全部")}
          className="h-9 rounded-lg border border-line bg-surface px-2 text-xs text-ink outline-none focus:border-brand/60"
        >
          <option value="全部">全部分类</option>
          {glossaryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Badge tone="neutral">{results.length} 条</Badge>
      </div>
      <div className={cn("mt-3 grid grid-cols-1 gap-2", compact ? "max-h-[46vh] overflow-y-auto pr-1" : "sm:grid-cols-2")}>
        {results.map((term) => {
          const expanded = open === term.term;
          return (
            <Card key={term.term} className="p-3">
              <button type="button" onClick={() => setOpen(expanded ? null : term.term)} className="flex w-full items-start justify-between gap-2 text-left">
                <div>
                  <div className="text-[12.5px] font-semibold text-ink">{highlightText(term.term, query)} <span className="font-normal text-muted">· {highlightText(term.cn, query)}</span></div>
                  <div className="mt-1 text-[11px] leading-5 text-muted">{highlightText(term.plain, query)}</div>
                </div>
                <Badge tone={term.category === "Ontology" ? "purple" : term.category === "Knowledge Graph" ? "cyan" : term.category === "GraphRAG / RAG" ? "blue" : "neutral"}>{term.category}</Badge>
              </button>
              {expanded ? (
                <div className="mt-2 border-t border-line pt-2 text-[11.5px] leading-6 text-muted">
                  <div><strong className="text-ink">技术解释：</strong>{highlightText(term.technical, query)}</div>
                  {term.related?.length ? <div className="mt-1"><strong className="text-ink">相关术语：</strong>{term.related.join(" · ")}</div> : null}
                </div>
              ) : null}
            </Card>
          );
        })}
        {!results.length ? <div className="col-span-full rounded-xl border border-dashed border-line p-6 text-center text-xs text-muted">没有匹配术语，试试 GraphRAG、SHACL 或 Provenance。</div> : null}
      </div>
    </div>
  );
}
