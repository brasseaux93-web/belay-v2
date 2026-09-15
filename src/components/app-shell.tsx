import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutList, Radio, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { AppUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Home", icon: Timer },
  { to: "/confirm", label: "Confirm", icon: Radio },
  { to: "/tape", label: "History", icon: LayoutList },
] as const;

function PendingScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="relative rounded-lg border border-border bg-surface px-6 py-5">
        <BrandMark />
        <p className="mt-3 text-sm text-muted">One second</p>
      </div>
    </div>
  );
}

const navClass = (active: boolean) =>
  cn(
    "flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
    active
      ? "bg-surface-2 text-fg"
      : "text-muted hover:bg-bg hover:text-fg",
  );

const mobileNavClass = (active: boolean) =>
  cn(
    "flex min-h-11 w-full flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium tracking-wide",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
    active ? "text-fg" : "text-muted hover:text-fg",
  );

function ShellInner({ children, user }: { children: ReactNode; user: AppUser }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="pointer-events-none absolute inset-0 bg-grid" />

      <aside className="bg-sidebar fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border md:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <BrandMark />
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => void navigate({ to: item.to })}
                className={navClass(active)}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-1 pb-2 font-mono text-xs text-muted">
            {user.primaryEmail}
          </p>
          <UserButton />
        </div>
      </aside>

      <header className="no-print sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 md:hidden">
        <BrandMark />
        <UserButton />
      </header>

      <main className="relative z-10 md:pl-60">
        <div className="mx-auto w-full max-w-xl px-4 py-6 pb-28 md:py-10">{children}</div>
      </main>

      <nav className="no-print panel fixed inset-x-3 bottom-3 z-20 rounded-lg border border-border pb-[env(safe-area-inset-bottom)] md:hidden">
        <div className="grid grid-cols-3">
          {NAV.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => void navigate({ to: item.to })}
                className={mobileNavClass(active)}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "!bg-surface-2 !border-border !text-fg !text-sm",
        }}
      />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <PendingScreen />;
  if (!user) return <RedirectToSignIn />;
  return <ShellInner user={user}>{children}</ShellInner>;
}
