import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./button-DBc0JaQC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metric-row-Mssubqvm.js
var import_jsx_runtime = require_jsx_runtime();
function MetricRow({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "metric-cell px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted",
				children: item.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 font-mono text-lg font-medium tracking-tight tabular-nums", item.tone === "ok" && "text-ok", item.tone === "warn" && "text-warn", item.tone === "bad" && "text-bad", item.tone === "accent" && "text-accent", (!item.tone || item.tone === "fg") && "text-fg"),
				children: item.value
			})]
		}, item.label))
	});
}
//#endregion
export { MetricRow as t };
