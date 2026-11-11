"use client";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { SwitcherButton } from "@/components/ui/switcher-button";

function hash(input: string) {
  let h = 0;
  for (const ch of input) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function seedHues(seed: string): [number, number] {
  const h = hash(seed);
  const a = h % 360;
  return [a, (a + 60 + ((h >> 3) % 120)) % 360];
}

/**
 * Creators have no photos. Each one gets a unique abstract orb generated from
 * their handle, so the same creator always looks the same.
 */
export function Orb({
  seed,
  className,
}: {
  seed: string;
  className?: string | undefined;
}) {
  const h = hash(seed);
  const a = h % 360;
  const b = (a + 60 + ((h >> 3) % 120)) % 360;
  return (
    <span
      aria-hidden
      className={cn("block size-12 shrink-0 rounded-full", className)}
      style={{
        backgroundImage: `radial-gradient(circle at 30% 25%, oklch(0.95 0.08 ${a}), transparent 55%), linear-gradient(135deg, oklch(0.75 0.17 ${a}), oklch(0.55 0.2 ${b}))`,
      }}
    />
  );
}

export function Rating({
  rating,
  reviews,
  className,
}: {
  rating: number;
  reviews: number;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold tabular-nums",
        className,
      )}
    >
      <Star aria-hidden className="size-4 fill-amber-400 text-amber-400" />
      {rating.toFixed(1)}
      <span className="sr-only">out of 5 from {reviews} reviews</span>
    </span>
  );
}

export function SectionHeader({
  id,
  title,
  description,
  href,
  cta = "View all",
}: {
  id: string;
  title: string;
  description: string;
  href: string;
  cta?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <h2
          id={id}
          className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          {title}
        </h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>
      <SwitcherButton
        icon={ArrowRight}
        variant={"outline"}
        size={"lg"}
        nativeButton={false}
        render={<Link href={href} />}
      >
        {cta}
      </SwitcherButton>
    </div>
  );
}
