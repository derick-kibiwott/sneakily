// Mock profile data layered on top of the creators list.
// Replace these helpers with real database queries.
import { AREAS, CREATORS, type Creator } from "./creators";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type Availability = {
  status: "available" | "busy" | "away";
  days: string[];
  hours: string;
  note: string;
};

export type CreatorProfile = Creator & {
  bio: string;
  availability: Availability;
  memberSince: string; // YYYY-MM
};

export type Review = {
  id: string;
  rating: number; // 1 to 5
  body: string;
  createdAt: string; // ISO date
  reply?: { body: string; createdAt: string } | undefined;
};

type Extras = Pick<CreatorProfile, "bio" | "availability" | "memberSince">;

const EXTRAS: Record<string, Extras> = {
  velvetmoon: {
    bio: "Part storyteller, part night owl. I like slow evenings, good conversation and people who say what they mean.",
    availability: {
      status: "available",
      days: ["Wed", "Thu", "Fri", "Sat"],
      hours: "6 pm to midnight",
      note: "Usually replies within an hour",
    },
    memberSince: "2025-03",
  },
  nightjasmine: {
    bio: "Warm, spontaneous and always up for a plan. Tell me what you’re into and we’ll take it from there.",
    availability: {
      status: "busy",
      days: ["Thu", "Fri", "Sat", "Sun"],
      hours: "7 pm to 2 am",
      note: "Booked tonight, replying tomorrow",
    },
    memberSince: "2025-01",
  },
  quietstorm: {
    bio: "Calm, thoughtful and a very good listener. I’m happiest when there’s no rush.",
    availability: {
      status: "available",
      days: ["Mon", "Tue", "Fri", "Sat"],
      hours: "5 pm to 11 pm",
      note: "Replies within a few hours",
    },
    memberSince: "2025-02",
  },
  goldenhour: {
    bio: "Adventurous with a soft spot for punctuality. Clear boundaries, big energy.",
    availability: {
      status: "away",
      days: ["Fri", "Sat", "Sun"],
      hours: "Afternoons and evenings",
      note: "Back next week",
    },
    memberSince: "2025-05",
  },
  silkywit: {
    bio: "Sharp humour, playful mind. I’ll keep you laughing and I’ll be honest about what I’m after.",
    availability: {
      status: "available",
      days: ["Tue", "Wed", "Thu", "Sat"],
      hours: "6 pm to 1 am",
      note: "Replies within the day",
    },
    memberSince: "2025-04",
  },
  amberdusk: {
    bio: "Confident and kind. Communication first, always, before anything else.",
    availability: {
      status: "available",
      days: ["Wed", "Fri", "Sat", "Sun"],
      hours: "8 pm to 3 am",
      note: "Usually replies within 2 hours",
    },
    memberSince: "2025-06",
  },
  bluelagoon: {
    bio: "Relaxed and genuine. What you read in my reviews is what you get.",
    availability: {
      status: "available",
      days: ["Mon", "Wed", "Thu", "Sun"],
      hours: "4 pm to 10 pm",
      note: "Usually replies within an hour",
    },
    memberSince: "2025-02",
  },
  silverfox: {
    bio: "Charming, direct and good company. No games, just an easy evening.",
    availability: {
      status: "busy",
      days: ["Fri", "Sat"],
      hours: "8 pm to 2 am",
      note: "Weekends only",
    },
    memberSince: "2025-07",
  },
  sunnydelight: {
    bio: "Cheerful, curious and full of questions. I make afternoons feel easy.",
    availability: {
      status: "available",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      hours: "12 pm to 6 pm",
      note: "Replies within an hour",
    },
    memberSince: "2025-08",
  },
  papermoon: {
    bio: "Gentle, creative and patient. I like building something slowly.",
    availability: {
      status: "away",
      days: ["Thu", "Fri", "Sat"],
      hours: "6 pm to midnight",
      note: "On a short break",
    },
    memberSince: "2025-08",
  },
  coastalbreeze: {
    bio: "Easygoing and funny. I run a little late sometimes, but I always say so first.",
    availability: {
      status: "available",
      days: ["Fri", "Sat", "Sun"],
      hours: "3 pm to 11 pm",
      note: "Replies within the day",
    },
    memberSince: "2025-09",
  },
  midnightpoet: {
    bio: "Romantic, honest and refreshingly direct. New here, but already well reviewed.",
    availability: {
      status: "available",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      hours: "9 pm to 4 am",
      note: "Replies within an hour",
    },
    memberSince: "2026-09",
  },
};

