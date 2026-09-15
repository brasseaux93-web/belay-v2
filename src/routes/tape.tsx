import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MetricRow } from "@/components/metric-row";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { StatusPip } from "@/components/status-pip";
import { Button } from "@/components/ui/button";
import { eventLabel, listLabel, pipTone } from "@/lib/belay/labels";
import { useBlocks } from "@/hooks/use-blocks";

export const Route = createFileRoute("/tape")({ component: TapePage });

function TapePage() {
  return (
    <AppShell>
      <TapeView />
    </AppShell>
  );
}

function TapeView() {
  const { blocks, events, loading, refresh } = useBlocks();
  const [openId, setOpenId] = useState<string | null>(null);
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const rows = blocks.filter((b) => b.startTime >= cutoff);
  const received = rows.filter((b) => b.receivedAt);
  const hours = received.reduce((s, b) => s + b.durationMinutes, 0) / 60;
  const dark = rows.filter((b) => b.status === "dark").length;


  return (
    <>
      <PageHeader
        kicker="History"
        title="Last 14 days"
        description="Hours someone else confirmed. Print this for a desk. No streaks."
        action={
          <div className="no-print flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => void refresh()}>
              Check again
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              Print
            </Button>
          </div>
        }
      />

      <div className="mb-5">
        <MetricRow
          items={[
            { label: "Confirmed", value: String(received.length), tone: "ok" },
            { label: "Hours logged", value: hours.toFixed(1) },
            {
              label: "Went silent",
              value: String(dark),
              tone: dark > 0 ? "bad" : "fg",
            },
          ]}
        />
      </div>

      <Panel>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">History</p>
          <p className="font-mono text-xs text-faint">
            {rows.length} {rows.length === 1 ? "check-in" : "check-ins"}
          </p>
        </div>

        {loading ? (
          <div className="h-32 animate-pulse bg-surface-2" />
        ) : rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted">
            No check-ins yet. Start 90 minutes on Home.
          </p>
        ) : (
          <ul>
            {rows.map((b, i) => {
              const label = listLabel(b);
              const date = new Date(b.startTime);
              const open = openId === b.id;
              const trail = events
                .filter((e) => e.blockId === b.id)
                .sort((a, c) => a.timestamp - c.timestamp);
              return (
                <li
                  key={b.id}
                  className={i === rows.length - 1 ? "" : "border-b border-border"}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
                    onClick={() => setOpenId(open ? null : b.id)}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <StatusPip tone={pipTone(label)} />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-fg">{b.task}</p>
                        <p className="font-mono text-xs text-muted">
                          {date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          {date.toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-right text-xs tracking-wide text-muted">
                      {label}
                    </p>
                  </button>
                  {open ? (
                    <div className="px-5 pb-4">
                      <p className="font-mono text-xs text-faint">
                        {b.confirmerEmail}
                        {b.backupEmail ? ` · backup ${b.backupEmail}` : ""}
                      </p>
                      <ul className="mt-2">
                        {trail.length === 0 ? (
                          <li className="text-xs text-faint">No notes on this one.</li>
                        ) : (
                          trail.map((ev) => (
                            <li
                              key={ev.id}
                              className="flex items-center justify-between py-1 font-mono text-xs text-muted"
                            >
                              <span>{eventLabel(ev.type)}</span>
                              <span className="tabular-nums">
                                {new Date(ev.timestamp).toLocaleTimeString(undefined, {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
