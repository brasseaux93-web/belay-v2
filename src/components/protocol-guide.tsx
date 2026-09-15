const STEPS = [
  {
    n: "1",
    t: "Pick 90 minutes",
    d: "Write down one small thing you can actually finish right now, and name who is checking on you.",
  },
  {
    n: "2",
    t: "Check in",
    d: "Tap I'm here (Sober) or I used, but I showed up. Showing up after a slip still counts — the only real failure is disappearing.",
  },
  {
    n: "3",
    t: "They confirm",
    d: "The other person taps Confirm they showed up when they actually see you. If nobody confirms, it doesn't count.",
  },
  {
    n: "4",
    t: "Craving hit? Hit pause.",
    d: "Need a 10-min pause gives you a freeze window. If you finish any small task during that time, you still get credit.",
  },
  {
    n: "5",
    t: "Going silent is the only loss",
    d: "If the clock runs out and you never check in, it marks as Went silent. No lectures — it just means you disappeared, and your backup gets a note.",
  },
] as const;

export function ProtocolGuide() {
  return (
    <details className="panel rounded-lg border border-border">
      <summary className="cursor-pointer list-none px-5 py-3.5 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          How this works
          <span className="text-xs tracking-wide text-muted">Plain words</span>
        </span>
      </summary>
      <ol className="border-t border-border px-5 py-4">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-3 py-2 first:pt-0 last:pb-0">
            <span className="mt-0.5 font-mono text-xs text-accent tabular-nums">{step.n}</span>
            <div>
              <p className="text-sm text-fg">{step.t}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{step.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}
