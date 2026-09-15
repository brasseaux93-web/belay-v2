import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { DeviceAlerts } from "@/components/device-alerts";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { StatusPip } from "@/components/status-pip";
import { Button } from "@/components/ui/button";
import { confirmBlock } from "@/lib/belay/actions";
import { backupDarkInvite, copyText } from "@/lib/belay/copy";
import { canConfirm, formatCountdown, formatWhen, remainingMs, untilStartMs } from "@/lib/belay/clock";
import { listLabel, confirmLabel, pipTone } from "@/lib/belay/labels";
import { useBlocks } from "@/hooks/use-blocks";
import type { Block } from "@/lib/belay/types";

export const Route = createFileRoute("/confirm")({ component: ConfirmPage });

function ConfirmPage() {
  return (
    <AppShell>
      <ConfirmView />
    </AppShell>
  );
}

function theySaid(block: Block) {
  if (block.claim === "showed_up") return "They said they're here, sober.";
  if (block.claim === "used_but_here") return "They said they used, but they showed up.";
  return "They haven't checked in yet.";
}

async function copyBackup(block: Block) {
  const ok = await copyText(backupDarkInvite(block.task, window.location.origin));
  if (ok) toast("Text copied. Send it to the backup.");
  else toast.error("Could not copy");
}

function ConfirmView() {
  const { toConfirm, now, loading, error, refresh, setBlocks, user } = useBlocks();
  const [busyId, setBusyId] = useState<string | null>(null);
  const queue = toConfirm;
  const email = user?.primaryEmail?.trim().toLowerCase() ?? "";

  if (loading) {
    return <div className="h-48 animate-pulse rounded-lg border border-border bg-surface" />;
  }

  return (
    <>
      <PageHeader
        kicker="Confirm"
        title="Did they show up?"
        description="Tap only if you actually see them. What they tapped on their phone is not enough."
        action={
          <Button variant="secondary" size="sm" onClick={() => void refresh()}>
            Check again
          </Button>
        }
      />

      <div className="mb-4">
        <DeviceAlerts />
      </div>

      {error ? <p className="mb-4 text-sm text-bad">{error}</p> : null}

      {queue.length === 0 ? (
        <Panel className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-fg">Nobody needs you right now</p>
          <p className="mt-2 text-sm text-muted">
            When someone puts your email on a check-in, it shows up here.
          </p>
        </Panel>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map((block) => {
            const status = listLabel(block);
            const shown = confirmLabel(block);
            const paused = block.pauseUntil != null && block.pauseUntil > now;
            const scheduled = block.status === "scheduled" || now < block.startTime;
            const isBackup =
              Boolean(email) &&
              block.backupEmail === email &&
              block.confirmerEmail !== email;
            const settle = canConfirm(block, now) && !isBackup;
            const clock = scheduled
              ? untilStartMs(block, now)
              : remainingMs(block, now);
            return (
              <Panel key={block.id} live={settle} className="p-5">
                {block.status === "dark" ? (
                  <div className="mb-4 rounded-md border border-bad/40 bg-bad/10 px-3 py-2 text-sm text-bad">
                    Missed check-in. They went silent.
                  </div>
                ) : null}
                {paused ? (
                  <div className="mb-4 rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
                    They asked for a 10-minute pause.
                  </div>
                ) : null}
                {scheduled ? (
                  <div className="mb-4 rounded-md border border-border bg-bg px-3 py-2 text-sm text-muted">
                    Starts {formatWhen(block.startTime)}. Don't confirm until then.
                  </div>
                ) : null}
                {isBackup && block.status !== "dark" ? (
                  <div className="mb-4 rounded-md border border-border bg-bg px-3 py-2 text-sm leading-relaxed text-muted">
                    You're the backup. You hear about it if they go silent.
                  </div>
                ) : null}
                {isBackup && block.status === "dark" ? (
                  <p className="mb-4 text-sm text-muted">
                    Check on them in person. This one doesn't count.
                  </p>
                ) : null}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
                    <StatusPip tone={pipTone(status)} pulse={status === "Clock running"} />
                    {shown}
                  </div>
                  <p className="font-mono text-sm tabular-nums text-fg">
                    {formatCountdown(clock)}
                  </p>
                </div>

                <p className="mt-4 text-base text-fg">{block.task}</p>
                <p className="mt-1 text-sm text-muted">{theySaid(block)}</p>
                {block.backupEmail ? (
                  <p className="mt-1 font-mono text-xs text-faint">
                    Backup {block.backupEmail}
                  </p>
                ) : null}

                {settle ? (
                  <div className="mt-6">
                    <Button
                      disabled={busyId === block.id}
                      onClick={async () => {
                        setBusyId(block.id);
                        try {
                          const next = await confirmBlock({ data: { blockId: block.id } });
                          setBlocks((prev) => prev.map((b) => (b.id === next.id ? next : b)));
                          toast("Confirmed. They showed up.");
                          await refresh();
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Could not confirm");
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      {busyId === block.id ? "Saving…" : "Confirm they showed up"}
                    </Button>
                  </div>
                ) : null}

                {block.status === "dark" && block.backupEmail && !isBackup ? (
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-11 w-full"
                      onClick={() => void copyBackup(block)}
                    >
                      Copy a note for the backup
                    </Button>
                  </div>
                ) : null}
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
