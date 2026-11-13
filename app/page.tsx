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

      </div>
    </SiteShell>
  );
}
