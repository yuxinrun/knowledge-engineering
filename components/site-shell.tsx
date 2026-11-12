"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowUp, BookOpen, Bookmark, Command, HelpCircle, Home, ListChecks, Menu, Moon, Network,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Printer, Search, Star, Sun, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui/primitives";
import { ChecklistDialog } from "@/components/checklist-dialog";
import { FaqList } from "@/components/faq-list";
import { GlossaryBrowser } from "@/components/glossary-browser";
import { SearchDialog } from "@/components/search-dialog";
import { SiteProvider, type SiteActions } from "@/components/site-context";
import { chapters, chapterGroups, siteTagline } from "@/data/site";
import { cn } from "@/lib/utils";

const BOOKMARK_KEY = "ke-bookmarks";
const THEME_KEY = "ke-theme";
const LEFT_KEY = "ke-left-collapsed";
const RIGHT_KEY = "ke-right-collapsed";

function chapterLabel(no: number, group: string) {
  return group === "附录" ? "附录" : `第 ${no} 章`;
}

interface SidebarProps {
  activeChapter: string;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  onNavigate: (target: string) => void;
}

function SidebarContent({ activeChapter, bookmarks, toggleBookmark, onNavigate }: SidebarProps) {
  return (
    <nav aria-label="章节目录" className="px-3 py-4">
      <div className="mb-4 rounded-xl border border-line bg-elevated/50 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Whitepaper</div>
        <div className="mt-1 text-[12.5px] font-semibold leading-5 text-ink">企业级知识工程完整实战指南</div>
        <div className="mt-1 font-mono text-[10px] text-muted">12 章 · 12+ 交互图</div>
      </div>
      {chapterGroups.map((group) => (
        <div key={group} className="mb-4">
          <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted">{group}</div>
          <div className="space-y-0.5">
            {chapters.filter((c) => c.group === group).map((c) => {
              const active = activeChapter === c.id;
              return (
                <div key={c.id} className={cn("group flex items-center rounded-lg transition-colors", active ? "bg-brand/10" : "hover:bg-elevated")}>
                  <a
                    href={`#${c.id}`}
                    onClick={(e) => { e.preventDefault(); onNavigate(`#${c.id}`); }}
                    className={cn("flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-[11.5px]", active ? "font-semibold text-brand" : "text-muted hover:text-ink")}
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", active ? "bg-brand" : "bg-line")} />
                    <span className="truncate">{c.short}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(c.id)}
                    aria-label={bookmarks.includes(c.id) ? `取消收藏 ${c.short}` : `收藏 ${c.short}`}
                    className={cn("mr-1 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100", bookmarks.includes(c.id) ? "text-amber-500 opacity-100" : "text-muted hover:text-ink")}
                  >
                    <Star className={cn("h-3 w-3", bookmarks.includes(c.id) && "fill-current")} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="mt-6 border-t border-line pt-3 text-[10px] leading-5 text-muted">
        <div className="font-semibold text-ink">内容声明</div>
        示例实体与指标为教学数据；技术选型请以实际数据与官方版本文档为准。
      </div>
    </nav>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [activeSection, setActiveSection] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [learningStarted, setLearningStarted] = useState(false);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    try {
      const stored = JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? "[]");
      if (Array.isArray(stored)) setBookmarks(stored.filter((x) => typeof x === "string"));
    } catch { /* ignore invalid local storage */ }
    setLeftCollapsed(localStorage.getItem(LEFT_KEY) === "1");
    setRightCollapsed(localStorage.getItem(RIGHT_KEY) === "1");
  }, []);

  const navigate = useCallback((target: string) => {
    const id = target.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      window.history.replaceState(null, "", `#${id}`);
    }
    setMobileOpen(false);
  }, []);

  const startLearning = useCallback((target = "#ch1-overview") => {
    setLearningStarted(true);
    setMobileOpen(false);
    window.setTimeout(() => navigate(target), 170);
  }, [navigate]);

  const backToCover = useCallback(() => {
    setLearningStarted(false);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToChapter = useCallback((target: string) => startLearning(target), [startLearning]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      let current = sections[0]?.dataset.chapter ?? chapters[0].id;
      let currentEl: HTMLElement | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= 160) { current = el.dataset.chapter ?? current; currentEl = el; }
      }
      if (!currentEl) currentEl = sections[0] ?? null;
      let section = "";
      if (currentEl) {
        const heads = Array.from(currentEl.querySelectorAll<HTMLElement>("h3[id], h4[id]"));
        for (const head of heads) if (head.getBoundingClientRect().top <= 190) section = head.id;
      }
      setActiveChapter(current);
      setActiveSection(section);
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
      setScrollY(window.scrollY);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => { update(); frame = 0; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [learningStarted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const applyTheme = (next: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next === "dark" ? "dark" : "light";
    try { localStorage.setItem(THEME_KEY, next); } catch { /* ignore */ }
    setTheme(next);
  };

  const changeLeft = (value: boolean) => {
    setLeftCollapsed(value);
    try { localStorage.setItem(LEFT_KEY, value ? "1" : "0"); } catch { /* ignore */ }
  };
  const changeRight = (value: boolean) => {
    setRightCollapsed(value);
    try { localStorage.setItem(RIGHT_KEY, value ? "1" : "0"); } catch { /* ignore */ }
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const siteActions = useMemo<SiteActions>(() => ({
    learningStarted,
    startLearning,
    backToCover,
    openChecklist: () => setChecklistOpen(true),
    openGlossary: () => setGlossaryOpen(true),
    openSearch: () => setSearchOpen(true),
  }), [learningStarted, startLearning, backToCover]);

  const active = chapters.find((c) => c.id === activeChapter) ?? chapters[0];
  const activeBookmarked = bookmarks.includes(active.id);
  const shellPad = learningStarted
    ? cn(!leftCollapsed && "lg:pl-[248px]", !rightCollapsed && "xl:pr-[258px]")
    : "";

  return (
    <div data-learning={learningStarted ? "true" : "false"} className={cn("min-h-screen", !learningStarted && "bg-[#F6F4EE] dark:bg-[#0B1220]")}>
      <header className="glass fixed left-0 right-0 top-0 z-50 h-14 border-b border-line" data-print="hide">
        <div className="flex h-full items-center gap-1.5 px-3 sm:gap-2 sm:px-4">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="打开章节目录" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-elevated lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <button type="button" onClick={backToCover} aria-label="返回封面" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white"><Network className="h-4 w-4" /></span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-[12.5px] font-semibold leading-4 text-ink">企业级知识工程指南</span>
              <span className="hidden truncate font-mono text-[9.5px] text-muted xl:block">{siteTagline}</span>
            </span>
          </button>
          <div className="flex-1" />
          {learningStarted ? (
            <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-xs text-muted transition-colors hover:text-ink sm:w-48 md:w-56">
              <Search className="h-3.5 w-3.5" /><span className="hidden flex-1 text-left sm:block">搜索文档、术语、代码…</span>
              <span className="hidden items-center gap-0.5 rounded border border-line px-1 py-0.5 font-mono text-[9px] md:inline-flex"><Command className="h-2.5 w-2.5" />K</span>
            </button>
          ) : (
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="全站搜索" title="全站搜索" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink">
              <Search className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={() => setChecklistOpen(true)} title="学习清单" aria-label="学习清单" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[11px] text-muted hover:text-ink">
            <ListChecks className="h-3.5 w-3.5" /><span className="hidden sm:inline">Checklist</span>
          </button>
          <button type="button" onClick={() => setGlossaryOpen(true)} title="技术术语词典" aria-label="技术术语词典" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink"><BookOpen className="h-4 w-4" /></button>
          {learningStarted ? (
            <>
              <button type="button" onClick={() => setFaqOpen(true)} title="常见问题" aria-label="常见问题" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink sm:inline-flex"><HelpCircle className="h-4 w-4" /></button>
              <button type="button" onClick={() => setBookmarksOpen(true)} title="收藏的章节" aria-label="收藏的章节" className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink">
                <Bookmark className="h-4 w-4" />
                {bookmarks.length ? <span className="absolute right-0.5 top-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand px-0.5 text-[9px] font-bold text-white">{bookmarks.length}</span> : null}
              </button>
            </>
          ) : null}
          <button type="button" onClick={() => applyTheme(theme === "dark" ? "light" : "dark")} title="切换主题" aria-label="切换主题" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {learningStarted ? (
            <>
              <button type="button" onClick={() => window.print()} title="打印白皮书" aria-label="打印白皮书" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink sm:inline-flex"><Printer className="h-4 w-4" /></button>
              <button type="button" onClick={backToCover} title="返回封面" className="hidden h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[11px] text-muted hover:text-ink lg:inline-flex"><Home className="h-3.5 w-3.5" />封面</button>
            </>
          ) : null}
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </header>

      <div className={cn("pt-14", shellPad)}>
        {learningStarted && !leftCollapsed ? (
          <aside data-sidebar className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-[248px] overflow-y-auto border-r border-line bg-surface/70 lg:block" data-print="hide">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">章节目录</span>
              <button type="button" onClick={() => changeLeft(true)} aria-label="收起左侧目录" title="收起左侧目录" className="rounded p-1 text-muted hover:bg-elevated hover:text-ink"><PanelLeftClose className="h-3.5 w-3.5" /></button>
            </div>
            <SidebarContent activeChapter={activeChapter} bookmarks={bookmarks} toggleBookmark={toggleBookmark} onNavigate={navigate} />
          </aside>
        ) : null}
        {learningStarted && leftCollapsed ? (
          <button data-sidebar type="button" onClick={() => changeLeft(false)} aria-label="展开左侧目录" title="展开左侧目录" data-print="hide" className="fixed left-2 top-16 z-40 hidden h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-[11px] text-muted shadow-card hover:text-ink lg:inline-flex">
            <PanelLeftOpen className="h-3.5 w-3.5" /> 目录
          </button>
        ) : null}

        <main data-print="main" className="mx-auto w-full max-w-[920px] px-4 py-8 sm:px-7 lg:px-8">
          <SiteProvider value={siteActions}>{children}</SiteProvider>
        </main>

        {learningStarted && !rightCollapsed ? (
          <aside data-sidebar className="fixed right-0 top-14 hidden h-[calc(100vh-3.5rem)] w-[258px] overflow-y-auto border-l border-line bg-surface/60 px-4 py-4 xl:block" data-print="hide">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">本页目录</span>
              <button type="button" onClick={() => changeRight(true)} aria-label="收起右侧目录" title="收起右侧目录" className="rounded p-1 text-muted hover:bg-elevated hover:text-ink"><PanelRightClose className="h-3.5 w-3.5" /></button>
            </div>
            <div className="text-[12.5px] font-semibold leading-5 text-ink">{chapterLabel(active.no, active.group)} · {active.short}</div>
            <div className="mt-3 space-y-0.5 border-l border-line">
              {active.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); navigate(`#${s.id}`); }} className={cn("-ml-px flex items-start gap-1.5 border-l-2 py-1 pl-2.5 text-[11px] leading-5 transition-colors", activeSection === s.id ? "border-brand font-medium text-brand" : "border-transparent text-muted hover:text-ink")}>
                  {s.title}
                </a>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">关键概念</div>
              <div className="mt-2 flex flex-wrap gap-1.5">{active.keywords.slice(0, 8).map((k) => <Badge key={k} tone="neutral">{k}</Badge>)}</div>
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <div className="flex items-center justify-between text-[10.5px] text-muted"><span>全书阅读进度</span><span className="font-mono text-ink">{Math.round(progress)}%</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} /></div>
              <button type="button" onClick={() => toggleBookmark(active.id)} className={cn("mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition-colors", activeBookmarked ? "border-amber-400/60 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300" : "border-line text-muted hover:text-ink")}>
                <Star className={cn("h-3.5 w-3.5", activeBookmarked && "fill-current")} />{activeBookmarked ? "已收藏本章" : "收藏本章"}
              </button>
            </div>
            <div className="mt-5 border-t border-line pt-4 text-[10.5px] leading-5 text-muted">
              <div className="mb-1 font-semibold text-ink">阅读工具</div>
              <button type="button" onClick={() => setSearchOpen(true)} className="flex w-full items-center gap-1.5 py-1 text-left hover:text-ink"><Search className="h-3 w-3" /> 全站搜索</button>
              <button type="button" onClick={() => setChecklistOpen(true)} className="flex w-full items-center gap-1.5 py-1 text-left hover:text-ink"><ListChecks className="h-3 w-3" /> 学习清单</button>
              <button type="button" onClick={() => setGlossaryOpen(true)} className="flex w-full items-center gap-1.5 py-1 text-left hover:text-ink"><BookOpen className="h-3 w-3" /> 术语词典</button>
              <button type="button" onClick={() => window.print()} className="flex w-full items-center gap-1.5 py-1 text-left hover:text-ink"><Printer className="h-3 w-3" /> 打印白皮书</button>
            </div>
          </aside>
        ) : null}
        {learningStarted && rightCollapsed ? (
          <button data-sidebar type="button" onClick={() => changeRight(false)} aria-label="展开右侧目录" title="展开右侧目录" data-print="hide" className="fixed right-2 top-16 z-40 hidden h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-[11px] text-muted shadow-card hover:text-ink xl:inline-flex">
            <PanelRightOpen className="h-3.5 w-3.5" /> 本章
          </button>
        ) : null}
      </div>

      {learningStarted && scrollY > 700 ? (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回顶部" data-print="hide" className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-float transition-transform hover:-translate-y-0.5">
          <ArrowUp className="h-4 w-4" />
        </button>
      ) : null}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onNavigate={goToChapter} />
      <ChecklistDialog open={checklistOpen} onOpenChange={setChecklistOpen} onNavigate={goToChapter} />

      <Dialog open={glossaryOpen} onOpenChange={setGlossaryOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader title="技术术语词典" description="36 条术语定义；支持分类筛选与关键词高亮。" />
          <div className="max-h-[70vh] overflow-y-auto p-4"><GlossaryBrowser compact /></div>
        </DialogContent>
      </Dialog>

      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader title="常见问题 FAQ" description="关于三者边界、技术选型、数据治理与网站数据声明的常见疑问。" />
          <div className="max-h-[70vh] overflow-y-auto p-4"><FaqList compact /></div>
        </DialogContent>
      </Dialog>

      <Dialog open={bookmarksOpen} onOpenChange={setBookmarksOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader title="收藏的章节" description="收藏保存在浏览器 localStorage，不会上传到任何服务器。" />
          <div className="max-h-[60vh] overflow-y-auto p-3">
            {bookmarks.length ? (
              <div className="space-y-1.5">
                {bookmarks.map((id) => {
                  const c = chapters.find((x) => x.id === id);
                  if (!c) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 rounded-lg border border-line bg-elevated/40 px-3 py-2">
                      <a href={`#${id}`} onClick={(e) => { e.preventDefault(); setBookmarksOpen(false); goToChapter(`#${id}`); }} className="min-w-0 flex-1 text-[12px] font-medium text-ink hover:text-brand">
                        <span className="font-mono text-[10px] text-muted">{chapterLabel(c.no, c.group)}</span> · {c.short}
                      </a>
                      <button type="button" onClick={() => toggleBookmark(id)} aria-label="移除收藏" className="rounded p-1 text-muted hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-line p-8 text-center text-xs text-muted">还没有收藏章节。可以在左侧目录悬停章节后点击星标，或在右侧目录点击「收藏本章」。</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="!left-0 !top-0 !h-screen !w-[86vw] !max-w-[330px] !translate-x-0 !overflow-y-auto !rounded-none !p-0">
          <DialogTitle className="sr-only">章节目录</DialogTitle>
          <div className="flex items-center justify-between border-b border-line px-3 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Network className="h-4 w-4 text-brand" /> 章节目录 <Badge tone="neutral">12 章</Badge></div>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="关闭目录" className="rounded p-1 text-muted"><X className="h-4 w-4" /></button>
          </div>
          <SidebarContent activeChapter={activeChapter} bookmarks={bookmarks} toggleBookmark={toggleBookmark} onNavigate={goToChapter} />
          <div className="border-t border-line px-4 py-3">
            <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> 打印白皮书</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="hidden print:block">
        <p className="text-[10.5pt]">网站导航交互（章节目录、搜索、主题、收藏、图表筛选）请在屏幕模式下使用；本打印版保留全部正文、表格与代码示例。</p>
      </div>
    </div>
  );
}
