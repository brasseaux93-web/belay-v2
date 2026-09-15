import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./button-DBc0JaQC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as requestNotifications, l as notificationPermission } from "./use-blocks-CUueKd6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/copy-snC86qsH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeviceAlerts() {
	const [perm, setPerm] = (0, import_react.useState)("default");
	(0, import_react.useEffect)(() => {
		setPerm(notificationPermission());
	}, []);
	if (perm === "unsupported") return null;
	if (perm === "granted") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-faint",
		children: "Device alerts on for Dark and About to use."
	});
	if (perm === "denied") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-faint",
		children: "Alerts are blocked in this browser."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "ghost",
		size: "sm",
		className: "h-11 px-0 text-muted hover:bg-transparent",
		onClick: async () => {
			const next = await requestNotifications();
			setPerm(next);
			if (next === "granted") toast("Alerts on. This device pings on Dark and About to use.");
			else toast.error("Alerts were not allowed.");
		},
		children: "Notify this device"
	});
}
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
function confirmerInvite(email, origin) {
	return [
		"I'm standing a 90-minute check-in on BELAY.",
		`Sign in as ${email} and open Confirm.`,
		"Tap Received only if I am here.",
		"",
		`${origin}/confirm`
	].join("\n");
}
function backupDarkInvite(task, origin) {
	return [
		"A BELAY block went Dark. They went silent — no tap, no Received.",
		`Task: ${task}`,
		"This does not count. Please check on them.",
		"",
		origin
	].join("\n");
}
//#endregion
export { copyText as i, backupDarkInvite as n, confirmerInvite as r, DeviceAlerts as t };
