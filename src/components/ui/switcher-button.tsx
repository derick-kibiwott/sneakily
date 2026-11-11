"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { Button, type buttonVariants } from "./button";

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

// Icon circle colors per Button variant. The circle always contrasts with the
// button surface it sits on. Typed as a Record so adding a new Button variant
// shows a type error here until you give it a color.
const ICON_STYLES: Record<ButtonVariant, string> = {
  default: "bg-primary-foreground text-primary",
  outline: "bg-foreground text-background",
  secondary: "bg-secondary-foreground text-secondary",
  ghost: "bg-foreground text-background",
  destructive: "bg-destructive text-white",
  link: "bg-primary text-primary-foreground",
};

type SwitcherButtonProps = {
  icon: LucideIcon;
};

export function SwitcherButton({
  className,
  children,
  variant,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Button> & SwitcherButtonProps) {
  return (
    <Button
      className={cn("pl-5 pr-12", className)}
      variant={variant}
      {...props}
    >
      <span className="transition-transform duration-300 ease-out group-hover/button:translate-x-7 group-focus-visible/button:translate-x-7 motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute left-[calc(100%-2.375rem)] top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-4xl transition-[left] duration-300 ease-out group-hover/button:left-1.5 group-focus-visible/button:left-1.5 motion-reduce:transition-none",
          ICON_STYLES[variant ?? "default"],
        )}
      >
        <Icon className="size-3.5" />
      </span>
    </Button>
  );
}
