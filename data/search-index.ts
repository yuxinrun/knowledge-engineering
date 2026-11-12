import { codeSamples } from "@/data/code";
import { faq } from "@/data/faq";
import { glossary } from "@/data/glossary";
import { chapters } from "@/data/site";

export type SearchCategory = "章节" | "小节" | "术语" | "FAQ" | "代码";

export interface SearchEntry {
  id: string;
  target: string;
  title: string;
  category: SearchCategory;
  chapter?: string;
  excerpt: string;
  keywords: string[];
}

const chapterEntries: SearchEntry[] = chapters.flatMap((chapter) => [
  {
    id: `chapter-${chapter.id}`,
    target: `#${chapter.id}`,
    title: `第 ${chapter.no} 章｜${chapter.title}`,
    category: "章节" as const,
    chapter: chapter.short,
    excerpt: chapter.subtitle,
    keywords: [chapter.short, ...chapter.keywords],
  },
  ...chapter.sections.map((section) => ({
    id: `section-${section.id}`,
    target: `#${section.id}`,
    title: section.title,
    category: "小节" as const,
    chapter: chapter.short,
    excerpt: `第 ${chapter.no} 章 · ${chapter.short} 中的小节：${section.title}。${chapter.subtitle}`,
    keywords: [chapter.short, section.title, ...chapter.keywords],
  })),
]);

const glossaryEntries: SearchEntry[] = glossary.map((term) => ({
  id: `glossary-${term.term}`,
  target: "#appendix-glossary",
  title: `${term.term}｜${term.cn}`,
  category: "术语",
  chapter: term.category,
  excerpt: term.plain,
  keywords: [term.term, term.cn, term.category, ...(term.related ?? [])],
}));

const faqEntries: SearchEntry[] = faq.map((item, i) => ({
  id: `faq-${i}`,
  target: "#appendix-faq",
  title: item.q,
  category: "FAQ",
  chapter: item.tags.join(" / "),
  excerpt: item.a,
  keywords: [...item.tags, item.q],
}));

const codeEntries: SearchEntry[] = codeSamples.map((sample) => ({
  id: `code-${sample.id}`,
  target: `#code-${sample.id}`,
  title: `代码｜${sample.title}`,
  category: "代码",
  chapter: sample.deps,
  excerpt: `${sample.scope} ${sample.version}`,
  keywords: [sample.title, sample.language, sample.deps, sample.scope],
}));

export const searchEntries: SearchEntry[] = [...chapterEntries, ...glossaryEntries, ...faqEntries, ...codeEntries];

export function searchSite(query: string, category?: SearchCategory | "全部", limit = 40): SearchEntry[] {
  const q = query.trim().toLowerCase();
  const pool = !category || category === "全部" ? searchEntries : searchEntries.filter((e) => e.category === category);
  if (!q) return pool.slice(0, Math.min(limit, 14));
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = pool
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${title} ${entry.excerpt} ${entry.keywords.join(" ")} ${entry.chapter ?? ""}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 6;
        if (entry.keywords.some((k) => k.toLowerCase().includes(term))) score += 3;
        if (haystack.includes(term)) score += 1;
      }
      return { entry, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return scored.slice(0, limit).map((x) => x.entry);
}
