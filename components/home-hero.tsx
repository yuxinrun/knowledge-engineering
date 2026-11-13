"use client";

import Link from "next/link";
import {
  ArrowRight, BookOpen, Boxes, Code2, Compass, FlaskConical, Layers3, ListChecks, Network,
  Printer, Search, ShieldCheck, Sparkles, Target, type LucideIcon,
} from "lucide-react";
import { Callout } from "@/components/ui/primitives";
import { useSite } from "@/components/site-context";
import { KnowledgeLoop } from "@/components/viz/knowledge-loop";
import { ThreeLayerDiagram } from "@/components/viz/three-layer-diagram";
import { chapters, chapterGroups } from "@/data/site";

const stats = [
  { value: "12", label: "章完整技术内容", tone: "text-brand" },
  { value: "12+", label: "交互式可视化", tone: "text-ink" },
  { value: "36", label: "条技术术语", tone: "text-accent" },
  { value: "20", label: "组可复制代码", tone: "text-azure" },
];

const pillars = [
  {
    index: "01", label: "ONTOLOGY", cn: "定义语义", tone: "border-t-violet", text: "text-violet",
    desc: "用 Class、Object / Data Property、OWL 公理与 SHACL 约束，约定企业世界里哪些陈述是合法的。",
    output: "交付物：CQ 清单 · OWL · SHACL · 版本策略", href: "#ch3-ontology",
  },
  {
    index: "02", label: "KNOWLEDGE GRAPH", cn: "组织事实", tone: "border-t-brand", text: "text-brand",
    desc: "把解析、抽取、消歧、融合后的实体与关系写成可查询的图数据，并保留来源、时态与置信度。",
    output: "交付物：实体 ID 体系 · 图 Schema · Provenance", href: "#ch4-ingestion",
  },
  {
    index: "03", label: "GRAPHRAG", cn: "检索与生成", tone: "border-t-azure", text: "text-azure",
    desc: "把图路径、文档原文与向量检索融合成上下文，在引用、权限与评估约束下生成可追溯的答案。",
    output: "交付物：混合检索 · Citation · 评估基线", href: "#ch6-graphrag",
  },
];

const paths: {
  role: string; goal: string; icon: LucideIcon; tone: string;
  steps: { label: string; href: string }[];
}[] = [
  {
    role: "架构师 / 技术负责人", goal: "先划清边界与组合方式，再决定投入规模。", icon: Compass, tone: "text-violet",
    steps: [
      { label: "概念与边界", href: "#ch1-overview" },
      { label: "六方案选型矩阵", href: "#ch7-selection" },
      { label: "四类企业案例", href: "#ch8-cases" },
      { label: "八阶段实施路线图", href: "#ch11-roadmap" },
    ],
  },
  {
    role: "数据 / AI 工程师", goal: "把 Pipeline、图库与检索做成可运行、可回滚的系统。", icon: Code2, tone: "text-azure",
    steps: [
      { label: "12 步本体设计", href: "#ch3-ontology" },
      { label: "离线构建 Pipeline", href: "#ch4-ingestion" },
      { label: "Neo4j 与 Cypher", href: "#ch5-neo4j" },
      { label: "企业级 GraphRAG 架构", href: "#ch6-graphrag" },
      { label: "完整代码示例", href: "#ch12-code" },
    ],
  },
  {
    role: "产品 / 技术决策者", goal: "评估成本、风险、评估指标与上线节奏。", icon: Target, tone: "text-accent",
    steps: [
      { label: "贯穿全书的业务场景", href: "#ch2-scenario" },
      { label: "20 项生产议题", href: "#ch9-production" },
      { label: "评估指标与仪表盘", href: "#ch10-eval" },
      { label: "术语、FAQ 与官方参考", href: "#appendix" },
    ],
  },
];

