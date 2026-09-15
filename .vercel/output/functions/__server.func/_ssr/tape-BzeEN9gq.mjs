import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./button-DBc0JaQC.mjs";
import { c as listLabel, i as StatusPip, n as PageHeader, p as useBlocks, r as Panel, s as eventLabel, t as AppShell, u as pipTone } from "./use-blocks-CUueKd6d.mjs";
import { t as MetricRow } from "./metric-row-Mssubqvm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tape-BzeEN9gq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TapePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TapeView, {}) });
}
function TapeView() {
	const { blocks, events, loading, refresh } = useBlocks();
	const [openId, setOpenId] = (0, import_react.useState)(null);
	const cutoff = Date.now() - 12096e5;
	const rows = blocks.filter((b) => b.startTime >= cutoff);
	const received = rows.filter((b) => b.receivedAt);
	const hours = received.reduce((s, b) => s + b.durationMinutes, 0) / 60;
	const dark = rows.filter((b) => b.status === "dark").length;
	const missed = rows.filter((b) => b.status === "missed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Tape",
			title: "14-day received hours",
			description: "Print this for a desk. No streaks. Showing up is the point.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => void refresh(),
					children: "Refresh"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => window.print(),
					children: "Print"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, { items: [
				{
					label: "Received",
					value: String(received.length),
					tone: "ok"
				},
				{
					label: "Hours",
					value: hours === 0 ? "0" : hours.toFixed(1)
				},
				{
					label: "Dark / missed",
					value: `${dark}/${missed}`,
					tone: dark + missed > 0 ? "bad" : "fg"
				}
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-5 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Log"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs text-faint",
				children: [rows.length, " blocks"]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse bg-surface-2" }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-5 py-10 text-center text-sm text-muted",
			children: "No blocks yet."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((b, i) => {
			const label = listLabel(b);
			const date = new Date(b.startTime);
			const open = openId === b.id;
			const trail = events.filter((e) => e.blockId === b.id).sort((a, c) => a.timestamp - c.timestamp);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: i === rows.length - 1 ? "" : "border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left",
					onClick: () => setOpenId(open ? null : b.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPip, { tone: pipTone(label) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-fg",
								children: b.task
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-muted",
								children: [
									date.toLocaleDateString(void 0, {
										month: "short",
										day: "numeric"
									}),
									" ",
									date.toLocaleTimeString(void 0, {
										hour: "numeric",
										minute: "2-digit"
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shrink-0 text-right text-xs tracking-wide text-muted",
						children: label
					})]
				}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-5 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-faint",
						children: [b.confirmerEmail, b.backupEmail ? ` · backup ${b.backupEmail}` : ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2",
						children: trail.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-xs text-faint",
							children: "No events recorded."
						}) : trail.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-1 font-mono text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: eventLabel(ev.type) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: new Date(ev.timestamp).toLocaleTimeString(void 0, {
									hour: "numeric",
									minute: "2-digit"
								})
							})]
						}, ev.id))
					})]
				}) : null]
			}, b.id);
		}) })] })
	] });
}
//#endregion
export { TapePage as component };
