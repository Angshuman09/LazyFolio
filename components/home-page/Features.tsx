"use client";

import { useEffect, useRef, useState } from "react";
import { Variants, motion, useInView, useReducedMotion } from "motion/react";
import { FEATURES } from "../assets/icons-features";
import {
  FeatureAnimationStyles,
  TemplatesAnimation,
  AnalyticsAnimation,
  PublishAnimation,
  DomainAnimation,
} from "./feature-animations";

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

  const [active, setActive] = useState(-1);
  const [run, setRun] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

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
    setRun((r) => r + 1);
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
      <FeatureAnimationStyles />

      <motion.h2
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif-display text-3xl sm:text-4xl font-normal leading-tight text-(--lf-ink) flex justify-center pb-10"
      >
        <span className="block w-fit tracking-wide">
          What's <span className="text-(--lf-accent-text)">inside</span>
        </span>
      </motion.h2>

      {/* 2×2 square bento grid */}
      <motion.div
        ref={gridRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className={[
          "max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5",
          inView ? "fa-on" : "",
        ].join(" ")}
      >
        {FEATURES.map((f, i) => {
          const isActive = active === i;

          return (
            <motion.article
              key={f.title}
              variants={reduce ? reducedCardVariants : cardVariants}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={handleLeave}
              className="group relative w-full aspect-square overflow-hidden rounded-2xl bg-(--lf-surface) border border-(--lf-border) p-5 sm:p-6 flex flex-col justify-between"
            >
              {/* Illustration area — fills the upper space of the square */}
              <div className="relative w-full flex-1 min-h-0 overflow-hidden">
                <div
                  key={`${i}-${isActive ? run : "idle"}`}
                  className={[
                    "relative w-full h-full",
                    isActive ? "fa-play" : "",
                  ].join(" ")}
                >
                  {animations[i]}
                </div>
              </div>

              {/* Text — pinned at the bottom */}
              <div className="shrink-0 pt-3">
                <h3 className="font-sans text-[0.95rem] font-semibold leading-snug mb-1 text-(--lf-ink)">
                  {f.title}
                </h3>
                <p className="text-[0.8rem] leading-relaxed text-(--lf-muted) max-w-[36ch]">
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
