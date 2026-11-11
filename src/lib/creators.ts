// Mock data. Replace these helpers with real database queries.
import { RATING_OPTIONS, type CreatorFilters } from "./explore-filters";

export type Creator = {
  id: string;
  handle: string;
  area: string;
  rating: number;
  reviews: number;
  tags: string[];
  services: string[]; // service slugs
  latestReview: string;
};

export type Area = { slug: string; name: string; creators: number };
export type Service = { slug: string; label: string; creators: number };

export const AREAS: Area[] = [
  { slug: "boma", name: "Boma", creators: 128 },
  { slug: "nyeri-view", name: "Nyeri View", creators: 96 },
  { slug: "kahawa", name: "Kahawa", creators: 74 },
  { slug: "westlands", name: "Westlands", creators: 61 },
  { slug: "karen", name: "Karen", creators: 48 },
  { slug: "roysambu", name: "Roysambu", creators: 39 },
  { slug: "kilimani", name: "Kilimani", creators: 52 },
];

/* Creators opt in to each service they offer. Labels stay short and
   non-graphic; extra detail can sit behind an 18+ confirmation. */
export const SERVICES: Service[] = [
  { slug: "bj", label: "BJ", creators: 84 },
  { slug: "bdsm", label: "BDSM", creators: 57 },
  { slug: "massage", label: "Massage", creators: 71 },
  { slug: "roleplay", label: "Roleplay", creators: 46 },
  { slug: "companionship", label: "Companionship", creators: 119 },
  { slug: "couples", label: "Couples", creators: 23 },
];