const REVIEWS: Record<string, Review[]> = {
  velvetmoon: [
    {
      id: "vm-1",
      rating: 5,
      body: "Easy to talk to and genuinely funny. The plans were exactly as promised.",
      createdAt: "2026-11-02",
      reply: {
        body: "That means a lot, thank you. It was a lovely evening!",
        createdAt: "2026-11-03",
      },
    },
    {
      id: "vm-2",
      rating: 5,
      body: "Warm, attentive and completely themselves. I’d recommend without hesitation.",
      createdAt: "2026-10-21",
    },
    {
      id: "vm-3",
      rating: 4,
      body: "Great conversation. We ran a bit late but they kept me updated the whole way.",
      createdAt: "2026-10-05",
      reply: {
        body: "Thanks for the patience, and sorry about the delay. I’ll plan the timing better.",
        createdAt: "2026-10-06",
      },
    },
    {
      id: "vm-4",
      rating: 5,
      body: "Felt comfortable from the first message. Clear, kind and fun.",
      createdAt: "2026-09-18",
    },
  ],
  quietstorm: [
    {
      id: "qs-1",
      rating: 5,
      body: "Calm energy and great conversation. I felt comfortable from start to finish.",
      createdAt: "2026-10-30",
      reply: {
        body: "Thank you. I’m glad you felt at ease.",
        createdAt: "2026-10-31",
      },
    },
    {
      id: "qs-2",
      rating: 4,
      body: "Thoughtful and respectful. A little quiet at first but warmed up quickly.",
      createdAt: "2026-10-12",
    },
    {
      id: "qs-3",
      rating: 5,
      body: "Exactly as described. Would meet again.",
      createdAt: "2026-09-27",
    },
  ],
};

function fallbackReviews(c: Creator): Review[] {
  return [
    {
      id: `${c.id}-1`,
      rating: Math.round(c.rating),
      body: c.latestReview,
      createdAt: "2026-10-28",
      reply: {
        body: "Thank you! Glad you enjoyed it.",
        createdAt: "2026-10-29",
      },
    },
    {
      id: `${c.id}-2`,
      rating: 5,
      body: "Respectful, on time and exactly as described.",
      createdAt: "2026-10-02",
    },
    {
      id: `${c.id}-3`,
      rating: 4,
      body: "Good conversation and a relaxed vibe. Would recommend.",
      createdAt: "2026-09-14",
    },
  ];
}

export function getProfile(id: string): CreatorProfile | undefined {
  const creator = CREATORS.find((c) => c.id === id);
  const extras = EXTRAS[id];
  return creator && extras ? { ...creator, ...extras } : undefined;
}

/** Latest first. Paginate in the real query. */
export function getReviews(c: Creator): Review[] {
  return REVIEWS[c.id] ?? fallbackReviews(c);
}

/** Creators who share at least one service, most overlap first, then best rated. */
export function getSimilarCreators(c: Creator, limit = 8): Creator[] {
  return CREATORS.filter((o) => o.id !== c.id)
    .map((o) => ({
      o,
      shared: o.services.filter((s) => c.services.includes(s)).length,
    }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.o.rating - a.o.rating)
    .slice(0, limit)
    .map((x) => x.o);
}

/**
 * Same-area creators, most reviewed first. Anyone already shown in "Similar
 * profiles" goes last, so the two sections don't just repeat each other.
 */
export function getSameAreaCreators(
  c: Creator,
  limit = 4,
  alreadyShown: string[] = [],
): Creator[] {
  const pool = CREATORS.filter((o) => o.id !== c.id && o.area === c.area).sort(
    (a, b) => b.reviews - a.reviews,
  );
  return [
    ...pool.filter((o) => !alreadyShown.includes(o.id)),
    ...pool.filter((o) => alreadyShown.includes(o.id)),
  ].slice(0, limit);
}

export const getAreaByName = (name: string) =>
  AREAS.find((a) => a.name === name);
