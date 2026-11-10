// @/actions/auth/recovery.ts

"use server";

import { acknowledgeRecoveryPhrase } from "@/lib/auth/recovery-store";
import { requireSession } from "@/lib/auth/session";

export async function acknowledgeRecoveryPhraseAction() {
  const res = await requireSession();

  if (!res?.user)
    return {
      ok: false,
      error: "You don't have an active session",
    };

  await acknowledgeRecoveryPhrase(res.user.id);

  return {
    ok: true,
    message: "Recovery code acknowledged successfully",
  };
}
