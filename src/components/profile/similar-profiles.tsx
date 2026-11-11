import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Creator } from "@/lib/creators";
import { CreatorCard } from "@/components/common/creator-card";

export function SimilarProfiles({ creators }: { creators: Creator[] }) {
  return (
    <section aria-labelledby="similar-heading">
      <Carousel opts={{ align: "start", dragFree: true }}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2
              id="similar-heading"
              className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
            >
              Similar profiles
            </h2>
            <p className="mt-2 text-muted-foreground">
              Creators who offer a similar mix of styles.
            </p>
          </div>
          {/* Arrows sit in the header instead of floating over the cards */}
          <div className="flex gap-2">
            <CarouselPrevious className="static size-10 translate-y-0" />
            <CarouselNext className="static size-10 translate-y-0" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {creators.map((c) => (
            <CarouselItem
              key={c.id}
              className="basis-[82%] pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <CreatorCard creator={c} showServices />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
