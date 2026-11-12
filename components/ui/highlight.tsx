import type { ReactNode } from "react";

export function highlightText(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const parts = q.split(/\s+/).filter(Boolean).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!parts.length) return text;
  const splitter = new RegExp(`(${parts.join("|")})`, "gi");
  const matcher = new RegExp(`^(?:${parts.join("|")})$`, "i");
  return text.split(splitter).map((part, i) =>
    matcher.test(part) ? <mark key={i} className="highlight-mark">{part}</mark> : <span key={i}>{part}</span>
  );
}
