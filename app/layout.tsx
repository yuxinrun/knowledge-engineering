import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ontology × Knowledge Graph × GraphRAG｜企业级知识工程完整实战指南",
  description:
    "从业务语义建模到知识关联，再到智能检索与推理：面向企业架构师、AI 架构师、数据工程师与 RAG 工程师的中文技术白皮书、交互式学习平台与企业架构设计指南。",
  keywords: ["Ontology", "Knowledge Graph", "GraphRAG", "OWL", "SHACL", "Neo4j", "Azure AI Search", "知识工程", "企业架构"],
  authors: [{ name: "Enterprise Knowledge Engineering Guide" }],
};

const themeScript = `
try {
  var stored = localStorage.getItem('ke-theme');
  var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
} catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
