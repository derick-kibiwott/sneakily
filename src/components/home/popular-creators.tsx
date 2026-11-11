import type { Creator } from "@/lib/creators";
import { CreatorCard } from "@/components/common/creator-card";
import { SectionHeader } from "./home-bits";

export function PopularCreators({ creators }: { creators: Creator[] }) {
  return (
    <section aria-labelledby="popular-heading">
      <SectionHeader
        id="popular-heading"
        title="Popular creators"
        description="The most reviewed profiles, so there’s plenty to read before you reach out."
        href="/explore?sort=popular"
      />

      {/* Swipeable row on phones, grid from md up */}
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {creators.map((c) => (
          <li key={c.id} className="w-[78%] shrink-0 snap-start md:w-auto">
            <CreatorCard creator={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}
