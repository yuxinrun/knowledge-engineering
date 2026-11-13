import type { Metadata } from "next";
import { HubShell } from "@/components/v2/hub-shell";

export const metadata: Metadata = {
  title: "Enterprise Knowledge Engineering Hub｜企业知识工程知识库 V2.0",
  description: "知识建模、智能检索、知识智能体、企业语义层、数据治理、数字孪生与企业知识架构的持续扩展知识库；保留原有 12 章与 3 个交互工具。",
};

export default function HubLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <HubShell>{children}</HubShell>;
}
