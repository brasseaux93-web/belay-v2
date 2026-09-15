import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-faint transition-[border-color] duration-150 focus:border-accent disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
