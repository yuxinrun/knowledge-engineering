"use client";

import { useState, type ReactNode } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid,
  Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { BarChart3, FlaskConical } from "lucide-react";
import { Badge, Callout, Card, StatCard } from "@/components/ui/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  accuracyBarData, kpiCards, latencySeries, metricGroups, metricItems, radarData, retrievalBarData, type MetricItem,
} from "@/data/metrics";
import { palette } from "@/data/palette";

const tooltipStyle = {
  background: palette.darkCanvas, border: `1px solid ${palette.slate}`, borderRadius: 8,
  color: "#e2e8f0", fontSize: 11, padding: "6px 10px",
};

function formatValue(m: MetricItem) {
  if (m.unit === "%" || m.unit === "score") return `${(m.value * 100).toFixed(m.value > 0 && m.value < 0.01 ? 1 : 0)}%`;
  return `${m.value}${m.unit}`;
}

function formatTarget(m: MetricItem) {
  if (m.unit === "%" || m.unit === "score") return `${(m.target * 100).toFixed(0)}%`;
  return `${m.target}${m.unit}`;
}

function ChartCard({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <Card className="min-w-0 p-4">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold text-ink">{title}</div>
        <Badge tone="amber"><FlaskConical className="h-3 w-3" /> 演示数据</Badge>
      </div>
      <p className="mb-3 text-[10.5px] leading-5 text-muted">{hint}</p>
      <div className="h-[260px] w-full">{children}</div>
    </Card>
  );
}

