"use client";

import { useEffect, useRef, useState } from "react";

type Step = { number: string; title: string; body: string };

/**
 * Desktop: a pinned scene driven continuously by scroll. The section is N
 * screens tall; one panel sticks to the viewport. Scroll position becomes a
 * fractional step (`pos`, 0 to N-1) that is eased toward its target each frame,
 * so the rail fill, the step cross-fade and the line drawing all glide instead
 * of flipping. One passive scroll listener feeds a requestAnimationFrame loop
 * that stops itself once settled. Phones, no-JS and reduced-motion users get a
 * plain ordered list (reduced motion on desktop snaps to the target).
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
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function ScrollSteps({ heading, steps }: { heading: string; steps: readonly Step[] }) {
  const [pos, setPos] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const last = steps.length - 1;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let current = 0;
    let raf = 0;

    const measure = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      target = total > 0 ? clamp(-r.top / total) * last : 0;
    };
    const tick = () => {
      current += (target - current) * (reduce ? 1 : 0.1);
      if (Math.abs(target - current) < 0.0008) current = target;
      setPos(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    setPos(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [last]);

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

      {/* Desktop: pinned, scroll-linked scene */}
      <div ref={track} className="relative hidden lg:block" style={{ height: `${steps.length * 90}svh` }}>
        <div className="sticky top-24 grid h-[calc(100svh-6rem)] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-20">
          <div>
            <h2 className="max-w-xl font-serif text-3xl font-semibold tracking-tight text-brand-ink md:text-4xl">
              {heading}
            </h2>

            <div className="relative mt-12 flex gap-10">
              {/* Progress rail: the fill follows scroll continuously */}
              <div aria-hidden="true" className="relative ml-1 w-3.5 shrink-0">
                <span className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-1/2 bg-border" />
                <span
                  className="absolute top-2 bottom-2 left-1/2 w-px origin-top bg-[color:var(--step-accent)]"
                  style={{ transform: `translateX(-50%) scaleY(${pos / last})`, willChange: "transform" }}
                />
                {steps.map((s, i) => {
                  const on = clamp(pos - i + 0.35, 0, 0.35) / 0.35;
                  return (
                    <span
                      key={s.number}
                      className="absolute left-0 size-3.5 rounded-full border-2 border-border bg-background"
                      style={{ top: `calc(${(i / last) * 100}% - ${(i / last) * 14}px)` }}
                    >
                      <span
                        className="absolute -inset-0.5 rounded-full border-2 border-[color:var(--step-accent)] bg-[color:var(--step-accent)]"
                        style={{ opacity: on, transform: `scale(${0.6 + 0.4 * on})` }}
                      />
                    </span>
                  );
                })}
              </div>

              {/* One slot; steps cross-fade and slide with the fractional position */}
              <ol className="grid min-h-[16rem] flex-1">
                {steps.map((s, i) => {
                  const d = pos - i;
                  // Hold fully visible near its own step, fade out in the gap
                  // before the next one; neighbours never overlap or blur.
                  const o = clamp(1 - (Math.abs(d) - 0.22) * 3.6);
                  return (
                    <li
                      key={s.number}
                      aria-hidden={Math.abs(d) > 0.5}
                      className="col-start-1 row-start-1"
                      style={{
                        opacity: o,
                        transform: `translateY(${-clamp(d, -0.5, 0.5) * 28}px)`,
                        pointerEvents: o < 0.5 ? "none" : undefined,
                        willChange: "transform, opacity",
                      }}
                    >
                      <p className="font-serif text-5xl font-semibold tabular-nums text-brand-accent">{s.number}</p>
                      <h3 className="mt-3 font-serif text-2xl font-semibold text-brand-ink">{s.title}</h3>
                      <p className="mt-4 max-w-md text-lg leading-relaxed text-body-ink">{s.body}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <svg
            viewBox="0 25 520 405"
            role="img"
            aria-label="Practice workflow connecting to your EHR as each step completes"
            className="mx-auto max-h-[calc(100svh-9rem)] w-full"
          >
            {NODES.map((n) => {
              const r = smooth(clamp((pos - (n.from - 0.5)) / 0.5));
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
                  strokeDashoffset={len * (1 - r)}
                  className="stroke-[color:var(--step-line)]"
                />
              );
            })}
            {NODES.map((n) => {
              const r = smooth(clamp((pos - (n.from - 0.5)) / 0.5));
              const ty = n.y + (n.y > CY ? 28 : -18);
              return (
                <g key={n.label}>
                  <circle cx={n.x} cy={n.y} r={7} className="fill-[color:var(--step-idle)]" />
                  <circle cx={n.x} cy={n.y} r={7 + 2 * r} className="fill-[color:var(--step-line)]" style={{ opacity: r }} />
                  <text x={n.x} y={ty} textAnchor="middle" className="fill-[color:var(--step-idle-text)] text-[13px]">
                    {n.label}
                  </text>
                  <text
                    x={n.x}
                    y={ty}
                    textAnchor="middle"
                    className="fill-[color:var(--color-ink-900)] text-[13px] dark:fill-white"
                    style={{ opacity: r }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={34} className="fill-[color:var(--step-accent)]/20" />
            <circle cx={CX} cy={CY} r={20} className="pulse-ring fill-none stroke-[color:var(--step-accent)]" strokeWidth={1.5} />
            <circle cx={CX} cy={CY} r={20} className="fill-[color:var(--step-accent)]" />
            <text x={CX} y={CY + 56} textAnchor="middle" className="fill-[color:var(--color-ink-900)] text-[14px] font-semibold dark:fill-white">
              Your EHR
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}
