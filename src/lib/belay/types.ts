export type BlockStatus =
  | "scheduled"
  | "live"
  | "claimed_showed_up"
  | "claimed_used_but_here"
  | "received"
  | "missed"
  | "dark";

export type EventType =
  | "SCHEDULED"
  | "STARTED"
  | "ABOUT_TO_USE"
  | "PAUSE_ENDED"
  | "SHOWED_UP"
  | "USED_BUT_HERE"
  | "MISSED"
  | "DARK"
  | "CONFIRMED";

export type Claim = "showed_up" | "used_but_here" | null;

export type Block = {
  id: string;
  clientId: string;
  confirmerEmail: string;
  backupEmail: string | null;
  task: string;
  startTime: number;
  durationMinutes: number;
  status: BlockStatus;
  pauseUntil: number | null;
  receivedAt: number | null;
  claim: Claim;
};

export type EventRow = {
  id: string;
  blockId: string;
  type: EventType;
  timestamp: number;
};
