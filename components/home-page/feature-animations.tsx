import type { CSSProperties } from "react";

/*
  Per-tile animation
  ──────────────────
  Each tile's motion is authored against a 16s timeline, but only the first
  ~4s moves; the rest is rest state. A tile plays once when its wrapper gets
  the `fa-play` class (added by <Features /> for the tile whose turn it is in
  the loop, or the one being hovered). Every animated element carries `.fa-a`
  and an optional per-element `--d` stagger. Each tile finishes inside ~3.9s.
*/

const dly = (s: string) => ({ "--d": s }) as CSSProperties;

/* ─── Shared CSS (render <FeatureAnimationStyles /> once) ─── */
const CSS = `
.fa-play .fa-a {
  animation-duration: 16s;
  animation-delay: var(--d, 0s);
  animation-iteration-count: 1;
  animation-fill-mode: backwards;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* tones (work in light + dark) */
.fa-t1 { background: color-mix(in srgb, var(--lf-muted) 16%, transparent); }
.fa-t2 { background: color-mix(in srgb, var(--lf-muted) 28%, transparent); }
.fa-t3 { background: color-mix(in srgb, var(--lf-muted) 48%, transparent); }

/* rest positions */
.fa-mid     { transform: translate(9px, 7px); }
.fa-fan-bot { transform: translate(18px, 15px); }
.fa-chip    { color: var(--lf-muted); border-color: var(--lf-border); }

/* animation names */
.fa-fan-top  { animation-name: fa-fan-top; }
.fa-fan-bot  { animation-name: fa-fan-bot; }
.fa-edit     { animation-name: fa-edit; transform-origin: left; }
.fa-reveal   { animation-name: fa-reveal; }
.fa-fill     { animation-name: fa-fill; transform-origin: left; }
.fa-travel   { animation-name: fa-travel; }
.fa-lit      { animation-name: fa-lit; }
.fa-fade     { animation-name: fa-fade; }
.fa-type     { animation-name: fa-type; transform-origin: left; }
.fa-caret    { animation-name: fa-caret; }
.fa-on .fa-blink { animation: fa-blink 1.1s steps(1) infinite; }

/* Templates: stack fans out, then settles (done by 21% ≈ 3.4s) */
@keyframes fa-fan-top {
  0%   { transform: translate(0, 0) rotate(0); }
  8%, 14% { transform: translate(-14px, -12px) rotate(-2deg); }
  21%, 100% { transform: translate(0, 0) rotate(0); }
}
@keyframes fa-fan-bot {
  0%   { transform: translate(18px, 15px) rotate(0); }
  8%, 14% { transform: translate(32px, 26px) rotate(3deg); }
  21%, 100% { transform: translate(18px, 15px) rotate(0); }
}
@keyframes fa-edit {
  0%   { transform: scaleX(1); }
  7%   { transform: scaleX(0.5); }
  14%, 100% { transform: scaleX(1); }
}

/* Analytics: chart wipes in, bars refill (done by 16% + 0.6s ≈ 3.2s) */
@keyframes fa-reveal {
  0%   { clip-path: inset(0 0 0 0); opacity: 1; }
  2%   { clip-path: inset(0 0 0 0); opacity: 0; }
  2.1% { clip-path: inset(0 100% 0 0); opacity: 0; }
  3%   { clip-path: inset(0 100% 0 0); opacity: 1; }
  15%, 100% { clip-path: inset(0 0 0 0); opacity: 1; }
}
@keyframes fa-fill {
  0%   { transform: scaleX(1); }
  4%   { transform: scaleX(0.08); }
  16%, 100% { transform: scaleX(1); }
}

/* Share: pulse travels hub → platform, platform lights up
   (last node starts at 1.35s, finishes by 1.35s + 2.5s ≈ 3.9s) */
@keyframes fa-travel {
  0%   { left: 50%; top: 50%; opacity: 0; }
  1%   { left: 50%; top: 50%; opacity: 1; }
  6%   { left: var(--tx); top: var(--ty); opacity: 1; }
  6.5%, 100% { left: var(--tx); top: var(--ty); opacity: 0; }
}
@keyframes fa-lit {
  0%, 5% { color: var(--lf-muted); border-color: var(--lf-border); transform: scale(1); }
  8%     { color: var(--lf-accent-text); border-color: var(--lf-accent-text); transform: scale(1.1); }
  15%, 100% { color: var(--lf-muted); border-color: var(--lf-border); transform: scale(1); }
}

/* Blogs: content types in line by line (last line starts at 1.6s, done ≈ 3.8s) */
@keyframes fa-fade {
  0%   { opacity: 1; }
  2%, 6% { opacity: 0; }
  14%, 100% { opacity: 1; }
}
@keyframes fa-type {
  0%   { transform: scaleX(1); }
  2%, 3% { transform: scaleX(0); }
  14%, 100% { transform: scaleX(1); }
}
@keyframes fa-caret {
  0%   { opacity: 1; }
  2%, 13% { opacity: 0; }
  14%, 100% { opacity: 1; }
}
@keyframes fa-blink { 50% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .fa-play .fa-a, .fa-on .fa-blink { animation: none !important; }
}
`;

