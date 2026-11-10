// @/actions/auth/login.ts

"use server";

import { auth } from "@/lib/auth";
import { checkRateLimit, formatRetry } from "@/lib/auth/rate-limit";
import { ActionResult, toFieldErrors } from "@/lib/form-errors";
import { loginSchema } from "@/validations/auth";
import { ArkErrors } from "arktype";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const limit = await checkRateLimit({
    scope: "login",
    limit: 10,
    windowSeconds: 15 * 60,
  });

  if (!limit.ok) {
    return {
      errors: {
        form: `Too many attempts. Try again in ${formatRetry(limit.retryAfterSeconds)}`,
      },
    };
  }

  const raw = Object.fromEntries(formData);
  const parsed = loginSchema({
    ...raw,
    anonymousUsername: String(raw.anonymousUsername ?? "")
      .trim()
      .toLowerCase(),
  });

  if (parsed instanceof ArkErrors) return { errors: toFieldErrors(parsed) };

  /*
   * Sign in. Better auth will set the auth cookies
   */

  try {
    await auth.api.signInUsername({
      body: {
        username: parsed.anonymousUsername,
        password: parsed.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    /*
     * Always return one generic error so the form doesn't reveal which usernames exist
     */

    if (error instanceof APIError && error.statusCode < 500) {
      return {
        errors: {
          form: "Invalid username or password",
        },
      };
    }

    console.error("login failed", error);
    return {
      errors: {
        form: "Something went wrong. Please try again",
      },
    };
  }
  redirect("/dashboard");
}
