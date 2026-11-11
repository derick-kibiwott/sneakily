import Link from "next/link";
import { Flag } from "lucide-react";

import type { CreatorProfile, Review } from "@/lib/profiles";
import { Orb, Rating } from "@/components/home/home-bits";
import { Stars } from "./stars";
import { ReviewForm } from "./review-form";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function ReviewsSection({
  profile: p,
  reviews,
}: {
  profile: CreatorProfile;
  reviews: Review[];
}) {
  return (
    <section aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="reviews-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Reviews
        </h2>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Rating
            rating={p.rating}
            reviews={p.reviews}
            className="text-base text-foreground"
          />
          from {p.reviews} reviews
        </p>
      </div>

      <ol className="mt-6 divide-y">
        {reviews.map((r) => (
          <li key={r.id} className="py-6 first:pt-0">
            <article>
              <header className="flex items-center gap-3">
                <Orb seed={`reviewer-${r.id}`} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Anonymous</p>
                  <time
                    dateTime={r.createdAt}
                    className="text-xs text-muted-foreground"
                  >
                    {fmt(r.createdAt)}
                  </time>
                </div>
                <Stars value={r.rating} />
              </header>

              <p className="mt-3 leading-relaxed">{r.body}</p>

              {r.reply && (
                <div
                  role="group"
                  aria-label={`Reply from ${p.handle}`}
                  className="ml-3 mt-4 flex gap-3 border-l-2 pl-4 md:ml-12"
                >
                  <Orb seed={p.handle} className="size-7" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {p.handle}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                        Creator
                      </span>
                      <time
                        dateTime={r.reply.createdAt}
                        className="text-xs font-normal text-muted-foreground"
                      >
                        {fmt(r.reply.createdAt)}
                      </time>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {r.reply.body}
                    </p>
                  </div>
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>

      <p className="mt-2 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        Showing the latest {reviews.length} of {p.reviews} reviews.
        <Link
          href={`/report?creator=${p.id}`}
          className="inline-flex items-center gap-1.5 rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <Flag className="size-3.5" aria-hidden />
          Report this profile
        </Link>
      </p>

      <div className="mt-8">
        <ReviewForm creatorId={p.id} handle={p.handle} />
      </div>
    </section>
  );
}
