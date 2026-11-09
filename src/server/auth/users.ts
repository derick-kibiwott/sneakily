// @/server/auth/users.ts

"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
};

export const signUp = async (email: string, password: string) => {
  await auth.api.signUpEmail({
    body: {
      name: "Derick Kibiwott",
      email,
      password,
    },
    headers: await headers(),
  });
};

export const signIn = async (email: string, password: string) => {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
  });
};
