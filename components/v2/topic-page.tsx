"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, ChevronRight, Clock, Network, Printer, Star } from "lucide-react";
import {
  Badge, Button, Callout, Card, DataTable, Prose, StepBadge,
} from "@/components/ui/primitives";
import { AnchorHeading } from "@/components/ui/primitives";
import { CodeBlock } from "@/components/ui/code-block";
import { FlowCanvas } from "@/components/viz/flow-canvas";
import { InteractiveBlock } from "@/components/v2/interactive";
import type { FlowKey, TopicBlock, TopicPageContent, TopicSectionContent } from "@/data/v2-content";
import { topicContent } from "@/data/v2-content";
import { moreContent } from "@/data/v2-content-more";
import { miscContent } from "@/data/v2-content-misc";
import {
  agenticFlowDiagram, governanceLifecycleDiagram, knowledgeAgentDiagram,
  semanticChainDiagram, twinArchitectureDiagram,
} from "@/data/v2-diagrams";
import {
  hubNavGroups, hubPageById, hubPages, knowledgeNodeById, type TopicRelations,
} from "@/data/v2-hub";
import { getV2Bookmarks, recordVisit, toggleV2Bookmark } from "@/lib/v2-storage";
import { cn } from "@/lib/utils";

const ALL_CONTENT: Record<string, TopicPageContent> = { ...topicContent, ...moreContent, ...miscContent };
const FLOWS: Record<FlowKey, typeof agenticFlowDiagram> = {
  agentic: agenticFlowDiagram,
  "knowledge-agent": knowledgeAgentDiagram,
  "semantic-chain": semanticChainDiagram,
  "governance-lifecycle": governanceLifecycleDiagram,
  "twin-architecture": twinArchitectureDiagram,
};

const CODE_LINK_MAP: Record<string, { label: string; href: string }> = {
  "code-hybrid-search": { label: "Hybrid Search 代码示例", href: "/#ch12-search" },
  "code-agent-loop": { label: "Agent Loop 伪代码", href: "/hub/agentic-rag#ar-simulator" },
  "code-agent-router": { label: "Agent Router / Tool Registry", href: "/hub/knowledge-agent#ka-code" },
  "code-permission-check": { label: "Permission Check 伪代码", href: "/hub/knowledge-agent#ka-code" },
  "code-semantic-query": { label: "Semantic Query 伪代码", href: "/hub/knowledge-agent#ka-code" },
  "code-lineage-record": { label: "血缘字段契约", href: "/hub/data-governance#dg-explorer" },
  "code-twin-state": { label: "统一数据模型", href: "/hub/digital-twin#dt-scenario" },
  "code-layer-contract": { label: "八层架构接口契约", href: "/hub/architecture#ea-overview" },
  "code-eval-set": { label: "评估数据集构建", href: "/#ch10-dataset" },
};

const RELATION_GROUPS: { key: keyof TopicRelations; label: string; tone: "blue" | "cyan" | "purple" | "green" | "amber" | "rose" | "neutral" }[] = [
  { key: "core", label: "核心概念", tone: "blue" },
  { key: "prereq", label: "前置知识", tone: "cyan" },
  { key: "related", label: "相关概念", tone: "neutral" },
  { key: "upstream", label: "上游技术", tone: "purple" },
  { key: "downstream", label: "下游技术", tone: "green" },
  { key: "compare", label: "对比概念", tone: "amber" },
  { key: "applications", label: "企业应用", tone: "rose" },
  { key: "patterns", label: "关联架构模式", tone: "blue" },
  { key: "code", label: "关联代码示例", tone: "cyan" },
];

function groupForPage(pageId: string): string {
  const page = hubPageById[pageId];
  const path = `/${page.slug}`;
  const group = hubNavGroups.find((g) => g.items.some((i) => i.href.split("#")[0].replace(/\/$/, "") === path));
  return group?.label ?? "知识库";
}

