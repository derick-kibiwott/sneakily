"use client";

import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { SwitcherButton } from "@/components/ui/switcher-button";

export function ChatNowButton({ creatorId }: { creatorId: string }) {
  const router = useRouter();
  return (
    <SwitcherButton
      icon={MessageCircle}
      size="lg"
      className="h-11 text-base"
      onClick={() => router.push(`/chats/new?creator=${creatorId}`)}
    >
      Chat now
    </SwitcherButton>
  );
}
