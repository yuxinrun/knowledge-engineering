"use client";

import {
  ArrowRight, ArrowUp, BookOpen, ExternalLink, Home, ListChecks, Network, Printer, Search,
} from "lucide-react";
import { useSite } from "@/components/site-context";
import { chapters, chapterGroups, references, siteTagline } from "@/data/site";

const groupLinks = chapterGroups.map((group) => ({
  label: group,
  target: `#${chapters.find((c) => c.group === group)?.id ?? chapters[0].id}`,
}));

const resources = [
  { label: "Yuxin Run 站点首页", href: "https://www.yuxin.run/" },
  { label: "Agent Loop Engineering", href: "https://www.yuxin.run/agent-loop-engineering" },
  ...references.slice(0, 4).map((r) => ({ label: r.name, href: r.url })),
];

export function SiteFooter() {
  const { learningStarted, startLearning, backToCover, openChecklist, openGlossary, openSearch } = useSite();
  const linkClass = "group inline-flex w-full items-center gap-1.5 py-1 text-left text-[12px] text-muted transition-colors hover:text-brand";

  return (
    <footer data-print="hide" className="border-t border-line bg-elevated">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-12 sm:px-10 lg:px-12">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white">
                <Network className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold text-ink">企业级知识工程完整实战指南</div>
                <div className="truncate font-mono text-[10px] text-muted">{siteTagline}</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[12px] leading-6 text-muted">
              一份从业务语义建模讲到生产运维的中文技术白皮书：12 章正文、12+ 交互式可视化、可复制代码与可勾选学习清单。全部内容可离线阅读，也可打印成册。
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Field Guide · 2026", "12 章 · 约 3.5 小时", "独立思考 · Yuxin Run"].map((tag) => (
                <span key={tag} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] text-muted">{tag}</span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => (learningStarted ? backToCover() : startLearning("#ch1-overview"))}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-brand-deep px-4 text-[12px] font-semibold text-white transition-colors hover:bg-brand"
            >
              {learningStarted ? "返回封面" : "开始学习"} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="min-w-0">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Chapters</div>
            <div className="text-[12.5px] font-semibold text-ink">章节导航</div>
            <div className="mt-2">
              {groupLinks.map((item) => (
                <button key={item.label} type="button" onClick={() => startLearning(item.target)} className={linkClass}>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-line transition-colors group-hover:bg-brand" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Toolkit</div>
            <div className="text-[12.5px] font-semibold text-ink">阅读工具</div>
            <div className="mt-2">
              <button type="button" onClick={openSearch} className={linkClass}><Search className="h-3.5 w-3.5 shrink-0" />全站搜索</button>
              <button type="button" onClick={openChecklist} className={linkClass}><ListChecks className="h-3.5 w-3.5 shrink-0" />学习清单</button>
              <button type="button" onClick={openGlossary} className={linkClass}><BookOpen className="h-3.5 w-3.5 shrink-0" />术语词典</button>
              <button type="button" onClick={() => window.print()} className={linkClass}><Printer className="h-3.5 w-3.5 shrink-0" />打印白皮书</button>
              {learningStarted ? (
                <button type="button" onClick={backToCover} className={linkClass}><Home className="h-3.5 w-3.5 shrink-0" />返回封面</button>
              ) : null}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">References</div>
            <div className="text-[12.5px] font-semibold text-ink">站点与官方参考</div>
            <div className="mt-2">
              {resources.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={linkClass}>
                  <ExternalLink className="h-3 w-3 shrink-0" /><span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <div className="max-w-2xl text-[11px] leading-5 text-muted">
            <div className="font-semibold text-ink">© 2026 Yuxin Run · 独立思考</div>
            <div>本网站的全部实体、事实、指标、成本与排期均为教学示例或演示数据；具体 API 与 SDK 请以附录所列官方文档的当前版本为准。网站不调用任何后端或云服务。</div>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] text-muted transition-colors hover:border-brand/60 hover:text-brand"
          >
            <ArrowUp className="h-3.5 w-3.5" /> 返回顶部
          </button>
        </div>
      </div>
    </footer>
  );
}
