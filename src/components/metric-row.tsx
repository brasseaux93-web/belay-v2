import { cn } from "@/lib/cn";

export function MetricRow({
  items,
}: {
  items: { label: string; value: string; tone?: "fg" | "ok" | "warn" | "bad" | "accent" }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
      {items.map((item) => (
        <div key={item.label} className="metric-cell px-3 py-3">
          <p className="text-xs tracking-wide text-muted">{item.label}</p>
          <p
            className={cn(
              "mt-1 font-mono text-lg font-medium tracking-tight tabular-nums",
              item.tone === "ok" && "text-ok",
              item.tone === "warn" && "text-warn",
              item.tone === "bad" && "text-bad",
              item.tone === "accent" && "text-accent",
              (!item.tone || item.tone === "fg") && "text-fg",
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
