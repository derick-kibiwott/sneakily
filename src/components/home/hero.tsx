"use client";

import Link from "next/link";
import { ArrowRight, EyeOff, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Creator } from "@/lib/creators";
import { Orb, Rating } from "./home-bits";

// Position + tilt for each floating card (outer wrapper), so the entrance
// animation on the inner element never fights with the rotation.
const SLOTS = [
  "left-0 top-2 -rotate-6",
  "right-0 top-36 rotate-3",
  "left-12 bottom-0 -rotate-2",
];

export function Hero({ creators }: { creators: Creator[] }) {
  return (
    <section className="grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-16">
      <div>
        <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-tight text-balance md:text-7xl">
          Stop wasting your body count
        </h1>
        <p className="mt-6 max-w-lg text-lg text-muted-foreground text-pretty">
          Creators put themselves out there without showing their face. Read
          what people who’ve met them actually say, then decide who’s worth a
          conversation.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/explore"
            className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}
          >
            Explore creators
            <ArrowRight aria-hidden />
          </Link>
          <Link
            href="/become-a-creator"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 px-6",
            )}
          >
            Become a creator
          </Link>
        </div>

        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <EyeOff className="size-4" aria-hidden />
          Creators stay anonymous. Visitors are never displayed.
        </p>
      </div>

      {/* Decorative preview; the same reviews appear in the sections below */}
      <div aria-hidden className="relative hidden h-[28rem] lg:block">
        {creators.slice(0, 3).map((c, i) => (
          <div key={c.id} className={cn("absolute w-80", SLOTS[i])}>
            <div
              className="animate-in rounded-3xl border bg-card p-5 shadow-xl shadow-foreground/5 duration-700 fade-in slide-in-from-bottom-6 fill-mode-both motion-reduce:animate-none"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-3">
                <Orb seed={c.handle} className="size-10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.handle}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {c.area}
                  </p>
                </div>
                <Rating rating={c.rating} reviews={c.reviews} />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                “{c.latestReview}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
