import type { Metadata } from "next";
import { Geist_Mono, Raleway } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});

const regola = localFont({
  src: "../fonts/regola.woff2",
  weight: "300 900",
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sneakily",
  description: "Best website to find sneaky links",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        regola.variable,
        ralewayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
