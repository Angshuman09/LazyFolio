"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Variants, motion, useInView, useReducedMotion } from "motion/react";
import { FEATURES } from "../assets/icons-features";
import {
  FeatureAnimationStyles,
  TemplatesAnimation,
  AnalyticsAnimation,
  PublishAnimation,
  DomainAnimation,
} from "./feature-animations";
import { DashedFrame } from "../ui/dashed-border";

const TILES = [
  { span: "md:col-span-2", wide: true },
  { span: "md:col-start-3 md:row-start-1 md:row-span-2", wide: false },
  { span: "", wide: false },
  { span: "", wide: false },
] as const;

const ORDER = [0, 1, 2, 3];
const STEP_MS = 4200;
const START_DELAY_MS = 600;

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const reducedCardVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

const Features = () => {
  const reduce = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { amount: 0.3 });

  const [active, setActive] = useState(-1); // tile currently animating (-1 = none)
  const [run, setRun] = useState(0); // bumped on every (re)play so the tile restarts
  const [hovered, setHovered] = useState<number | null>(null);

  // The loop: advance to the next tile every STEP_MS while the grid is on
  // screen and nothing is hovered.
  useEffect(() => {
    if (!inView || reduce) {
      setActive(-1);
      return;
    }
    if (hovered !== null) return;

    const first = active === -1;
    const id = window.setTimeout(
      () => {
        setActive(
          first ? ORDER[0] : ORDER[(ORDER.indexOf(active) + 1) % ORDER.length],
        );
        setRun((r) => r + 1);
      },
      first ? START_DELAY_MS : STEP_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, reduce, hovered, active, run]);

  const handleEnter = (i: number) => {
    if (reduce) return;
    setHovered(i);
    setActive(i);
    setRun((r) => r + 1); // replay from the start
  };

  const handleLeave = () => setHovered(null);

  const animations = [
    <TemplatesAnimation key="temp" />,
    <AnalyticsAnimation key="anal" />,
    <PublishAnimation key="pub" />,
    <DomainAnimation key="dom" />,
  ];

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-5 md:px-6 pb-24 scroll-mt-24 mt-25"
    >
      {/* Keyframes + tone classes used by the tile animations (render once) */}
      <FeatureAnimationStyles />

      <motion.h2
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif-display text-3xl sm:text-4xl font-normal leading-tight text-(--lf-ink) flex justify-center pb-10"
      >
        <span className="block w-fit tracking-wide">
          What’s <span className="text-(--lf-accent-text)">inside</span>
        </span>
      </motion.h2>

      {/* Bento grid */}
      <motion.div
        ref={gridRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className={[
          "max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 md:auto-rows-[minmax(290px,auto)] gap-4 md:gap-5",
          inView ? "fa-on" : "",
        ].join(" ")}
      >
        {FEATURES.map((f, i) => {
          const tile = TILES[i] ?? TILES[2];
          const isActive = active === i;

          return (
            <motion.article
              key={f.title}
              variants={reduce ? reducedCardVariants : cardVariants}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              className={[
                "group relative overflow-hidden rounded-2xl border border-(--lf-border) bg-(--lf-surface) p-4 sm:p-5",
                "flex flex-col gap-5",
                "transition-[border-color,box-shadow] duration-300",
                "hover:border-(--lf-muted)/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40",
                tile.span,
                tile.wide ? "md:flex-row md:items-stretch md:gap-7" : "",
              ].join(" ")}
            >
              {/* Illustration panel */}
              <div
                className={[
                  "relative min-h-47.5 flex-1 rounded-xl overflow-hidden",
                  tile.wide ? "md:basis-[58%] md:min-h-0" : "",
                ].join(" ")}
              >
                {/* Quiet dot texture, fades toward the edges */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "radial-gradient(var(--lf-border) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                    maskImage:
                      "radial-gradient(ellipse at center, black 30%, transparent 78%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse at center, black 30%, transparent 78%)",
                  }}
                />
                {/* `fa-play` runs this tile's animation once; the key remounts
                    it so every activation (loop or hover) starts from frame 0. */}
                <div
                  key={`${i}-${isActive ? run : "idle"}`}
                  className={["relative w-full h-full", isActive ? "fa-play" : ""].join(" ")}
                >
                  {animations[i]}
                </div>

                <DashedFrame />
              </div>

              {/* Copy: centred against the illustration in the wide tile */}
              <div
                className={[
                  "shrink-0",
                  tile.wide
                    ? "md:basis-[42%] md:flex md:flex-col md:justify-center md:px-1"
                    : "px-1 pb-1",
                ].join(" ")}
              >
                <h3
                  className={[
                    "font-serif-display leading-snug mb-1.5 text-(--lf-ink)",
                    tile.wide ? "text-[1.4rem]" : "text-[1.2rem]",
                  ].join(" ")}
                >
                  {f.title}
                </h3>
                <p className="text-[0.8rem] leading-relaxed text-(--lf-muted) max-w-[38ch]">
                  {f.desc}
                </p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Features;