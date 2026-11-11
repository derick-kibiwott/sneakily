import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Area } from "@/lib/creators";
import { SectionHeader } from "./home-bits";

// Full class strings so Tailwind can see them. Spans are the same at every
// breakpoint: Boma is the 2x2 feature tile, the rest tessellate in 2 or 4 columns.
const TILES: Record<string, { color: string; span: string; title: string }> = {
  boma: {
    color: "bg-emerald-300 text-emerald-950",
    span: "col-span-2 row-span-2",
    title: "text-4xl md:text-5xl",
  },
  "nyeri-view": {
    color: "bg-violet-300 text-violet-950",
    span: "col-span-2",
    title: "text-2xl md:text-3xl",
  },
  kahawa: {
    color: "bg-orange-300 text-orange-950",
    span: "",
    title: "text-xl md:text-2xl",
  },
  westlands: {
    color: "bg-rose-300 text-rose-950",
    span: "",
    title: "text-xl md:text-2xl",
  },
  karen: {
    color: "bg-sky-300 text-sky-950",
    span: "col-span-2",
    title: "text-2xl md:text-3xl",
  },
  roysambu: {
    color: "bg-amber-200 text-amber-950",
    span: "",
    title: "text-xl md:text-2xl",
  },
  kilimani: {
    color: "bg-fuchsia-300 text-fuchsia-950",
    span: "",
    title: "text-xl md:text-2xl",
  },
};

const FALLBACK = {
  color: "bg-zinc-300 text-zinc-950",
  span: "",
  title: "text-xl md:text-2xl",
};

export function AreaBento({ areas }: { areas: Area[] }) {
  return (
    <section aria-labelledby="areas-heading">
      <SectionHeader
        id="areas-heading"
        title="Browse by area"
        description="Find creators close to where you hang out."
        href="/explore"
        cta="All areas"
      />

      <ul className="grid auto-rows-42 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {areas.map((area) => {
          const tile = TILES[area.slug] ?? FALLBACK;
          return (
            <li key={area.slug} className={cn("min-h-0", tile.span)}>
              <Link
                href={`/explore?area=${area.slug}`}
                className={cn(
                  "group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-4xl p-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:p-6",
                  tile.color,
                )}
              >
                {/* Soft decorative disc that swells on hover */}
                <span
                  aria-hidden
                  className="absolute -right-12 -top-12 -z-10 size-48 rounded-full bg-white/30 transition-transform duration-500 group-hover:scale-125 motion-reduce:transition-none"
                />

                <div className="flex items-start justify-between">
                  <MapPin className="size-5 opacity-70" aria-hidden />
                  <span
                    aria-hidden
                    className="grid size-9 place-items-center rounded-4xl bg-black/85 text-white transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>

                <div>
                  <h3
                    className={cn(
                      "font-semibold leading-tight tracking-tight",
                      tile.title,
                    )}
                  >
                    Creators in {area.name}
                  </h3>
                  <p className="mt-1 text-sm opacity-75">
                    {area.creators} creators
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