function BlockView({ block }: { block: TopicBlock }) {
  switch (block.type) {
    case "prose":
      return (
        <Prose className={block.lead ? undefined : "mt-3"}>
          {block.paragraphs.map((text, i) => (
            <p key={i} className={cn(block.lead && i === 0 && "lead")} dangerouslySetInnerHTML={{ __html: text }} />
          ))}
        </Prose>
      );
    case "bullets":
      return (
        <div className="mt-4">
          {block.title ? <div className="mb-2 text-[13px] font-semibold text-ink">{block.title}</div> : null}
          <Prose>
            {block.numbered ? (
              <ol>{block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>
            ) : (
              <ul>{block.items.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>
            )}
          </Prose>
        </div>
      );
    case "callout":
      return <Callout type={block.tone} title={block.title}><p>{block.body}</p></Callout>;
    case "table":
      return <DataTable headers={block.headers} rows={block.rows} caption={block.caption} dense={block.dense} />;
    case "cards":
      return (
        <div className="mt-5">
          {block.title ? <div className="mb-2.5 text-[13px] font-semibold text-ink">{block.title}</div> : null}
          <div className={cn("grid grid-cols-1 gap-3", block.cols === 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2")}>
            {block.items.map((item, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2">
                  {item.badge ? <Badge tone={item.tone ?? "blue"}>{item.badge}</Badge> : null}
                  <span className="text-[12.5px] font-semibold text-ink">{item.title}</span>
                </div>
                <p className="mt-2 text-[12px] leading-6 text-muted">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      );
    case "definitions":
      return (
        <div className="mt-5">
          {block.title ? <div className="mb-2.5 text-[13px] font-semibold text-ink">{block.title}</div> : null}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {block.items.map((item, i) => (
              <Card key={i} className="p-3.5">
                <div className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /><div className="text-[12.5px] font-semibold text-ink">{item.term}</div></div>
                <p className="mt-1.5 text-[11.5px] leading-6 text-muted">{item.definition}</p>
              </Card>
            ))}
          </div>
        </div>
      );
    case "steps":
      return (
        <div className="mt-5">
          {block.title ? <div className="mb-3 text-[13px] font-semibold text-ink">{block.title}</div> : null}
          <div className="space-y-2">
            {block.items.map((step, i) => (
              <Card key={i} className="flex items-start gap-3 p-3">
                <StepBadge step={i + 1} tone={i % 3 === 0 ? "cyan" : i % 3 === 1 ? "blue" : "purple"} />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-ink">{step.label}</div>
                  <div className="mt-1 text-[11.5px] leading-6 text-muted">{step.detail}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    case "flow": {
      const data = FLOWS[block.diagram];
      return (
        <div className="my-5" data-print="hide">
          <FlowCanvas nodes={data.nodes} edges={data.edges} legend={data.legend} height={block.height ?? 440} caption="点击节点或连线查看详情；支持拖动、缩放与重置。图中内容为教学示意与模拟数据。" />
        </div>
      );
    }
    case "code":
      return <CodeBlock id={`v2-code-${block.language}-${block.title}`} title={block.title} filename={block.filename} language={block.language} code={block.code} note={block.note} scope={block.scope} />;
    case "custom":
      return <div className="my-5"><InteractiveBlock name={block.name} /></div>;
    default:
      return null;
  }
}

function SectionView({ section, first }: { section: TopicSectionContent; first: boolean }) {
  return (
    <div className={first ? "mt-6" : "mt-10 border-t border-line/80 pt-8"}>
      <AnchorHeading id={section.id}>{section.title}</AnchorHeading>
      {section.blocks.map((block, i) => <BlockView key={i} block={block} />)}
    </div>
  );
}

function RelationPanel({ relations }: { relations: TopicRelations }) {
  const hasAny = RELATION_GROUPS.some((g) => relations[g.key].length > 0);
  if (!hasAny) return null;
  return (
    <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-5" data-print="hide">
      <div className="flex items-center gap-2 border-b border-line pb-3 text-sm font-semibold text-ink"><Network className="h-4 w-4 text-brand" /> 全站知识关联</div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {RELATION_GROUPS.filter((g) => relations[g.key].length > 0).map((g) => (
          <div key={g.key}>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{g.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {relations[g.key].map((id) => {
                const node = knowledgeNodeById[id];
                const pattern = id.startsWith("PAT-");
                const code = CODE_LINK_MAP[id];
                if (node) return <Link key={id} href={node.href}><Badge tone={g.tone} className="cursor-pointer hover:underline">{node.label}</Badge></Link>;
                if (pattern) return <Link key={id} href="/hub/patterns#pt-library"><Badge tone="blue" className="cursor-pointer hover:underline">{id} · 架构模式</Badge></Link>;
                if (code) return <Link key={id} href={code.href}><Badge tone="cyan" className="cursor-pointer hover:underline">{code.label}</Badge></Link>;
                return <Badge key={id} tone="neutral">{id}</Badge>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-line pt-3 text-[11px] leading-5 text-muted">
        连线的语义：依赖（必须有）／关联（常一起出现）／比较（边界区分）／应用（落地场景）／可选组合（可以一起用，不是必须）。
        <Link href="/hub/knowledge-map" className="ml-1 text-brand hover:underline">在知识关系浏览器中查看 1–3 跳关系 ↗</Link>
      </div>
    </div>
  );
}

export function TopicPage({ pageId }: { pageId: string }) {
  const page = hubPageById[pageId];
  const content = ALL_CONTENT[pageId];
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    setBookmarks(getV2Bookmarks());
    if (page) recordVisit(`/${page.slug}`, page.short);
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      const sections = content?.sections ?? [];
      let active = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 190) active = s.id;
      }
      setActiveSection(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [content]);

  const neighbors = useMemo(() => {
    const index = hubPages.findIndex((p) => p.id === pageId);
    return {
      prev: index > 0 ? hubPages[index - 1] : null,
      next: index >= 0 && index < hubPages.length - 1 ? hubPages[index + 1] : null,
    };
  }, [pageId]);

  if (!page || !content) {
    return (
      <Card className="p-8">
        <div className="text-sm font-semibold text-ink">未找到专题内容</div>
        <p className="mt-2 text-xs text-muted">该页面尚未注册或内容缺失，请返回<Link href="/hub" className="text-brand hover:underline">知识库首页</Link>。</p>
      </Card>
    );
  }

  const saved = bookmarks.includes(page.id);

  return (
    <article>
      <nav aria-label="面包屑导航" className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted" data-print="hide">
        <Link href="/" className="hover:text-brand">V1 白皮书</Link><ChevronRight className="h-3 w-3" />
        <Link href="/hub" className="hover:text-brand">知识库首页</Link><ChevronRight className="h-3 w-3" />
        <span>{groupForPage(pageId)}</span><ChevronRight className="h-3 w-3" />
        <span className="font-medium text-ink">{page.short}</span>
      </nav>

      <header className="pb-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge tone="cyan">{page.eyebrow}</Badge>
          <Badge tone="neutral"><Clock className="h-3 w-3" /> 约 {page.minutes} 分钟</Badge>
          <Badge tone="neutral">{page.domain}</Badge>
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-[32px]">{page.title}</h1>
        <p className="mt-2 font-mono text-[11px] text-muted">{page.en}</p>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-muted">{page.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5" data-print="hide">
          <Button variant={saved ? "subtle" : "outline"} size="sm" onClick={() => setBookmarks(toggleV2Bookmark(page.id))}>
            <Star className={cn("h-3.5 w-3.5", saved && "fill-current text-accent")} />{saved ? "已收藏本专题" : "收藏本专题"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> 打印本页</Button>
          <Link href="/hub/search"><Button variant="ghost" size="sm"><Bookmark className="h-3.5 w-3.5" /> 全站搜索</Button></Link>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-1.5" data-print="hide">
        {page.keywords.slice(0, 8).map((k) => <Badge key={k} tone="neutral">{k}</Badge>)}
      </div>

      {content.sections.length > 1 ? (
        <div className="mb-7 rounded-xl border border-line bg-elevated/50 p-3" data-print="hide">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">本页目录</div>
          <div className="flex flex-wrap gap-1.5">
            {content.sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className={cn("rounded-lg border px-2 py-1 text-[11px] transition-colors", activeSection === s.id ? "border-brand/50 bg-brand/10 font-semibold text-brand" : "border-line bg-surface text-muted hover:text-ink")}>
                {String(i + 1).padStart(2, "0")} · {s.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {content.sections.map((section, i) => <SectionView key={section.id} section={section} first={i === 0} />)}

      <RelationPanel relations={page.relations} />

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2" data-print="hide">
        {neighbors.prev ? (
          <Link href={`/${neighbors.prev.slug}`} className="group rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand/40">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted"><ArrowLeft className="h-3 w-3" /> 上一页</div>
            <div className="mt-1.5 text-[13px] font-semibold text-ink group-hover:text-brand">{neighbors.prev.short}</div>
          </Link>
        ) : <div />}
        {neighbors.next ? (
          <Link href={`/${neighbors.next.slug}`} className="group rounded-xl border border-line bg-surface p-4 text-right transition-colors hover:border-brand/40">
            <div className="flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-wider text-muted">下一页 <ArrowRight className="h-3 w-3" /></div>
            <div className="mt-1.5 text-[13px] font-semibold text-ink group-hover:text-brand">{neighbors.next.short}</div>
          </Link>
        ) : null}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-elevated/40 p-4 text-[11.5px] leading-6 text-muted">
        <div className="font-semibold text-ink">内容边界与版本声明</div>
        本页示例实体、指标定义、血缘记录、质量评分、设备状态与 Agent 轨迹均为本地确定性模拟数据，不是行业基准，也不代表任何真实企业、设备或产品性能。
        文中提及的云厂商、图数据库、搜索服务与 SDK 能力具版本敏感性，请以官方当期文档为准；站内 V1 附录提供可点击的官方参考链接。
      </div>
    </article>
  );
}
