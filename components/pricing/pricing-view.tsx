"use client";

import { Check } from "lucide-react";
import { ArticlePaywall } from "@/components/dashboard/articles/article-paywall";
import { motion, type Variants } from "motion/react";
import { lightEase } from "@/lib/motion";

const highlights = [
  "2 free articles included",
  "Unlimited writing on any paid plan",
  "Markdown, images, custom slugs, and SEO",
];

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: lightEase },
  },
};

export default function PricingView() {
  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans-body">
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-18 pb-8">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: lightEase }}
            className="font-serif-display text-[2.7rem] sm:text-[4rem] leading-[1.02] font-normal tracking-tight mb-5"
          >
            Publish more without clutter.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: lightEase }}
            className="text-[0.95rem] sm:text-[1.05rem] text-(--lf-muted) leading-relaxed"
          >
            Keep the dashboard clean and choose the writing plan that fits how
            often you publish on your portfolio.
          </motion.p>
        </div>

        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {highlights.map((item) => (
            <motion.li
              key={item}
              variants={itemVariants}
              className="flex items-center gap-1.5 text-[0.76rem] text-(--lf-muted)"
            >
              <Check size={12} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: lightEase }}
        className="max-w-6xl mx-auto px-5 sm:px-8 pb-20"
      >
        <ArticlePaywall freeLimit={2} />
      </motion.section>
    </div>
  );
}
