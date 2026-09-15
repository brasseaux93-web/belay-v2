import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { a as useCurrentUserState, n as Button, t as BrandMark } from "./button-DBc0JaQC.mjs";
import { t as GROK_PROVIDERS } from "./server-Bw_9MwRa.mjs";
import { t as Input } from "./input-BjhGrGNh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DJcW-4bt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center bg-bg px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-mesh" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel relative w-full max-w-sm rounded-lg border border-border p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm text-muted",
				children: "Loading session"
			})]
		})]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative grid min-h-dvh place-items-center bg-bg px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-mesh" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-grid" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel relative w-full max-w-sm rounded-lg border border-border p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 text-xl font-semibold tracking-tight text-fg",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "A 90-minute check-in. A second person has to confirm. If nobody confirms, it does not count."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex flex-col gap-2",
						children: GROK_PROVIDERS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => signIn(p.providerId, { callbackURL: "/" }),
							className: i === 0 ? "h-11 w-full rounded-md bg-fg text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-90 active:scale-[0.96]" : "h-11 w-full rounded-md border border-border bg-surface text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2 active:scale-[0.96]",
							children: ["Continue with ", p.label]
						}, p.providerId))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-4 flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-wide text-faint",
								children: "or email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-3",
						onSubmit: async (e) => {
							e.preventDefault();
							setBusy(true);
							setError(null);
							try {
								if (mode === "up") {
									const res = await authClient.signUp.email({
										email: email.trim(),
										password,
										name: email.trim().split("@")[0] || "BELAY"
									});
									if (res.error) throw new Error(res.error.message || "Could not create account");
								} else {
									const res = await authClient.signIn.email({
										email: email.trim(),
										password
									});
									if (res.error) throw new Error(res.error.message || "Could not sign in");
								}
							} catch (err) {
								setError(err instanceof Error ? err.message : "Could not sign in");
							} finally {
								setBusy(false);
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "password",
									type: "password",
									autoComplete: mode === "up" ? "new-password" : "current-password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-bad",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: busy,
								children: busy ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 w-full text-center text-xs text-muted hover:text-fg",
						onClick: () => {
							setMode(mode === "up" ? "in" : "up");
							setError(null);
						},
						children: mode === "up" ? "Have an account? Sign in" : "Need an account? Create one"
					})
				]
			})
		]
	});
}
//#endregion
export { Login as component };
