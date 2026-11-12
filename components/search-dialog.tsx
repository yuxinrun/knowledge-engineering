"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Command, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlossaryBrowser } from "@/components/glossary-browser";
import { highlightText } from "@/components/ui/highlight";
import { searchSite, type SearchCategory } from "@/data/search-index";
import { cn } from "@/lib/utils";

const CATEGORIES: (SearchCategory | "全部")[] = ["全部", "章节", "小节", "术语", "FAQ", "代码"];
const QUICK = ["GraphRAG", "SHACL", "Entity Resolution", "Hybrid Search", "ACL", "Cypher"];

export function SearchDialog({ open, onOpenChange, onNavigate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (target: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory | "全部">("全部");
  const results = useMemo(() => searchSite(query, category, 45), [query, category]);

  const go = (target: string) => {
    onOpenChange(false);
    onNavigate(target);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader title="全站搜索" description="搜索章节、小节、技术术语、FAQ 与代码示例；支持关键词高亮。" />
        <Tabs defaultValue="all">
          <div className="border-b border-line px-4 pt-3">
            <TabsList className="mb-3">
              <TabsTrigger value="all"><Search className="mr-1 inline h-3 w-3" /> 全站搜索</TabsTrigger>
              <TabsTrigger value="glossary"><BookOpen className="mr-1 inline h-3 w-3" /> 技术术语</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="p-0">
            <div className="border-b border-line px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].target); }}
                  placeholder="例如：Ontology 与知识图谱的区别 / SHACL / 混合检索 / Cypher"
                  className="h-11 w-full rounded-xl border border-line bg-elevated/60 pl-10 pr-16 text-sm text-ink outline-none focus:border-brand/60"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted">Enter ↵</span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={cn("rounded-md border px-2 py-1 text-[11px] transition-colors", category === c ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}
                  >
                    {c}
                  </button>
                ))}
                <span className="ml-auto text-[10.5px] text-muted">{results.length} 条结果</span>
              </div>
              {!query ? (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10.5px] text-muted">热门：</span>
                  {QUICK.map((q) => <button key={q} type="button" onClick={() => setQuery(q)} className="rounded-md bg-elevated px-2 py-1 font-mono text-[10.5px] text-muted hover:text-ink">{q}</button>)}
                </div>
              ) : null}
            </div>
            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => go(entry.target)}
                  className="group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-elevated"
                >
                  <Badge tone={entry.category === "术语" ? "purple" : entry.category === "代码" ? "cyan" : entry.category === "FAQ" ? "amber" : "blue"} className="mt-0.5 shrink-0">{entry.category}</Badge>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{highlightText(entry.title, query)}</span>
                    <span className="mt-0.5 block line-clamp-2 text-[11px] leading-5 text-muted">{highlightText(entry.excerpt, query)}</span>
                    <span className="mt-0.5 block text-[10px] text-muted/80">{entry.chapter}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
              {!results.length ? (
                <div className="p-8 text-center text-xs text-muted">没有匹配结果。试试「Ontology」「Neo4j」「权限」或切换到术语词典。</div>
              ) : null}
            </div>
            <div className="flex items-center gap-2 border-t border-line px-4 py-2 text-[10.5px] text-muted">
              <Command className="h-3 w-3" /> Ctrl / ⌘ + K 打开搜索 · 结果按标题与关键词匹配度排序
            </div>
          </TabsContent>
          <TabsContent value="glossary" className="p-4">
            <GlossaryBrowser compact />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
