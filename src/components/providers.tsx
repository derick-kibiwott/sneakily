"use client";

import { getSafeRedirectTo } from "@better-auth-ui/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth/client";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        emailAndPassword={{ requireEmailVerification: false }} // match your branch's setting
        navigate={({ to, replace }) => {
          const path = getSafeRedirectTo(to, window.location.origin);
          const target = path.startsWith("//") ? "/" : path;
          if (replace) router.replace(target);
          else router.push(target);
        }}
        Link={Link}
        redirectTo="/"
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