const guide = [
  { icon: Layers3, title: "认知基础", desc: "先把 Ontology / KG / GraphRAG 的边界划清楚", href: "#ch1-overview", tag: "第 1–2 章", tone: "text-violet" },
  { icon: BookOpen, title: "建模与构建", desc: "12 步本体设计、OWL/SHACL 与离线构建 Pipeline", href: "#ch3-ontology", tag: "第 3–4 章", tone: "text-brand" },
  { icon: Boxes, title: "工程实现", desc: "Neo4j 属性图与 Azure 企业级 GraphRAG 架构", href: "#ch5-neo4j", tag: "第 5–6 章", tone: "text-azure" },
  { icon: Sparkles, title: "选型与案例", desc: "六方案对比矩阵、可解释决策器与四类企业案例", href: "#ch7-selection", tag: "第 7–8 章", tone: "text-leaf" },
  { icon: FlaskConical, title: "生产与评估", desc: "20 项生产议题、评估仪表盘与八阶段路线图", href: "#ch9-production", tag: "第 9–11 章", tone: "text-accent" },
  { icon: Code2, title: "代码与附录", desc: "建议项目结构、关键代码示例、术语与官方参考", href: "#ch12-code", tag: "第 12 章 · 附录", tone: "text-brand-soft" },
];

const outcomes = [
  { icon: Layers3, title: "一张清晰的边界图", desc: "分清语义层、事实层与检索层各自解决什么问题，避免把三个名词混成一个方案。" },
  { icon: Network, title: "一套可落地的架构", desc: "从抽取、消歧到权限过滤、引用与评估，每个环节都有组件职责与失败处理。" },
  { icon: Code2, title: "可直接改写的代码", desc: "OWL / SHACL / Pydantic / Cypher / Hybrid Search / FastAPI 的关键片段，均可复制。" },
  { icon: ShieldCheck, title: "生产级检查清单", desc: "20 项上线议题、评估指标定义与阶段门禁，把 PoC 推进到可运维。" },
];

