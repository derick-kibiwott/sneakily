// @/validation/auth/create-account.ts

import { type } from "arktype";

export const loginSchema = type({
  anonymousUsername: type("/^[a-zA-Z0-9_.-]{8,24}$/").configure({
    message:
      "Username must be 8-24 characters: letters, numbers, dots, underscores or hyphens",
  }),
  password: "string >= 8",
});

export const createAccountSchema = loginSchema
  .and({
    confirmPassword: "string",
  })
  .narrow((data, ctx) => {
    if (data.password === data.confirmPassword) return true;
    return ctx.reject({
      expected: "identical to password",
      actual: "",
      path: ["confirmPassword"],
    });
  });

export type LoginData = typeof loginSchema.infer;
export type CreateAccountData = typeof createAccountSchema.infer;
