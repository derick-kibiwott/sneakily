"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Creator } from "@/lib/creators";
import { Orb, Rating } from "./home-bits";
import { SwitcherButton } from "../ui/switcher-button";

/** Dark panel (foreground color) so it matches the navbar pill and breaks up the page. */
export function TopRated({ creators }: { creators: Creator[] }) {
  return (
    <section
      aria-labelledby="top-rated-heading"
      className="grid gap-10 rounded-5xl bg-foreground p-6 text-background md:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
    >
      <div className="flex flex-col items-start justify-between gap-8">
        <div>
          <h2
            id="top-rated-heading"
            className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
          >
            Highly rated
          </h2>
          <p className="mt-3 max-w-sm text-background/70">
            The creators people rate highest. Only profiles with at least 20
            reviews are ranked, so every score has real weight behind it.
          </p>
        </div>
        <SwitcherButton
          icon={ArrowRight}
          size={"lg"}
          variant={"secondary"}
          nativeButton={false}
          render={<Link href="/explore?sort=rating" />}
        >
          See the full ranking
        </SwitcherButton>
      </div>

      <ol className="divide-y divide-background/15">
        {creators.map((c, i) => (
          <li key={c.id} className="py-1 first:pt-0 last:pb-0">
            <Link
              href={`/profile/${c.id}`}
              className="flex items-center gap-4 rounded-3xl px-3 py-3 outline-none transition-colors hover:bg-background/10 focus-visible:ring-2 focus-visible:ring-background/50"
            >
              <span
                aria-hidden
                className="w-6 text-center text-lg font-semibold tabular-nums text-background/50"
              >
                {i + 1}
              </span>
              <Orb seed={c.handle} className="size-11" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{c.handle}</span>
                <span className="flex gap-3 text-sm text-background/60">
                  <span>{c.area}</span>
                  <span>{c.reviews} reviews</span>
                </span>
              </span>
              <Rating
                rating={c.rating}
                reviews={c.reviews}
                className="text-base"
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
