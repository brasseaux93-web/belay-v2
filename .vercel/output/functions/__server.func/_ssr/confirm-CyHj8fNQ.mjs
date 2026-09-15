import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatCountdown, d as untilStartMs, o as formatWhen, r as canConfirm, u as remainingMs } from "./clock-lJOQZewq.mjs";
import { n as Button } from "./button-DBc0JaQC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as listLabel, i as StatusPip, n as PageHeader, o as confirmBlock, p as useBlocks, r as Panel, t as AppShell, u as pipTone } from "./use-blocks-CUueKd6d.mjs";
import { i as copyText, n as backupDarkInvite, t as DeviceAlerts } from "./copy-snC86qsH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confirm-CyHj8fNQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConfirmPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmView, {}) });
}
function claimCopy(block) {
	if (block.claim === "showed_up") return "Showed up";
	if (block.claim === "used_but_here") return "Used but here";
	return "No claim yet";
}
async function copyBackup(block) {
	if (await copyText(backupDarkInvite(block.task, window.location.origin))) toast("Backup note copied. Send it now.");
	else toast.error("Could not copy");
}
function ConfirmView() {
	const { toConfirm, now, loading, error, refresh, setBlocks, user } = useBlocks();
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const queue = toConfirm;
	const email = user?.primaryEmail?.trim().toLowerCase() ?? "";
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-lg border border-border bg-surface" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Confirm",
			title: "Received settles it",
			description: "Tap Received only if they are here. A claim is not enough.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				size: "sm",
				onClick: () => void refresh(),
				children: "Refresh"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceAlerts, {})
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-bad",
			children: error
		}) : null,
		queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "px-5 py-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-fg",
				children: "No block to confirm"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "When someone names your email, it lands here."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: queue.map((block) => {
				const label = listLabel(block);
				const paused = block.pauseUntil != null && block.pauseUntil > now;
				const scheduled = block.status === "scheduled" || now < block.startTime;
				const isBackup = Boolean(email) && block.backupEmail === email && block.confirmerEmail !== email;
				const settle = canConfirm(block, now) && !isBackup;
				const clock = scheduled ? untilStartMs(block, now) : remainingMs(block, now);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					live: settle,
					className: "p-5",
					children: [
						block.status === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 rounded-md border border-bad/40 bg-bad/10 px-3 py-2 text-xs font-medium tracking-wide text-bad",
							children: "They went silent."
						}) : null,
						paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-xs font-medium tracking-wide text-warn",
							children: "They signaled about to use."
						}) : null,
						scheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-md border border-border bg-bg px-3 py-2 text-xs font-medium tracking-wide text-muted",
							children: [
								"Starts ",
								formatWhen(block.startTime),
								". Received is closed until then."
							]
						}) : null,
						isBackup && block.status !== "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 rounded-md border border-border bg-bg px-3 py-2 text-xs leading-relaxed text-muted",
							children: "You are the backup. You are pinged if this goes Dark."
						}) : null,
						isBackup && block.status === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-sm text-muted",
							children: "Check on them. This block does not count."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPip, {
									tone: pipTone(label),
									pulse: label === "Live"
								}), label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-sm tabular-nums text-fg",
								children: formatCountdown(clock)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-fg",
							children: block.task
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: ["Claim: ", claimCopy(block)]
						}),
						block.backupEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-xs text-faint",
							children: ["Backup ", block.backupEmail]
						}) : null,
						settle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								disabled: busyId === block.id,
								onClick: async () => {
									setBusyId(block.id);
									try {
										const next = await confirmBlock({ data: { blockId: block.id } });
										setBlocks((prev) => prev.map((b) => b.id === next.id ? next : b));
										toast("Received. Block settled.");
										await refresh();
									} catch (err) {
										toast.error(err instanceof Error ? err.message : "Confirm failed");
									} finally {
										setBusyId(null);
									}
								},
								children: busyId === block.id ? "Saving…" : "Received"
							})
						}) : null,
						block.status === "dark" && block.backupEmail && !isBackup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								size: "sm",
								className: "h-11 w-full",
								onClick: () => void copyBackup(block),
								children: "Copy backup note"
							})
						}) : null
					]
				}, block.id);
			})
		})
	] });
}
//#endregion
export { ConfirmPage as component };
