"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await auth.api.signOut({
    // Pass the current request headers so Better Auth can read and set cookies.
    headers: await headers(),
  });

  redirect("/auth/login");
}