export const CREATORS: Creator[] = [
  {
    id: "velvetmoon",
    handle: "VelvetMoon",
    area: "Boma",
    rating: 4.9,
    reviews: 312,
    tags: ["Witty", "Great listener"],
    services: ["companionship", "massage", "roleplay"],
    latestReview:
      "Easy to talk to and genuinely funny. The plans were exactly as promised.",
  },
  {
    id: "nightjasmine",
    handle: "NightJasmine",
    area: "Nyeri View",
    rating: 4.5,
    reviews: 305,
    tags: ["Warm", "Spontaneous"],
    services: ["bj", "companionship"],
    latestReview:
      "Lots of personality and zero awkward silences. Would happily meet again.",
  },
  {
    id: "quietstorm",
    handle: "QuietStorm",
    area: "Nyeri View",
    rating: 4.7,
    reviews: 268,
    tags: ["Calm", "Thoughtful"],
    services: ["massage", "companionship"],
    latestReview:
      "Calm energy and great conversation. I felt comfortable from start to finish.",
  },
  {
    id: "goldenhour",
    handle: "GoldenHour",
    area: "Kahawa",
    rating: 4.8,
    reviews: 231,
    tags: ["Adventurous", "Punctual"],
    services: ["bdsm", "roleplay", "couples"],
    latestReview: "Showed up on time and kept the whole evening easy and fun.",
  },
  {
    id: "silkywit",
    handle: "SilkyWit",
    area: "Westlands",
    rating: 4.6,
    reviews: 190,
    tags: ["Sharp", "Playful"],
    services: ["roleplay", "companionship"],
    latestReview:
      "Quick humour and kind with it. Honest about what they were looking for.",
  },
  {
    id: "amberdusk",
    handle: "AmberDusk",
    area: "Kahawa",
    rating: 4.7,
    reviews: 160,
    tags: ["Confident", "Kind"],
    services: ["bj", "bdsm"],
    latestReview:
      "Clear boundaries and great communication before and during. Felt very safe.",
  },
  {
    id: "bluelagoon",
    handle: "BlueLagoon",
    area: "Boma",
    rating: 4.9,
    reviews: 142,
    tags: ["Genuine", "Chill"],
    services: ["massage", "couples"],
    latestReview:
      "Exactly like their profile. Relaxed, respectful and a lot of fun.",
  },
  {
    id: "silverfox",
    handle: "SilverFox",
    area: "Roysambu",
    rating: 4.4,
    reviews: 120,
    tags: ["Charming", "Direct"],
    services: ["companionship", "bj"],
    latestReview: "Charming and straightforward. No games, just good company.",
  },
  {
    id: "sunnydelight",
    handle: "SunnyDelight",
    area: "Kilimani",
    rating: 4.8,
    reviews: 87,
    tags: ["Cheerful", "Curious"],
    services: ["companionship", "massage"],
    latestReview:
      "Made the whole afternoon feel effortless. Great questions, great laugh.",
  },
  {
    id: "papermoon",
    handle: "PaperMoon",
    area: "Westlands",
    rating: 4.6,
    reviews: 64,
    tags: ["Gentle", "Creative"],
    services: ["roleplay", "massage"],
    latestReview:
      "Creative, patient and easy to be around. I left in a great mood.",
  },
  {
    id: "coastalbreeze",
    handle: "CoastalBreeze",
    area: "Kilimani",
    rating: 4.3,
    reviews: 38,
    tags: ["Easygoing", "Funny"],
    services: ["couples", "companionship"],
    latestReview:
      "Easygoing and fun. Slightly late, but communicated the whole way.",
  },
  {
    id: "midnightpoet",
    handle: "MidnightPoet",
    area: "Karen",
    rating: 5.0,
    reviews: 24,
    tags: ["Romantic", "Honest"],
    services: ["companionship", "bdsm"],
    latestReview:
      "Thoughtful, kind and refreshingly direct. Easily the best date I’ve had.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Queries                                                                   */
/* -------------------------------------------------------------------------- */

const areaSlugOf = (name: string) =>
  AREAS.find((a) => a.name === name)?.slug ?? "";

export const getServiceLabel = (slug: string) =>
  SERVICES.find((s) => s.slug === slug)?.label ?? slug;

/** Most reviews first. */
export function getPopularCreators(limit = 4): Creator[] {
  return [...CREATORS].sort((a, b) => b.reviews - a.reviews).slice(0, limit);
}

/**
 * Homepage ranking: highest rating first. A minimum review count keeps a
 * brand-new profile with one 5-star review from outranking everyone.
 */
const MIN_REVIEWS_FOR_RANKING = 20;

export function getTopRatedCreators(limit = 5): Creator[] {
  return CREATORS.filter((c) => c.reviews >= MIN_REVIEWS_FOR_RANKING)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, limit);
}

/** Bayesian average: pulls low-review profiles toward the site average. */
const PRIOR_RATING = 4.2;
const PRIOR_WEIGHT = 10;
const weighted = (c: Creator) =>
  (c.rating * c.reviews + PRIOR_RATING * PRIOR_WEIGHT) /
  (c.reviews + PRIOR_WEIGHT);

type SearchParams = Record<string, string | string[] | undefined>;
const toArray = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

/** Reads and validates ?area=&service=&rating=&sort= from the URL. */
export function parseFilters(sp: SearchParams): CreatorFilters {
  const rating = Number(toArray(sp.rating)[0]);
  return {
    areas: toArray(sp.area).filter((s) => AREAS.some((a) => a.slug === s)),
    services: toArray(sp.service).filter((s) =>
      SERVICES.some((x) => x.slug === s),
    ),
    minRating: RATING_OPTIONS.some((o) => o.value === rating) ? rating : 0,
    sort: toArray(sp.sort)[0] === "rating" ? "rating" : "popular",
  };
}

/** Within a group it's "any of" (Boma or Kahawa); across groups it's "and". */
export function queryCreators(f: CreatorFilters): Creator[] {
  return CREATORS.filter((c) => {
    if (f.areas.length && !f.areas.includes(areaSlugOf(c.area))) return false;
    if (f.services.length && !f.services.some((s) => c.services.includes(s)))
      return false;
    return c.rating >= f.minRating;
  }).sort((a, b) =>
    f.sort === "rating" ? weighted(b) - weighted(a) : b.reviews - a.reviews,
  );
}
