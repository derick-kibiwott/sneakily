// @/lib/auth.ts
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema"; // your drizzle schema
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  /* Better auth needs an email per user
   We never collect one while signing up instead we generate a throwaway email <uuid>@anonymous.invalid server-side */

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  /* We never persist the user agent or the ip address of the user 
     Ips are only used(HMAC-hashed)
     by our own rate limiter found at @/lib/rate-limit.ts
  */

  databaseHooks: {
    session: {
      create: {
        before: async (session) => ({
          data: { ...session, ipAdress: null, userAgent: null },
        }),
      },
    },
  },
  plugins: [
    username({
      displayUsername: false,
      minUsernameLength: 8,
      maxUsernameLength: 24,
      usernameValidator: (username) => /^[a-zA-Z0-9_.-]+$/.test(username),
    }),
    nextCookies(),
  ],
});
