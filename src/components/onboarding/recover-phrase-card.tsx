// components/onboarding/recovery-phrase-card.tsx
"use client";

import { useState, useTransition } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { acknowledgeRecoveryPhraseAction } from "@/actions/auth/recovery";

export function RecoveryPhraseCard({ phrase }: { phrase: string }) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const words = phrase.split(" ");

  async function copy() {
    await navigator.clipboard.writeText(phrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle>Save your recovery phrase</CardTitle>
        <CardDescription>
          It&apos;s the only way to reset your password. You can view it again
          later from your account page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-3 text-sm sm:grid-cols-3">
          {words.map((word, i) => (
            <li key={i} className="flex gap-2 font-mono">
              <span className="w-5 text-right text-muted-foreground">
                {i + 1}.
              </span>
              <span>{word}</span>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter className="gap-2">
        <Button type="button" variant="outline" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await acknowledgeRecoveryPhraseAction();
            })
          }
        >
          {isPending ? "Saving…" : "I've saved it"}
        </Button>
      </CardFooter>
    </Card>
  );
}
