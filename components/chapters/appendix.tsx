import { Badge, Callout, ChapterHeader, DataTable, Prose } from "@/components/ui/primitives";
import { ChapterSection } from "@/components/ui/chapter-section";
import { FaqList } from "@/components/faq-list";
import { GlossaryBrowser } from "@/components/glossary-browser";
import { chapters, references } from "@/data/site";

const meta = chapters[12];

const tools = [
  ["全站搜索", "顶部搜索框或 Ctrl / ⌘ + K，可搜索章节、小节、术语、FAQ 与代码，结果关键词高亮", "点击结果跳转到对应锚点"],
  ["技术术语搜索", "搜索对话框的「技术术语」标签，或顶部词典按钮；支持分类筛选与关键词高亮", "共 36 条术语"],
  ["章节目录与滚动高亮", "左侧固定目录按分组定位，右侧显示本章小节与关键概念；滚动时自动高亮", "移动端为抽屉式目录"],
  ["收藏章节", "左侧目录悬停星标或右侧「收藏本章」；顶部可查看收藏列表", "保存在浏览器 localStorage"],
  ["代码复制", "每个代码块右上角「复制」按钮，并显示语言、依赖与版本说明", "20 组代码示例"],
  ["阅读进度", "顶部渐变进度条与右侧百分比；另有章节间导航与返回顶部", "按整页滚动计算"],
  ["主题切换", "顶部月亮/太阳按钮，支持深色与浅色主题并记忆选择", "首次访问跟随系统偏好"],
  ["打印白皮书", "顶部打印按钮或 Ctrl+P；打印样式隐藏导航与交互控件，按章节分页", "图表提供打印版摘要"],
  ["交互式图表", "节点拖动、缩放平移、点击详情、过滤器、跳数切换、图例、重置视图", "全部由 React Flow / Recharts 构成"],
];

export default function Appendix() {
  return (
    <>
      <ChapterHeader id={meta.id} no={meta.no} title={meta.title} subtitle={meta.subtitle} minutes={meta.minutes} />

      <ChapterSection id="appendix-glossary" title="技术术语词典" first>
        <Prose><p>覆盖 Ontology、Knowledge Graph、GraphRAG / RAG 与工程平台四类术语。点击术语卡片可展开技术解释与相关术语；支持分类筛选与关键词高亮。</p></Prose>
        <div className="my-4 rounded-xl border border-line bg-surface p-4 shadow-card"><GlossaryBrowser /></div>
        <Callout type="note" title="两个容易混淆的 GraphRAG 项目">
          <p><strong>Microsoft GraphRAG</strong> 与 <strong>Neo4j GraphRAG (neo4j-graphrag-python)</strong> 不是同一个项目：前者围绕社区检测与分层摘要支持全局性问题，后者围绕已有 Neo4j 图与向量索引提供 Retriever 抽象。附录参考链接同时列出两者官方文档。</p>
        </Callout>
      </ChapterSection>

      <ChapterSection id="appendix-faq" title="常见问题 FAQ">
        <Prose><p>围绕三者边界、技术选型、数据治理、权限与网站数据声明的高频疑问，支持搜索过滤。</p></Prose>
        <div className="mt-4"><FaqList /></div>
      </ChapterSection>

      <ChapterSection id="appendix-refs" title="官方技术参考">
        <DataTable
          headers={["类别", "官方资源", "链接"]}
          rows={references.map((r) => [
            <Badge key={`${r.name}-c`} tone="blue">{r.category}</Badge>,
            r.name,
            <a key={`${r.name}-u`} href={r.url} target="_blank" rel="noreferrer noopener" className="break-all text-brand underline underline-offset-2">{r.url}</a>,
          ])}
          dense
        />
        <Prose className="mt-4">
          <p>技术参考以官方文档为准。OWL 2 与 SHACL 是 W3C 标准，语义相对稳定；Neo4j、Azure AI Search、Azure OpenAI 与两个 GraphRAG 项目的 SDK / REST API 具有明显版本敏感性，实施前请核对当前文档中的 API 版本、模型支持范围、服务层级与配额。</p>
        </Prose>
      </ChapterSection>

      <ChapterSection id="appendix-print" title="白皮书打印与阅读说明">
        <DataTable headers={["功能", "使用方式", "说明"]} rows={tools} dense />
        <Callout type="assumption" title="全书数据声明（再次强调）">
          <p>本书的 OrderSystem / PaymentService / Incident-001 / Runbook-001 等实体、7 条业务事实、扩展演示节点、评估指标、成本、延迟、权重、阈值与排期均为<strong>教学示例假设或演示数据</strong>；技术结论已按「行业通用原则 / 架构建议 / 示例假设」区分标注，不代表任何真实客户、真实项目、行业标准或厂商承诺。</p>
        </Callout>
        <Prose className="mt-4">
          <p>打印时交互图表会显示为「节点与关系摘要」，用于在纸质白皮书中保留结构信息；完整交互体验请在屏幕模式下使用。若需引用本书内容，请连同「示例假设」标注一起引用，避免把假设数据当作实测结论。</p>
        </Prose>
      </ChapterSection>
    </>
  );
}
