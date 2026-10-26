"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PERKS, TEMPLATES } from "@/components/resources/extras";
import { motion, type Variants } from "motion/react";
import { lightEase } from "@/lib/motion";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: lightEase },
  },
};

const perkListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.25,
    },
  },
};

const perkItemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: lightEase },
  },
};

export default function TemplatesView() {
  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans-body">
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-20 pb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: lightEase }}
          className="inline-flex items-center gap-2 text-[0.72rem] tracking-widest text-(--lf-tan-text) mb-6 px-4 py-1.5"
        >
          11 Templates · Free Forever
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: lightEase }}
          className="font-serif-display text-[2.6rem] sm:text-[3.5rem] font-normal leading-[1.1] tracking-tight text-(--lf-ink) mb-5"
        >
          Find your{" "}
          <em className="not-italic text-(--lf-accent-text)">perfect</em> style.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: lightEase }}
          className="text-[0.95rem] sm:text-[1.05rem] text-(--lf-muted) leading-relaxed max-w-xl mx-auto mb-10"
        >
          Every template is crafted to present your work beautifully. Pick one,
          fill in your story, and go live in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: lightEase }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.85rem] font-semibold px-5 py-2.5 rounded-full hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
          >
            Get started
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 border border-(--lf-border) text-(--lf-muted) text-[0.85rem] font-medium px-5 py-2.5 rounded-full hover:text-(--lf-ink) hover:border-(--lf-muted) hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
          >
            See features
          </Link>
        </motion.div>

        <motion.ul
          variants={perkListVariants}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {PERKS.map((perk) => (
            <motion.li
              key={perk}
              variants={perkItemVariants}
              className="flex items-center gap-1.5 text-[0.75rem] text-(--lf-muted)"
            >
              <Check size={11} strokeWidth={2.5} className="shrink-0 opacity-60" />
              {perk}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-5 sm:px-8"
      >
        <div className="h-px bg-(--lf-border)" />
      </motion.div>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-14"
        >
          {TEMPLATES.map((t, i) => (
            // No card box: the preview is the only framed element, text sits
            // directly on the page background.
            <motion.article
              key={t.id}
              variants={cardVariants}
              className="group flex flex-col"
            >
              {/* Preview */}
              <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl border border-(--lf-border) bg-(--lf-surface) transition-colors duration-300">
                <Image
                  src={t.image}
                  alt={`${t.label} template preview`}
                  fill
                  sizes="(max-width: 640px) 92vw, 45vw"
                  priority={i < 2}
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>

              {/* Text */}
              <div className="pt-4 flex flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="flex items-baseline gap-2.5 font-semibold text-[1rem] text-(--lf-ink) leading-tight">
                    <span className="text-[0.7rem] font-mono font-normal text-(--lf-muted) opacity-70">
                      {String(t.id).padStart(2, "0")}
                    </span>
                    {t.label}
                  </h2>
                </div>

                <p className="mt-2 text-[0.82rem] text-(--lf-muted) leading-relaxed max-w-[46ch]">
                  {t.description}
                </p>

                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] font-mono text-(--lf-muted) opacity-70">
                  {t.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}