function MetricTable({ group }: { group: MetricItem["group"] }) {
  const items = metricItems.filter((m) => m.group === group);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-elevated/60 px-3 py-2.5">
        <div className="text-xs font-semibold text-ink">{group}指标明细</div>
        <Badge tone="amber">演示数据</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-[11.5px]">
          <thead className="bg-elevated/60 text-[10px] uppercase tracking-wider text-muted">
            <tr><th className="px-3 py-2">指标</th><th className="px-3 py-2">当前值</th><th className="px-3 py-2">自定目标</th><th className="px-3 py-2">定义</th></tr>
          </thead>
          <tbody>
            {items.map((m) => {
              const pct = m.unit === "%" || m.unit === "score" ? m.value * 100 : Math.min(100, (m.value / (m.target || 1)) * 80);
              const offTarget = m.higherBetter ? m.value < m.target : m.value > m.target;
              return (
                <tr key={m.name} className="border-t border-line/60 align-top">
                  <td className="px-3 py-2 font-medium text-ink">{m.name}</td>
                  <td className="px-3 py-2">
                    <div className={offTarget ? "font-mono font-semibold text-amber-600 dark:text-amber-300" : "font-mono font-semibold text-emerald-600 dark:text-emerald-300"}>{formatValue(m)}</div>
                    <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-elevated"><div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, pct)}%` }} /></div>
                  </td>
                  <td className="px-3 py-2 font-mono text-muted">{formatTarget(m)}</td>
                  <td className="px-3 py-2 leading-5 text-muted">{m.definition}<div className="mt-0.5 text-[10px] text-muted/80">{m.note}</div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function MetricsDashboard() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="my-5">
      <Callout type="assumption" title="所有数值均为演示数据">
        <p>下面的 Precision / Recall、MRR / NDCG、Faithfulness、延迟、成本与 ACL Leakage Rate 均为<strong>为展示指标形态而构造的演示数据</strong>，目标阈值也为团队自定示例，不是行业标准、基准测试成绩或任何真实客户结果。</p>
      </Callout>
      <div className="my-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpiCards.map((k) => <StatCard key={k.label} label={k.label} value={k.value} hint={k.hint} tone={k.tone} />)}
      </div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="extraction">抽取质量</TabsTrigger>
          <TabsTrigger value="retrieval">检索质量</TabsTrigger>
          <TabsTrigger value="answer">回答质量</TabsTrigger>
          <TabsTrigger value="system">性能与安全</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="五维能力雷达" hint="演示基线 vs 团队自定目标阈值，用于观察短板而非跨项目比较。">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="rgba(100,116,139,.35)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <Radar name="演示基线" dataKey="演示基线" stroke={palette.azure} fill={palette.azure} fillOpacity={0.28} />
                <Radar name="目标阈值" dataKey="目标阈值" stroke={palette.leaf} fill={palette.leaf} fillOpacity={0.08} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="P50 / P95 延迟与单查询成本趋势" hint="8 周演示序列；成本单位仅用于示意，不代表任何云厂商报价。">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencySeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,.22)" />
                <XAxis dataKey="week" tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="p50" name="P50 (s)" stroke={palette.azure} strokeWidth={2} dot={{ r: 2 }} />
                <Line yAxisId="left" type="monotone" dataKey="p95" name="P95 (s)" stroke={palette.violet} strokeWidth={2} dot={{ r: 2 }} />
                <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost (示意)" stroke={palette.leaf} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="lg:col-span-2"><MetricTable group="抽取质量" /></div>
        </TabsContent>
        <TabsContent value="extraction" className="space-y-4">
          <ChartCard title="抽取质量：当前值 vs 自定目标" hint="实体/关系 Precision、Recall、F1，Entity Resolution 与本体校验通过率（演示数据）。">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyBarData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,.22)" />
                <XAxis dataKey="name" tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <YAxis domain={[60, 100]} tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="当前" fill={palette.azure} radius={[3, 3, 0, 0]} />
                <Bar dataKey="目标" fill={palette.slate} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <MetricTable group="抽取质量" />
        </TabsContent>
        <TabsContent value="retrieval" className="space-y-4">
          <ChartCard title="检索与回答质量：当前值 vs 自定目标" hint="Recall@K、MRR、NDCG、Graph Path Accuracy、Faithfulness、Citation、Completeness（演示数据）。">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retrievalBarData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,.22)" />
                <XAxis type="number" domain={[60, 100]} tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={96} tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="当前" fill={palette.brand} radius={[0, 3, 3, 0]} />
                <Bar dataKey="目标" fill={palette.slate} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <MetricTable group="检索质量" />
        </TabsContent>
        <TabsContent value="answer" className="space-y-4">
          <MetricTable group="回答质量" />
          <Card className="p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink"><BarChart3 className="h-3.5 w-3.5 text-brand" /> 解读要点</div>
            <ul className="list-disc space-y-1.5 pl-5 text-[12px] leading-6 text-muted">
              <li>Faithfulness 高不等于答案完整：还要看 Answer Completeness 是否覆盖所有标注要点。</li>
              <li>Citation Accuracy 必须检查“引用存在”与“引用确实支持该结论”两件事。</li>
              <li>模型自评不能替代人工标注；评估集要包含证据不足、冲突事实与越权用例。</li>
            </ul>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="space-y-4">
          <ChartCard title="延迟趋势（演示数据）" hint="优化动作与流量变化都可能影响 P95，需结合调用量与错误率一起看。">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencySeries} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,.22)" />
                <XAxis dataKey="week" tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="p50" name="P50 (s)" stroke={palette.azure} strokeWidth={2} />
                <Line type="monotone" dataKey="p95" name="P95 (s)" stroke={palette.rose} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <MetricTable group="系统性能" />
          <MetricTable group="权限安全" />
        </TabsContent>
      </Tabs>
      <details className="mt-4 rounded-xl border border-line bg-surface p-3">
        <summary className="cursor-pointer text-xs font-semibold text-ink">查看全部 {metricItems.length} 项指标定义（{metricGroups.join(" / ")}）</summary>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {metricItems.map((m) => (
            <div key={m.name} className="rounded-lg border border-line bg-elevated/40 p-2.5">
              <div className="text-[11.5px] font-semibold text-ink">{m.name} <span className="text-[10px] font-normal text-muted">· {m.group}</span></div>
              <div className="mt-1 text-[11px] leading-5 text-muted">{m.definition}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
