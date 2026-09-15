import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { listMyBlocks, listMyEvents } from "@/lib/belay/actions";
import { applyClock, endTime, isOpenBlock } from "@/lib/belay/clock";
import { notify } from "@/lib/belay/notify";
import type { Block, EventRow } from "@/lib/belay/types";
import { useCurrentUser } from "@/lib/auth/use-current-user";

type Snap = { status: Block["status"]; pauseUntil: number | null };

export function useBlocks() {
  const user = useCurrentUser();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prev = useRef<Map<string, Snap>>(new Map());
  const primed = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const [nextBlocks, nextEvents] = await Promise.all([listMyBlocks(), listMyEvents()]);
      setBlocks(nextBlocks);
      setEvents(nextEvents);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void refresh();
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = setInterval(() => void refresh(), 8000);
    return () => {
      clearInterval(tick);
      clearInterval(poll);
    };
  }, [user, refresh]);

  const viewed = useMemo(
    () => blocks.map((b) => applyClock(b, now).block),
    [blocks, now],
  );

  useEffect(() => {
    for (const b of viewed) {
      const snap: Snap = { status: b.status, pauseUntil: b.pauseUntil };
      const old = prev.current.get(b.id);
      if (primed.current && old) {
        if (old.status !== "dark" && b.status === "dark") {
          notify("BELAY — Went silent", `${b.task} ended with no check-in.`, `dark-${b.id}`);
        }
        const oldPaused = old.pauseUntil != null && old.pauseUntil > now;
        const nowPaused = b.pauseUntil != null && b.pauseUntil > now;
        if (!oldPaused && nowPaused) {
          notify(
            "BELAY — 10-min pause",
            `${b.task}: they asked for a pause.`,
            `pause-${b.id}-${b.pauseUntil}`,
          );
        }
        if (old.status === "scheduled" && b.status !== "scheduled" && b.status !== "dark") {
          notify("BELAY — Clock running", `${b.task} started.`, `live-${b.id}`);
        }
      }
      prev.current.set(b.id, snap);
    }
    primed.current = true;
  }, [viewed, now]);

  const mine = viewed.filter((b) => user && b.clientId === user.id);
  const toConfirm = viewed.filter((b) => !b.receivedAt && b.status !== "missed");
  const active = mine.find((b) => isOpenBlock(b, now));
  const recentConfirmers = Array.from(
    new Set(mine.map((b) => b.confirmerEmail).filter(Boolean)),
  ).slice(0, 4);
  const recentBackups = Array.from(
    new Set(mine.map((b) => b.backupEmail).filter((v): v is string => Boolean(v))),
  ).slice(0, 4);
  const latest = mine[0];
  const lastDark =
    !active &&
    latest &&
    latest.status === "dark" &&
    now - endTime(latest) < 24 * 60 * 60 * 1000
      ? latest
      : undefined;

  return {
    blocks: mine,
    all: viewed,
    events,
    toConfirm,
    active,
    lastDark,
    recentConfirmers,
    recentBackups,
    now,
    loading,
    error,
    refresh,
    setBlocks,
    user,
  };
}
