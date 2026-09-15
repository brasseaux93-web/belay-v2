import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CountdownRing } from "@/components/countdown-ring";
import { DeviceAlerts } from "@/components/device-alerts";
import { MetricRow } from "@/components/metric-row";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { ProtocolGuide } from "@/components/protocol-guide";
import { StatusPip } from "@/components/status-pip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backupDarkInvite, confirmerInvite, copyText, shareConfirmLink } from "@/lib/belay/copy";
import { clientAction, startBlock } from "@/lib/belay/actions";
import {
  formatCountdown,
  formatWhen,
  isPaused,
  remainingMs,
  untilStartMs,
} from "@/lib/belay/clock";
import { listLabel, pipTone } from "@/lib/belay/labels";
import { useBlocks } from "@/hooks/use-blocks";
import type { Block } from "@/lib/belay/types";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <AppShell>
      <ClientHome />
    </AppShell>
  );
}

function tapeStats(blocks: ReturnType<typeof useBlocks>["blocks"]) {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const rows = blocks.filter((b) => b.startTime >= cutoff);
  const received = rows.filter((b) => b.receivedAt);
  const hours = received.reduce((s, b) => s + b.durationMinutes, 0) / 60;
  const dark = rows.filter((b) => b.status === "dark").length;
  return {
    received: String(received.length),
    hours: hours.toFixed(1),
    dark: String(dark),
  };
}

async function copyInvite(email: string) {
  const ok = await copyText(confirmerInvite(email, window.location.origin));
  if (ok) toast("Text copied. Send it to whoever is checking.");
  else toast.error("Could not copy");
}

async function shareConfirmLinkAction(blockId: string) {
  const result = await shareConfirmLink(blockId, window.location.origin);
  if (result === "shared") toast("Shared. They'll land right on your block.");
  else if (result === "copied") toast("Link copied. Paste it to your confirmer.");
  else toast.error("Could not share or copy the link.");
}

async function copyBackup(block: Block) {
  const ok = await copyText(backupDarkInvite(block.task, window.location.origin));
  if (ok) toast("Text copied. Send it to your backup.");
  else toast.error("Could not copy");
}

function toLocalInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EmailChips({
  emails,
  onPick,
}: {
  emails: string[];
  onPick: (email: string) => void;
}) {
  if (emails.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {emails.map((email) => (
        <button
          key={email}
          type="button"
          onClick={() => onPick(email)}
          className="rounded-sm border border-border bg-bg px-2 py-1 font-mono text-xs text-muted hover:border-border-strong hover:text-fg"
        >
          {email}
        </button>
      ))}
    </div>
  );
}

function DarkBanner({ block }: { block: Block }) {
  return (
    <Panel className="mb-4 p-5">
      <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-bad uppercase">
        <StatusPip tone="bad" />
        Missed check-in
      </div>
      <p className="mt-3 text-sm text-fg">{block.task}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Time ran out. You never checked in. This one doesn't count.
      </p>
      {block.backupEmail ? (
        <div className="mt-4">
          <p className="font-mono text-xs text-muted">{block.backupEmail}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3 h-11 w-full"
            onClick={() => void copyBackup(block)}
          >
            Copy a note for your backup
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-faint">
          Next time, add a backup so someone gets a note if you go silent.
        </p>
      )}
    </Panel>
  );
}

