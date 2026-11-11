"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@teispace/next-themes";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  ArrowRight,
  Compass,
  Home,
  LayoutDashboard,
  MessageCircle,
  Monitor,
  Moon,
  Palette,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { SwitcherButton } from "@/components/ui/switcher-button";

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                           */
/*  Optional props carry `| undefined` so they work with                      */
/*  exactOptionalPropertyTypes.                                               */
/* -------------------------------------------------------------------------- */

type NavEntry = {
  href: string;
  label: string;
  icon?: LucideIcon | undefined;
  badge?: number | undefined;
  avatar?: boolean | undefined;
};

type AvatarProps = {
  avatarSrc?: string | undefined;
  avatarFallback: string;
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
  count?: number | undefined;
  className?: string | undefined;
}) {
  if (!count) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-5 min-w-5 place-items-center rounded-4xl bg-emerald-400 px-1.5 text-[11px] font-semibold leading-none text-neutral-950",
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
  src?: string | undefined;
  fallback: string;
  className?: string | undefined;
}) {
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="text-[11px]">{fallback}</AvatarFallback>
    </Avatar>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop pill nav (lg and up)                                              */
/*  The pill uses the foreground color so it contrasts with the app           */
/*  background; links use `background` as their text color.                   */
/* -------------------------------------------------------------------------- */

/** Overrides on top of the ghost Button: the sliding pill replaces the hover bg. */
const desktopTone = (active: boolean) =>
  cn(
    "isolate gap-2 px-4 focus-visible:border-transparent focus-visible:ring-background/40",
    active
      ? "bg-background text-foreground hover:bg-background hover:text-foreground aria-expanded:bg-background aria-expanded:text-foreground dark:hover:bg-background"
      : "text-background hover:bg-transparent hover:text-background aria-expanded:bg-transparent aria-expanded:text-background dark:hover:bg-transparent",
  );

/** The one highlight that glides between links (shared via layoutId). */
function HoverPill({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          layoutId="nav-hover-pill"
          aria-hidden
          className="absolute inset-0 -z-10 rounded-4xl bg-background/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        />
      )}
    </AnimatePresence>
  );
}

function ProfileMenu({
  item,
  active,
  hovered,
  avatarSrc,
  avatarFallback,
  onHover,
  onBlurTrigger,
  onOpenChange,
}: AvatarProps & {
  item: NavEntry;
  active: boolean;
  hovered: boolean;
  onHover: () => void;
  onBlurTrigger: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="lg"
            aria-label="Profile menu"
            onMouseEnter={onHover}
            onFocus={onHover}
            onBlur={onBlurTrigger}
            className={cn(desktopTone(active), "px-2.5")}
          />
        }
      >
        <HoverPill show={hovered && !active} />
        <ProfileAvatar
          src={avatarSrc}
          fallback={avatarFallback}
          className="size-7"
        />
        <span className="sr-only">{item.label}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={14} className="w-48">
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account" />}>
          <User />
          Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme ?? "system"}
              onValueChange={(value) => setTheme(String(value))}
            >
              <DropdownMenuRadioItem value="light">
                <Sun />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DesktopNav({
  items,
  pathname,
  avatarSrc,
  avatarFallback,
}: AvatarProps & {
  items: NavEntry[];
  pathname: string;
}) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul
        onMouseLeave={() => !menuOpen && setHovered(null)}
        className="flex items-center gap-1 rounded-4xl bg-foreground p-1.5"
      >
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          if (item.avatar) {
            return (
              <li key={item.href}>
                <ProfileMenu
                  item={item}
                  active={active}
                  hovered={hovered === item.href}
                  avatarSrc={avatarSrc}
                  avatarFallback={avatarFallback}
                  onHover={() => setHovered(item.href)}
                  onBlurTrigger={() => !menuOpen && setHovered(null)}
                  onOpenChange={(open) => {
                    setMenuOpen(open);
                    setHovered(open ? item.href : null);
                  }}
                />
              </li>
            );
          }

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
                  desktopTone(active),
                )}
              >
                <HoverPill show={hovered === item.href && !active} />
                {Icon && <Icon aria-hidden />}
                <span>{item.label}</span>
                <CountBadge count={item.badge} />
                {item.badge ? (
                  <span className="sr-only">{item.badge} unread</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bottom tab bar (below lg): icons only, labelled for screen readers.       */
/*  Profile is a plain link to /profile here; no dropdown.                    */
/* -------------------------------------------------------------------------- */

function MobileNav({
  items,
  pathname,
  avatarSrc,
  avatarFallback,
}: AvatarProps & {
  items: NavEntry[];
  pathname: string;
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
            className="h-10 animate-in rounded-4xl bg-background fade-in duration-200"
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
                className={"dark:bg-background border"}
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
  chatCount = 0,
  avatarSrc,
  avatarFallback = "U",
}: {
  chatCount?: number | undefined;
  avatarSrc?: string | undefined;
  avatarFallback?: string | undefined;
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
      <header
        className={cn(
          "sticky top-0 z-40",
          pathname == "/explore" && "relative",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 lg:px-6">
          <Button
            size={"icon-lg"}
            nativeButton={false}
            render={<Link href="/" aria-label="sneakily, go to home page" />}
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
            <SwitcherButton
              icon={ArrowRight}
              className={cn(searchOpen && "max-sm:hidden")}
              size={"lg"}
              render={<Link href={"/auth/login"} />}
            >
              Login
            </SwitcherButton>
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
