"use client";

import { useEffect, useRef, useState } from "react";

type Step = { number: string; title: string; body: string };

/**
 * Desktop: a pinned scene. The section is N screens tall; inside it one panel
 * sticks to the viewport and shows only the active step, with a progress rail
 * on the left and a network on the right that wires up as the step advances.
 * The active step comes from sentinels and an IntersectionObserver (no scroll
 * listener). Phones, and anyone without JS, get a plain ordered list of all
 * three steps. Motion is opacity, transform and stroke only; it stops under
 * reduced motion.
 */
const NODES = [
  { label: "Eligible patients", x: 70, y: 70, from: 0 },
  { label: "Consent", x: 450, y: 60, from: 0 },
  { label: "Care plans", x: 55, y: 300, from: 1 },
  { label: "Time logs", x: 455, y: 305, from: 1 },
  { label: "CPT 99490", x: 150, y: 385, from: 2 },
  { label: "Monthly invoice", x: 380, y: 390, from: 2 },
] as const;
const CX = 260;
const CY = 215;
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

export function ScrollSteps({ heading, steps }: { heading: string; steps: readonly Step[] }) {
  const [active, setActive] = useState(0);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sentinels.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const last = steps.length - 1;

  return (
    <>
      {/* Phone and no-JS: every step, in order */}
      <div className="lg:hidden">
        <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand-ink">{heading}</h2>
        <ol className="mt-10 space-y-10">
          {steps.map((s) => (
            <li key={s.number}>
              <p className="font-serif text-3xl font-semibold tabular-nums text-brand-accent">{s.number}</p>
              <h3 className="mt-2 font-serif text-xl font-semibold text-brand-ink">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-body-ink">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Desktop: pinned scene, one step at a time */}
      <div className="relative hidden lg:block" style={{ height: `${steps.length * 90}svh` }}>
        {steps.map((s, i) => (
          <div
            key={s.number}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
            data-i={i}
            aria-hidden="true"
            className="absolute inset-x-0"
            style={{ top: `${i * 90}svh`, height: "90svh" }}
          />
        ))}

        <div className="sticky top-0 grid h-svh grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-20">
          <div>
            <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              {heading}
            </h2>

            <div className="relative mt-12 flex gap-10">
              {/* Progress rail */}
              <div aria-hidden="true" className="relative ml-1 w-3.5 shrink-0">
                <span className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-border" />
                <span
                  className={`absolute top-2 bottom-2 left-1/2 w-px origin-top -translate-x-1/2 bg-[color:var(--color-gold-500)] transition-transform duration-700 ${EASE} motion-reduce:transition-none`}
                  style={{ transform: `translateX(-50%) scaleY(${active / last})` }}
                />
                {steps.map((s, i) => (
                  <span
                    key={s.number}
                    className={`absolute left-0 size-3.5 rounded-full border-2 transition-[background-color,border-color] duration-500 motion-reduce:transition-none ${
                      i <= active
                        ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]"
                        : "border-border bg-background"
                    }`}
                    style={{ top: `calc(${(i / last) * 100}% - ${(i / last) * 14}px)` }}
                  />
                ))}
              </div>

              {/* One slot; only the active step is visible */}
              <ol className="grid min-h-[16rem] flex-1">
                {steps.map((s, i) => (
                  <li
                    key={s.number}
                    aria-hidden={i !== active}
                    className={`col-start-1 row-start-1 transition-[opacity,transform] duration-700 ${EASE} motion-reduce:transition-none ${
                      i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                    }`}
                  >
                    <p className="font-serif text-5xl font-semibold tabular-nums text-brand-accent">{s.number}</p>
                    <h3 className="mt-3 font-serif text-2xl font-semibold text-brand-ink">{s.title}</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-body-ink">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <svg
            viewBox="0 0 520 440"
            role="img"
            aria-label="Practice workflow connecting to your EHR as each step completes"
            className="w-full"
          >
            {NODES.map((n) => {
              const on = n.from <= active;
              const len = Math.hypot(n.x - CX, n.y - CY);
              return (
                <line
                  key={n.label}
                  x1={CX}
                  y1={CY}
                  x2={n.x}
                  y2={n.y}
                  strokeWidth={1.5}
                  strokeDasharray={len}
                  strokeDashoffset={on ? 0 : len}
                  className={`stroke-[color:var(--color-teal-500)] transition-[stroke-dashoffset] duration-1000 ${EASE} motion-reduce:transition-none`}
                />
              );
            })}
            {NODES.map((n) => {
              const on = n.from <= active;
              return (
                <g key={n.label}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={on ? 9 : 7}
                    className={`transition-[fill,r] duration-500 motion-reduce:transition-none ${
                      on ? "fill-[color:var(--color-teal-500)]" : "fill-[color:var(--color-border-200)]"
                    }`}
                  />
                  <text
                    x={n.x}
                    y={n.y + (n.y > CY ? 28 : -18)}
                    textAnchor="middle"
                    className={`text-[13px] transition-[fill] duration-500 motion-reduce:transition-none ${
                      on ? "fill-[color:var(--color-ink-900)] dark:fill-white" : "fill-[color:var(--color-ink-400)]"
                    }`}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={34} className="fill-[color:var(--color-gold-500)]/20" />
            <circle cx={CX} cy={CY} r={20} className="fill-[color:var(--color-gold-500)]" />
            <text x={CX} y={CY + 56} textAnchor="middle" className="fill-[color:var(--color-ink-900)] text-[14px] font-semibold dark:fill-white">
              Your EHR
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}
