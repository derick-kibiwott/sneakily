import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AREAS, SERVICES, parseFilters, queryCreators } from "@/lib/creators";
import { CreatorCard } from "@/components/common/creator-card";
import { ExploreToolbar } from "@/components/explore/explore-toolbar";

export const metadata: Metadata = { title: "Explore creators" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const creators = queryCreators(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 lg:px-6">
      <header className="pb-8 pt-10 md:pb-10 md:pt-16">
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
          Explore creators
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
          Read what people say, compare ratings and find someone worth a
          conversation.
        </p>
      </header>

      <ExploreToolbar filters={filters} areas={AREAS} services={SERVICES} />

      <p aria-live="polite" className="mb-5 mt-6 text-sm text-muted-foreground">
        {creators.length} {creators.length === 1 ? "creator" : "creators"}
      </p>

      {creators.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {creators.map((c) => (
            <li key={c.id}>
              <CreatorCard creator={c} showServices />
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid place-items-center gap-4 rounded-4xl border border-dashed px-6 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-muted">
            <SearchX className="size-6" aria-hidden />
          </span>
          <div>
            <h2 className="text-xl font-semibold">No creators match</h2>
            <p className="mt-1 text-muted-foreground">
              Try removing a filter or widening your area.
            </p>
          </div>
          <Button
            variant={"outline"}
            size={"lg"}
            nativeButton={false}
            render={<Link href="/explore" />}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </main>
  );
}
