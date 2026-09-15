import type { Block, EventType } from "./types";

export function endTime(block: Block): number {
  return block.startTime + block.durationMinutes * 60 * 1000;
}

export function remainingMs(block: Block, now: number): number {
  return Math.max(0, endTime(block) - now);
}

export function untilStartMs(block: Block, now: number): number {
  return Math.max(0, block.startTime - now);
}

export function isPaused(block: Block, now: number): boolean {
  return block.pauseUntil != null && block.pauseUntil > now;
}

export function isTerminal(status: Block["status"]): boolean {
  return status === "received" || status === "missed" || status === "dark";
}

/** Client still sits on this block (missed stays until the 90 minutes run out). */
export function isOpenBlock(block: Block, now: number): boolean {
  if (block.receivedAt) return false;
  if (block.status === "dark") return false;
  if (block.status === "missed") return now < endTime(block);
  return true;
}

export function canConfirm(block: Block, now: number = Date.now()): boolean {
  if (block.receivedAt) return false;
  if (block.status === "missed" || block.status === "dark") return false;
  if (block.status === "scheduled" || now < block.startTime) return false;
  return true;
}

export function applyClock(
  block: Block,
  now: number,
): { block: Block; events: EventType[] } {
  const next: Block = { ...block };
  const events: EventType[] = [];
  const end = endTime(block);

  if (next.pauseUntil != null && now >= next.pauseUntil) {
    next.pauseUntil = null;
    events.push("PAUSE_ENDED");
  }

  if (next.receivedAt != null) {
    next.status = "received";
    return { block: next, events };
  }

  if (next.status === "missed") {
    return { block: next, events };
  }

  if (now < next.startTime) {
    next.status = "scheduled";
    return { block: next, events };
  }

  const wasScheduled = block.status === "scheduled";

  if (now < end) {
    if (wasScheduled) events.push("STARTED");
    if (next.claim === "showed_up") next.status = "claimed_showed_up";
    else if (next.claim === "used_but_here") next.status = "claimed_used_but_here";
    else next.status = "live";
    return { block: next, events };
  }

  if (next.claim === "showed_up") {
    next.status = "claimed_showed_up";
  } else if (next.claim === "used_but_here") {
    next.status = "claimed_used_but_here";
  } else if (next.status !== "dark") {
    next.status = "dark";
    events.push("DARK");
  }

  return { block: next, events };
}

export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatWhen(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
