import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Panel({
  children,
  className,
  live = false,
}: {
  children: ReactNode;
  className?: string;
  live?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border",
        live ? "panel-live" : "panel",
        className,
      )}
    >
      {children}
    </section>
  );
}
