"use client";

import { useMemo, useState } from "react";
import { Check, Copy, FileCode2, Info } from "lucide-react";
import { highlightCode, languageLabels, type CodeLanguage } from "@/lib/prism";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  id?: string;
  title?: string;
  filename?: string;
  language?: CodeLanguage;
  code: string;
  note?: string;
  scope?: string;
  className?: string;
  maxHeight?: string;
}

export function CodeBlock({
  id, title, filename, language = "text", code, note, scope, className, maxHeight = "30rem",
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => {
    const source = code.replace(/^\n/, "").replace(/\n+$/, "");
    return source.split("\n").map((line) => highlightCode(line || " ", language));
  }, [code, language]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.replace(/^\n/, "").replace(/\n+$/, "") + "\n");
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <figure id={id} className={cn("my-5 scroll-mt-24 overflow-hidden rounded-xl border border-slate-700/70 shadow-card", className)}>
      <figcaption className="flex items-center justify-between gap-2 border-b border-slate-700/70 bg-[#111c30] px-3.5 py-2">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-300">
          <FileCode2 className="h-3.5 w-3.5 shrink-0 text-brand-soft" />
          <span className="truncate font-medium">{title ?? filename ?? "示例代码"}</span>
          <span className="shrink-0 rounded border border-slate-600 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            {languageLabels[language] ?? language}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="复制代码"
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-slate-600 px-2 text-[11px] font-medium text-slate-200 transition-colors hover:bg-slate-700/70"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </figcaption>
      <div className="code-surface overflow-auto" style={{ maxHeight }}>
        <pre className="min-w-max py-3 font-mono text-[12.5px] leading-6">
          <code>
            {lines.map((html, i) => (
              <span key={i} className="flex">
                <span className="mr-4 inline-block w-9 shrink-0 select-none pr-2 text-right text-slate-600">{i + 1}</span>
                <span className="pr-6" dangerouslySetInnerHTML={{ __html: html }} />
              </span>
            ))}
          </code>
        </pre>
      </div>
      {note || scope ? (
        <div className="space-y-1 border-t border-slate-700/70 bg-[#111c30] px-3.5 py-2.5 text-[11.5px] leading-5 text-slate-400">
          {scope ? <p><span className="font-semibold text-amber-300">适用范围：</span>{scope}</p> : null}
          {note ? <p className="flex gap-1.5"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />{note}</p> : null}
        </div>
      ) : null}
    </figure>
  );
}
