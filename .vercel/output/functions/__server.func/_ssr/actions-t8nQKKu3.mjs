import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-7X19hNRB.mjs";
import { l as isTerminal, n as authMiddleware, r as canConfirm, s as isOpenBlock, t as applyClock } from "./clock-lJOQZewq.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/actions-t8nQKKu3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MAX_AHEAD_MS = 6048e5;
function num(v) {
	if (v == null || v === "") return null;
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : null;
}
function mapBlock(row) {
	return {
		id: row.id,
		clientId: row.client_id,
		confirmerEmail: row.confirmer_email,
		backupEmail: row.backup_email?.trim().toLowerCase() || null,
		task: row.task,
		startTime: num(row.start_time) ?? 0,
		durationMinutes: num(row.duration_minutes) ?? 90,
		status: row.status,
		pauseUntil: num(row.pause_until),
		receivedAt: num(row.received_at),
		claim: row.claim ?? null
	};
}
function normEmail(value) {
	return (value?.trim().toLowerCase() ?? "") || null;
}
async function sessionEmail(userId) {
	return (await (await getSql())`
    select email from "user" where id = ${userId} limit 1
  `)[0]?.email?.trim().toLowerCase() || null;
}
async function persistBlock(sql, block) {
	await sql`
    update blocks
    set status = ${block.status},
        claim = ${block.claim},
        received_at = ${block.receivedAt},
        pause_until = ${block.pauseUntil}
    where id = ${block.id}
  `;
}
async function insertEvent(sql, blockId, type, actorId) {
	await sql`
    insert into events (id, block_id, type, timestamp, actor_id)
    values (${crypto.randomUUID()}, ${blockId}, ${type}, ${Date.now()}, ${actorId})
  `;
}
async function loadVisible(sql, userId, email) {
	return (email ? await sql`
        select * from blocks
        where client_id = ${userId}
           or confirmer_email = ${email}
           or backup_email = ${email}
        order by start_time desc
      ` : await sql`
        select * from blocks
        where client_id = ${userId}
        order by start_time desc
      `).map(mapBlock);
}
async function tickOne(sql, block, userId, now) {
	if (isTerminal(block.status) && block.status !== "dark") return block;
	const { block: next, events } = applyClock(block, now);
	if (next.status !== block.status || next.pauseUntil !== block.pauseUntil || next.receivedAt !== block.receivedAt) await persistBlock(sql, next);
	for (const ev of events) await insertEvent(sql, next.id, ev, userId);
	return next;
}
function isPausedNow(block) {
	return block.pauseUntil != null && block.pauseUntil > Date.now();
}
var listMyBlocks_createServerFn_handler = createServerRpc({
	id: "b372007fe930a01b8ae2570f65e2dc0fd593eaee8db959fa1ad8578dd5dca2e8",
	name: "listMyBlocks",
	filename: "src/lib/belay/actions.ts"
}, (opts) => listMyBlocks.__executeServer(opts));
var listMyBlocks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyBlocks_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const email = await sessionEmail(context.userId);
	const blocks = await loadVisible(sql, context.userId, email);
	const now = Date.now();
	const ticked = [];
	for (const b of blocks) ticked.push(await tickOne(sql, b, context.userId, now));
	return ticked;
});
var startBlock_createServerFn_handler = createServerRpc({
	id: "e49d987c19cf6ea32031aba47e0feaf6a9c9c7aa40e5cf7dd6e6137b87912c09",
	name: "startBlock",
	filename: "src/lib/belay/actions.ts"
}, (opts) => startBlock.__executeServer(opts));
var startBlock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	task: string().min(1).max(160),
	confirmerEmail: string().min(3).max(200),
	backupEmail: string().max(200).optional(),
	startAt: number().optional()
})).handler(startBlock_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const email = await sessionEmail(context.userId);
	const existing = await loadVisible(sql, context.userId, email);
	const now = Date.now();
	const ticked = [];
	for (const b of existing) ticked.push(await tickOne(sql, b, context.userId, now));
	const active = ticked.find((b) => b.clientId === context.userId && isOpenBlock(b, now));
	if (active) return active;
	const confirmer = normEmail(data.confirmerEmail);
	if (!confirmer) throw new Error("Confirmer email is required");
	let backup = normEmail(data.backupEmail ?? null);
	if (backup && backup === confirmer) backup = null;
	const startAt = typeof data.startAt === "number" && Number.isFinite(data.startAt) ? Math.floor(data.startAt) : null;
	if (startAt != null && startAt > now + MAX_AHEAD_MS) throw new Error("Start must be within 7 days");
	const scheduled = startAt != null && startAt > now + 15e3;
	const block = {
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
		claim: null
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
var clientAction_createServerFn_handler = createServerRpc({
	id: "fc06c23c6fe9d7ade61c9f14642aac08357940886838fd6c7f1f054078d17566",
	name: "clientAction",
	filename: "src/lib/belay/actions.ts"
}, (opts) => clientAction.__executeServer(opts));
var clientAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	blockId: string().min(1),
	action: _enum([
		"showed_up",
		"used_but_here",
		"missed",
		"about_to_use"
	])
})).handler(clientAction_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const row = (await sql`
      select * from blocks where id = ${data.blockId} and client_id = ${context.userId} limit 1
    `)[0];
	if (!row) throw new Error("Block not found");
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
		block.pauseUntil = Date.now() + 6e5;
		await persistBlock(sql, block);
		await insertEvent(sql, block.id, "ABOUT_TO_USE", context.userId);
	}
	return block;
});
var confirmBlock_createServerFn_handler = createServerRpc({
	id: "9ba8dd178d8eb64a81ebd7d16661c8d46cc4efc9e21c87dc63ca23ccf67d808a",
	name: "confirmBlock",
	filename: "src/lib/belay/actions.ts"
}, (opts) => confirmBlock.__executeServer(opts));
var confirmBlock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ blockId: string().min(1) })).handler(confirmBlock_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const email = await sessionEmail(context.userId);
	const row = (email ? await sql`
          select * from blocks
          where id = ${data.blockId}
            and (client_id = ${context.userId} or confirmer_email = ${email})
          limit 1
        ` : await sql`
          select * from blocks
          where id = ${data.blockId} and client_id = ${context.userId}
          limit 1
        `)[0];
	if (!row) throw new Error("Block not found");
	let block = mapBlock(row);
	block = await tickOne(sql, block, context.userId, Date.now());
	if (!canConfirm(block)) return block;
	block.receivedAt = Date.now();
	block.status = "received";
	await persistBlock(sql, block);
	await insertEvent(sql, block.id, "CONFIRMED", context.userId);
	return block;
});
var listMyEvents_createServerFn_handler = createServerRpc({
	id: "0de19caaffad49fffe447fd92b5e18b045074bcb63c418002ca8ab407733d3ff",
	name: "listMyEvents",
	filename: "src/lib/belay/actions.ts"
}, (opts) => listMyEvents.__executeServer(opts));
var listMyEvents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyEvents_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const email = await sessionEmail(context.userId);
	return (email ? await sql`
          select e.id, e.block_id, e.type, e.timestamp
          from events e
          join blocks b on b.id = e.block_id
          where b.client_id = ${context.userId}
             or b.confirmer_email = ${email}
             or b.backup_email = ${email}
          order by e.timestamp desc
          limit 200
        ` : await sql`
          select e.id, e.block_id, e.type, e.timestamp
          from events e
          join blocks b on b.id = e.block_id
          where b.client_id = ${context.userId}
          order by e.timestamp desc
          limit 200
        `).map((row) => ({
		id: row.id,
		blockId: row.block_id,
		type: row.type,
		timestamp: num(row.timestamp) ?? 0
	}));
});
//#endregion
export { clientAction_createServerFn_handler, confirmBlock_createServerFn_handler, listMyBlocks_createServerFn_handler, listMyEvents_createServerFn_handler, startBlock_createServerFn_handler };
