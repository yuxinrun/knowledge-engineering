"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Activity, AlertTriangle, Cpu, Factory, Thermometer, Waves, Wrench } from "lucide-react";
import { Badge, Card, PanelTitle } from "@/components/ui/primitives";
import { manufacturingRelations, simulationNotice, twinAssets, twinEvents, twinSeries } from "@/data/v2-model";
import { cn } from "@/lib/utils";

const tooltipStyle = { background: "#0B1220", border: "1px solid #334155", borderRadius: 10, color: "#E2E8F0", fontSize: 11 };
const STATE_TONE = { Running: "green", Warning: "amber", Stopped: "rose" } as const;

const PROPAGATION = ["FAC-A", "LINE-01", "MCH-001", "CMP-001", "SNS-001", "TLM-001", "MEV-001", "WO-001", "TEAM-MNT-01"];

export function DigitalTwinSimulator() {
  const [assetId, setAssetId] = useState("MCH-001");
  const [scenario, setScenario] = useState<"alert" | "normal">("alert");
  const [eventFilter, setEventFilter] = useState<"all" | "Alert" | "Telemetry" | "Maintenance">("all");

  const asset = twinAssets.find((a) => a.id === assetId) ?? twinAssets[0];
  const series = useMemo(() => {
    if (scenario === "normal") return twinSeries.map((p, i) => ({ ...p, temperature: Number((68.2 + Math.sin(i / 2.6) * 0.7).toFixed(1)), vibration: Number((3.1 + Math.cos(i / 3) * 0.25).toFixed(2)) }));
    return twinSeries;
  }, [scenario]);

  const events = twinEvents.filter((e) => (eventFilter === "all" || e.kind === eventFilter) && (scenario === "alert" || e.time < "11:00"));
  const relations = manufacturingRelations.filter((r) => r.source === assetId || r.target === assetId);
  const downstream = PROPAGATION.slice(Math.max(0, PROPAGATION.indexOf(assetId)));
  const last = series[series.length - 1];

  return (
    <Card className="overflow-hidden">
      <PanelTitle icon={<Factory className="h-4 w-4 text-brand" />} right={<Badge tone="amber">模拟数据 · 未连接真实 IoT</Badge>}>Digital Twin Simulator</PanelTitle>
      <div className="p-4">
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] px-3 py-2 text-[11px] leading-5 text-muted">
          <strong className="text-ink">全部数据为模拟数据。</strong>Factory-A / Line-01 / Machine-001 / Sensor-001 / Motor-001 / Maintenance-Team 及所有温度、振动、告警、工单均由本地确定性函数生成，<strong>未连接任何真实 IoT 设备、MES 或工厂系统</strong>。{simulationNotice}。
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10.5px] text-muted">场景：</span>
          <button type="button" onClick={() => setScenario("normal")} className={cn("rounded-lg border px-2.5 py-1 text-[11px] transition-colors", scenario === "normal" ? "border-leaf/60 bg-leaf/10 font-semibold text-leaf" : "border-line text-muted hover:text-ink")}>正常运行（模拟）</button>
          <button type="button" onClick={() => setScenario("alert")} className={cn("rounded-lg border px-2.5 py-1 text-[11px] transition-colors", scenario === "alert" ? "border-accent/60 bg-accent/10 font-semibold text-accent" : "border-line text-muted hover:text-ink")}>振动告警（模拟）</button>
          <span className="ml-auto font-mono text-[10px] text-muted">采样：1 Hz 模拟 · 24 点 · 阈值 76 °C / 5.5 mm·s⁻¹</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[190px_minmax(0,1fr)]">
          <div>
            <div className="mb-2 text-[11px] font-semibold text-ink">资产层级（点击选择）</div>
            <div className="space-y-1">
              {twinAssets.map((a) => {
                const depth = a.parent ? (twinAssets.find((x) => x.id === a.parent)?.parent ? 2 : 1) : 0;
                return (
                  <button key={a.id} type="button" onClick={() => setAssetId(a.id)} style={{ paddingLeft: `${8 + depth * 12}px` }} className={cn("flex w-full items-center gap-1.5 rounded-lg border py-1.5 pr-2 text-left text-[11px] transition-colors", assetId === a.id ? "border-brand/60 bg-brand/[0.08] font-semibold text-brand" : "border-line bg-surface text-muted hover:text-ink")}>
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", a.state === "Warning" ? "bg-accent" : a.state === "Stopped" ? "bg-rose-500" : "bg-leaf")} />
                    <span className="min-w-0 flex-1 truncate">{a.label}</span>
                  </button>
                );
              })}
            </div>
            <Card className="mt-3 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">直接关系（{relations.length}）</div>
              <div className="mt-1.5 space-y-1">
                {relations.length ? relations.map((r) => (
                  <div key={r.id} className="font-mono text-[9.5px] leading-4 text-muted">{r.source} -[{r.predicate}]→ {r.target}</div>
                )) : <div className="text-[10.5px] text-muted">该资产在当前演示模型中没有直接关系。</div>}
              </div>
            </Card>
          </div>

          <div className="min-w-0 space-y-3">
            <Card className="p-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="blue">{asset.id}</Badge><Badge tone="neutral">{asset.type}</Badge>
                <Badge tone={STATE_TONE[asset.state]}>{asset.state}（模拟）</Badge>
                {scenario === "normal" ? <Badge tone="green">场景：正常</Badge> : <Badge tone="amber">场景：告警</Badge>}
              </div>
              <h3 className="mt-2 text-[15px] font-bold text-ink">{asset.label}</h3>
              <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {asset.props.map((p) => (
                  <div key={p.label} className="flex items-start gap-2 text-[11px]"><span className="w-[110px] shrink-0 text-muted">{p.label}</span><span className="min-w-0 break-words font-mono text-[10.5px] text-ink">{p.value}</span></div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 sm:grid-cols-4">
                {[
                  { icon: Thermometer, label: "温度 (模拟)", value: `${last.temperature} °C`, warn: last.temperature > last.thresholdTemp },
                  { icon: Waves, label: "振动 (模拟)", value: `${last.vibration} mm/s`, warn: last.vibration > last.thresholdVib },
                  { icon: Activity, label: "告警数 (模拟)", value: `${events.filter((e) => e.kind === "Alert").length}`, warn: scenario === "alert" },
                  { icon: Wrench, label: "待审批工单", value: scenario === "alert" ? "1" : "0", warn: false },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-elevated/40 p-2.5">
                    <div className="flex items-center gap-1 text-[10px] text-muted"><s.icon className="h-3 w-3" />{s.label}</div>
                    <div className={cn("mt-1 text-[15px] font-bold", s.warn ? "text-accent" : "text-ink")}>{s.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card className="p-3">
                <div className="text-[11px] font-semibold text-ink">温度趋势（模拟）</div>
                <div className="mt-2 h-[190px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 9, fill: "rgb(var(--muted))" }} interval={5} />
                      <YAxis tick={{ fontSize: 9, fill: "rgb(var(--muted))" }} domain={[60, 90]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <ReferenceLine y={76} stroke="#E2683C" strokeDasharray="4 4" label={{ value: "关注线", fontSize: 9, fill: "#E2683C", position: "insideTopRight" }} />
                      <Line type="monotone" dataKey="temperature" name="°C" stroke="#0E9F8A" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-[11px] font-semibold text-ink">振动趋势（模拟）</div>
                <div className="mt-2 h-[190px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                      <XAxis dataKey="t" tick={{ fontSize: 9, fill: "rgb(var(--muted))" }} interval={5} />
                      <YAxis tick={{ fontSize: 9, fill: "rgb(var(--muted))" }} domain={[0, 8]} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <ReferenceLine y={5.5} stroke="#E2683C" strokeDasharray="4 4" label={{ value: "告警线", fontSize: 9, fill: "#E2683C", position: "insideTopRight" }} />
                      <Line type="monotone" dataKey="vibration" name="mm/s" stroke="#3B6FE0" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="p-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-ink">事件时间线</span>
                {(["all", "Alert", "Telemetry", "Maintenance"] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setEventFilter(f)} className={cn("rounded-md border px-1.5 py-0.5 text-[10px] transition-colors", eventFilter === f ? "border-brand/60 bg-brand/10 font-semibold text-brand" : "border-line text-muted hover:text-ink")}>{f === "all" ? "全部" : f}</button>
                ))}
              </div>
              <div className="mt-2.5 space-y-1.5">
                {events.length ? events.map((e) => (
                  <div key={e.id} className="flex items-start gap-2.5 rounded-lg border border-line bg-elevated/30 px-2.5 py-2">
                    <span className="mt-0.5 w-10 shrink-0 font-mono text-[10px] text-brand">{e.time}</span>
                    <Badge tone={e.kind === "Alert" ? "rose" : e.kind === "Maintenance" ? "amber" : "blue"} className="shrink-0">{e.kind}</Badge>
                    <div className="min-w-0"><div className="text-[11.5px] font-semibold text-ink">{e.label}</div><div className="mt-0.5 text-[10.5px] leading-5 text-muted">{e.detail}</div></div>
                  </div>
                )) : <div className="py-4 text-center text-[11px] text-muted">当前筛选条件下没有事件。</div>}
              </div>
            </Card>

            <Card className="p-3.5">
              <div className="text-[11px] font-semibold text-ink">故障传播 / 影响路径（按资产关系方向，模拟）</div>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {(downstream.length > 1 ? downstream : PROPAGATION).map((id, i, arr) => (
                  <span key={id} className="flex items-center gap-1">
                    <button type="button" onClick={() => { if (twinAssets.some((a) => a.id === id)) setAssetId(id); }} className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[10px]", id === assetId ? "border-brand/60 bg-brand/10 text-brand" : "border-line text-muted hover:text-ink")}>{id}</button>
                    {i < arr.length - 1 ? <span className="text-[10px] text-muted">→</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10.5px] leading-5 text-muted">路径上的节点表示「图上的可能影响链」，不等于已确认的业务影响；跨领域关联 INC-001 -[:IMPACTS]-&gt; LINE-01 在演示数据中为 Pending 审批。</p>
            </Card>

            <Card className="border-accent/30 bg-accent/[0.05] p-3.5">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink"><AlertTriangle className="h-3.5 w-3.5 text-accent" /> 维护记录与建议操作（模拟）</div>
              <ul className="mt-2 space-y-1 text-[11.5px] leading-6 text-muted">
                <li>• 历史：2026-02-11 更换轴承（TW-E5，模拟历史记录），可作为相似案例检索依据。</li>
                <li>• 建议：降载运行、安排轴承检查、核对传感器校准日期；生成待审批工单 WO-001。</li>
                <li>• 边界：以上只是建议，不触发任何真实控制；对真实设备的控制必须经过安全验证和人工授权。</li>
              </ul>
              <div className="mt-2 flex flex-wrap gap-1.5"><Badge tone="amber">需人工审批</Badge><Badge tone="neutral">不连接真实设备</Badge><Badge tone="neutral">建议非结论</Badge></div>
            </Card>

            <div className="rounded-xl border border-line bg-elevated/40 p-3 text-[11px] leading-6 text-muted">
              <strong className="text-ink">关联知识：</strong>点击资产可查看统一数据模型中的属性与关系。知识图谱描述设备/部件/业务关系，时序库保存趋势数据，Digital Twin State 维护对象状态，Simulation 做假设分析，Agent 只提出建议。
              <Cpu className="ml-1 inline h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
