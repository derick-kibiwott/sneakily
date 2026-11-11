import Link from "next/link";

import { getServiceLabel } from "@/lib/creators";
import type { CreatorProfile } from "@/lib/profiles";

const DOTS = [
  "bg-emerald-400",
  "bg-violet-400",
  "bg-orange-400",
  "bg-rose-400",
  "bg-sky-400",
  "bg-fuchsia-400",
];

export function StylesSection({ profile: p }: { profile: CreatorProfile }) {
  return (
    <section aria-labelledby="styles-heading">
      <h2
        id="styles-heading"
        className="text-2xl font-semibold tracking-tight md:text-3xl"
      >
        Styles &amp; specialities
      </h2>
      <p className="mt-2 text-muted-foreground">
        Everything {p.handle} offers. Creators choose what appears here.
      </p>

      <h3 className="mb-3 mt-6 text-sm font-semibold">Styles</h3>
      <ul className="flex flex-wrap gap-3">
        {p.services.map((slug, i) => (
          <li key={slug}>
            <Link
              href={`/explore?service=${slug}`}
              className="flex items-center gap-2.5 rounded-full border bg-card px-4 py-2.5 text-base font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <span
                aria-hidden
                className={`size-2.5 rounded-full ${DOTS[i % DOTS.length]}`}
              />
              {getServiceLabel(slug)}
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="mb-3 mt-6 text-sm font-semibold">Personality</h3>
      <ul className="flex flex-wrap gap-2">
        {p.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-muted px-3.5 py-1.5 text-sm font-medium"
          >
            {tag}
          </li>
        ))}
      </ul>
    </section>
  );
}
