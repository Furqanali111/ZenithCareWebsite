/**
 * A slowly turning wireframe globe with the three service lines wired together
 * inside it. Latitudes are fixed; each meridian is a circle whose width scales
 * with the cosine of its angle (`meridian-turn`), which reads as rotation.
 * Transform only, off under reduced motion. Decorative: the same lines are
 * real links elsewhere on the page.
 */
const R = 150;
const LATS = [-105, -60, 0, 60, 105];
const MERIDIANS = [0, 1, 2, 3];
const NODES = [
  { label: "Care management", x: -62, y: -58 },
  { label: "Revenue cycle", x: 72, y: -6 },
  { label: "Virtual staffing", x: -18, y: 66 },
] as const;

export function OrbitVisual() {
  return (
    <svg viewBox="-200 -190 400 380" aria-hidden="true" focusable="false" className="mx-auto w-full max-w-lg">
      <defs>
        <radialGradient id="globe-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-teal-500)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--color-teal-500)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={R} fill="url(#globe-core)" />
      <g className="fill-none stroke-[color:var(--color-teal-600)]/45 dark:stroke-[color:var(--color-teal-400)]/45" strokeWidth={1}>
        {LATS.map((y) => {
          const rx = Math.sqrt(R * R - y * y);
          return <ellipse key={y} cy={y} rx={rx} ry={rx * 0.2} />;
        })}
        {MERIDIANS.map((i) => (
          <ellipse
            key={i}
            rx={R}
            ry={R}
            className="meridian"
            style={{ animationDelay: `${-i * 4}s` }}
          />
        ))}
      </g>
      <circle r={R} className="fill-none stroke-[color:var(--color-teal-600)] dark:stroke-[color:var(--color-teal-400)]" strokeWidth={1.5} />

      <g className="stroke-[color:var(--step-accent)]" strokeWidth={1.2}>
        <line x1={NODES[0].x} y1={NODES[0].y} x2={NODES[1].x} y2={NODES[1].y} />
        <line x1={NODES[1].x} y1={NODES[1].y} x2={NODES[2].x} y2={NODES[2].y} />
        <line x1={NODES[2].x} y1={NODES[2].y} x2={NODES[0].x} y2={NODES[0].y} />
      </g>
      {NODES.map((n, i) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
          <g className={`float-y ${i === 1 ? "float-y-b" : i === 2 ? "float-y-c" : ""}`}>
            <polygon
              points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5"
              className="fill-[color:var(--step-accent)] stroke-[color:var(--color-surface-0)] dark:stroke-[color:var(--color-brand-900)]"
              strokeWidth={2}
            />
            <text y={-20} textAnchor="middle" className="fill-[color:var(--color-ink-900)] text-[13px] font-medium dark:fill-white">
              {n.label}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
