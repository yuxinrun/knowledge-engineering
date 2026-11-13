"use client";

import type { ComponentType } from "react";
import { Badge, Card } from "@/components/ui/primitives";
import { AgenticRagSimulator } from "@/components/v2/tools/agentic-rag-simulator";
import { KnowledgeAgentDesigner } from "@/components/v2/tools/knowledge-agent-designer";
import { SemanticModelExplorer } from "@/components/v2/tools/semantic-model-explorer";
import {
  GovernanceExplorer, GovernanceLifecycleDetail, GovernanceQuestions, QualityDashboard,
} from "@/components/v2/tools/governance-explorer";
import { DigitalTwinSimulator } from "@/components/v2/tools/digital-twin-simulator";
import { ArchitectureExplorer } from "@/components/v2/tools/architecture-explorer";
import {
  GlobalSearchPage, GlossaryV2, KnowledgeNetwork, LearningPaths, PatternLibrary, RecentVisits, ToolsList,
} from "@/components/v2/tools/lab-browsers";
import {
  AdrList, AgenticStateMachine, EngineeringPatternLink, HomeDomainMap, HomeQuickLinks,
  PrinciplesList, RetrievalCompare, SolutionDetailItops,
} from "@/components/v2/blocks";

/** 内容数据中的 `{ type: "custom", name }` 通过此注册表注入真实交互组件。 */
const REGISTRY: Record<string, ComponentType> = {
  "tool-agentic-rag": AgenticRagSimulator,
  "agentic-state-machine": AgenticStateMachine,
  "tool-knowledge-agent": KnowledgeAgentDesigner,
  "tool-semantic": SemanticModelExplorer,
  "tool-governance": GovernanceExplorer,
  "governance-lifecycle-detail": GovernanceLifecycleDetail,
  "governance-questions": GovernanceQuestions,
  "tool-quality": QualityDashboard,
  "tool-digital-twin": DigitalTwinSimulator,
  "tool-architecture": ArchitectureExplorer,
  "tool-patterns": PatternLibrary,
  "adr-list": AdrList,
  "principles-list": PrinciplesList,
  "tool-knowledge-network": KnowledgeNetwork,
  "tool-learning-paths": LearningPaths,
  "recent-visits": RecentVisits,
  "tool-global-search": GlobalSearchPage,
  "tool-glossary-v2": GlossaryV2,
  "tool-tools-list": ToolsList,
  "home-domain-map": HomeDomainMap,
  "home-quick-links": HomeQuickLinks,
  "retrieval-compare": RetrievalCompare,
  "solution-detail-itops": SolutionDetailItops,
  "engineering-pattern-link": EngineeringPatternLink,
};

export function InteractiveBlock({ name }: { name: string }) {
  const Component = REGISTRY[name];
  if (!Component) {
    return (
      <Card className="p-4">
        <Badge tone="rose">组件未注册</Badge>
        <p className="mt-2 text-[11.5px] text-muted">交互组件「{name}」尚未注册到 interactive.tsx。</p>
      </Card>
    );
  }
  return <Component />;
}

export const registeredInteractives = Object.keys(REGISTRY);
