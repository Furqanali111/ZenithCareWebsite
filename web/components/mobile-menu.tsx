"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import type { NavItem } from "@/components/mobile-sheet";

const loadSheet = () => import("@/components/mobile-sheet");
const MobileSheet = dynamic(loadSheet, { ssr: false });

/**
 * Theme toggle + hamburger for screens below lg. The slide-out menu itself is
 * fetched only when it is first needed; hovering, focusing or touching the
 * button starts the download early so the first tap feels instant.
 */
export function MobileMenu({
  services,
  whoWeServe,
  main,
}: {
  services: readonly NavItem[];
  whoWeServe: readonly NavItem[];
  main: readonly NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <ThemeToggle className="size-11 min-h-[44px] min-w-[44px]" />
      <Button
        ref={button}
        variant="ghost"
        size="icon"
        className="size-11 min-h-[44px] min-w-[44px]"
        aria-label="Open navigation menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={loadSheet}
        onFocus={loadSheet}
        onTouchStart={loadSheet}
        onClick={() => {
          setWanted(true);
          setOpen(true);
        }}
      >
        <Menu className="size-5" />
      </Button>
      {wanted ? (
        <MobileSheet
          open={open}
          onOpenChange={setOpen}
          returnFocusRef={button}
          services={services}
          whoWeServe={whoWeServe}
          main={main}
        />
      ) : null}
    </div>
  );
}
