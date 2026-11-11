"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowRight,
  Compass,
  Home,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppLogo } from "@/components/app-logo";

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                           */
/* -------------------------------------------------------------------------- */

type NavEntry = {
  href: string;
  label: string;
  icon?: LucideIcon;
  badge?: number;
  avatar?: boolean;
};

const SEARCH_HINTS = [
  "Search near Boma",
  "Search near Nyeri View",
  "Search near Westlands",
  "Search near Karen",
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function CountBadge({
  count,
  className,
}: {
  count?: number;
  className?: string;
}) {
  if (!count) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center size-6 rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function ProfileAvatar({
  src,
  fallback,
  className,
}: {
  src?: string;
  fallback: string;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="text-[11px]">{fallback}</AvatarFallback>
    </Avatar>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop pill nav (lg and up) with the sliding hover highlight             */
/*  Links use buttonVariants (real <a> tags), not <Button>, so Base UI        */
/*  doesn't add role="button" to them.                                        */
/* -------------------------------------------------------------------------- */

function DesktopNav({
  items,
  pathname,
  avatarSrc,
  avatarFallback,
}: {
  items: NavEntry[];
  pathname: string;
  avatarSrc?: string;
  avatarFallback: string;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-1 rounded-full bg-foreground text-background backdrop-blur-md p-1.5"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(item.href)}
                onFocus={() => setHovered(item.href)}
                onBlur={() => setHovered(null)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "isolate gap-2 px-4 focus-visible:border-transparent focus-visible:ring-primary-foreground/40",
                  // The sliding pill replaces the button's own hover background
                  active
                    ? "bg-background text-foreground hover:bg-background"
                    : "text-primary-foreground hover:bg-transparent hover:text-primary-foreground",
                  item.avatar && "px-2.5",
                )}
              >
                {/* One shared highlight: it glides between whichever link is hovered */}
                <AnimatePresence>
                  {hovered === item.href && !active && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full bg-primary-foreground/15"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.45,
                      }}
                    />
                  )}
                </AnimatePresence>

                {item.avatar ? (
                  <>
                    <ProfileAvatar
                      src={avatarSrc}
                      fallback={avatarFallback}
                      className="size-7"
                    />
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  <>
                    {Icon && <Icon aria-hidden />}
                    <span>{item.label}</span>
                    <CountBadge count={item.badge} />
                    {item.badge ? (
                      <span className="sr-only">{item.badge} unread</span>
                    ) : null}
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bottom tab bar (below lg): icons only, labelled for screen readers        */
/* -------------------------------------------------------------------------- */

function MobileNav({
  items,
  pathname,
  avatarSrc,
  avatarFallback,
}: {
  items: NavEntry[];
  pathname: string;
  avatarSrc?: string;
  avatarFallback: string;
}) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-background/70 lg:hidden"
    >
      <ul className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-lg" }),
                  "size-12",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.avatar ? (
                  <ProfileAvatar
                    src={avatarSrc}
                    fallback={avatarFallback}
                    className={cn(
                      "size-7",
                      active &&
                        "ring-2 ring-foreground ring-offset-2 ring-offset-background",
                    )}
                  />
                ) : (
                  Icon && (
                    <Icon
                      className="size-6"
                      strokeWidth={active ? 2.6 : 1.8}
                      aria-hidden
                    />
                  )
                )}

                {item.badge ? (
                  <CountBadge
                    count={item.badge}
                    className="absolute right-0.5 top-0.5 h-4 min-w-4 px-1 text-[10px]"
                  />
                ) : null}

                <span className="sr-only">
                  {item.label}
                  {item.badge ? `, ${item.badge} unread` : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Login: default Button style; the arrow slides right to left on hover.     */
/*  buttonVariants already declares `group/button`, so we use that group.     */
/* -------------------------------------------------------------------------- */

function LoginButton({ className }: { className?: string }) {
  return (
    <Link
      href="/auth/login"
      className={cn(buttonVariants({ size: "lg" }), "pl-5 pr-12 ", className)}
    >
      <span className="transition-transform duration-300 ease-out group-hover/button:translate-x-7 group-focus-visible/button:translate-x-7 motion-reduce:transition-none">
        Login
      </span>
      <span
        aria-hidden
        className="absolute left-[calc(100%-2.375rem)] top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-primary-foreground text-primary transition-[left] duration-300 ease-out group-hover/button:left-1.5 group-focus-visible/button:left-1.5 motion-reduce:transition-none"
      >
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*  Search: tooltip -> expands into an input group with rotating hints        */
/* -------------------------------------------------------------------------- */

function SearchBox({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [hint, setHint] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const refocus = React.useRef(false);

  // Cycle the suggestion text while the box is open and empty
  React.useEffect(() => {
    if (!open || value) return;
    const id = setInterval(
      () => setHint((i) => (i + 1) % SEARCH_HINTS.length),
      2500,
    );
    return () => clearInterval(id);
  }, [open, value]);

  // Hand focus back to the trigger when closed with Esc / the close button
  React.useEffect(() => {
    if (!open && refocus.current) {
      refocus.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  function close(returnFocus = false) {
    refocus.current = returnFocus;
    setValue("");
    onOpenChange(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div
      className={cn(
        "shrink-0 transition-[width] duration-300 ease-out motion-reduce:transition-none",
        open ? "w-[calc(100vw-8rem)] sm:w-72" : "w-10",
      )}
    >
      {open ? (
        <form role="search" onSubmit={onSubmit}>
          <InputGroup
            className="h-10 animate-in rounded-full bg-background fade-in duration-200"
            onKeyDown={(e) => e.key === "Escape" && close(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget) && !value)
                onOpenChange(false);
            }}
          >
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>

            <InputGroupInput
              autoFocus
              type="search"
              aria-label="Search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            {/* Animated stand-in placeholder (decorative; the input has its own aria-label) */}
            {!value && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-9 right-10 flex items-center overflow-hidden text-sm text-muted-foreground"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={hint}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="truncate"
                  >
                    {SEARCH_HINTS[hint]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                size="icon-xs"
                aria-label="Close search"
                onClick={() => close(true)}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      ) : (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                ref={triggerRef}
                type="button"
                variant="outline"
                size="icon-lg"
                aria-label="Search"
                aria-expanded={false}
                onClick={() => onOpenChange(true)}
              />
            }
          >
            <Search aria-hidden />
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

export function Navbar({
  chatCount = 4,
  avatarSrc,
  avatarFallback = "U",
}: {
  chatCount?: number;
  avatarSrc?: string;
  avatarFallback?: string;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const items: NavEntry[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/chats", label: "Chats", icon: MessageCircle, badge: chatCount },
    { href: "/profile", label: "Profile", avatar: true },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
          <Button
            size={"icon-lg"}
            render={<Link href="/" aria-label="Go to home page" />}
            nativeButton={false}
          >
            <AppLogo className="size-6" />
          </Button>

          <div className="flex flex-1 justify-center">
            <DesktopNav
              items={items}
              pathname={pathname}
              avatarSrc={avatarSrc}
              avatarFallback={avatarFallback}
            />
          </div>

          <div className="flex items-center gap-2">
            <SearchBox open={searchOpen} onOpenChange={setSearchOpen} />
            <LoginButton className={cn(searchOpen && "max-sm:hidden")} />
          </div>
        </div>
      </header>

      <MobileNav
        items={items}
        pathname={pathname}
        avatarSrc={avatarSrc}
        avatarFallback={avatarFallback}
      />
    </MotionConfig>
  );
}
