import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise Knowledge Engineering Hub｜企业知识工程知识库",
  description:
    "Ontology × Knowledge Graph × GraphRAG 12 章完整实战指南，以及 V2.0 企业知识库：Agentic RAG、Knowledge Agent、企业语义层、数据治理、数字孪生、企业总体架构与架构模式库。",
  keywords: ["Ontology", "Knowledge Graph", "GraphRAG", "Agentic RAG", "Knowledge Agent", "Semantic Layer", "Data Governance", "Digital Twin", "企业知识工程", "企业架构"],
  authors: [{ name: "Enterprise Knowledge Engineering Hub" }],
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
