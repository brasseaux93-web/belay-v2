import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as formatCountdown, c as isPaused, d as untilStartMs, o as formatWhen, u as remainingMs } from "./clock-lJOQZewq.mjs";
import { n as Button, r as cn } from "./button-DBc0JaQC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as clientAction, c as listLabel, f as startBlock, i as StatusPip, n as PageHeader, p as useBlocks, r as Panel, t as AppShell, u as pipTone } from "./use-blocks-CUueKd6d.mjs";
import { i as copyText, n as backupDarkInvite, r as confirmerInvite, t as DeviceAlerts } from "./copy-snC86qsH.mjs";
import { t as Input } from "./input-BjhGrGNh.mjs";
import { t as MetricRow } from "./metric-row-Mssubqvm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-QwmqhVk8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	accent: "var(--color-accent)",
	ok: "var(--color-ok)",
	warn: "var(--color-warn)",
	bad: "var(--color-bad)",
	muted: "var(--color-faint)"
};
var GLOW = {
	accent: "ring-glow",
	ok: "ring-glow-ok",
	warn: "ring-glow-warn",
	bad: "ring-glow-bad",
	muted: "ring-glow"
};
function CountdownRing({ remaining, total, tone, children }) {
	const r = 54;
	const c = 2 * Math.PI * r;
	const offset = c * (1 - (total <= 0 ? 0 : Math.min(1, Math.max(0, remaining / total))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto size-52 sm:size-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute inset-8 rounded-full blur-2xl", GLOW[tone]) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 120 120",
				className: "relative size-full -rotate-90",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r,
					fill: "none",
					stroke: "var(--color-border)",
					strokeWidth: "2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "60",
					cy: "60",
					r,
					fill: "none",
					stroke: TONE[tone],
					strokeWidth: "2.5",
					strokeLinecap: "round",
					strokeDasharray: c,
					strokeDashoffset: offset,
					className: "ring-progress"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center",
				children
			})
		]
	});
}
var STEPS = [
	{
		n: "1",
		t: "Start 90 minutes",
		d: "Name one small task, who confirms, and an optional backup. Leave start empty to begin now."
	},
	{
		n: "2",
		t: "You claim",
		d: "Showed up, or used but here. A claim is not the result."
	},
	{
		n: "3",
		t: "They tap Received",
		d: "Only that settles the block. Closed until a scheduled start goes live."
	},
	{
		n: "4",
		t: "About to use",
		d: "A 10-minute pause. This device can ping. A finished small task still counts."
	},
	{
		n: "5",
		t: "Silent expiry is Dark",
		d: "No tap, no proof. It does not count. Copy the backup so someone checks on you."
	}
];
function ProtocolGuide() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "panel rounded-lg border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "cursor-pointer list-none px-5 py-3.5 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center justify-between gap-3",
				children: ["How a block works", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tracking-wide text-muted",
					children: "Protocol"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "border-t border-border px-5 py-4",
			children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 py-2 first:pt-0 last:pb-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 font-mono text-xs text-accent tabular-nums",
					children: step.n
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: step.t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs leading-relaxed text-muted",
					children: step.d
				})] })]
			}, step.n))
		})]
	});
}
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientHome, {}) });
}
function tapeStats(blocks) {
	const cutoff = Date.now() - 12096e5;
	const rows = blocks.filter((b) => b.startTime >= cutoff);
	const received = rows.filter((b) => b.receivedAt);
	const hours = received.reduce((s, b) => s + b.durationMinutes, 0) / 60;
	const dark = rows.filter((b) => b.status === "dark").length;
	return {
		received: String(received.length),
		hours: hours === 0 ? "0" : hours.toFixed(1),
		dark: String(dark)
	};
}
async function copyInvite(email) {
	if (await copyText(confirmerInvite(email, window.location.origin))) toast("Invite copied. Send it to the confirmer.");
	else toast.error("Could not copy");
}
async function copyBackup(block) {
	if (await copyText(backupDarkInvite(block.task, window.location.origin))) toast("Backup note copied. Send it now.");
	else toast.error("Could not copy");
}
function toLocalInput(ms) {
	const d = new Date(ms);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function EmailChips({ emails, onPick }) {
	if (emails.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-1.5",
		children: emails.map((email) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onPick(email),
			className: "rounded-sm border border-border bg-bg px-2 py-1 font-mono text-xs text-muted hover:border-border-strong hover:text-fg",
			children: email
		}, email))
	});
}
function DarkBanner({ block }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-4 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-medium tracking-widest text-bad uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPip, { tone: "bad" }), "Dark"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-fg",
				children: block.task
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: "Silent expiry. No tap, no Received. This block does not count."
			}),
			block.backupEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-muted",
					children: block.backupEmail
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "mt-3 h-11 w-full",
					onClick: () => void copyBackup(block),
					children: "Copy backup note"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-faint",
				children: "Name a backup on the next block so someone is copied if this happens again."
			})
		]
	});
}
function ClientHome() {
	const { active, blocks, lastDark, recentConfirmers, recentBackups, now, loading, error, refresh, setBlocks, user } = useBlocks();
	const [task, setTask] = (0, import_react.useState)("");
	const [confirmer, setConfirmer] = (0, import_react.useState)("");
	const [backup, setBackup] = (0, import_react.useState)("");
	const [startLocal, setStartLocal] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user?.primaryEmail && !confirmer) setConfirmer(user.primaryEmail);
	}, [user, confirmer]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-lg border border-border bg-surface" });
	const stats = tapeStats(blocks);
	async function runAction(action) {
		if (!active) return;
		setBusy(true);
		try {
			const next = await clientAction({ data: {
				blockId: active.id,
				action
			} });
			setBlocks((prev) => prev.map((b) => b.id === next.id ? next : b));
			if (action === "showed_up") toast("Claimed: showed up. Waiting on Received.");
			if (action === "used_but_here") toast("Claimed: used but here. Waiting on Received.");
			if (action === "missed") toast("Marked missed.");
			if (action === "about_to_use") toast("10-minute pause. Confirmer was notified.");
			if (action === "missed") await refresh();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Action failed");
		} finally {
			setBusy(false);
		}
	}
	if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Home",
			title: "Stand the next 90 minutes",
			description: "One small task. One confirmer. Showing up is the point. A slip does not reset you."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricRow, { items: [
				{
					label: "Received",
					value: stats.received,
					tone: "ok"
				},
				{
					label: "Hours",
					value: stats.hours
				},
				{
					label: "Dark",
					value: stats.dark,
					tone: stats.dark === "0" ? "fg" : "bad"
				}
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceAlerts, {})
		}),
		lastDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkBanner, { block: lastDark }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "New block"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-bad",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 flex flex-col gap-3",
					onSubmit: async (e) => {
						e.preventDefault();
						if (!task.trim() || !confirmer.trim()) return;
						const startAt = startLocal ? new Date(startLocal).getTime() : void 0;
						if (startAt != null && Number.isNaN(startAt)) {
							toast.error("Start time is not valid.");
							return;
						}
						setBusy(true);
						try {
							const block = await startBlock({ data: {
								task: task.trim(),
								confirmerEmail: confirmer.trim(),
								backupEmail: backup.trim() || void 0,
								startAt
							} });
							setBlocks((prev) => [block, ...prev.filter((b) => b.id !== block.id)]);
							setTask("");
							setStartLocal("");
							if (block.status === "scheduled") toast(`Block scheduled. Clock starts ${formatWhen(block.startTime)}.`);
							else toast("Block live. Clock is running.");
						} catch (err) {
							toast.error(err instanceof Error ? err.message : "Could not start");
						} finally {
							setBusy(false);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Task"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "task",
								placeholder: "Eat. Water. Sit in the lobby.",
								value: task,
								onChange: (e) => setTask(e.target.value),
								maxLength: 160,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Confirmer email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "confirmer",
								placeholder: "person@desk.org",
								type: "email",
								value: confirmer,
								onChange: (e) => setConfirmer(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailChips, {
							emails: recentConfirmers,
							onPick: setConfirmer
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Backup email — on Dark"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "backup",
								placeholder: "optional",
								type: "email",
								value: backup,
								onChange: (e) => setBackup(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmailChips, {
							emails: recentBackups,
							onPick: setBackup
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "Start at — empty is now"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "start-at",
								type: "datetime-local",
								min: toLocalInput(Date.now()),
								value: startLocal,
								onChange: (e) => setStartLocal(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-faint",
							children: "Use your own email to confirm on this device. A second person signs in on Confirm. Backup is copied only if the block goes Dark."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Starting…" : startLocal ? "Schedule" : "Start"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProtocolGuide, {})
		})
	] });
	const scheduled = active.status === "scheduled" || now < active.startTime;
	const remaining = scheduled ? untilStartMs(active, now) : remainingMs(active, now);
	const total = scheduled ? Math.max(untilStartMs(active, now), 1) : active.durationMinutes * 60 * 1e3;
	const paused = isPaused(active, now);
	const label = listLabel(active);
	const pauseLeft = paused && active.pauseUntil ? Math.max(0, active.pauseUntil - now) : 0;
	const missed = active.status === "missed";
	const tone = scheduled ? "muted" : paused ? "warn" : missed ? "bad" : active.claim ? "ok" : "accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Home",
			title: scheduled ? "Scheduled block" : "Live block",
			description: scheduled ? `Clock starts ${formatWhen(active.startTime)}. Received is closed until then.` : "A claim is not the result. Only Received from the confirmer settles the block.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs tracking-wide text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPip, {
					tone: pipTone(label),
					pulse: label === "Live"
				}), label]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceAlerts, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			live: !scheduled && !missed,
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPip, {
							tone: pipTone(label),
							pulse: label === "Live"
						}), label]
					}), paused ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs tracking-wide text-warn tabular-nums",
						children: ["Pause ", formatCountdown(pauseLeft)]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownRing, {
					remaining,
					total,
					tone,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-4xl font-medium tracking-tight tabular-nums text-fg sm:text-5xl",
							children: formatCountdown(remaining)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs tracking-wide text-muted",
							children: scheduled ? "until start" : "90-minute window"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-base text-fg",
					children: active.task
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center font-mono text-xs text-muted",
					children: active.confirmerEmail
				}),
				active.backupEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-center font-mono text-xs text-faint",
					children: ["Backup ", active.backupEmail]
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-bad",
					children: error
				}) : null,
				scheduled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted",
						children: "Claims stay closed until the window starts."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-11 w-full",
						onClick: () => void copyInvite(active.confirmerEmail),
						children: "Copy confirmer invite"
					})]
				}) : missed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-sm text-muted",
					children: "This block was missed. The window stays open until the clock hits zero."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy,
							onClick: () => void runAction("showed_up"),
							children: "I showed up"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							disabled: busy,
							onClick: () => void runAction("used_but_here"),
							children: "Used but I am here"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-11 w-full",
								disabled: busy,
								onClick: () => void runAction("missed"),
								children: "Missed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-11 w-full",
								disabled: busy || paused,
								onClick: () => void runAction("about_to_use"),
								children: "About to use"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "h-11 w-full",
							onClick: () => void copyInvite(active.confirmerEmail),
							children: "Copy confirmer invite"
						})
					]
				})
			]
		})
	] });
}
//#endregion
export { HomePage as component };
