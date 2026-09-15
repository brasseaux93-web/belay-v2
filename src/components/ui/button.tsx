import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,background-color,transform,color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96] select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:opacity-90",
        secondary: "border border-border bg-surface text-fg hover:bg-surface-2",
        ghost: "text-muted hover:text-fg hover:bg-surface-2",
        danger: "border border-bad/40 text-bad hover:bg-bad/10",
      },
      size: {
        lg: "h-13 w-full rounded-md text-sm",
        md: "h-11 rounded-md px-4 text-sm",
        sm: "h-9 rounded-sm px-3 text-xs tracking-wide",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
