import { RecoveryPhraseCard } from "@/components/onboarding/recover-phrase-card";
import { getRecoveryPhrase } from "@/lib/auth/recovery-store";
import { getSession } from "@/lib/auth/session";
import { Suspense } from "react";

export default async function OnboardingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<p>Loading...</p>}>
        <RecoveryPhraseContent />
      </Suspense>
    </div>
  );
}

async function RecoveryPhraseContent() {
  const session = await getSession();

  if (!session?.user) return null;
  const stored = await getRecoveryPhrase(session.user.id);

  if (!stored) return null;

  return <RecoveryPhraseCard phrase={stored.phrase} />;
}
