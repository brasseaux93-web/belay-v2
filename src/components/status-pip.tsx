import { cn } from "@/lib/cn";
import type { pipTone } from "@/lib/belay/labels";

const toneClass: Record<ReturnType<typeof pipTone>, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
  accent: "bg-accent",
  muted: "bg-faint",
};

export function StatusPip({
  tone,
  pulse,
}: {
  tone: ReturnType<typeof pipTone>;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        toneClass[tone],
        pulse && "animate-pulse",
      )}
      aria-hidden
    />
  );
}
