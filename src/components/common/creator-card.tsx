import Link from "next/link";
import { MapPin, MessageSquareText } from "lucide-react";

import { getServiceLabel, type Creator } from "@/lib/creators";
import { Orb, Rating } from "@/components/home/home-bits";

export function CreatorCard({
  creator: c,
  showServices = false,
}: {
  creator: Creator;
  showServices?: boolean | undefined;
}) {
  const shown = c.services.slice(0, 3);
  const extra = c.services.length - shown.length;

  return (
    <Link
      href={`/profile/${c.id}`}
      className="group flex h-full flex-col gap-5 rounded-4xl border bg-card p-5 outline-none transition-colors hover:border-foreground/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <div className="flex items-center gap-3">
        <Orb seed={c.handle} className="size-12" />
        <div className="min-w-0">
          <p className="truncate font-semibold">{c.handle}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden />
            {c.area}
          </p>
        </div>
      </div>

      <blockquote className="line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
        “{c.latestReview}”
      </blockquote>

      <div className="flex flex-wrap gap-1.5">
        {c.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
        {showServices &&
          shown.map((s) => (
            <span
              key={s}
              className="rounded-full border px-2.5 py-1 text-xs font-medium"
            >
              {getServiceLabel(s)}
            </span>
          ))}
        {showServices && extra > 0 && (
          <span className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground">
            +{extra}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquareText className="size-4" aria-hidden />
          {c.reviews} reviews
        </span>
        <Rating rating={c.rating} reviews={c.reviews} />
      </div>
    </Link>
  );
}
