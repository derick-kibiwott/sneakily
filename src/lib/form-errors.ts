// @/lib/form-errors.ts

/* This file is meant to be shared between the server and the client
 * No need for any directives at the top
 */
import { ArkErrors } from "arktype";

/* Errors with no field use the key form */
export type FieldErrors = Record<string, string>;

export type ActionResult = { errors: FieldErrors } | void;

/* Arktype already groups errors by path, this just flattens them to messages */
export function toFieldErrors(errors: ArkErrors): FieldErrors {
  return Object.fromEntries(
    Object.entries(errors.byPath).map(([path, error]) => [
      path || "form",
      error.message,
    ]),
  );
}
