// @/lib/auth/rate-limit.ts
import "server-only";
import { headers } from "next/headers";
import { createHmac } from "node:crypto";
import { db } from "@/db";
import { rateLimit } from "@/db/schemas/auth-extras";
import { sql } from "drizzle-orm";

function getPepper() {
  const pepper = process.env.RATE_LIMIT_SECRET;
  if (!pepper) throw new Error("Rate limit secret not set!");
  return pepper;
}

/**
 * Returns a keyed hash of the caller's IP. The secret matters: the IPv4 space is
 * tiny, so a plain hash could be reversed by brute force.
 *
 * x-forwarded-for is only trustworthy behind a proxy that overwrites it
 * (Vercel does). Elsewhere, adjust this to your proxy setup.
 */

async function getClientIpHash() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() || headersList.get("x-real-ip")?.trim();

  if (!ipAddress) {
    throw new Error("Unable to determine client IP address");
  }

  return createHmac("sha256", getPepper()).update(ipAddress).digest("hex");
}

type RateLimitOptions = {
  scope: string; // e.g. signup, generate-username
  limit: number;
  windowSeconds: number;
};

export async function checkRateLimit({
  scope,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<{ ok: boolean; retryAfterSeconds: number }> {
  const key = `${scope}:${await getClientIpHash()}`;
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  const resetIso = resetAt.toISOString();

  /* Single atomic upsert: starts a new window if the old one expired
     Otherwise increments. Safe under concurrent requests */

  const [row] = await db
    .insert(rateLimit)
    .values({ key, count: 1, resetAt })
    .onConflictDoUpdate({
      target: rateLimit.key,
      set: {
        count: sql`CASE WHEN ${rateLimit.resetAt} <= now() THEN 1 ELSE ${rateLimit.count} + 1 END`,
        resetAt: sql`CASE WHEN ${rateLimit.resetAt} <= now() THEN ${resetIso}::timestamptz ELSE ${rateLimit.resetAt} END`,
      },
    })
    .returning({ count: rateLimit.count, resetAt: rateLimit.resetAt });

  if (!row) {
    throw new Error("Rate limit upsert did not return a row");
  }

  return {
    ok: row.count <= limit,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((row?.resetAt.getTime() - Date.now()) / 1000),
    ),
  };
}

export function formatRetry(seconds: number) {
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.ceil(seconds / 60);

  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}
