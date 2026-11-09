// @/validation/auth/create-account.ts

import { type } from "arktype";

export const createAccountSchema = type({
  anonymousUsername: "string >= 8",
  password: "string >= 8",
  confirmPassword: "string",
}).narrow((data, ctx) => {
  if (data.password === data.confirmPassword) return true;
  return ctx.reject({
    expected: "identical to password",
    actual: "",
    path: ["confirmPassword"],
  });
});

export type CreateAccountData = typeof createAccountSchema.infer;
