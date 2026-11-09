import { GeminiLogo } from "@/components/gemini-logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "cn";
import React from "react";

export function GenerateUsernameButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("group inline-flex relative", className)} {...props}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-4xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span className="absolute -inset-full bg-[conic-gradient(from_0deg,transparent_0deg,#4285f4_90deg,#9b72cb_180deg,#d96570_270deg,#ffffff_360deg)] animation-duration-[2s] animate-spin motion-reduce:animate-none" />
      </span>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={"outline"}
              size={"icon-sm"}
              aria-label="Ask AI"
              className="relative m-[3] transition-all duration-300 hover:bg-background group-hover:scale-105 active:scale-95 shadow-sm group-hover:shadow-lg dark:bg-muted dark:hover:bg-muted"
            />
          }
        >
          <GeminiLogo className="size-6 transition-transform duration-700 ease-out group-hover:rotate-180 group-hover:scale-110 motion-reduce:transition-none" />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Generate Anonymous Username
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
