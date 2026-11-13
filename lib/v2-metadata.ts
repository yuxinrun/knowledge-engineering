import type { Metadata } from "next";
import { hubPageById } from "@/data/v2-hub";

/** 每个 V2 静态路由复用的 metadata，来源与导航/搜索索引同一份注册数据。 */
export function hubMetadata(id: string): Metadata {
  const page = hubPageById[id];
  return {
    title: page.title.includes("Enterprise Knowledge Engineering Hub")
      ? page.title
      : `${page.title}｜Enterprise Knowledge Engineering Hub`,
    description: page.subtitle,
    keywords: [page.en, page.short, page.domain, ...page.keywords],
  };
}
