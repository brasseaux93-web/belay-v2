export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function confirmerInvite(email: string, origin: string): string {
  return [
    "I'm doing 90 minutes on BELAY.",
    `Sign in as ${email} and open Confirm.`,
    "Tap Confirm they showed up only if you actually see me.",
    "",
    `${origin}/confirm`,
  ].join("\n");
}

export function backupDarkInvite(task: string, origin: string): string {
  return [
    "They went silent on BELAY. Time ran out and they never checked in.",
    `What they were doing: ${task}`,
    "This one doesn't count. Please check on them.",
    "",
    origin,
  ].join("\n");
}

/**
 * Returns the direct deep-link URL to the confirm screen pre-filtered to
 * a specific block. Send this to the confirmer so they land on the right card.
 */
export function confirmLink(blockId: string, origin: string): string {
  return `${origin}/confirm?block_id=${encodeURIComponent(blockId)}`;
}

/**
 * Shares the confirm deep-link via the Web Share API when available (mobile),
 * otherwise copies it to the clipboard. Always resolves — callers should show
 * a toast indicating success or failure.
 *
 * @returns `"shared"` | `"copied"` | `"failed"`
 */
export async function shareConfirmLink(
  blockId: string,
  origin: string,
): Promise<"shared" | "copied" | "failed"> {
  const url = confirmLink(blockId, origin);
  const text = `I started a 90-minute block on BELAY. Please verify: ${url}`;

  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await navigator.share({ title: "BELAY — please confirm", text, url });
      return "shared";
    } catch (err) {
      // User cancelled the share sheet — don't fall through to clipboard.
      if (err instanceof Error && err.name === "AbortError") return "failed";
    }
  }

  const ok = await copyText(url);
  return ok ? "copied" : "failed";
}
