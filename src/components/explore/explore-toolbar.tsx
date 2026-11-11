import Link from "next/link";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SORT_OPTIONS,
  filtersToHref,
  type CreatorFilters,
} from "@/lib/explore-filters";
import type { Area, Service } from "@/lib/creators";
import { FilterDrawer } from "./filter-drawer";

/** Floating pill toolbar: filter button, removable active filters, sort. */
export function ExploreToolbar({
  filters,
  areas,
  services,
}: {
  filters: CreatorFilters;
  areas: Area[];
  services: Service[];
}) {
  const chips = [
    ...filters.areas.map((slug) => ({
      key: `area-${slug}`,
      label: areas.find((a) => a.slug === slug)?.name ?? slug,
      href: filtersToHref(filters, {
        areas: filters.areas.filter((s) => s !== slug),
      }),
    })),
    ...filters.services.map((slug) => ({
      key: `service-${slug}`,
      label: services.find((s) => s.slug === slug)?.label ?? slug,
      href: filtersToHref(filters, {
        services: filters.services.filter((s) => s !== slug),
      }),
    })),
    ...(filters.minRating
      ? [
          {
            key: "rating",
            label: `${filters.minRating.toFixed(1)}+ rating`,
            href: filtersToHref(filters, { minRating: 0 }),
          },
        ]
      : []),
  ];

  return (
    <div className="sticky top-2 z-30 flex flex-wrap items-center gap-3 rounded-4xl border bg-background/85 p-2 backdrop-blur">
      <FilterDrawer
        filters={filters}
        areas={areas.map((a) => ({
          slug: a.slug,
          label: a.name,
          count: a.creators,
        }))}
        services={services.map((s) => ({
          slug: s.slug,
          label: s.label,
          count: s.creators,
        }))}
      />

      <div
        role="group"
        aria-label="Sort by"
        className="ml-auto inline-flex rounded-4xl border p-1 md:order-last"
      >
        {SORT_OPTIONS.map((o) => {
          const active = filters.sort === o.value;
          return (
            <Link
              key={o.value}
              href={filtersToHref(filters, { sort: o.value })}
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={cn(
                "rounded-4xl px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/40 motion-reduce:transition-none",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o.label}
            </Link>
          );
        })}
      </div>

      {chips.length > 0 && (
        <ul
          aria-label="Active filters"
          className="order-last flex w-full gap-2 overflow-x-auto px-1 pb-1 md:order-none md:w-auto md:min-w-0 md:flex-1 md:pb-0"
        >
          {chips.map((chip) => (
            <li key={chip.key} className="shrink-0">
              <Link
                href={chip.href}
                scroll={false}
                aria-label={`Remove filter: ${chip.label}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted py-1.5 pl-3 pr-2 text-sm font-medium outline-none transition-colors hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                {chip.label}
                <X className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
          {chips.length > 1 && (
            <li className="shrink-0">
              <Link
                href={filtersToHref(filters, {
                  areas: [],
                  services: [],
                  minRating: 0,
                })}
                scroll={false}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                Clear all
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
