import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clock-lJOQZewq.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-D82fueJ-.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
function endTime(block) {
	return block.startTime + block.durationMinutes * 60 * 1e3;
}
function remainingMs(block, now) {
	return Math.max(0, endTime(block) - now);
}
function untilStartMs(block, now) {
	return Math.max(0, block.startTime - now);
}
function isPaused(block, now) {
	return block.pauseUntil != null && block.pauseUntil > now;
}
function isTerminal(status) {
	return status === "received" || status === "missed" || status === "dark";
}
/** Client still sits on this block (missed stays until the 90 minutes run out). */
function isOpenBlock(block, now) {
	if (block.receivedAt) return false;
	if (block.status === "dark") return false;
	if (block.status === "missed") return now < endTime(block);
	return true;
}
function canConfirm(block, now = Date.now()) {
	if (block.receivedAt) return false;
	if (block.status === "missed" || block.status === "dark") return false;
	if (block.status === "scheduled" || now < block.startTime) return false;
	return true;
}
function applyClock(block, now) {
	const next = { ...block };
	const events = [];
	const end = endTime(block);
	if (next.pauseUntil != null && now >= next.pauseUntil) {
		next.pauseUntil = null;
		events.push("PAUSE_ENDED");
	}
	if (next.receivedAt != null) {
		next.status = "received";
		return {
			block: next,
			events
		};
	}
	if (next.status === "missed") return {
		block: next,
		events
	};
	if (now < next.startTime) {
		next.status = "scheduled";
		return {
			block: next,
			events
		};
	}
	const wasScheduled = block.status === "scheduled";
	if (now < end) {
		if (wasScheduled) events.push("STARTED");
		if (next.claim === "showed_up") next.status = "claimed_showed_up";
		else if (next.claim === "used_but_here") next.status = "claimed_used_but_here";
		else next.status = "live";
		return {
			block: next,
			events
		};
	}
	if (next.claim === "showed_up") next.status = "claimed_showed_up";
	else if (next.claim === "used_but_here") next.status = "claimed_used_but_here";
	else if (next.status !== "dark") {
		next.status = "dark";
		events.push("DARK");
	}
	return {
		block: next,
		events
	};
}
function formatCountdown(ms) {
	const total = Math.floor(ms / 1e3);
	const h = Math.floor(total / 3600);
	const m = Math.floor(total % 3600 / 60);
	const s = total % 60;
	if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatWhen(ms) {
	return new Date(ms).toLocaleString(void 0, {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
//#endregion
export { formatCountdown as a, isPaused as c, untilStartMs as d, endTime as i, isTerminal as l, authMiddleware as n, formatWhen as o, canConfirm as r, isOpenBlock as s, applyClock as t, remainingMs as u };
