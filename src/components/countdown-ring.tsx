import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const TONE: Record<"accent" | "ok" | "warn" | "bad" | "muted", string> = {
  accent: "var(--color-accent)",
  ok: "var(--color-ok)",
  warn: "var(--color-warn)",
  bad: "var(--color-bad)",
  muted: "var(--color-faint)",
};

const GLOW: Record<"accent" | "ok" | "warn" | "bad" | "muted", string> = {
  accent: "ring-glow",
  ok: "ring-glow-ok",
  warn: "ring-glow-warn",
  bad: "ring-glow-bad",
  muted: "ring-glow",
};

export function CountdownRing({
  remaining,
  total,
  tone,
  children,
}: {
  remaining: number;
  total: number;
  tone: keyof typeof TONE;
  children: ReactNode;
}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = total <= 0 ? 0 : Math.min(1, Math.max(0, remaining / total));
  const offset = c * (1 - pct);

  return (
    <div className="relative mx-auto size-52 sm:size-56">
      <div className={cn("pointer-events-none absolute inset-8 rounded-full blur-2xl", GLOW[tone])} />
      <svg viewBox="0 0 120 120" className="relative size-full -rotate-90" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={TONE[tone]}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="ring-progress"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
