"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Card, DataTable } from "@/components/ui/primitives";
import { comparisonRows, solutionOptions } from "@/data/selection";
import { cn } from "@/lib/utils";

export function ComparisonMatrix() {
  const [visible, setVisible] = useState<Set<string>>(new Set(solutionOptions.map((o) => o.id)));
  const toggle = (id: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); } else next.add(id);
      return next;
    });
  };
  const shown = solutionOptions.filter((o) => visible.has(o.id));

  return (
    <div className="my-5">
      <Card className="mb-3 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-muted"><Filter className="h-3.5 w-3.5" /> 点击显示 / 隐藏方案列（至少保留一列）</div>
        <div className="flex flex-wrap gap-1.5">
          {solutionOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggle(o.id)}
              aria-pressed={visible.has(o.id)}
              className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition-opacity", visible.has(o.id) ? "border-line bg-surface text-ink" : "border-line bg-elevated text-muted opacity-50 line-through")}
            >
              <span className="h-2 w-2 rounded-sm" style={{ background: o.color }} />{o.label}
            </button>
          ))}
        </div>
      </Card>
      <DataTable
        headers={["比较维度", ...shown.map((o) => o.short)]}
        rows={comparisonRows.map((row) => [row.dimension, ...shown.map((o) => row.values[o.id])])}
        caption={`展示 ${shown.length} / ${solutionOptions.length} 种方案 × ${comparisonRows.length} 个比较维度。表格可横向滚动；结论为架构建议，不是性能基准测试。`}
        dense
      />
    </div>
  );
}