function ClientHome() {
  const {
    active,
    blocks,
    lastDark,
    recentConfirmers,
    recentBackups,
    now,
    loading,
    error,
    refresh,
    setBlocks,
    user,
  } = useBlocks();
  const [task, setTask] = useState("");
  const [confirmer, setConfirmer] = useState("");
  const [backup, setBackup] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user?.primaryEmail && !confirmer) setConfirmer(user.primaryEmail);
  }, [user, confirmer]);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />;
  }

  const stats = tapeStats(blocks);

  async function runAction(
    action: "showed_up" | "used_but_here" | "missed" | "about_to_use",
  ) {
    if (!active) return;
    setBusy(true);
    try {
      const next = await clientAction({ data: { blockId: active.id, action } });
      setBlocks((prev) => prev.map((b) => (b.id === next.id ? next : b)));
      if (action === "showed_up") toast("You're marked here. Waiting on them to confirm.");
      if (action === "used_but_here") toast("You showed up after using. Waiting on them to confirm.");
      if (action === "missed") toast("Marked couldn't make it.");
      if (action === "about_to_use") toast("10-minute pause. They get a ping if alerts are on.");
      if (action === "missed") await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "That didn't save");
    } finally {
      setBusy(false);
    }
  }

  if (!active) {
    return (
      <>
        <PageHeader
          kicker="Home"
          title="90 minutes at a time."
          description="Pick one small thing you can actually finish. Someone else checks that you showed up. If you slipped, you still count."
        />
        <div className="mb-5">
          <MetricRow
            items={[
              { label: "Confirmed", value: stats.received, tone: "ok" },
              { label: "Hours logged", value: stats.hours },
              {
                label: "Went silent",
                value: stats.dark,
                tone: stats.dark === "0" ? "fg" : "bad",
              },
            ]}
          />
        </div>
        <div className="mb-4">
          <DeviceAlerts />
        </div>
        {lastDark ? <DarkBanner block={lastDark} /> : null}
        <Panel className="p-5">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Start a check-in
          </p>
          {error ? <p className="mt-3 text-sm text-bad">{error}</p> : null}
          <form
            className="mt-5 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!task.trim() || !confirmer.trim()) return;
              const startAt = startLocal ? new Date(startLocal).getTime() : undefined;
              if (startAt != null && Number.isNaN(startAt)) {
                toast.error("That start time isn't valid.");
                return;
              }
              setBusy(true);
              try {
                const block = await startBlock({
                  data: {
                    task: task.trim(),
                    confirmerEmail: confirmer.trim(),
                    backupEmail: backup.trim() || undefined,
                    startAt,
                  },
                });
                setBlocks((prev) => [block, ...prev.filter((b) => b.id !== block.id)]);
                setTask("");
                setStartLocal("");
                if (block.status === "scheduled") {
                  toast(`Starts ${formatWhen(block.startTime)}.`);
                } else {
                  toast("Clock is running.");
                }
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not start");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">What are you doing?</span>
              <Input
                id="task"
                placeholder="Eat something. Drink water. Sit in the clinic lobby."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                maxLength={160}
                required
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Who verifies this?</span>
              <Input
                id="confirmer"
                placeholder="case.manager@desk.org"
                type="email"
                value={confirmer}
                onChange={(e) => setConfirmer(e.target.value)}
                required
              />
            </label>
            <EmailChips emails={recentConfirmers} onPick={setConfirmer} />
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">Backup if you go silent</span>
              <Input
                id="backup"
                placeholder="optional"
                type="email"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
              />
            </label>
            <EmailChips emails={recentBackups} onPick={setBackup} />
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-muted">When to start — leave empty for now</span>
              <Input
                id="start-at"
                type="datetime-local"
                min={toLocalInput(Date.now())}
                value={startLocal}
                onChange={(e) => setStartLocal(e.target.value)}
              />
            </label>
            <p className="text-xs leading-relaxed text-faint">
              Enter the email of a case manager, peer, or friend who will honestly confirm you
              showed up. Use your own email to test on this phone. Backup only gets a note if
              you go silent.
            </p>
            <Button type="submit" disabled={busy}>
              {busy ? "Starting…" : startLocal ? "Start later" : "Start 90 Minutes"}
            </Button>
          </form>
        </Panel>
        <div className="mt-4">
          <ProtocolGuide />
        </div>
      </>
    );
  }

  const scheduled = active.status === "scheduled" || now < active.startTime;
  const remaining = scheduled ? untilStartMs(active, now) : remainingMs(active, now);
  const total = scheduled
    ? Math.max(untilStartMs(active, now), 1)
    : active.durationMinutes * 60 * 1000;
  const paused = isPaused(active, now);
  const label = listLabel(active);
  const pauseLeft = paused && active.pauseUntil ? Math.max(0, active.pauseUntil - now) : 0;
  const missed = active.status === "missed";
  const tone = scheduled
    ? "muted"
    : paused
      ? "warn"
      : missed
        ? "bad"
        : active.claim
          ? "ok"
          : "accent";

  return (
    <>
      <PageHeader
        kicker="Home"
        title={scheduled ? "Starts later" : "You're in it."}
        description={
          scheduled
            ? `Starts ${formatWhen(active.startTime)}. They can't confirm until then.`
            : "What you tap is you talking. It only counts when they confirm they actually saw you."
        }
        action={
          <span className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs tracking-wide text-muted">
            <StatusPip tone={pipTone(label)} pulse={label === "Clock running"} />
            {label}
          </span>
        }
      />

      <div className="mb-4">
        <DeviceAlerts />
      </div>

      <Panel live={!scheduled && !missed} className="p-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
            <StatusPip tone={pipTone(label)} pulse={label === "Clock running"} />
            {label}
          </div>
          {paused ? (
            <span className="font-mono text-xs tracking-wide text-warn tabular-nums">
              Pause {formatCountdown(pauseLeft)}
            </span>
          ) : null}
        </div>

        <CountdownRing remaining={remaining} total={total} tone={tone}>
          <div className="text-center">
            <p className="font-mono text-4xl font-medium tracking-tight tabular-nums text-fg sm:text-5xl">
              {formatCountdown(remaining)}
            </p>
            <p className="mt-1 text-xs tracking-wide text-muted">
              {scheduled ? "until it starts" : "90 minutes"}
            </p>
          </div>
        </CountdownRing>

        <p className="mt-2 text-center text-base text-fg">{active.task}</p>
        <p className="mt-1 text-center font-mono text-xs text-muted">{active.confirmerEmail}</p>
        {active.backupEmail ? (
          <p className="mt-1 text-center font-mono text-xs text-faint">
            Backup {active.backupEmail}
          </p>
        ) : null}

        {error ? <p className="mt-3 text-sm text-bad">{error}</p> : null}

        {scheduled ? (
          <div className="mt-8 flex flex-col gap-2">
            <p className="text-center text-sm text-muted">
              You can't check in yet. Wait for the start time.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-full"
              onClick={() => void copyInvite(active.confirmerEmail)}
            >
              Copy a text for them
            </Button>
          </div>
        ) : missed ? (
          <p className="mt-8 text-center text-sm text-muted">
            You marked couldn't make it. The clock still runs until it hits zero.
          </p>
        ) : (
          <div className="mt-8 flex flex-col gap-2">
            <Button disabled={busy} onClick={() => void runAction("showed_up")}>
              I'm here (Sober)
            </Button>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => void runAction("used_but_here")}
            >
              I used, but I showed up
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-full"
              disabled={busy || paused}
              onClick={() => void runAction("about_to_use")}
            >
              Need a 10-min pause
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-full"
              disabled={busy}
              onClick={() => void runAction("missed")}
            >
              Couldn't make it
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-full"
              onClick={() => void copyInvite(active.confirmerEmail)}
            >
              Copy a text for them
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-11 w-full"
              onClick={() => void shareConfirmLinkAction(active.id)}
            >
              Share confirmation link
            </Button>
          </div>
        )}
      </Panel>
    </>
  );
}
