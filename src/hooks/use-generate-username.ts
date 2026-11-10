// @/hooks/use-generate-username.ts
"use client";

import { generateUsernameAction } from "@/actions/auth/create-account";
import { useState, useTransition } from "react";

export function useGenerateUsername({
  onGenerated,
}: {
  onGenerated?: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, startTransition] = useTransition();

  const generate = () => {
    setError(null);
    startTransition(async () => {
      const result = await generateUsernameAction();
      if (result.ok) {
        setUsername(result.username);
        onGenerated?.(result.username);
      } else {
        setError(result.error);
      }
    });
  };

  return { username, setUsername, generate, isGenerating, error };
}
