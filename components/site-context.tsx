"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface SiteActions {
  learningStarted: boolean;
  startLearning: (target?: string) => void;
  backToCover: () => void;
  openChecklist: () => void;
  openGlossary: () => void;
  openSearch: () => void;
}

const SiteContext = createContext<SiteActions | null>(null);

export function SiteProvider({ value, children }: { value: SiteActions; children: ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteActions {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteShell");
  return ctx;
}
