import { codeSamples } from "@/data/code";
import { faq } from "@/data/faq";
import { glossary } from "@/data/glossary";
import { chapters } from "@/data/site";
import { adrExamples, architecturePatterns } from "@/data/v2-patterns";
import { hubPages, learningPaths, v2Glossary, knowledgeNodes } from "@/data/v2-hub";

/** V2.0：原有 5 类保持不变，追加专题 / 工具 / 模式 / ADR / 路径 / 概念。 */
export type SearchCategory = "章节" | "小节" | "术语" | "FAQ" | "代码" | "专题" | "工具" | "模式" | "ADR" | "路径" | "概念";

export const searchCategories: (SearchCategory | "全部")[] = [
  "全部", "章节", "小节", "专题", "概念", "术语", "FAQ", "代码", "工具", "模式", "ADR", "路径",
];

export interface SearchEntry {
  id: string;
  target: string;
  title: string;
  category: SearchCategory;
  chapter?: string;
  excerpt: string;
  keywords: string[];
}

const chapterEntries: SearchEntry[] = chapters.flatMap((chapter) => [
  {
    id: `chapter-${chapter.id}`,
    target: `#${chapter.id}`,
    title: `第 ${chapter.no} 章｜${chapter.title}`,
    category: "章节" as const,
    chapter: chapter.short,
    excerpt: chapter.subtitle,
    keywords: [chapter.short, ...chapter.keywords],
  },
  ...chapter.sections.map((section) => ({
    id: `section-${section.id}`,
    target: `#${section.id}`,
    title: section.title,
    category: "小节" as const,
    chapter: chapter.short,
    excerpt: `第 ${chapter.no} 章 · ${chapter.short} 中的小节：${section.title}。${chapter.subtitle}`,
    keywords: [chapter.short, section.title, ...chapter.keywords],
  })),
]);

const glossaryEntries: SearchEntry[] = glossary.map((term) => ({
  id: `glossary-${term.term}`,
  target: "#appendix-glossary",
  title: `${term.term}｜${term.cn}`,
  category: "术语",
  chapter: term.category,
  excerpt: term.plain,
  keywords: [term.term, term.cn, term.category, ...(term.related ?? [])],
}));

const faqEntries: SearchEntry[] = faq.map((item, i) => ({
  id: `faq-${i}`,
  target: "#appendix-faq",
  title: item.q,
  category: "FAQ",
  chapter: item.tags.join(" / "),
  excerpt: item.a,
  keywords: [...item.tags, item.q],
}));

const codeEntries: SearchEntry[] = codeSamples.map((sample) => ({
  id: `code-${sample.id}`,
  target: `#code-${sample.id}`,
  title: `代码｜${sample.title}`,
  category: "代码",
  chapter: sample.deps,
  excerpt: `${sample.scope} ${sample.version}`,
  keywords: [sample.title, sample.language, sample.deps, sample.scope],
}));

/* ---------------- V2.0 新增条目：target 为跨路由路径 ---------------- */
const toolTargets: { id: string; name: string; href: string; excerpt: string }[] = [
  { id: "tool-agentic-rag", name: "Agentic RAG 流程模拟器", href: "/hub/agentic-rag#ar-simulator", excerpt: "输入复杂问题，逐步查看规划、子任务、工具调用、证据检查、引用校验与最终答案。" },
  { id: "tool-knowledge-agent", name: "Knowledge Agent 架构设计器", href: "/hub/knowledge-agent#ka-designer", excerpt: "选择 Agent 角色、工具与权限，生成企业知识智能体架构图。" },
  { id: "tool-semantic", name: "Enterprise Semantic Model Explorer", href: "/hub/semantic-layer#sl-explorer", excerpt: "查看指标定义、公式、维度、数据来源、映射链路、权限与版本。" },
  { id: "tool-governance", name: "Knowledge Governance Explorer", href: "/hub/data-governance#dg-explorer", excerpt: "知识血缘交互图：Document → Chunk → Entity → Graph → Index → Answer。" },
  { id: "tool-quality", name: "知识质量评分仪表盘", href: "/hub/data-governance#dg-quality", excerpt: "八项质量指标的演示数据与定义。" },
  { id: "tool-digital-twin", name: "Digital Twin Simulator", href: "/hub/digital-twin#dt-simulator", excerpt: "资产状态、温度/振动趋势、告警、故障传播路径与维护建议。" },
  { id: "tool-architecture", name: "全屏企业知识架构图", href: "/hub/architecture#ea-map", excerpt: "八层架构 + 三套视图 + 右侧八项详情面板。" },
  { id: "tool-patterns", name: "架构模式库浏览器", href: "/hub/patterns#pt-library", excerpt: "十个模式统一模板与联动架构图。" },
  { id: "tool-knowledge-network", name: "知识关系浏览器", href: "/hub/knowledge-map#km-browser", excerpt: "搜索、按域过滤、1–3 跳、上下游查看与章节跳转。" },
  { id: "tool-learning-paths", name: "学习路径进度", href: "/hub/learn#lp-paths", excerpt: "四条角色路径与本地进度记录。" },
];

