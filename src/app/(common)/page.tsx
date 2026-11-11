import {
  AREAS,
  getPopularCreators,
  getTopRatedCreators,
  SERVICES,
} from "@/lib/creators";
import { Hero } from "@/components/home/hero";
import { PopularCreators } from "@/components/home/popular-creators";
import { TopRated } from "@/components/home/top-rated";
import { AreaBento } from "@/components/home/area-bento";
import { ServiceCategories } from "@/components/home/services-category";

export default function HomePage() {
  const popular = getPopularCreators(4);
  const topRated = getTopRatedCreators(5);

  return (
    <>
      <Hero creators={popular} />
      <PopularCreators creators={popular} />
      <TopRated creators={topRated} />
      <AreaBento areas={AREAS} />
      <ServiceCategories services={SERVICES} />
    </>
  );
}
