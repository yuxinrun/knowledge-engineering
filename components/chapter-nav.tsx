"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles } from "lucide-react";
import { useSite } from "@/components/site-context";
import { chapters } from "@/data/site";

/** V1 章节 → V2 相关知识库页面（增量关联，不改动章节正文）。 */
const V2_LINKS: { label: string; href: string }[] = [
  { label: "知识库总览与知识地图", href: "/hub" },
  { label: "IT Operations 解决方案", href: "/hub/solutions#so-itops" },
  { label: "Ontology 与语义层的区别", href: "/hub/semantic-layer#sl-compare" },
  { label: "知识治理生命周期与血缘", href: "/hub/data-governance#dg-lifecycle" },
  { label: "八层企业知识架构", href: "/hub/architecture#ea-map" },
  { label: "GraphRAG 与 Agentic RAG 边界", href: "/hub/retrieval#rt-graphrag" },
  { label: "Agentic RAG 专题与模拟器", href: "/hub/agentic-rag" },
  { label: "六类企业解决方案", href: "/hub/solutions" },
  { label: "权限贯穿与合规", href: "/hub/data-governance#dg-security" },
  { label: "Retrieval Evaluation", href: "/hub/retrieval#rt-evaluation" },
  { label: "实施路线与阶段门禁", href: "/hub/engineering#en-roadmap" },
  { label: "Knowledge Agent 代码与工具治理", href: "/hub/knowledge-agent#ka-code" },
  { label: "术语词典（扩展版）", href: "/hub/glossary" },
];

export function ChapterNav({ index }: { index: number }) {
  const { backToCover } = useSite();
  const prev = index === 0 ? null : chapters[index - 1];
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;
  const v2 = V2_LINKS[index];

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
      {v2 ? (
        <Link href={v2.href} className="flex w-full items-center gap-2 rounded-lg border border-brand/25 bg-brand/[0.05] px-3 py-2 text-[11px] text-muted transition-colors hover:border-brand/60 hover:text-ink">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="min-w-0 flex-1 truncate"><strong className="text-ink">V2.0 延伸阅读：</strong>{v2.label}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand" />
        </Link>
      ) : null}
    </nav>
  );
}