const v2PageEntries: SearchEntry[] = hubPages.flatMap((page) => [
  {
    id: `v2-page-${page.id}`,
    target: `/${page.slug}`,
    title: `${page.eyebrow}｜${page.title}`,
    category: "专题" as const,
    chapter: page.short,
    excerpt: page.subtitle,
    keywords: [page.en, page.short, page.domain, ...page.keywords],
  },
  ...page.sections.map((section) => ({
    id: `v2-section-${page.id}-${section.id}`,
    target: `/${page.slug}#${section.id}`,
    title: section.title,
    category: "小节" as const,
    chapter: page.short,
    excerpt: `${page.title} 中的小节：${section.title}。${page.subtitle}`,
    keywords: [page.short, section.title, ...page.keywords],
  })),
]);

const v2GlossaryEntries: SearchEntry[] = v2Glossary.map((term) => ({
  id: `v2-term-${term.term}`,
  target: term.href,
  title: `${term.term}｜${term.cn}`,
  category: "术语",
  chapter: term.category,
  excerpt: term.plain,
  keywords: [term.term, term.cn, term.category, ...term.related],
}));

const v2ConceptEntries: SearchEntry[] = knowledgeNodes.map((n) => ({
  id: `v2-concept-${n.id}`,
  target: n.href,
  title: `概念｜${n.label}`,
  category: "概念",
  chapter: n.domain,
  excerpt: n.summary,
  keywords: [n.label, n.domain, ...n.keywords],
}));

const v2ToolEntries: SearchEntry[] = [
  ...toolTargets.map((t) => ({
    id: `v2-tool-${t.id}`,
    target: t.href,
    title: `工具｜${t.name}`,
    category: "工具" as const,
    chapter: "交互实验室",
    excerpt: t.excerpt,
    keywords: [t.name, "交互工具", "模拟器", "浏览器", "设计器"],
  })),
  { id: "v2-tool-v1-graph", target: "/#ch2-graph", title: "工具｜企业知识图谱交互工具（V1）", category: "工具", chapter: "原第 2 章", excerpt: "搜索节点、切换中心实体、1–3 跳关系浏览、按类型过滤。", keywords: ["知识图谱", "跳数", "V1"] },
  { id: "v2-tool-v1-arch", target: "/#ch6-architecture", title: "工具｜GraphRAG 架构交互工具（V1）", category: "工具", chapter: "原第 6 章", excerpt: "Azure 企业级完整架构图、12 步查询时序与 7 步查询演示。", keywords: ["GraphRAG", "架构图", "V1"] },
  { id: "v2-tool-v1-decision", target: "/#ch7-decision", title: "工具｜企业技术选型决策器（V1）", category: "工具", chapter: "原第 7 章", excerpt: "11 题问卷与透明评分规则，输出推荐架构与风险。", keywords: ["选型", "决策器", "V1"] },
];

const v2PatternEntries: SearchEntry[] = architecturePatterns.map((p) => ({
  id: `v2-pattern-${p.id}`,
  target: "/hub/patterns#pt-library",
  title: `模式｜${p.name}（${p.cn}）`,
  category: "模式",
  chapter: `复杂度 ${p.complexity}`,
  excerpt: `${p.problem} 适用：${p.suitable.slice(0, 2).join("；")}。`,
  keywords: [p.name, p.cn, ...p.components, ...p.technologies],
}));

const v2AdrEntries: SearchEntry[] = adrExamples.map((a) => ({
  id: `v2-adr-${a.id}`,
  target: "/hub/patterns#pt-adr",
  title: `ADR｜${a.title}`,
  category: "ADR",
  chapter: a.businessQuestion.slice(0, 24),
  excerpt: `${a.businessQuestion} 决策：${a.decision}`,
  keywords: [a.title, a.decision, ...a.rationale],
}));

const v2PathEntries: SearchEntry[] = learningPaths.map((p) => ({
  id: `v2-path-${p.id}`,
  target: "/hub/learn#lp-paths",
  title: `学习路径 ${p.code}｜${p.role}`,
  category: "路径",
  chapter: p.title,
  excerpt: `${p.goal} 顺序：${p.steps.map((s) => s.label).join(" → ")}。`,
  keywords: [p.role, p.title, ...p.steps.map((s) => s.label), ...p.outcomes],
}));

