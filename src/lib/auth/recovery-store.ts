// @/lib/auth/recovery-store.ts
import "server-only";
import { decryptRecoveryPhrase, encryptRecoveryPhrase } from "./recovery";
import { withUser } from "@/db/function/rls";
import { recoveryPhrase } from "@/db/schemas/auth-extras";
import { eq } from "drizzle-orm";

export async function saveRecoveryPhrase(userId: string, phrase: string) {
  const encrypted = encryptRecoveryPhrase(phrase, userId);
  await withUser(userId, (tx) =>
    tx.insert(recoveryPhrase).values({ userId, encrypted }),
  );
}

/* Returns the decrypted phrase to the user only
 * (enforced by RLS, plus the explicit where)
 */
export async function getRecoveryPhrase(userId: string) {
  const [row] = await withUser(userId, (tx) =>
    tx
      .select()
      .from(recoveryPhrase)
      .where(eq(recoveryPhrase.userId, userId))
      .limit(1),
  );

  if (!row) return null;

  return {
    phrase: decryptRecoveryPhrase(row.encrypted, userId),
    acknowledgedAt: row.acknowledgedAt,
  };
}

export async function acknowledgeRecoveryPhrase(userId: string) {
  await withUser(userId, (tx) =>
    tx
      .update(recoveryPhrase)
      .set({
        acknowledgedAt: new Date(),
      })
      .where(eq(recoveryPhrase.userId, userId)),
  );
}
