"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUp, BookOpen, Bookmark, ChevronDown, Command, Home, Menu, Moon, Network,
  PanelLeftClose, PanelLeftOpen, Printer, Search, Star, Sun, X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SearchDialog } from "@/components/search-dialog";
import { Badge, Button } from "@/components/ui/primitives";
import { hubExtraLinks, hubNavGroups, hubPages } from "@/data/v2-hub";
import { applyTheme, getRecentVisits, getV2Bookmarks, readTheme, V2_KEYS } from "@/lib/v2-storage";
import { cn } from "@/lib/utils";

const THEME_ICON = { light: Moon, dark: Sun } as const;

function normalize(href: string): string {
  return href.split("#")[0].replace(/\/$/, "") || "/";
}

interface NavProps {
  pathname: string;
  hash: string;
  bookmarks: string[];
  onNavigate: () => void;
}

function HubNav({ pathname, hash, bookmarks, onNavigate }: NavProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const current = useMemo(() => `${pathname}${hash}`, [pathname, hash]);

  useEffect(() => {
    const active = hubNavGroups
      .filter((g) => g.items.some((i) => normalize(i.href) === normalize(pathname)))
      .map((g) => g.id);
    setOpenGroups((prev) => Array.from(new Set([...prev, ...active])));
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.includes("#")) return current === href || current.startsWith(href.split("#")[0]) && hash === `#${href.split("#")[1]}`;
    return normalize(href) === normalize(pathname);
  };

  return (
    <nav aria-label="知识库导航" className="px-3 py-4">
      <div className="mb-4 rounded-xl border border-line bg-elevated/50 p-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">V2.0 · Knowledge Hub</div>
        <div className="mt-1 text-[12.5px] font-semibold leading-5 text-ink">企业知识工程知识库</div>
        <div className="mt-1 font-mono text-[10px] text-muted">9 大导航组 · 8 交互工具 · 4 学习路径</div>
      </div>

      <Link href="/hub" onClick={onNavigate} className={cn("mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11.5px] transition-colors", pathname === "/hub" ? "bg-brand/10 font-semibold text-brand" : "text-muted hover:bg-elevated hover:text-ink")}>
        <Home className="h-3.5 w-3.5" /> 知识库首页
      </Link>

      {hubNavGroups.map((group, gi) => {
        const open = openGroups.includes(group.id);
        return (
          <div key={group.id} className="mb-1">
            <button
              type="button"
              onClick={() => setOpenGroups((prev) => prev.includes(group.id) ? prev.filter((x) => x !== group.id) : [...prev, group.id])}
              className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[10.5px] font-semibold uppercase tracking-wider text-muted hover:bg-elevated hover:text-ink"
            >
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-elevated font-mono text-[9px] text-brand">{gi + 1}</span>
              <span className="min-w-0 flex-1 truncate normal-case tracking-normal">{group.label}</span>
              <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-180")} />
            </button>
            {open ? (
              <div className="mb-2 ml-2 space-y-0.5 border-l border-line pl-2">
                {group.items.map((item) => (
                  <Link
                    key={`${group.id}-${item.label}`}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn("flex items-start gap-1.5 rounded-md px-2 py-1 text-[11px] leading-5 transition-colors", isActive(item.href) ? "bg-brand/10 font-semibold text-brand" : "text-muted hover:bg-elevated hover:text-ink")}
                  >
                    <span className={cn("mt-1.5 h-1 w-1 shrink-0 rounded-full", isActive(item.href) ? "bg-brand" : "bg-line")} />
                    <span className="min-w-0 flex-1">{item.label}</span>
                    {item.note ? <span className="shrink-0 font-mono text-[9px] text-muted/70">V1</span> : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="mt-4 border-t border-line pt-3">
        <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted">实验室与工具</div>
        {hubExtraLinks.slice(1, 7).map((link) => (
          <Link key={link.href} href={link.href} onClick={onNavigate} className={cn("flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] transition-colors", normalize(link.href) === normalize(pathname) ? "bg-brand/10 font-semibold text-brand" : "text-muted hover:bg-elevated hover:text-ink")}>
            <span className="h-1 w-1 shrink-0 rounded-full bg-line" />{link.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 border-t border-line pt-3">
        <div className="mb-1.5 flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted"><Bookmark className="h-3 w-3" /> 收藏</div>
        {bookmarks.length ? bookmarks.slice(0, 5).map((id) => {
          const page = hubPages.find((p) => p.id === id);
          if (!page) return null;
          return <Link key={id} href={`/${page.slug}`} onClick={onNavigate} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-muted hover:bg-elevated hover:text-ink"><Star className="h-3 w-3 fill-current text-accent" /><span className="truncate">{page.short}</span></Link>;
        }) : <div className="px-2 text-[10px] leading-5 text-muted/80">在专题页点击「收藏本专题」即可保存。</div>}
      </div>

      <div className="mt-4 border-t border-line pt-3 text-[10px] leading-5 text-muted">
        <div className="font-semibold text-ink">内容声明</div>
        新增示例实体、指标、质量评分与设备状态均为本地模拟数据；技术选型请以实际数据与官方当期文档为准。
      </div>
    </nav>
  );
}

export function HubShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hash, setHash] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [recent, setRecent] = useState<{ href: string; title: string; at: number }[]>([]);
  const [leftCollapsed, setLeftCollapsed] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setBookmarks(getV2Bookmarks());
    setRecent(getRecentVisits());
    try { setLeftCollapsed(localStorage.getItem(V2_KEYS.leftCollapsed) === "1"); } catch { /* ignore */ }
    const onHash = () => setHash(window.location.hash);
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // 带 hash 进入页面（含跨路由跳转）时滚动到锚点。
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t0 = window.setTimeout(scrollToHash, 180);
    window.addEventListener("hashchange", scrollToHash);
    return () => { window.clearTimeout(t0); window.removeEventListener("hashchange", scrollToHash); };
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
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
  }, []);

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

  const onSearchNavigate = useCallback((target: string) => {
    if (target.startsWith("#")) router.push(`/${target}`);
    else router.push(target);
  }, [router]);

  const changeTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const changeLeft = (value: boolean) => {
    setLeftCollapsed(value);
    try { localStorage.setItem(V2_KEYS.leftCollapsed, value ? "1" : "0"); } catch { /* ignore */ }
  };

  const ThemeIcon = THEME_ICON[theme];
  const currentPage = hubPages.find((p) => normalize(`/${p.slug}`) === normalize(pathname));

  return (
    <div className="min-h-screen bg-canvas">
      <header className="glass fixed left-0 right-0 top-0 z-50 h-14 border-b border-line" data-print="hide">
        <div className="flex h-full items-center gap-1.5 px-3 sm:gap-2 sm:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="打开知识库目录" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-elevated lg:hidden"><Menu className="h-5 w-5" /></button>
          <Link href="/hub" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-deep text-white"><Network className="h-4 w-4" /></span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-[12.5px] font-semibold leading-4 text-ink">Enterprise Knowledge Hub</span>
              <span className="hidden truncate font-mono text-[9.5px] text-muted xl:block">企业知识工程知识库 · V2.0</span>
            </span>
          </Link>
          {currentPage ? <Badge tone="cyan" className="hidden shrink-0 md:inline-flex">{currentPage.short}</Badge> : null}
          <div className="flex-1" />
          <button type="button" onClick={() => setSearchOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-xs text-muted transition-colors hover:text-ink sm:w-44 md:w-56">
            <Search className="h-3.5 w-3.5" /><span className="hidden flex-1 text-left sm:block">搜索新旧章节、代码、模式…</span>
            <span className="hidden items-center gap-0.5 rounded border border-line px-1 py-0.5 font-mono text-[9px] md:inline-flex"><Command className="h-2.5 w-2.5" />K</span>
          </button>
          <Link href="/hub/glossary" title="术语词典" aria-label="术语词典" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink sm:inline-flex"><BookOpen className="h-4 w-4" /></Link>
          <button type="button" onClick={() => window.print()} title="打印本页" aria-label="打印本页" className="hidden h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink sm:inline-flex"><Printer className="h-4 w-4" /></button>
          <button type="button" onClick={changeTheme} title="切换主题" aria-label="切换主题" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink"><ThemeIcon className="h-4 w-4" /></button>
          <Link href="/" title="返回 V1 白皮书" className="hidden h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[11px] text-muted hover:text-ink lg:inline-flex"><Home className="h-3.5 w-3.5" /> V1 白皮书</Link>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand via-brand-soft to-azure transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </header>

      {!leftCollapsed ? (
        <aside className="fixed left-0 top-14 hidden h-[calc(100vh-3.5rem)] w-[264px] overflow-y-auto border-r border-line bg-surface/70 lg:block" data-print="hide">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">知识库目录</span>
            <button type="button" onClick={() => changeLeft(true)} aria-label="收起目录" title="收起目录" className="rounded p-1 text-muted hover:bg-elevated hover:text-ink"><PanelLeftClose className="h-3.5 w-3.5" /></button>
          </div>
          <HubNav pathname={pathname} hash={hash} bookmarks={bookmarks} onNavigate={() => {}} />
          <div className="border-t border-line px-3 py-3">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">最近访问</div>
            {recent.length ? recent.slice(0, 4).map((v) => (
              <Link key={v.href} href={v.href} className="block truncate py-0.5 text-[10.5px] text-muted hover:text-brand">{v.title}</Link>
            )) : <div className="text-[10px] text-muted/80">暂无访问记录</div>}
          </div>
        </aside>
      ) : (
        <button type="button" onClick={() => changeLeft(false)} aria-label="展开目录" title="展开目录" data-print="hide" className="fixed left-2 top-16 z-40 hidden h-8 items-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-[11px] text-muted shadow-card hover:text-ink lg:inline-flex"><PanelLeftOpen className="h-3.5 w-3.5" /> 目录</button>
      )}

      <div className={cn("pt-14 print:pt-0 print:pl-0", !leftCollapsed && "lg:pl-[264px]")}>
        <main data-print="main" className="mx-auto w-full max-w-[1040px] px-4 py-8 sm:px-7">
          {children}
        </main>
        <footer data-print="hide" className="mx-auto w-full max-w-[1040px] px-4 pb-10 sm:px-7">
          <div className="ke-hairline mb-5" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted">
            <span>Enterprise Knowledge Engineering Hub · V2.0 增量升级 · V1 的 12 章与 3 个交互工具完整保留</span>
            <Link href="/" className="text-brand hover:underline">返回原白皮书封面 ↗</Link>
          </div>
        </footer>
      </div>

      {scrollY > 700 ? (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回顶部" data-print="hide" className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-float transition-transform hover:-translate-y-0.5"><ArrowUp className="h-4 w-4" /></button>
      ) : null}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onNavigate={onSearchNavigate} />

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="!left-0 !top-0 !h-screen !w-[88vw] !max-w-[340px] !translate-x-0 !overflow-y-auto !rounded-none !p-0">
          <DialogTitle className="sr-only">知识库目录</DialogTitle>
          <div className="flex items-center justify-between border-b border-line px-3 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink"><Network className="h-4 w-4 text-brand" /> 知识库目录 <Badge tone="neutral">V2.0</Badge></div>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="关闭目录" className="rounded p-1 text-muted"><X className="h-4 w-4" /></button>
          </div>
          <HubNav pathname={pathname} hash={hash} bookmarks={bookmarks} onNavigate={() => setMobileOpen(false)} />
          <div className="border-t border-line px-4 py-3"><Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> 打印本页</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
