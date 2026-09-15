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
