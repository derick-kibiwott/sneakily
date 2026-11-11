import Link from "next/link";

import { AppLogo } from "@/components/app-logo";
import { cacheLife } from "next/cache";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Popular creators", href: "/explore?sort=popular" },
      { label: "Highly rated", href: "/explore?sort=rating" },
      { label: "Browse by area", href: "/explore" },
    ],
  },
  {
    title: "Creators",
    links: [
      { label: "Become a creator", href: "/become-a-creator" },
      { label: "Creator guidelines", href: "/guidelines/creators" },
      { label: "Your dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Safety", href: "/safety" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Community guidelines", href: "/guidelines" },
      { label: "Report a profile", href: "/report" },
    ],
  },
];

export function Footer() {
  return (
    // pb leaves room for the mobile bottom tab bar
    <footer className="mt-24 border-t pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 pt-14 lg:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <p className="max-w-xs text-lg font-medium text-balance">
              Anonymous by design. Honest reviews, no photos.
            </p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Sneakily is for adults 18 and over.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Giant wordmark: decorative, since the copyright line already names the brand */}
        <div
          aria-hidden
          className="mt-16 flex select-none items-center justify-center gap-[0.12em] text-[clamp(3rem,15vw,14rem)] font-semibold leading-none tracking-tighter"
        >
          <div className="size-[0.85em] shrink-0 *:size-full">
            <AppLogo />
          </div>
          <span>Sneakily</span>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
          © {getDate()} Sneakily. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

async function getDate() {
  "use cache";
  cacheLife({
    stale: 60 * 60 * 24 * 365,
    revalidate: 60 * 60 * 24 * 365,
    expire: 60 * 60 * 24 * 365,
  });

  return new Date().getFullYear();
}
