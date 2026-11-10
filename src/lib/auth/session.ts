// @/lib/auth/session.ts
import "server-only";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/* Deduplicate per request, so calling in several places causes one lookup */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/* Call at the top of every server action / page that needs signed user */

export async function requireSession() {
  const session = getSession();

  if (!session) redirect("/auth/login");

  return session;
}
