import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyClock,
  canConfirm,
  endTime,
  isOpenBlock,
  remainingMs,
  untilStartMs,
} from "./clock.ts";
import type { Block } from "./types.ts";

function block(over: Partial<Block> = {}): Block {
  return {
    id: "b1",
    clientId: "c1",
    confirmerEmail: "desk@org",
    backupEmail: "backup@org",
    task: "Sit in the lobby",
    startTime: 1_000_000,
    durationMinutes: 90,
    status: "live",
    pauseUntil: null,
    receivedAt: null,
    claim: null,
    ...over,
  };
}

describe("applyClock", () => {
  it("keeps a future start as scheduled", () => {
    const { block: next, events } = applyClock(
      block({ status: "scheduled", startTime: 5_000 }),
      1_000,
    );
    assert.equal(next.status, "scheduled");
    assert.deepEqual(events, []);
  });

  it("emits STARTED when a scheduled block goes live", () => {
    const { block: next, events } = applyClock(
      block({ status: "scheduled", startTime: 5_000 }),
      5_000,
    );
    assert.equal(next.status, "live");
    assert.deepEqual(events, ["STARTED"]);
  });

  it("goes Dark on silent expiry and stays Dark", () => {
    const start = 1_000;
    const b = block({ status: "live", startTime: start });
    const { block: next, events } = applyClock(b, endTime(b));
    assert.equal(next.status, "dark");
    assert.deepEqual(events, ["DARK"]);
    const again = applyClock(next, endTime(b) + 60_000);
    assert.equal(again.block.status, "dark");
    assert.deepEqual(again.events, []);
  });

  it("does not Dark a claimed block after the window", () => {
    const b = block({ claim: "showed_up", status: "claimed_showed_up" });
    const { block: next, events } = applyClock(b, endTime(b) + 1);
    assert.equal(next.status, "claimed_showed_up");
    assert.deepEqual(events, []);
  });

  it("clears an expired pause", () => {
    const { block: next, events } = applyClock(
      block({ pauseUntil: 2_000, status: "live" }),
      2_000,
    );
    assert.equal(next.pauseUntil, null);
    assert.deepEqual(events, ["PAUSE_ENDED"]);
  });

  it("lets Received win over the clock", () => {
    const { block: next } = applyClock(
      block({ receivedAt: 1_500, status: "live" }),
      9_999_999,
    );
    assert.equal(next.status, "received");
  });
});

describe("open / confirm", () => {
  it("treats scheduled as open but not confirmable", () => {
    const b = block({ status: "scheduled", startTime: 8_000 });
    assert.equal(isOpenBlock(b, 1_000), true);
    assert.equal(canConfirm(b, 1_000), false);
  });

  it("closes Dark immediately", () => {
    const b = block({ status: "dark" });
    assert.equal(isOpenBlock(b, endTime(b) + 1), false);
    assert.equal(canConfirm(b), false);
  });

  it("keeps missed open until the window ends", () => {
    const b = block({ status: "missed", startTime: 1_000 });
    assert.equal(isOpenBlock(b, 1_000), true);
    assert.equal(isOpenBlock(b, endTime(b)), false);
    assert.equal(canConfirm(b), false);
  });
});

describe("countdowns", () => {
  it("counts down to start, then to end", () => {
    const b = block({ startTime: 10_000, durationMinutes: 90 });
    assert.equal(untilStartMs(b, 4_000), 6_000);
    assert.equal(untilStartMs(b, 10_000), 0);
    assert.equal(remainingMs(b, 10_000), 90 * 60 * 1000);
  });
});
