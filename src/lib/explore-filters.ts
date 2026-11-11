// Pure helpers shared by server and client code (no data in here).

export type SortKey = "popular" | "rating";

export type CreatorFilters = {
  areas: string[]; // area slugs
  services: string[]; // service slugs
  minRating: number; // 0 = any
  sort: SortKey;
};

export const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 3.5, label: "3.5+" },
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
] as const;

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most reviewed" },
  { value: "rating", label: "Highest rated" },
];

/** Filters live in the URL so results are shareable and the back button works. */
export function filtersToHref(
  filters: CreatorFilters,
  overrides: Partial<CreatorFilters> = {},
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();
  next.areas.forEach((a) => params.append("area", a));
  next.services.forEach((s) => params.append("service", s));
  if (next.minRating) params.set("rating", String(next.minRating));
  if (next.sort !== "popular") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/explore?${qs}` : "/explore";
}
