import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {kicker ? (
          <p className="text-xs font-medium tracking-widest text-muted uppercase">{kicker}</p>
        ) : null}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
