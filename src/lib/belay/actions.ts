import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { applyClock, canConfirm, isOpenBlock, isTerminal } from "./clock";
import type { Block, BlockStatus, Claim, EventType } from "./types";

const MAX_AHEAD_MS = 7 * 24 * 60 * 60 * 1000;

type BlockRow = {
  id: string;
  client_id: string;
  confirmer_email: string;
  backup_email: string | null;
  task: string;
  start_time: number | string;
  duration_minutes: number | string;
  status: string;
  claim: string | null;
  received_at: number | string | null;
  pause_until: number | string | null;
};

function num(v: number | string | null | undefined): number | null {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function mapBlock(row: BlockRow): Block {
  return {
    id: row.id,
    clientId: row.client_id,
    confirmerEmail: row.confirmer_email,
    backupEmail: row.backup_email?.trim().toLowerCase() || null,
    task: row.task,
    startTime: num(row.start_time) ?? 0,
    durationMinutes: num(row.duration_minutes) ?? 90,
    status: row.status as BlockStatus,
    pauseUntil: num(row.pause_until),
    receivedAt: num(row.received_at),
    claim: (row.claim as Claim) ?? null,
  };
}

function normEmail(value: string | undefined | null): string | null {
  const email = value?.trim().toLowerCase() ?? "";
  return email || null;
}

async function sessionEmail(userId: string): Promise<string | null> {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`
    select email from "user" where id = ${userId} limit 1
  `;
  const email = rows[0]?.email?.trim().toLowerCase();
  return email || null;
}

async function persistBlock(sql: Awaited<ReturnType<typeof getSql>>, block: Block) {
  await sql`
    update blocks
    set status = ${block.status},
        claim = ${block.claim},
        received_at = ${block.receivedAt},
        pause_until = ${block.pauseUntil}
    where id = ${block.id}
  `;
}

async function insertEvent(
  sql: Awaited<ReturnType<typeof getSql>>,
  blockId: string,
  type: EventType,
  actorId: string,
) {
  await sql`
    insert into events (id, block_id, type, timestamp, actor_id)
    values (${crypto.randomUUID()}, ${blockId}, ${type}, ${Date.now()}, ${actorId})
  `;
}

async function loadVisible(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  email: string | null,
): Promise<Block[]> {
  const rows = email
    ? await sql<BlockRow>`
        select * from blocks
        where client_id = ${userId}
           or confirmer_email = ${email}
           or backup_email = ${email}
        order by start_time desc
      `
    : await sql<BlockRow>`
        select * from blocks
        where client_id = ${userId}
        order by start_time desc
      `;
  return rows.map(mapBlock);
}

async function tickOne(
  sql: Awaited<ReturnType<typeof getSql>>,
  block: Block,
  userId: string,
  now: number,
): Promise<Block> {
  if (isTerminal(block.status) && block.status !== "dark") return block;
  const { block: next, events } = applyClock(block, now);
  const changed =
    next.status !== block.status ||
    next.pauseUntil !== block.pauseUntil ||
    next.receivedAt !== block.receivedAt;
  if (changed) await persistBlock(sql, next);
  for (const ev of events) await insertEvent(sql, next.id, ev, userId);
  return next;
}

function isPausedNow(block: Block): boolean {
  return block.pauseUntil != null && block.pauseUntil > Date.now();
}

export const listMyBlocks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const email = await sessionEmail(context.userId);
    const blocks = await loadVisible(sql, context.userId, email);
    const now = Date.now();
    const ticked: Block[] = [];
    for (const b of blocks) ticked.push(await tickOne(sql, b, context.userId, now));
    return ticked;
  });