export const FeatureAnimationStyles = () => <style>{CSS}</style>;

/* ─── 1. Templates ─── stack of three layouts that fans out */
export const TemplatesAnimation = () => (
  <div className="absolute inset-0" aria-hidden>
    {/* back: list layout */}
    <div className="fa-a fa-fan-bot absolute left-[17%] top-[14%] h-[62%] w-[58%] overflow-hidden rounded-xl border border-(--lf-border) bg-(--lf-surface)">
      <div className="flex flex-col gap-2.5 p-3">
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex items-center gap-2">
            <div className="fa-t1 size-4 rounded" />
            <div className="fa-t1 h-1.5 flex-1 rounded-full" />
          </div>
        ))}
      </div>
    </div>

    {/* middle: grid layout */}
    <div className="fa-mid absolute left-[17%] top-[14%] h-[62%] w-[58%] overflow-hidden rounded-xl border border-(--lf-border) bg-(--lf-surface)">
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="fa-t2 h-7 rounded-md" />
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <div className="fa-t1 rounded-md" />
          <div className="fa-t1 rounded-md" />
        </div>
      </div>
    </div>

    {/* front: profile layout */}
    <div className="fa-a fa-fan-top absolute left-[17%] top-[14%] h-[62%] w-[58%] overflow-hidden rounded-xl border border-(--lf-muted)/50 bg-(--lf-surface) shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)]">
      <div className="flex h-full flex-col gap-2.5 p-3">
        <div className="flex items-center gap-2.5">
          <div className="fa-t2 size-7 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <div className="fa-a fa-edit fa-t3 h-1.5 w-2/3 rounded-full" />
            <div className="fa-t1 h-1 w-1/3 rounded-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="fa-t1 h-1 w-full rounded-full" />
          <div className="fa-t1 h-1 w-5/6 rounded-full" />
          <div className="fa-t1 h-1 w-2/3 rounded-full" />
        </div>
        <div className="mt-auto grid grid-cols-3 gap-1.5">
          <div className="fa-t1 h-6 rounded" />
          <div className="fa-t1 h-6 rounded" />
          <div className="fa-t1 h-6 rounded" />
        </div>
      </div>
    </div>
  </div>
);

/* ─── 2. Analytics ─── mini dashboard, fills the tall tile */
const PTS: [number, number][] = [
  [0, 31], [11, 27], [22, 29], [33, 21], [44, 23],
  [55, 15], [66, 18], [77, 10], [88, 12], [96, 5],
];

