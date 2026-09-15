import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

// Grok broker OAuth only works on *.grok-sandbox.com — hide those buttons
// on production Vercel (they'll fail with "Invalid redirect URI").
const isSandbox =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith(".grok-sandbox.com");
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return (
      <main className="relative grid min-h-dvh place-items-center bg-bg px-4 py-10">
        <div className="pointer-events-none absolute inset-0 bg-mesh" />
        <div className="panel relative w-full max-w-sm rounded-lg border border-border p-6">
          <BrandMark />
          <p className="mt-5 text-sm text-muted">One second</p>
        </div>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  return (
    <main className="relative grid min-h-dvh place-items-center bg-bg px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="panel relative w-full max-w-sm rounded-lg border border-border p-6">
        <BrandMark />
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-fg">
          {mode === "up" ? "Make a login" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {mode === "up"
            ? "Use an email someone else can type in when they check that you showed up."
            : "90 minutes at a time. Someone else has to say they saw you. If they don't, it doesn't count."}
        </p>
        <div className="mt-5 flex flex-col gap-2">
        {authEnabled && isSandbox ? (
            GROK_PROVIDERS.map((p, i) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className={
                  i === 0
                    ? "h-11 w-full rounded-md bg-fg text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-90 active:scale-[0.96]"
                    : "h-11 w-full rounded-md border border-border bg-surface text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface-2 active:scale-[0.96]"
                }
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs tracking-wide text-faint">or email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              if (mode === "up") {
                const res = await authClient.signUp.email({
                  email: email.trim(),
                  password,
                  name: email.trim().split("@")[0] || "BELAY",
                });
                if (res.error) throw new Error(res.error.message || "Could not create account");
              } else {
                const res = await authClient.signIn.email({
                  email: email.trim(),
                  password,
                });
                if (res.error) throw new Error(res.error.message || "Could not sign in");
              }
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not sign in");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Email</span>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Password</span>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "One second…" : mode === "up" ? "Create account" : "Sign in with email"}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 w-full text-center text-xs text-muted hover:text-fg"
          onClick={() => {
            setMode(mode === "up" ? "in" : "up");
            setError(null);
          }}
        >
          {mode === "up" ? "Have an account? Sign in" : "Need an account? Create one"}
        </button>
      </div>
    </main>
  );
}
