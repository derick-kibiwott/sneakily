import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Stars({
  value,
  className,
}: {
  value: number;
  className?: string | undefined;
}) {
  return (
    <span
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={cn("inline-flex gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            "size-4",
            i <= value
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}
