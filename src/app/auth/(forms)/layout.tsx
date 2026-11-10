import Link from "next/link";
import { AuthTimeline } from "@/components/auth/auth-timeline";
import { AppLogo } from "@/components/app-logo";

export default function AuthFormsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href="/"
            className="flex font-heading items-center gap-2 font-semibold"
          >
            <div className="p-1 bg-primary text-primary-foreground rounded-full">
              <AppLogo className="size-8" />
            </div>
            Sneakily
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted/30 lg:block rounded-tl-4xl rounded-bl-4xl overflow-hidden">
        <AuthTimeline />
      </div>
    </div>
  );
}
