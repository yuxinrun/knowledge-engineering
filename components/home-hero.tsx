"use client";

import { ArrowRight, BookOpen, Boxes, Code2, FlaskConical, Layers3, Sparkles } from "lucide-react";
import { Callout } from "@/components/ui/primitives";
import { useSite } from "@/components/site-context";
import { KnowledgeLoop } from "@/components/viz/knowledge-loop";
import { ThreeLayerDiagram } from "@/components/viz/three-layer-diagram";

const stats = [
  { value: "12", label: "章完整技术内容", tone: "text-[#0E9F8A]" },
  { value: "12+", label: "交互式可视化", tone: "text-[#102A24] dark:text-slate-100" },
  { value: "36", label: "条技术术语", tone: "text-[#E2683C]" },
  { value: "20", label: "组可复制代码", tone: "text-[#3B6FE0]" },
];

const guide = [
  { icon: Layers3, title: "认知基础", desc: "先把 Ontology / KG / GraphRAG 的边界划清楚", href: "#ch1-overview", tag: "第 1–2 章", tone: "text-purple-500 dark:text-purple-300" },
  { icon: BookOpen, title: "建模与构建", desc: "12 步本体设计、OWL/SHACL 与离线构建 Pipeline", href: "#ch3-ontology", tag: "第 3–4 章", tone: "text-cyan-600 dark:text-cyan-300" },
  { icon: Boxes, title: "工程实现", desc: "Neo4j 属性图与 Azure 企业级 GraphRAG 架构", href: "#ch5-neo4j", tag: "第 5–6 章", tone: "text-blue-600 dark:text-blue-300" },
  { icon: Sparkles, title: "选型与案例", desc: "六方案对比矩阵、可解释决策器与四类企业案例", href: "#ch7-selection", tag: "第 7–8 章", tone: "text-emerald-600 dark:text-emerald-300" },
  { icon: FlaskConical, title: "生产与评估", desc: "20 项生产议题、评估仪表盘与八阶段路线图", href: "#ch9-production", tag: "第 9–11 章", tone: "text-amber-600 dark:text-amber-300" },
  { icon: Code2, title: "代码与附录", desc: "建议项目结构、关键代码示例、术语与官方参考", href: "#ch12-code", tag: "第 12 章 · 附录", tone: "text-rose-500 dark:text-rose-300" },
];

export function HomeHero() {
  const { startLearning, openChecklist, openGlossary } = useSite();

  return (
    <section id="hero" className="relative w-full scroll-mt-24 overflow-hidden bg-[#F6F4EE] dark:bg-[#0B1220]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(14,159,138,0.14),transparent_66%)] dark:opacity-50" />
      <div className="pointer-events-none absolute -bottom-56 left-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.07),transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1320px] px-6 pb-14 pt-10 sm:px-10 lg:px-12 lg:pt-14">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
          <span>Field Guide · 2026</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>Ontology / KG / GraphRAG</span>
          <span className="rounded-full border border-[#DEDACF] bg-white/70 px-2 py-0.5 normal-case tracking-normal dark:border-slate-700 dark:bg-slate-900/70">12 章 · 可交互</span>
        </div>

        <div className="mt-7 grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div className="min-w-0">
            <h1 className="text-[38px] font-bold leading-[1.06] tracking-[-0.05em] text-[#102A24] dark:text-slate-50 sm:text-[52px] lg:text-[60px]">
              Ontology ×<br />
              <span className="text-[#0E9F8A] dark:text-teal-300">Knowledge Graph</span><br />
              × GraphRAG
            </h1>
            <p className="mt-6 text-[15px] font-semibold leading-7 text-[#1B3A31] dark:text-slate-100 sm:text-[18px]">
              从业务语义建模到知识关联，再到智能检索与推理，完整理解企业级知识工程。
            </p>
            <p className="mt-3 max-w-2xl text-[12.5px] leading-7 text-[#6B7269] dark:text-slate-400 sm:text-[13.5px]">
              不是把三个名词写在一页 PPT 上——真正的工程，是先用 Ontology 统一语义、用 Knowledge Graph 组织事实、再用 GraphRAG 融合图检索与文档证据，最后落到可追溯的引用、权限与评估。12 章从概念到代码，一路讲到生产运维与选型。
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => startLearning("#ch1-overview")}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0E9F8A] px-5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(14,159,138,0.28)] transition-colors hover:bg-[#0B8878]"
              >
                开始学习 <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openChecklist}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D9D6CC] bg-white px-4 text-[13px] font-medium text-[#2A3A32] transition-colors hover:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                直接跳到 Checklist
              </button>
              <button
                type="button"
                onClick={openGlossary}
                className="inline-flex h-10 items-center gap-1.5 px-1 text-[12.5px] font-medium text-[#626B62] underline-offset-4 hover:text-teal-700 hover:underline dark:text-slate-400 dark:hover:text-teal-300"
              >
                术语词典 <ArrowRight className="h-3.5 w-3.5 -rotate-45" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#6B7269] dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-teal-500" />12 章 · 约 3.5 小时</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-blue-500" />交互图 · 代码 · Checklist</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-purple-500" />中文技术白皮书</span>
            </div>

            <div className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-[#E3DFD4] bg-white/75 px-2.5 py-1 text-[10px] text-[#6B7269] dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <i className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />独立思考 · Yuxin Run
            </div>
          </div>

          <div className="min-w-0">
            <KnowledgeLoop />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#E3DFD4] bg-[#E3DFD4] dark:border-slate-700 dark:bg-slate-700 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-5 py-4 dark:bg-slate-900">
              <div className={`font-mono text-[26px] font-bold leading-8 ${s.tone}`}>{s.value}</div>
              <div className="mt-0.5 text-[11px] text-[#6B7269] dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Interactive Overview</div>
              <h2 className="mt-1 text-lg font-bold text-ink">全链路交互式总架构图</h2>
            </div>
            <span className="text-[11px] text-muted">节点可拖动 · 点击查看详情 · 可缩放平移</span>
          </div>
          <ThreeLayerDiagram variant="hero" />
          <Callout type="principle" title="这是一张概念性架构图，不是强制流水线">
            <p>图中展示的是一种<strong>常见组合方式</strong>：Ontology 定义语义、Knowledge Graph 组织事实、GraphRAG 组合检索与生成。三者可以独立使用，也可以两两组合：文档语义检索可直接走 Traditional RAG，知识图谱可直接用于确定性 Cypher 查询，GraphRAG 也不要求完整 OWL 本体或特定图数据库。</p>
          </Callout>
        </div>

        <div className="mt-12">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-ink">本书导读</h2>
            <span className="text-[11px] text-muted">按你的角色选择入口</span>
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
      </div>
    </section>
  );
}
