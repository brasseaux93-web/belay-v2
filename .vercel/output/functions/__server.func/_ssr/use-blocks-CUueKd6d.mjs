import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Navigate, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as endTime, n as authMiddleware, s as isOpenBlock, t as applyClock } from "./clock-lJOQZewq.mjs";
import { cn as _enum, gn as object, hn as number, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { a as useCurrentUserState, i as useCurrentUser, r as cn, t as BrandMark } from "./button-DBc0JaQC.mjs";
import { a as hasGateSessionMarker } from "./server-Bw_9MwRa.mjs";
import { i as LayoutList, n as Timer, r as Radio } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-blocks-CUueKd6d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: Timer
	},
	{
		to: "/confirm",
		label: "Confirm",
		icon: Radio
	},
	{
		to: "/tape",
		label: "Tape",
		icon: LayoutList
	}
];
function PendingScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh items-center justify-center bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-mesh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative rounded-lg border border-border bg-surface px-6 py-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Loading session"
			})]
		})]
	});
}
var navClass = (active) => cn("flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium", "transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-bg hover:text-fg active:bg-surface-2 active:text-fg");
var mobileNavClass = (active) => cn("flex min-h-11 flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium tracking-wide", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent", active ? "text-fg" : "text-muted hover:text-fg active:text-fg");
function ShellInner({ children, user }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-mesh" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-grid" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "bg-sidebar fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 items-center border-b border-border px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-0.5 p-2",
						children: NAV.map((item) => {
							const active = pathname === item.to;
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: navClass(active),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4",
									strokeWidth: 1.75
								}), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate px-1 pb-2 font-mono text-xs text-muted",
							children: user.primaryEmail
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "no-print sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 md:pl-60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-xl px-4 py-6 pb-28 md:py-10",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print panel fixed inset-x-3 bottom-3 z-20 rounded-lg border border-border pb-[env(safe-area-inset-bottom)] md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: mobileNavClass(active),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4",
								strokeWidth: 1.75
							}), item.label]
						}, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-right",
				toastOptions: { className: "!bg-surface-2 !border-border !text-fg !text-sm" }
			})
		]
	});
}
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingScreen, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellInner, {
		user,
		children
	});
}
function notificationPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	return Notification.permission;
}
async function requestNotifications() {
	if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
	try {
		return await Notification.requestPermission();
	} catch {
		return notificationPermission();
	}
}
function notify(title, body, tag) {
	if (typeof window === "undefined" || !("Notification" in window)) return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, {
			body,
			tag,
			silent: false
		});
	} catch {}
}
function PageHeader({ kicker, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-start justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: kicker
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 max-w-md text-sm leading-relaxed text-muted",
					children: description
				}) : null
			]
		}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		}) : null]
	});
}
function Panel({ children, className, live = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-lg border border-border", live ? "panel-live" : "panel", className),
		children
	});
}
var toneClass = {
	ok: "bg-ok",
	warn: "bg-warn",
	bad: "bg-bad",
	accent: "bg-accent",
	muted: "bg-faint"
};
function StatusPip({ tone, pulse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block size-1.5 shrink-0 rounded-full", toneClass[tone], pulse && "animate-pulse"),
		"aria-hidden": true
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var listMyBlocks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b372007fe930a01b8ae2570f65e2dc0fd593eaee8db959fa1ad8578dd5dca2e8"));
var startBlock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	task: string().min(1).max(160),
	confirmerEmail: string().min(3).max(200),
	backupEmail: string().max(200).optional(),
	startAt: number().optional()
})).handler(createSsrRpc("e49d987c19cf6ea32031aba47e0feaf6a9c9c7aa40e5cf7dd6e6137b87912c09"));
var clientAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	blockId: string().min(1),
	action: _enum([
		"showed_up",
		"used_but_here",
		"missed",
		"about_to_use"
	])
})).handler(createSsrRpc("fc06c23c6fe9d7ade61c9f14642aac08357940886838fd6c7f1f054078d17566"));
var confirmBlock = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ blockId: string().min(1) })).handler(createSsrRpc("9ba8dd178d8eb64a81ebd7d16661c8d46cc4efc9e21c87dc63ca23ccf67d808a"));
var listMyEvents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0de19caaffad49fffe447fd92b5e18b045074bcb63c418002ca8ab407733d3ff"));
function listLabel(b) {
	if (b.receivedAt && b.claim === "used_but_here") return "Used but here";
	if (b.receivedAt && b.claim === "showed_up") return "Showed up";
	if (b.receivedAt && !b.claim) return "Received";
	if (b.claim && !b.receivedAt) return "Claimed — not confirmed";
	if (b.status === "missed") return "Missed";
	if (b.status === "dark") return "Dark";
	if (b.status === "scheduled") return "Scheduled";
	return "Live";
}
function pipTone(label) {
	if (label === "Showed up" || label === "Received") return "ok";
	if (label === "Used but here" || label === "Claimed — not confirmed") return "warn";
	if (label === "Missed" || label === "Dark") return "bad";
	if (label === "Live") return "accent";
	return "muted";
}
function eventLabel(type) {
	switch (type) {
		case "SCHEDULED": return "Scheduled";
		case "STARTED": return "Started";
		case "SHOWED_UP": return "Showed up";
		case "USED_BUT_HERE": return "Used but here";
		case "ABOUT_TO_USE": return "About to use";
		case "PAUSE_ENDED": return "Pause ended";
		case "MISSED": return "Missed";
		case "DARK": return "Dark";
		case "CONFIRMED": return "Received";
	}
}
function useBlocks() {
	const user = useCurrentUser();
	const [blocks, setBlocks] = (0, import_react.useState)([]);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const prev = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const primed = (0, import_react.useRef)(false);
	const refresh = (0, import_react.useCallback)(async () => {
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
	(0, import_react.useEffect)(() => {
		if (!user) return;
		refresh();
		const tick = setInterval(() => setNow(Date.now()), 1e3);
		const poll = setInterval(() => void refresh(), 8e3);
		return () => {
			clearInterval(tick);
			clearInterval(poll);
		};
	}, [user, refresh]);
	const viewed = (0, import_react.useMemo)(() => blocks.map((b) => applyClock(b, now).block), [blocks, now]);
	(0, import_react.useEffect)(() => {
		for (const b of viewed) {
			const snap = {
				status: b.status,
				pauseUntil: b.pauseUntil
			};
			const old = prev.current.get(b.id);
			if (primed.current && old) {
				if (old.status !== "dark" && b.status === "dark") notify("BELAY — Dark", `${b.task} ended with no tap.`, `dark-${b.id}`);
				const oldPaused = old.pauseUntil != null && old.pauseUntil > now;
				const nowPaused = b.pauseUntil != null && b.pauseUntil > now;
				if (!oldPaused && nowPaused) notify("BELAY — About to use", `${b.task}: 10-minute pause.`, `pause-${b.id}-${b.pauseUntil}`);
				if (old.status === "scheduled" && b.status !== "scheduled" && b.status !== "dark") notify("BELAY — Live", `${b.task} is running.`, `live-${b.id}`);
			}
			prev.current.set(b.id, snap);
		}
		primed.current = true;
	}, [viewed, now]);
	const mine = viewed.filter((b) => user && b.clientId === user.id);
	const toConfirm = viewed.filter((b) => !b.receivedAt && b.status !== "missed");
	const active = mine.find((b) => isOpenBlock(b, now));
	const recentConfirmers = Array.from(new Set(mine.map((b) => b.confirmerEmail).filter(Boolean))).slice(0, 4);
	const recentBackups = Array.from(new Set(mine.map((b) => b.backupEmail).filter((v) => Boolean(v)))).slice(0, 4);
	const latest = mine[0];
	return {
		blocks: mine,
		all: viewed,
		events,
		toConfirm,
		active,
		lastDark: !active && latest && latest.status === "dark" && now - endTime(latest) < 864e5 ? latest : void 0,
		recentConfirmers,
		recentBackups,
		now,
		loading,
		error,
		refresh,
		setBlocks,
		user
	};
}
//#endregion
export { clientAction as a, listLabel as c, requestNotifications as d, startBlock as f, StatusPip as i, notificationPermission as l, PageHeader as n, confirmBlock as o, useBlocks as p, Panel as r, eventLabel as s, AppShell as t, pipTone as u };
