"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  RATING_OPTIONS,
  filtersToHref,
  type CreatorFilters,
} from "@/lib/explore-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Option = { slug: string; label: string; count: number };

/* Left drawer from lg up (matches the navbar breakpoint), bottom drawer below. */
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsDesktop = () =>
  React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );

/** Native checkbox/radio styled as a pill: keyboard and screen reader friendly. */
function Pill({
  type,
  name,
  checked,
  onChange,
  children,
}: {
  type: "checkbox" | "radio";
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative cursor-pointer">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted peer-checked:border-transparent peer-checked:bg-foreground peer-checked:text-background peer-checked:hover:bg-foreground/90 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40 motion-reduce:transition-none">
        {children}
      </span>
    </label>
  );
}

function Group({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export function FilterDrawer({
  filters,
  areas,
  services,
}: {
  filters: CreatorFilters;
  areas: Option[];
  services: Option[];
}) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<CreatorFilters>(filters);

  const activeCount =
    filters.areas.length +
    filters.services.length +
    (filters.minRating ? 1 : 0);

  function openDrawer() {
    setDraft(filters); // always start from what's currently applied
    setOpen(true);
  }

  function toggle(key: "areas" | "services", slug: string) {
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(slug)
        ? d[key].filter((s) => s !== slug)
        : [...d[key], slug],
    }));
  }

  function apply() {
    router.push(filtersToHref(draft), { scroll: false });
    setOpen(false);
  }

  function clear() {
    setDraft((d) => ({ ...d, areas: [], services: [], minRating: 0 }));
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        aria-haspopup="dialog"
        onClick={openDrawer}
        className="h-10 px-4"
      >
        <SlidersHorizontal aria-hidden />
        Filters
        {activeCount > 0 && (
          <>
            <span
              aria-hidden
              className="grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1.5 text-[11px] font-semibold leading-none text-background"
            >
              {activeCount}
            </span>
            <span className="sr-only">{activeCount} active</span>
          </>
        )}
      </Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        swipeDirection={isDesktop ? "left" : "down"}
      >
        <DrawerContent className={cn("lg:max-w-md")}>
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-2xl font-semibold tracking-tight">
              Filters
            </DrawerTitle>
            <DrawerDescription>
              Narrow down who you see. Pick as many as you like.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className={"min-h-0 flex-1 bg-muted/30"}>
            <div className="flex-1 space-y-8 px-4 py-6">
              <Group legend="Area">
                {areas.map((a) => (
                  <Pill
                    key={a.slug}
                    type="checkbox"
                    name="area"
                    checked={draft.areas.includes(a.slug)}
                    onChange={() => toggle("areas", a.slug)}
                  >
                    {a.label}
                  </Pill>
                ))}
              </Group>

              <Group legend="Services">
                {services.map((s) => (
                  <Pill
                    key={s.slug}
                    type="checkbox"
                    name="service"
                    checked={draft.services.includes(s.slug)}
                    onChange={() => toggle("services", s.slug)}
                  >
                    {s.label}
                  </Pill>
                ))}
              </Group>

              <Group legend="Minimum rating">
                {RATING_OPTIONS.map((o) => (
                  <Pill
                    key={o.value}
                    type="radio"
                    name="rating"
                    checked={draft.minRating === o.value}
                    onChange={() =>
                      setDraft((d) => ({ ...d, minRating: o.value }))
                    }
                  >
                    {o.value > 0 && (
                      <Star
                        aria-hidden
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    )}
                    {o.label}
                  </Pill>
                ))}
              </Group>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <DrawerFooter className="flex-row gap-3 py-4 border-t">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="h-11 flex-1"
              onClick={clear}
            >
              Clear all
            </Button>
            <Button
              type="button"
              size="lg"
              className="h-11 flex-1"
              onClick={apply}
            >
              Show results
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
