"use client";

import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { useSite } from "@/components/site-context";
import { chapters } from "@/data/site";

export function ChapterNav({ index }: { index: number }) {
  const { backToCover } = useSite();
  const prev = index === 0 ? null : chapters[index - 1];
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return (
    <nav aria-label="章节间导航" className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5" data-print="hide">
      {prev ? (
        <a href={`#${prev.id}`} className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-muted transition-colors hover:border-brand/50 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" /><span className="truncate">上一章 · {prev.short}</span>
        </a>
      ) : (
        <button type="button" onClick={backToCover} className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-muted transition-colors hover:border-brand/50 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" /><span className="truncate">返回封面</span>
        </button>
      )}
      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-brand">
        <ArrowUp className="h-3.5 w-3.5" /> 回到顶部
      </button>
      {next ? (
        <a href={`#${next.id}`} className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-muted transition-colors hover:border-brand/50 hover:text-ink">
          <span className="truncate">下一章 · {next.short}</span><ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <button type="button" onClick={backToCover} className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-muted transition-colors hover:border-brand/50 hover:text-ink">
          <span className="truncate">返回封面</span><ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </button>
      )}
    </nav>
  );
}