export const startBlock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      task: z.string().min(1).max(160),
      confirmerEmail: z.string().min(3).max(200),
      backupEmail: z.string().max(200).optional(),
      startAt: z.number().optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const email = await sessionEmail(context.userId);
    const existing = await loadVisible(sql, context.userId, email);
    const now = Date.now();
    const ticked: Block[] = [];
    for (const b of existing) ticked.push(await tickOne(sql, b, context.userId, now));
    const active = ticked.find(
      (b) => b.clientId === context.userId && isOpenBlock(b, now),
    );
    if (active) return active;

    const confirmer = normEmail(data.confirmerEmail);
    if (!confirmer) throw new Error("Who verifies this is required");
    let backup = normEmail(data.backupEmail ?? null);
    if (backup && backup === confirmer) backup = null;

    const startAt =
      typeof data.startAt === "number" && Number.isFinite(data.startAt)
        ? Math.floor(data.startAt)
        : null;
    if (startAt != null && startAt > now + MAX_AHEAD_MS) {
      throw new Error("Start time has to be within 7 days");
    }

    const scheduled = startAt != null && startAt > now + 15_000;
    const block: Block = {
      id: crypto.randomUUID(),
      clientId: context.userId,
      confirmerEmail: confirmer,
      backupEmail: backup,
      task: data.task.trim(),
      startTime: scheduled ? startAt : now,
      durationMinutes: 90,
      status: scheduled ? "scheduled" : "live",
      pauseUntil: null,
      receivedAt: null,
      claim: null,
    };
    await sql`
      insert into blocks (
        id, client_id, confirmer_email, backup_email, task, start_time,
        duration_minutes, status, claim, received_at, pause_until
      ) values (
        ${block.id}, ${block.clientId}, ${block.confirmerEmail}, ${block.backupEmail},
        ${block.task}, ${block.startTime}, ${block.durationMinutes}, ${block.status},
        ${block.claim}, ${block.receivedAt}, ${block.pauseUntil}
      )
    `;
    await insertEvent(sql, block.id, scheduled ? "SCHEDULED" : "STARTED", context.userId);
    return block;
  });

export const clientAction = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      blockId: z.string().min(1),
      action: z.enum(["showed_up", "used_but_here", "missed", "about_to_use"]),
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<BlockRow>`
      select * from blocks where id = ${data.blockId} and client_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) throw new Error("That check-in is gone");
    let block = mapBlock(row);
    block = await tickOne(sql, block, context.userId, Date.now());
    if (block.receivedAt) return block;
    if (block.status === "missed" || block.status === "dark") return block;
    if (block.status === "scheduled") return block;

    if (data.action === "showed_up") {
      block.claim = "showed_up";
      block.status = "claimed_showed_up";
      await persistBlock(sql, block);
      await insertEvent(sql, block.id, "SHOWED_UP", context.userId);
    } else if (data.action === "used_but_here") {
      block.claim = "used_but_here";
      block.status = "claimed_used_but_here";
      await persistBlock(sql, block);
      await insertEvent(sql, block.id, "USED_BUT_HERE", context.userId);
    } else if (data.action === "missed") {
      block.status = "missed";
      await persistBlock(sql, block);
      await insertEvent(sql, block.id, "MISSED", context.userId);
    } else if (data.action === "about_to_use") {
      if (isPausedNow(block)) return block;
      block.pauseUntil = Date.now() + 10 * 60 * 1000;
      await persistBlock(sql, block);
      await insertEvent(sql, block.id, "ABOUT_TO_USE", context.userId);
    }
    return block;
  });

export const confirmBlock = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ blockId: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const email = await sessionEmail(context.userId);
    const rows = email
      ? await sql<BlockRow>`
          select * from blocks
          where id = ${data.blockId}
            and (client_id = ${context.userId} or confirmer_email = ${email})
          limit 1
        `
      : await sql<BlockRow>`
          select * from blocks
          where id = ${data.blockId} and client_id = ${context.userId}
          limit 1
        `;
    const row = rows[0];
    if (!row) throw new Error("That check-in is gone");
    let block = mapBlock(row);
    block = await tickOne(sql, block, context.userId, Date.now());
    if (!canConfirm(block)) return block;
    const now = Date.now();
    block.receivedAt = now;
    block.status = "received";
    await persistBlock(sql, block);
    await insertEvent(sql, block.id, "CONFIRMED", context.userId);
    return block;
  });

type EventDb = {
  id: string;
  block_id: string;
  type: string;
  timestamp: number | string;
};

export const listMyEvents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const email = await sessionEmail(context.userId);
    const rows = email
      ? await sql<EventDb>`
          select e.id, e.block_id, e.type, e.timestamp
          from events e
          join blocks b on b.id = e.block_id
          where b.client_id = ${context.userId}
             or b.confirmer_email = ${email}
             or b.backup_email = ${email}
          order by e.timestamp desc
          limit 200
        `
      : await sql<EventDb>`
          select e.id, e.block_id, e.type, e.timestamp
          from events e
          join blocks b on b.id = e.block_id
          where b.client_id = ${context.userId}
          order by e.timestamp desc
          limit 200
        `;
    return rows.map((row) => ({
      id: row.id,
      blockId: row.block_id,
      type: row.type as EventType,
      timestamp: num(row.timestamp) ?? 0,
    }));
  });
