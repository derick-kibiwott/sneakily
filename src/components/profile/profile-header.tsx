"use client";

import { CalendarDays, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { DAYS, type CreatorProfile } from "@/lib/profiles";
import { Orb, seedHues } from "@/components/home/home-bits";
import { ChatNowButton } from "./chat-now-button";

const STATUS = {
  available: { label: "Available now", dot: "bg-emerald-500" },
  busy: { label: "Busy right now", dot: "bg-amber-500" },
  away: { label: "Away", dot: "bg-zinc-400" },
} as const;

const joined = (ym: string) =>
  new Date(`${ym}-01`).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });

/** The colored banner + orb stand in for a profile photo. */
export function ProfileHeader({ profile: p }: { profile: CreatorProfile }) {
  const [a, b] = seedHues(p.handle);
  const status = STATUS[p.availability.status];

  return (
    <section
      aria-labelledby="profile-name"
      className="overflow-hidden rounded-[2rem] border bg-card"
    >
      <div
        aria-hidden
        className="h-36 md:h-48"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, oklch(0.92 0.1 ${a}), transparent 50%), radial-gradient(circle at 85% 75%, oklch(0.78 0.15 ${b}), transparent 55%), linear-gradient(135deg, oklch(0.72 0.17 ${a}), oklch(0.52 0.2 ${b}))`,
        }}
      />

      <div className="px-5 pb-6 md:px-8 md:pb-8">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 md:-mt-14">
          <Orb
            seed={p.handle}
            className="size-24 ring-4 ring-card md:size-28"
          />
          <ChatNowButton creatorId={p.id} />
        </div>

        <h1
          id="profile-name"
          className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl"
        >
          {p.handle}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden />
            {p.area}
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <CalendarDays className="size-4" aria-hidden />
            Joined {joined(p.memberSince)}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-pretty">{p.bio}</p>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1.8fr]">
          <div className="rounded-3xl bg-muted/60 p-4">
            <dt className="text-sm text-muted-foreground">Rating</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-2xl font-semibold tabular-nums">
              <Star
                aria-hidden
                className="size-5 fill-amber-400 text-amber-400"
              />
              {p.rating.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground">
                / 5
              </span>
            </dd>
          </div>

          <div className="rounded-3xl bg-muted/60 p-4">
            <dt className="text-sm text-muted-foreground">Reviews</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
              {p.reviews}
            </dd>
          </div>

          <div className="col-span-2 rounded-3xl bg-muted/60 p-4 sm:col-span-1">
            <dt className="text-sm text-muted-foreground">Availability</dt>
            <dd className="mt-1">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <span
                  aria-hidden
                  className={cn("size-2.5 rounded-full", status.dot)}
                />
                {status.label}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {p.availability.hours}. {p.availability.note}
              </span>
              <ul className="mt-3 flex gap-1" aria-label="Days available">
                {DAYS.map((d) => {
                  const on = p.availability.days.includes(d);
                  return (
                    <li
                      key={d}
                      className={cn(
                        "grid size-7 place-items-center rounded-full border text-[11px] font-medium",
                        on
                          ? "border-transparent bg-foreground text-background"
                          : "text-muted-foreground",
                      )}
                    >
                      <span aria-hidden>{d[0]}</span>
                      <span className="sr-only">
                        {d}, {on ? "available" : "unavailable"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
