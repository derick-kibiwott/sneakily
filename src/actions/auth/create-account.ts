// @/actions/auth/create-account.ts
"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { checkRateLimit, formatRetry } from "@/lib/auth/rate-limit";
import { generateRecoveryPhrase } from "@/lib/auth/recovery";
import { saveRecoveryPhrase } from "@/lib/auth/recovery-store";
import {
  generateUniqueUsername,
  GenerateUsernameResult,
} from "@/lib/auth/username";
import { ActionResult, toFieldErrors } from "@/lib/form-errors";
import { createAccountSchema } from "@/validations/auth";
import { ArkErrors } from "arktype";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/* There is no session to check so it will only be Ip rate limited isntead */
export async function generateUsernameAction(): Promise<GenerateUsernameResult> {
  const limit = await checkRateLimit({
    scope: "generate-username",
    limit: 10,
    windowSeconds: 10 * 60,
  });

  if (!limit.ok) {
    return {
      ok: false,
      error: `Too many requests. Try again in ${formatRetry(limit.retryAfterSeconds)}`,
    };
  }

  const username = await generateUniqueUsername();

  if (!username) {
    return {
      ok: false,
      error: "Couldn't generate a unique username. Please try again",
    };
  }

  return {
    ok: true,
    username,
  };
}

/* --------------------------------------------------------------------------
                Sign up
 -------------------------------------------------------------------------- */

export type SignupState =
  | { status: "idle" }
  | {
      status: "error";
      message?: string;
      fieldErrors?: Partial<
        Record<"anonymousUsername" | "password" | "confirmPassword", string>
      >;
    }
  | {
      status: "success";
      message: string;
    };

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value : "";

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  // Rate limit the user first: cheapest check, protects everything below

  const limit = await checkRateLimit({
    scope: "signup",
    limit: 5,
    windowSeconds: 60 * 60,
  });

  if (!limit.ok) {
    return {
      errors: {
        form: `Too many attempts. Try again in ${formatRetry(limit.retryAfterSeconds)} `,
      },
    };
  }

  const parsed = createAccountSchema({
    anonymousUsername: text(formData.get("anonymousUsername"))
      .trim()
      .toLowerCase(),
    password: text(formData.get("password")),
    confirmPassword: text(formData.get("confirmPassword")),
  });

  if (parsed instanceof ArkErrors) return { errors: toFieldErrors(parsed) };

  const { anonymousUsername, password } = parsed;

  /* Create account and sign in the user(Better auth sets the session cookie)
   * The email is a throwaway placeholder, never shown or used */

  let userId: string;

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: `${crypto.randomUUID()}@anonymous.invalid`,
        password,
        name: anonymousUsername,
        username: anonymousUsername,
      },
      headers: await headers(),
    });

    userId = res.user.id;
  } catch (error) {
    if (error instanceof APIError) {
      const code = String(error.body?.code ?? "");

      if (code.includes("USERNAME")) {
        return {
          errors: {
            anonymousUsername: code.includes("TAKEN")
              ? "That username is already taken. Try creating a new one"
              : error.message,
          },
        };
      }
    }

    console.error("Signup failed", error);
    return {
      errors: {
        form: "Something went wrong. Please try again",
      },
    };
  }

  /* Create the recovery phrase and store it encrypted, scoped to this user via RLS
   * If this fails, roll back the account creation so that nobody has an account without a recovery key */

  try {
    await saveRecoveryPhrase(userId, generateRecoveryPhrase());
  } catch (error) {
    console.error("Recovery phrase failed", error);
    await db.delete(user).where(eq(user.id, userId)); // cascades to sessions and account;

    return {
      errors: {
        form: "Something went wrong. Please try again",
      },
    };
  }

  /* The user is signed in: The user is to be redirected to the dashboard for bried onboarding
   * redirect() from next/navigation throws so it should stay out any try/catch block
   */
  redirect("/onboarding");
}
