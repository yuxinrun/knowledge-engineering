/** V2 本地状态工具：阅读进度、收藏、最近访问、学习路径勾选。全部存 localStorage，不上传。 */

export const V2_KEYS = {
  bookmarks: "ke-v2-bookmarks",
  recent: "ke-v2-recent",
  paths: "ke-v2-path-progress",
  theme: "ke-theme",
  leftCollapsed: "ke-v2-left-collapsed",
} as const;

export interface VisitRecord { href: string; title: string; at: number }

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function getV2Bookmarks(): string[] {
  const value = read<unknown>(V2_KEYS.bookmarks, []);
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export function toggleV2Bookmark(id: string): string[] {
  const current = getV2Bookmarks();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  write(V2_KEYS.bookmarks, next);
  return next;
}

export function getRecentVisits(): VisitRecord[] {
  const value = read<unknown>(V2_KEYS.recent, []);
  return Array.isArray(value) ? value.filter((x): x is VisitRecord => !!x && typeof x.href === "string") : [];
}

export function recordVisit(href: string, title: string): VisitRecord[] {
  const next = [{ href, title, at: Date.now() }, ...getRecentVisits().filter((v) => v.href !== href)].slice(0, 12);
  write(V2_KEYS.recent, next);
  return next;
}

/** 学习路径勾选键：`${pathId}:${stepIndex}` */
export function getPathProgress(): string[] {
  const value = read<unknown>(V2_KEYS.paths, []);
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

export function togglePathStep(key: string): string[] {
  const current = getPathProgress();
  const next = current.includes(key) ? current.filter((x) => x !== key) : [...current, key];
  write(V2_KEYS.paths, next);
  return next;
}

export function readTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(next: "light" | "dark"): void {
  document.documentElement.classList.toggle("dark", next === "dark");
  document.documentElement.style.colorScheme = next === "dark" ? "dark" : "light";
  try { localStorage.setItem(V2_KEYS.theme, next); } catch { /* ignore */ }
}
