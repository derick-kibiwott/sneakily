import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Service } from "@/lib/creators";
import { SectionHeader } from "./home-bits";

// Full class strings so Tailwind can see them. One dot color per service.
const DOTS = [
  "bg-emerald-400",
  "bg-violet-400",
  "bg-orange-400",
  "bg-rose-400",
  "bg-sky-400",
  "bg-fuchsia-400",
];

export function ServiceCategories({ services }: { services: Service[] }) {
  return (
    <section aria-labelledby="services-heading">
      <SectionHeader
        id="services-heading"
        title="Browse by service"
        description="Adults only. Creators choose exactly what they offer and can turn any service off at any time."
        href="/explore"
        cta="All services"
      />

      <ul className="flex flex-wrap gap-3 md:gap-4">
        {services.map((service, i) => (
          <li key={service.slug}>
            <Link
              href={`/explore?service=${service.slug}`}
              className="group flex items-center gap-3 rounded-4xl border bg-card py-3 pl-5 pr-3 text-lg font-medium outline-none transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-xl"
            >
              <span
                aria-hidden
                className={`size-2.5 rounded-4xl ${DOTS[i % DOTS.length]}`}
              />
              {service.label}
              <span className="text-sm font-normal text-muted-foreground">
                {service.creators} creators
              </span>
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-4xl bg-foreground text-background transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
              >
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
