"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus, RotateCcw } from "lucide-react";
import { BulletedListItem } from "@/components/bulleted-list";

/**
 * Floating service card with a click/tap flip. The front is a service photo
 * with the title + a teaser; flipping reveals the full description, bullets,
 * and the Explore link. Keyboard-accessible: the front is a button
 * (Enter/Space flips), focus is trapped to whichever face is showing via
 * tabIndex, and `aria-expanded` announces state. The detail text stays in the
 * DOM on the back face, so it is still crawlable for SEO.
 */
export function ServiceCard({
  image,
  imageAlt,
  icon,
  label,
  title,
  teaser,
  body,
  href,
  bullets,
}: {
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  teaser: string;
  body: string;
  href: string;
  bullets: string[];
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="group h-full [perspective:1800px]">
      <div
        className={`relative min-h-[27rem] w-full rounded-2xl transition-[transform,box-shadow] duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        } ${
          flipped
            ? ""
            : "shadow-[0_18px_40px_-20px_rgba(11,37,69,0.35)] group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_60px_-24px_rgba(11,37,69,0.5)]"
        }`}
      >
        {/* ── Front ── */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-expanded={flipped}
          aria-label={`${title}, show what's included`}
          tabIndex={flipped ? -1 : 0}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left [backface-visibility:hidden] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-teal-600)]"
        >
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-brand-900)]/80 via-[color:var(--color-brand-900)]/20 to-transparent" />
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent backdrop-blur">
              <span className="text-[color:var(--color-teal-600)]">{icon}</span>
              {label}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-7">
            <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-ink">
              {title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-body-ink">
              {teaser}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[color:var(--color-teal-600)] dark:text-[color:var(--color-teal-400)]">
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-[color:var(--color-teal-600)]/10 transition-transform group-hover:rotate-90 dark:bg-[color:var(--color-teal-400)]/15">
                <Plus className="size-3.5" aria-hidden="true" />
              </span>
              What&rsquo;s included
            </span>
          </div>
        </button>

        {/* ── Back ── */}
        <div
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col rounded-2xl border border-[color:var(--color-teal-600)]/25 bg-card p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold tracking-tight text-brand-ink">
              {title}
            </h3>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              tabIndex={flipped ? 0 : -1}
              aria-label={`${title}, back to card`}
              className="inline-flex size-8 flex-none items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-teal-600)]"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-body-ink">{body}</p>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-body-ink">
            {bullets.map((b) => (
              <BulletedListItem key={b}>{b}</BulletedListItem>
            ))}
          </ul>
          <Link
            href={href}
            tabIndex={flipped ? 0 : -1}
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-[color:var(--color-teal-600)] hover:text-brand-ink dark:text-[color:var(--color-teal-400)]"
          >
            Explore {title}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