export function HomeHero() {
  const { startLearning, openChecklist, openGlossary, openSearch } = useSite();
  const cardClass = "rounded-xl border border-line bg-surface shadow-card";

  return (
    <section id="hero" className="relative w-full scroll-mt-24 overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(14,159,138,0.14),transparent_66%)] dark:opacity-50" />
      <div className="pointer-events-none absolute -bottom-56 left-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(226,104,60,0.07),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 pb-14 pt-10 sm:px-10 lg:px-12 lg:pt-14">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-deep dark:text-brand-soft">
          <span>Field Guide · 2026</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>Ontology / KG / GraphRAG</span>
          <span className="rounded-full border border-line bg-surface/80 px-2 py-0.5 normal-case tracking-normal text-muted">12 章 · 可交互</span>
        </div>

        <Link href="/hub" className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-brand/30 bg-brand/[0.06] px-4 py-3 transition-colors hover:border-brand/60">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-deep text-white"><Network className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold text-ink">V2.0 增量升级 · Enterprise Knowledge Engineering Hub</span>
            <span className="mt-0.5 block text-[11px] leading-5 text-muted">新增 7 大专题、5 个交互工具、10 个架构模式、知识关系浏览器与四条学习路径；原有 12 章与 3 个交互工具完整保留。</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-brand">进入知识库 <ArrowRight className="h-3.5 w-3.5" /></span>
        </Link>

        <div className="mt-7 grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div className="min-w-0">
            <h1 className="text-[38px] font-bold leading-[1.06] tracking-[-0.05em] text-ink sm:text-[52px] lg:text-[60px]">
              Ontology ×<br />
              <span className="text-brand">Knowledge Graph</span><br />
              × GraphRAG
            </h1>
            <p className="mt-6 text-[15px] font-semibold leading-7 text-ink sm:text-[18px]">
              从业务语义建模到知识关联，再到智能检索与推理，完整理解企业级知识工程。
            </p>
            <p className="mt-3 max-w-2xl text-[12.5px] leading-7 text-muted sm:text-[13.5px]">
              不是把三个名词写在一页 PPT 上——真正的工程，是先用 Ontology 统一语义、用 Knowledge Graph 组织事实、再用 GraphRAG 融合图检索与文档证据，最后落到可追溯的引用、权限与评估。12 章从概念到代码，一路讲到生产运维与选型。
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => startLearning("#ch1-overview")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-deep px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand"
              >
                开始学习 <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openChecklist}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-[13px] font-medium text-ink transition-colors hover:border-brand/60"
              >
                直接跳到 Checklist
              </button>
              <button
                type="button"
                onClick={openGlossary}
                className="inline-flex h-10 items-center gap-1.5 px-1 text-[12.5px] font-medium text-muted underline-offset-4 hover:text-brand hover:underline"
              >
                术语词典 <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-brand" />12 章 · 约 3.5 小时</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-azure" />交互图 · 代码 · Checklist</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-violet" />中文技术白皮书</span>
            </div>

            <div className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/80 px-2.5 py-1 text-[10px] text-muted">
              <i className="h-1.5 w-1.5 rounded-full bg-accent" />独立思考 · Yuxin Run
            </div>
          </div>

          <div className="min-w-0">
            <KnowledgeLoop />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface px-5 py-4">
              <div className={`font-mono text-[26px] font-bold leading-8 ${s.tone}`}>{s.value}</div>
              <div className="mt-0.5 text-[11px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Three Layers</div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">三个层次，解决三个不同的问题</h2>
            <p className="mt-1.5 max-w-3xl text-[12.5px] leading-6 text-muted">它们可以独立使用，也可以两两组合。先认清各自的输入与产物，才不会把「语义建模」「建图」和「检索生成」混为一谈。</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {pillars.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => startLearning(p.href)}
                className={`group rounded-xl border border-t-2 border-line bg-surface p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-float ${p.tone}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] font-bold tracking-[0.16em] ${p.text}`}>{p.index} / {p.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-brand" />
                </div>
                <div className="mt-3 text-[15px] font-bold text-ink">{p.cn}</div>
                <p className="mt-2 min-h-[72px] text-[12px] leading-6 text-muted">{p.desc}</p>
                <div className="mt-3 border-t border-line pt-2.5 font-mono text-[10px] leading-5 text-muted">{p.output}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Interactive Overview</div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">全链路交互式总架构图</h2>
            </div>
            <span className="text-[11px] text-muted">节点可拖动 · 点击查看详情 · 可缩放平移</span>
          </div>
          <ThreeLayerDiagram variant="hero" />
          <Callout type="principle" title="这是一张概念性架构图，不是强制流水线">
            <p>图中展示的是一种<strong>常见组合方式</strong>：Ontology 定义语义、Knowledge Graph 组织事实、GraphRAG 组合检索与生成。三者可以独立使用，也可以两两组合：文档语义检索可直接走 Traditional RAG，知识图谱可直接用于确定性 Cypher 查询，GraphRAG 也不要求完整 OWL 本体或特定图数据库。</p>
          </Callout>
        </div>

        <div className="mt-12">
          <div className="mb-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Reading Paths</div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">按你的角色选择阅读路径</h2>
            <p className="mt-1.5 text-[12.5px] leading-6 text-muted">不必从第 1 章线性读到第 12 章。点任意一站，直接进入对应章节。</p>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {paths.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.role} className={`${cardClass} p-5`}>
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated"><Icon className={`h-4 w-4 ${p.tone}`} /></span>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-bold text-ink">{p.role}</div>
                      <p className="mt-1 text-[11.5px] leading-5 text-muted">{p.goal}</p>
                    </div>
                  </div>
                  <ol className="mt-4 space-y-1.5">
                    {p.steps.map((step, i) => (
                      <li key={step.href}>
                        <button
                          type="button"
                          onClick={() => startLearning(step.href)}
                          className="group flex w-full items-center gap-2 rounded-lg border border-line bg-elevated/60 px-2.5 py-1.5 text-left text-[11.5px] text-ink transition-colors hover:border-brand/60 hover:bg-brand/[0.07]"
                        >
                          <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                          <span className="min-w-0 flex-1 truncate">{step.label}</span>
                          <ArrowRight className="h-3 w-3 shrink-0 text-muted group-hover:text-brand" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Chapter Map</div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ink">12 章 + 附录，完整地图</h2>
            </div>
            <span className="text-[11px] text-muted">点击任意章节直接进入 · 时长为建议阅读时间</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapterGroups.map((group) => (
              <div key={group} className={`${cardClass} p-4`}>
                <div className="mb-2.5 flex items-center gap-2 border-b border-line pb-2 text-[11px] font-semibold text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />{group}
                </div>
                <div className="space-y-0.5">
                  {chapters.filter((c) => c.group === group).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => startLearning(`#${c.id}`)}
                      className="group flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-elevated"
                    >
                      <span className="w-6 shrink-0 font-mono text-[10px] text-muted">{c.group === "附录" ? "AP" : String(c.no).padStart(2, "0")}</span>
                      <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink group-hover:text-brand">{c.short}</span>
                      <span className="shrink-0 font-mono text-[10px] text-muted">{c.minutes}′</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight text-ink">按主题快速进入</h2>
            <span className="text-[11px] text-muted">六段主题 · 覆盖全书</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guide.map((g) => {
              const Icon = g.icon;
              return (
                <button
                  key={g.title}
                  type="button"
                  onClick={() => startLearning(g.href)}
                  className="group rounded-xl border border-line bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-float"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-elevated"><Icon className={`h-4 w-4 ${g.tone}`} /></span>
                    <span className="rounded-md border border-line bg-elevated px-1.5 py-0.5 text-[10px] text-muted">{g.tag}</span>
                  </div>
                  <div className="mt-3 text-[13px] font-semibold text-ink">{g.title}</div>
                  <p className="mt-1 text-[11.5px] leading-5 text-muted">{g.desc}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">进入章节 <ArrowRight className="h-3 w-3" /></div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className={`${cardClass} p-5`}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">What You Get</div>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">读完这份指南，你会得到什么</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {outcomes.map((o) => {
                const Icon = o.icon;
                return (
                  <div key={o.title} className="rounded-lg border border-line bg-elevated/60 p-3.5">
                    <Icon className="h-4 w-4 text-brand" />
                    <div className="mt-2 text-[12.5px] font-semibold text-ink">{o.title}</div>
                    <p className="mt-1 text-[11.5px] leading-5 text-muted">{o.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${cardClass} p-5`}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Site Toolbox</div>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">站内阅读工具</h2>
            <p className="mt-2 text-[11.5px] leading-5 text-muted">所有状态保存在浏览器本地：进度、收藏与主题都不会上传。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={openSearch} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated text-[11.5px] text-ink transition-colors hover:border-brand/60"><Search className="h-3.5 w-3.5" />全站搜索</button>
              <button type="button" onClick={openChecklist} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated text-[11.5px] text-ink transition-colors hover:border-brand/60"><ListChecks className="h-3.5 w-3.5" />学习清单</button>
              <button type="button" onClick={openGlossary} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated text-[11.5px] text-ink transition-colors hover:border-brand/60"><BookOpen className="h-3.5 w-3.5" />术语词典</button>
              <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-elevated text-[11.5px] text-ink transition-colors hover:border-brand/60"><Printer className="h-3.5 w-3.5" />打印白皮书</button>
            </div>
            <div className="mt-4 rounded-lg border border-line bg-elevated/60 p-3 text-[11px] leading-5 text-muted">
              <span className="font-semibold text-ink">关于数据：</span>全书实体、事实、指标与排期均为教学示例；技术结论区分行业原则、架构建议与示例假设，API 请以官方文档当前版本为准。
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-ink px-6 py-8 text-canvas sm:px-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">Ready to start?</div>
              <h2 className="mt-2 text-[22px] font-bold tracking-tight sm:text-[26px]">从第一章开始，把三个概念彻底分清</h2>
              <p className="mt-1.5 text-[12.5px] leading-6 opacity-80">或先用 Checklist 规划节奏，按自己的角色挑章节读。</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={() => startLearning("#ch1-overview")} className="inline-flex h-10 items-center gap-2 rounded-full bg-canvas px-5 text-[13px] font-semibold text-ink transition-opacity hover:opacity-90">
                开始学习 <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={openChecklist} className="inline-flex h-10 items-center gap-2 rounded-full border border-canvas/40 px-4 text-[13px] font-medium text-canvas transition-colors hover:bg-canvas/10">
                查看 Checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
