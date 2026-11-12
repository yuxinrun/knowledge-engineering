import type { ReactNode } from "react";
import { AnchorHeading } from "@/components/ui/primitives";

export function ChapterSection({ id, title, children, first = false }: { id: string; title: string; children: ReactNode; first?: boolean }) {
  return (
    <div className={first ? "mt-6" : "mt-9 border-t border-line/80 pt-8"}>
      <AnchorHeading id={id}>{title}</AnchorHeading>
      {children}
    </div>
  );
}
