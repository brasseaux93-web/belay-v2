/**
 * Registers the BELAY service worker (`/sw.js`) on the window `load` event.
 *
 * Safe to call during SSR — bails out immediately when `window` is undefined
 * or `serviceWorker` is not in `navigator`.
 */
export function registerSW(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      // Non-fatal — the app still works without a service worker.
      console.warn("[SW] Registration failed:", err);
    });
  });
}
