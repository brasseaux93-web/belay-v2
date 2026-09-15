import type { Block, EventType } from "./types";

export type ListLabel =
  | "Used, showed up"
  | "Here (sober)"
  | "Confirmed"
  | "Waiting on them"
  | "Couldn't make it"
  | "Went silent"
  | "Clock running"
  | "Starts later";

export function listLabel(b: Block): ListLabel {
  if (b.receivedAt && b.claim === "used_but_here") return "Used, showed up";
  if (b.receivedAt && b.claim === "showed_up") return "Here (sober)";
  if (b.receivedAt && !b.claim) return "Confirmed";
  if (b.claim && !b.receivedAt) return "Waiting on them";
  if (b.status === "missed") return "Couldn't make it";
  if (b.status === "dark") return "Went silent";
  if (b.status === "scheduled") return "Starts later";
  return "Clock running";
}

/** Same status, from the person who has to look. */
export function confirmLabel(b: Block): string {
  const base = listLabel(b);
  switch (base) {
    case "Waiting on them":
      return "They checked in";
    case "Clock running":
      return "They're in it";
    case "Starts later":
      return "Not started yet";
    case "Couldn't make it":
      return "They couldn't make it";
    case "Went silent":
      return "They went silent";
    case "Confirmed":
      return "You confirmed";
    case "Here (sober)":
      return "Here, sober";
    case "Used, showed up":
      return "Used, showed up";
  }
}

export function pipTone(label: ListLabel): "ok" | "warn" | "bad" | "accent" | "muted" {
  if (label === "Here (sober)" || label === "Confirmed") return "ok";
  if (label === "Used, showed up" || label === "Waiting on them") return "warn";
  if (label === "Couldn't make it" || label === "Went silent") return "bad";
  if (label === "Clock running") return "accent";
  return "muted";
}

export function eventLabel(type: EventType): string {
  switch (type) {
    case "SCHEDULED":
      return "Set a start time";
    case "STARTED":
      return "Clock started";
    case "SHOWED_UP":
      return "Here (sober)";
    case "USED_BUT_HERE":
      return "Used, showed up";
    case "ABOUT_TO_USE":
      return "10-min pause";
    case "PAUSE_ENDED":
      return "Pause ended";
    case "MISSED":
      return "Couldn't make it";
    case "DARK":
      return "Went silent";
    case "CONFIRMED":
      return "Confirmed";
  }
}
