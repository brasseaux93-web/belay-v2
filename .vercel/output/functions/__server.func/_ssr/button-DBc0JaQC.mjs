import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-B40BzJxt.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DBc0JaQC.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-5 shrink-0",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: "32",
					height: "32",
					rx: "4",
					fill: "currentColor",
					className: "text-fg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "var(--color-bg)",
					fillRule: "evenodd",
					d: "M8 7h9.4c2.7 0 4.9 2.1 4.9 4.7 0 1.54-.77 2.9-1.95 3.73C21.6 16.3 22.6 17.8 22.6 19.6 22.6 22.4 20.2 24.8 17.2 24.8H8V7Zm3.7 2.8v3.7h5c1.08 0 1.95-.82 1.95-1.85S17.78 9.8 16.7 9.8h-5Zm0 7.5v4.5h5.3c1.24 0 2.25-.96 2.25-2.25s-1.01-2.25-2.25-2.25h-5.3Z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "23.4",
					y: "23.4",
					width: "4.4",
					height: "4.4",
					rx: "0.7",
					fill: "var(--color-accent)"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold tracking-tight text-fg",
			children: "BELAY"
		})]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,background-color,transform,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96] select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent", {
	variants: {
		variant: {
			primary: "bg-fg text-bg hover:opacity-90",
			secondary: "border border-border bg-surface text-fg hover:bg-surface-2",
			ghost: "text-muted hover:text-fg hover:bg-surface-2",
			danger: "border border-bad/40 text-bad hover:bg-bad/10"
		},
		size: {
			lg: "h-13 w-full rounded-md text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			sm: "h-9 rounded-sm px-3 text-xs tracking-wide"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "lg"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { useCurrentUserState as a, useCurrentUser as i, Button as n, cn as r, BrandMark as t };
