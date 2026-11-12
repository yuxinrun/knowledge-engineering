"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, ListChecks } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui/primitives";
import { chapters } from "@/data/site";
import { cn } from "@/lib/utils";

const KEY = "ke-checklist";

export function ChecklistDialog({ open, onOpenChange, onNavigate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (target: string) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(stored)) setChecked(stored.filter((x) => typeof x === "string"));
    } catch { /* ignore invalid local storage */ }
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const clear = () => {
    setChecked([]);
    try { localStorage.setItem(KEY, "[]"); } catch { /* ignore */ }
  };

  const percent = Math.round((checked.length / chapters.length) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader title="学习清单 Checklist" description="勾选已读章节，进度保存在浏览器 localStorage；点击章节标题可直接跳转。" />
        <div className="border-b border-line px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" /> 已完成 {checked.length} / {chapters.length}</span>
            <span className="font-mono text-ink">{percent}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${percent}%` }} /></div>
        </div>
        <div className="max-h-[52vh] space-y-1 overflow-y-auto p-3">
          {chapters.map((c) => {
            const done = checked.includes(c.id);
            return (
              <div key={c.id} className={cn("flex items-center gap-2 rounded-lg border px-2.5 py-2 transition-colors", done ? "border-teal-400/50 bg-teal-50/60 dark:bg-teal-500/[0.08]" : "border-line bg-surface")}>
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-label={`${done ? "取消" : "标记"} ${c.short}`}
                  aria-pressed={done}
                  className={cn("inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors", done ? "border-teal-500 bg-teal-500 text-white" : "border-line bg-elevated text-transparent hover:border-teal-400")}
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => { onOpenChange(false); onNavigate(`#${c.id}`); }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-[12px] font-medium text-ink">{c.group === "附录" ? "附录" : `第 ${c.no} 章`} · {c.short}</span>
                  <span className="block truncate text-[10px] text-muted">{c.sections.length} 个小节 · 约 {c.minutes} 分钟</span>
                </button>
                <Badge tone={done ? "green" : "neutral"}>{done ? "已读" : "未读"}</Badge>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
          <span className="text-[10.5px] text-muted">清单仅保存在本机，不会上传</span>
          <Button variant="ghost" size="sm" onClick={clear}><RotateCcw className="h-3.5 w-3.5" /> 清空进度</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
