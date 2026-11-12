import { SiteShell } from "@/components/site-shell";
import { HomeHero } from "@/components/home-hero";
import { ChapterNav } from "@/components/chapter-nav";
import Chapter1 from "@/components/chapters/ch1";
import Chapter2 from "@/components/chapters/ch2";
import Chapter3 from "@/components/chapters/ch3";
import Chapter4 from "@/components/chapters/ch4";
import Chapter5 from "@/components/chapters/ch5";
import Chapter6 from "@/components/chapters/ch6";
import Chapter7 from "@/components/chapters/ch7";
import Chapter8 from "@/components/chapters/ch8";
import Chapter9 from "@/components/chapters/ch9";
import Chapter10 from "@/components/chapters/ch10";
import Chapter11 from "@/components/chapters/ch11";
import Chapter12 from "@/components/chapters/ch12";
import Appendix from "@/components/chapters/appendix";
import { chapters } from "@/data/site";

const chapterComponents = [
  Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6,
  Chapter7, Chapter8, Chapter9, Chapter10, Chapter11, Chapter12, Appendix,
];

export default function Page() {
  return (
    <SiteShell>
      <div data-print="cover">
        <HomeHero />
      </div>
      <div data-print="document">
        {chapterComponents.map((Chapter, index) => {
          const meta = chapters[index];
          return (
            <div key={meta.id}>
              <div className="ke-hairline my-12" data-print="hide" />
              <section data-chapter={meta.id} data-print="chapter" className="scroll-mt-24">
                <Chapter />
              </section>
              <ChapterNav index={index} />
            </div>
          );
        })}
        <footer className="mt-14 border-t border-line py-8 text-[11px] leading-6 text-muted" data-print="hide">
          <div className="font-semibold text-ink">Ontology × Knowledge Graph × GraphRAG｜企业级知识工程完整实战指南</div>
          <p className="mt-1.5">本网站的全部实体、事实、指标、成本与排期均为教学示例或演示数据；技术结论区分行业通用原则、架构建议与示例假设。具体 API 与 SDK 请以附录所列官方文档的当前版本为准。</p>
          <p className="mt-1.5">交互式图谱与架构图由 React Flow 构成，图表由 Recharts 构成，代码高亮使用 Prism，公式使用 KaTeX；网站不调用任何后端或云服务。</p>
        </footer>
      </div>
    </SiteShell>
  );
}
