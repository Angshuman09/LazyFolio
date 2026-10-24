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
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {TEMPLATES.map((t, i) => (
            <motion.article
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex flex-col rounded-2xl border border-(--lf-border) bg-(--lf-surface) overflow-hidden hover:border-(--lf-muted) hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative w-full aspect-4/3 overflow-hidden bg-(--lf-border-alpha)">
                <Image
                  src={t.image}
                  alt={`${t.label} template preview`}
                  fill
                  sizes="(max-width: 640px) 92vw, 45vw"
                  priority={i < 2}
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-(--lf-bg)/85 backdrop-blur-sm border border-(--lf-border-alpha) flex items-center justify-center">
                  <span className="text-[0.65rem] font-mono font-semibold text-(--lf-muted)">
                    0{t.id}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h2 className="font-semibold text-[0.95rem] text-(--lf-ink) leading-tight">
                    {t.label}
                  </h2>
                  <span className="shrink-0 text-[0.68rem] font-mono text-(--lf-muted) border border-(--lf-border) rounded-full px-2 py-0.5 leading-none mt-0.5">
                    {t.preview}
                  </span>
                </div>

                <p className="text-[0.78rem] text-(--lf-muted) leading-relaxed flex-1 mb-3">
                  {t.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] font-medium font-mono text-(--lf-muted) bg-(--lf-accent-soft) border border-(--lf-border-alpha) rounded-full px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: lightEase }}
          className="rounded-2xl border border-(--lf-border) bg-(--lf-surface) px-8 py-12 text-center"
        >
          <p className="text-[0.68rem] tracking-widest text-(--lf-muted) mb-3">
            Ready to go live?
          </p>
          <h2 className="font-serif-display text-[1.9rem] sm:text-[2.4rem] font-normal tracking-tight text-(--lf-ink) leading-snug mb-3">
            Your portfolio deserves a home.
          </h2>
          <p className="text-[0.88rem] text-(--lf-muted) max-w-sm mx-auto mb-7 leading-relaxed">
            Claim your unique link, choose a template, and share your work with
            the world in under 5 minutes.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.85rem] font-semibold px-6 py-3.5 rounded-full hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
          >
            Claim your link
            <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[9px] font-bold leading-none">
              ↗
            </span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
