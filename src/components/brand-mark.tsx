import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className="size-5 shrink-0"
        aria-hidden
      >
        <rect width="32" height="32" rx="4" fill="currentColor" className="text-fg" />
        <path
          fill="var(--color-bg)"
          fillRule="evenodd"
          d="M8 7h9.4c2.7 0 4.9 2.1 4.9 4.7 0 1.54-.77 2.9-1.95 3.73C21.6 16.3 22.6 17.8 22.6 19.6 22.6 22.4 20.2 24.8 17.2 24.8H8V7Zm3.7 2.8v3.7h5c1.08 0 1.95-.82 1.95-1.85S17.78 9.8 16.7 9.8h-5Zm0 7.5v4.5h5.3c1.24 0 2.25-.96 2.25-2.25s-1.01-2.25-2.25-2.25h-5.3Z"
        />
        <rect x="23.4" y="23.4" width="4.4" height="4.4" rx="0.7" fill="var(--color-accent)" />
      </svg>
      <span className="text-sm font-semibold tracking-tight text-fg">BELAY</span>
    </span>
  );
}
