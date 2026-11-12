"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge, Card } from "@/components/ui/primitives";
import { highlightText } from "@/components/ui/highlight";
import { faq } from "@/data/faq";

export function FaqList({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faq;
    return faq.filter((item) => `${item.q} ${item.a} ${item.tags.join(" ")}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索常见问题，例如 Neo4j / 权限 / OWL"
          className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-3 text-xs text-ink outline-none focus:border-brand/60"
        />
      </div>
      <Card className={compact ? "mt-3 max-h-[46vh] overflow-y-auto" : "mt-3"}>
        <Accordion type="multiple" className="divide-y divide-line">
          {results.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className="border-b-0">
              <AccordionTrigger>{highlightText(item.q, query)}</AccordionTrigger>
              <AccordionContent>
                <p>{highlightText(item.a, query)}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">{item.tags.map((tag) => <Badge key={tag} tone="neutral">{tag}</Badge>)}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {!results.length ? <div className="p-6 text-center text-xs text-muted">没有匹配的问题</div> : null}
      </Card>
    </div>
  );
}
