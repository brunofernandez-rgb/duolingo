import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const duoButton = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-2xl border-b-4 px-5 text-sm font-extrabold uppercase tracking-wide transition-all active:translate-y-[3px] active:border-b-0 active:mb-[3px] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary-shadow text-primary-foreground hover:brightness-105",
        gold: "bg-gold border-gold-shadow text-foreground hover:brightness-105",
        success: "bg-success border-success/70 text-success-foreground hover:brightness-105",
        danger:
          "bg-destructive border-destructive-shadow text-destructive-foreground hover:brightness-105",
        outline:
          "border-2 border-b-4 border-border bg-card text-primary hover:bg-primary-soft",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        locked: "bg-secondary border-border text-muted-foreground",
      },
      size: {
        sm: "h-9 text-xs px-4",
        md: "h-12",
        lg: "h-14 text-base px-8",
        icon: "h-12 w-12 px-0",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface DuoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof duoButton> {}

export function DuoButton({ className, variant, size, block, ...props }: DuoButtonProps) {
  return <button className={cn(duoButton({ variant, size, block }), className)} {...props} />;
}

export { duoButton };
