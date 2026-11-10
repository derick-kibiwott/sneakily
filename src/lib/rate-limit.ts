// @/lib/rate-limit.ts
import "server-only";
import { headers } from "next/headers";

export type RateLimitRule = {
  scope: string;
  limit: number;
  windowSeconds: number;
};

export const RATE_LIMITS: Record<string, RateLimitRule> = {
  generateUsername: {
    scope: "generate-username",
    limit: 15,
    windowSeconds: 60,
  },
  signUp: { scope: "sign-up", limit: 10, windowSeconds: 60 * 60 },
};

export async function getClientIp() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() ?? null;

  return ipAddress;
}