// Catmull-Rom → cubic bezier, for a smooth line
const smooth = (pts: [number, number][]) => {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0]},${p2[1]}`;
  }
  return d;
};

const LINE = smooth(PTS);
const AREA = `${LINE} L96,40 L0,40 Z`;
const LAST = PTS[PTS.length - 1];

const METRICS = [
  { label: "Visitors", w: "78%", d: "0.3s" },
  { label: "Clicks", w: "52%", d: "0.45s" },
  { label: "Engagement", w: "64%", d: "0.6s" },
];

export const AnalyticsAnimation = () => (
  <div className="absolute inset-0 flex flex-col gap-4 p-4 sm:p-5" aria-hidden>
    {/* headline stat */}
    <div className="flex items-end justify-between">
      <div>
        <p className="text-[0.7rem] leading-none text-(--lf-muted)">Visitors</p>
        <p className="font-sans-body mt-1.5 text-[1.7rem] leading-none text-(--lf-ink)">
          12.4k
        </p>
      </div>
      <span className="text-[0.7rem] text-(--lf-accent-text)">+8.2%</span>
    </div>

    {/* chart */}
    <div className="fa-a fa-reveal relative min-h-0 flex-1" style={dly("0s")}>
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="fa-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--lf-muted)", stopOpacity: 0.28 }} />
            <stop offset="100%" style={{ stopColor: "var(--lf-muted)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        {[10, 20, 30].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="var(--lf-border)"
            strokeWidth="1"
            strokeDasharray="2 4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={AREA} fill="url(#fa-area)" />
        <path
          d={LINE}
          fill="none"
          stroke="var(--lf-muted)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-(--lf-accent-text) bg-(--lf-surface)"
        style={{ left: `${LAST[0]}%`, top: `${(LAST[1] / 40) * 100}%` }}
      />
    </div>

    {/* metric rows */}
    <div className="flex flex-col gap-3">
      {METRICS.map((m) => (
        <div key={m.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-[0.68rem] text-(--lf-muted)">{m.label}</span>
          <div className="fa-t1 h-1 flex-1 overflow-hidden rounded-full">
            <div
              className="fa-a fa-fill fa-t3 h-full rounded-full"
              style={{ width: m.w, ...dly(m.d) }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── 3. Share ─── one link, pulses out to each platform */
const NODES = [
  { x: 12, y: 27, d: "0s", icon: <span className="text-[0.8rem] font-semibold">𝕏</span> },
  { x: 88, y: 27, d: "0.45s", icon: <span className="text-[0.68rem] font-bold">in</span> },
  { x: 12, y: 73, d: "0.9s", icon: <span className="text-[0.85rem]">@</span> },
  {
    x: 88,
    y: 73,
    d: "1.35s",
    icon: (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11 11 5M6 5h5v5" />
      </svg>
    ),
  },
];

export const PublishAnimation = () => (
  <div className="absolute inset-0" aria-hidden>
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      {NODES.map((n) => (
        <line
          key={`${n.x}-${n.y}`}
          x1="50"
          y1="50"
          x2={n.x}
          y2={n.y}
          stroke="var(--lf-border)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>

    {/* travelling pulses */}
    {NODES.map((n) => (
      <span
        key={`dot-${n.x}-${n.y}`}
        className="fa-a fa-travel absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--lf-accent-text) opacity-0 shadow-[0_0_8px_var(--lf-accent-text)]"
        style={{ "--tx": `${n.x}%`, "--ty": `${n.y}%`, ...dly(n.d) } as CSSProperties}
      />
    ))}

    {/* platforms */}
    {NODES.map((n) => (
      <span
        key={`chip-${n.x}-${n.y}`}
        className="fa-a fa-chip fa-lit absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-(--lf-surface)"
        style={{ left: `${n.x}%`, top: `${n.y}%`, ...dly(n.d) }}
      >
        {n.icon}
      </span>
    ))}

    {/* hub */}
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border border-(--lf-muted)/50 bg-(--lf-surface) px-3 py-1.5 text-[0.7rem] text-(--lf-ink) shadow-[0_6px_20px_-10px_rgba(0,0,0,0.35)]">
      <svg viewBox="0 0 16 16" className="size-3 text-(--lf-muted)" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 9.5a2.5 2.5 0 0 0 3.5 0l2-2a2.5 2.5 0 0 0-3.5-3.5l-.5.5M9.5 6.5a2.5 2.5 0 0 0-3.5 0l-2 2a2.5 2.5 0 0 0 3.5 3.5l.5-.5" />
      </svg>
      lazyfolio/you
    </div>
  </div>
);

/* ─── 4. Blogs ─── an article page that types itself in */
const TypeLine = ({
  w,
  d,
  h = "h-1.5",
  tone = "fa-t1",
}: {
  w: string;
  d: string;
  h?: string;
  tone?: string;
}) => (
  <div
    className={`fa-a fa-type ${h} ${tone} rounded-full`}
    style={{ width: w, ...dly(d) }}
  />
);

export const DomainAnimation = () => (
  <div className="absolute inset-0" aria-hidden>
    {/* page peeks up from the bottom edge, so nothing floats in empty space */}
    <div className="absolute inset-x-[9%] bottom-0 top-5 flex flex-col gap-3 overflow-hidden rounded-t-xl border border-b-0 border-(--lf-border) bg-(--lf-surface) p-3.5">
      <div
        className="fa-a fa-fade fa-t1 flex h-[72px] shrink-0 items-center justify-center rounded-lg"
        style={dly("0s")}
      >
        <svg viewBox="0 0 40 20" className="h-5 text-(--lf-muted)/60" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 18 12 6l8 12M15 18l9-9 10 9" />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <TypeLine w="66%" h="h-2.5" tone="fa-t3" d="0.25s" />
        <div className="mt-1 flex flex-col gap-2">
          <TypeLine w="100%" d="0.7s" />
          <TypeLine w="92%" d="1s" />
          <TypeLine w="97%" d="1.3s" />
          <div className="relative">
            <TypeLine w="58%" d="1.6s" />
            <span
              className="fa-a fa-caret absolute top-1/2 -translate-y-1/2"
              style={{ left: "calc(58% + 4px)", ...dly("1.6s") }}
            >
              <span className="fa-blink block h-2.5 w-px bg-(--lf-accent-text)" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);