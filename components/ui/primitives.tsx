import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import katex from "katex";
import {
  AlertTriangle, BookOpen, Building2, FlaskConical, Info, Link2, Lightbulb, ShieldAlert, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-deep text-white hover:bg-brand",
        outline: "border border-line bg-surface text-ink hover:bg-elevated",
        ghost: "text-muted hover:bg-elevated hover:text-ink",
        subtle: "bg-elevated text-ink hover:bg-line/60",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
      },
      size: { default: "h-9 px-4", sm: "h-8 px-3 text-xs", lg: "h-11 px-6", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface shadow-card", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({
  children, tone = "neutral", className,
}: { children: ReactNode; tone?: "neutral" | "blue" | "cyan" | "purple" | "green" | "amber" | "rose"; className?: string }) {
  const tones: Record<string, string> = {
    neutral: "bg-elevated text-muted border-line",
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/25",
    purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/25",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/25",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-5", tones[tone], className)}>
      {children}
    </span>
  );
}

export type CalloutType = "principle" | "advice" | "assumption" | "warning" | "note" | "conclusion";

const calloutConfig: Record<CalloutType, { label: string; icon: typeof Info; className: string }> = {
  principle: {
    label: "行业通用原则",
    icon: Building2,
    className: "border-blue-200 bg-blue-50/70 dark:border-blue-500/25 dark:bg-blue-500/[0.07]",
  },
  advice: {
    label: "架构建议",
    icon: Lightbulb,
    className: "border-cyan-200 bg-cyan-50/70 dark:border-cyan-500/25 dark:bg-cyan-500/[0.07]",
  },
  assumption: {
    label: "示例假设 / 演示数据",
    icon: FlaskConical,
    className: "border-amber-300 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/[0.08]",
  },
  warning: {
    label: "风险提示",
    icon: ShieldAlert,
    className: "border-rose-200 bg-rose-50/70 dark:border-rose-500/25 dark:bg-rose-500/[0.07]",
  },
  note: {
    label: "补充说明",
    icon: Info,
    className: "border-line bg-elevated",
  },
  conclusion: {
    label: "关键结论",
    icon: Sparkles,
    className: "border-purple-200 bg-purple-50/70 dark:border-purple-500/25 dark:bg-purple-500/[0.07]",
  },
};

export function Callout({ type = "note", title, children }: { type?: CalloutType; title?: string; children: ReactNode }) {
  const config = calloutConfig[type];
  const Icon = type === "warning" ? AlertTriangle : config.icon;
  return (
    <div className={cn("my-5 rounded-xl border px-4 py-3.5 break-avoid", config.className)}>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        <Icon className="h-3.5 w-3.5" />
        <span>{config.label}</span>
        {title ? <span className="font-medium normal-case tracking-normal text-ink">· {title}</span> : null}
      </div>
      <div className="text-[13.5px] leading-7 text-ink/90 [&>p:last-child]:mb-0 [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:my-0.5">
        {children}
      </div>
    </div>
  );
}

export function DataTable({
  headers, rows, caption, dense = false, className,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
  caption?: string;
  dense?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("my-5 overflow-hidden rounded-xl border border-line bg-surface shadow-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
          <thead className="bg-elevated">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className={cn("border-b border-line px-3.5 font-semibold text-ink", dense ? "py-2" : "py-3")}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="transition-colors hover:bg-elevated/60">
                {row.map((cell, ci) => (
                  <td key={ci} className={cn("border-b border-line/70 align-top text-muted last:border-b-0", dense ? "px-3.5 py-2" : "px-3.5 py-2.5", ri === rows.length - 1 && "border-b-0")}>
                    <span className="leading-6">{cell}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <div className="border-t border-line bg-elevated/60 px-3.5 py-2 text-xs text-muted">{caption}</div> : null}
    </div>
  );
}

export function ChapterHeader({
  id, no, title, subtitle, minutes,
}: { id: string; no: number; title: string; subtitle?: string; minutes?: number }) {
  return (
    <header id={id} className="scroll-mt-24 pb-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-8 items-center rounded-lg bg-brand-deep px-2.5 font-mono text-xs font-bold tracking-wider text-white">
          CH {String(no).padStart(2, "0")}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">Chapter {no}</span>
        {minutes ? <Badge tone="neutral"><BookOpen className="h-3 w-3" /> 约 {minutes} 分钟</Badge> : null}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-[30px] sm:leading-tight">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-3xl text-[15px] leading-7 text-muted">{subtitle}</p> : null}
    </header>
  );
}

export function AnchorHeading({ id, children, level = 3 }: { id?: string; children: ReactNode; level?: 3 | 4 }) {
  const Tag = level === 3 ? "h3" : "h4";
  return (
    <Tag id={id} className={cn("group mb-3 scroll-mt-24 font-bold tracking-tight text-ink", level === 3 ? "text-[17px] leading-7 sm:text-[18px]" : "text-[14.5px] leading-6")} >
      <span>{children}</span>
      {id ? (
        <a href={`#${id}`} aria-label="锚点链接" className="ml-2 inline-flex align-middle opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">
          <Link2 className="h-3.5 w-3.5 text-brand" />
        </a>
      ) : null}
    </Tag>
  );
}

export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("ke-doc", className)}>{children}</div>;
}

export function Formula({ expression, block = true }: { expression: string; block?: boolean }) {
  const html = katex.renderToString(expression, { throwOnError: false, displayMode: block, output: "html" });
  return (
    <div className={cn("my-4 overflow-x-auto rounded-xl border border-line bg-elevated px-4 py-3 text-ink", block ? "text-center" : "inline-block")} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function StatCard({ label, value, hint, tone = "blue" }: { label: string; value: string; hint?: string; tone?: "blue" | "cyan" | "purple" | "green" | "amber" }) {
  const tones: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-300", cyan: "text-cyan-600 dark:text-cyan-300",
    purple: "text-purple-600 dark:text-purple-300", green: "text-emerald-600 dark:text-emerald-300",
    amber: "text-amber-600 dark:text-amber-300",
  };
  return (
    <Card className="p-4">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className={cn("mt-1.5 text-2xl font-bold tracking-tight", tones[tone])}>{value}</div>
      {hint ? <div className="mt-1 text-[11px] leading-5 text-muted">{hint}</div> : null}
    </Card>
  );
}

export function StepBadge({ step, tone = "blue" }: { step: number | string; tone?: "blue" | "cyan" | "purple" | "green" }) {
  const tones: Record<string, string> = {
    blue: "bg-blue-600", cyan: "bg-cyan-600", purple: "bg-purple-600", green: "bg-emerald-600",
  };
  return <span className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 font-mono text-xs font-bold text-white", tones[tone])}>{step}</span>;
}

export function PanelTitle({ icon, children, right }: { icon?: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">{icon}{children}</div>
      {right}
    </div>
  );
}