/** V2 新增的内联代码示例（Python 伪代码 / SQL / 映射契约），可按「代码」类别检索。 */
const v2CodeSamples: { id: string; title: string; href: string; excerpt: string; keywords: string[] }[] = [
  { id: "code-agent-router", title: "Agent Router + Tool Registry（Python 伪代码）", href: "/hub/knowledge-agent#ka-code", excerpt: "白名单注册、意图路由、执行时 permission_check 与审计记录。", keywords: ["Python", "Agent Router", "Tool Registry", "Whitelist"] },
  { id: "code-permission-check", title: "Permission Check + Evidence Validation", href: "/hub/knowledge-agent#ka-code", excerpt: "按角色与密级判定；引用校验失败即删除论断。", keywords: ["Python", "RBAC", "ABAC", "Citation"] },
  { id: "code-semantic-query", title: "Semantic Query Tool（Python 伪代码）", href: "/hub/knowledge-agent#ka-code", excerpt: "按已审批指标定义翻译为受控查询，返回口径版本。", keywords: ["Python", "Semantic Query", "Metrics Layer"] },
  { id: "code-hybrid-search", title: "Hybrid Search Index 与检索", href: "/#ch12-search", excerpt: "Azure AI Search 索引与混合检索示例（V1 代码示例）。", keywords: ["Python", "Azure AI Search", "Hybrid Search"] },
  { id: "code-agent-loop", title: "Agent Loop 十步轨迹与停止条件", href: "/hub/agentic-rag#ar-simulator", excerpt: "确定性模拟轨迹：规划、分解、迭代、反思与引用验证。", keywords: ["Agent Loop", "Stop Conditions", "模拟"] },
  { id: "code-lineage-record", title: "知识血缘字段契约", href: "/hub/data-governance#dg-explorer", excerpt: "Source ID / Version / Created / Updated / Evidence / Confidence / Approval / Policy。", keywords: ["Lineage", "Provenance", "Version"] },
  { id: "code-twin-state", title: "统一实体关系数据模型", href: "/hub/digital-twin#dt-scenario", excerpt: "IT Ops 与 Manufacturing 的稳定 ID、关系方向与元数据契约。", keywords: ["Entity ID", "Relationship", "Digital Twin"] },
  { id: "code-layer-contract", title: "八层架构组件接口契约", href: "/hub/architecture#ea-overview", excerpt: "每层职责、输入、输出与设计决策。", keywords: ["Architecture", "Layer", "Contract"] },
  { id: "code-eval-set", title: "评估数据集构建方法", href: "/#ch10-dataset", excerpt: "按问题类型分组、标注与基线对照（V1 第 10 章）。", keywords: ["Evaluation", "Recall@K", "Dataset"] },
];

const v2CodeEntries: SearchEntry[] = v2CodeSamples.map((s) => ({
  id: `v2-code-${s.id}`,
  target: s.href,
  title: `代码｜${s.title}`,
  category: "代码",
  chapter: "V2 代码示例",
  excerpt: s.excerpt,
  keywords: [s.id, ...s.keywords],
}));

export const searchEntries: SearchEntry[] = [
  ...chapterEntries, ...glossaryEntries, ...faqEntries, ...codeEntries,
  ...v2PageEntries, ...v2GlossaryEntries, ...v2ConceptEntries,
  ...v2ToolEntries, ...v2PatternEntries, ...v2AdrEntries, ...v2PathEntries, ...v2CodeEntries,
];

/** 同分时优先呈现主体页面，避免 ADR / 小节等派生条目盖过专题入口。 */
const CATEGORY_BOOST: Partial<Record<SearchCategory, number>> = {
  专题: 3, 章节: 2, 工具: 1, 概念: 1,
};

export function searchSite(query: string, category?: SearchCategory | "全部", limit = 40): SearchEntry[] {
  const q = query.trim().toLowerCase();
  const pool = !category || category === "全部" ? searchEntries : searchEntries.filter((e) => e.category === category);
  if (!q) return pool.slice(0, Math.min(limit, 14));
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = pool
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const haystack = `${title} ${entry.excerpt} ${entry.keywords.join(" ")} ${entry.chapter ?? ""}`.toLowerCase();
      let match = 0;
      for (const term of terms) {
        if (title.includes(term)) match += 6;
        if (entry.keywords.some((k) => k.toLowerCase().includes(term))) match += 3;
        if (haystack.includes(term)) match += 1;
      }
      return { entry, score: match > 0 ? match + (CATEGORY_BOOST[entry.category] ?? 0) : 0 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return scored.slice(0, limit).map((x) => x.entry);
}
