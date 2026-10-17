"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const CTA = () => {
  const router = useRouter();

  return (
    <section
      aria-label="Call to action"
      className="max-w-5xl mx-auto px-5 md:px-6 py-15"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="bg-(--lf-surface) border border-(--lf-border) text-(--lf-ink) rounded-2xl px-6 sm:px-12 py-16 text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)]"
      >
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-normal leading-tight mb-4"
        >
          Ready to Share What You{" "}
          <span className="text-(--lf-accent-text) italic">Create</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.92rem] text-(--lf-muted) leading-relaxed mb-8 max-w-md mx-auto"
        >
          Create a beautiful portfolio, share your favorite links, and publish blogs, all from a single page.
        </motion.p>

        <button
          onClick={() => router.push("/auth")}
          aria-label="Start building your portfolio for free"
          className="group inline-flex rounded-full items-center gap-2 bg-(--lf-ink) text-(--lf-bg) border border-(--lf-ink) text-[0.88rem] font-semibold px-6 py-3.5 cursor-pointer"
        >
          Start for free
          <span
            aria-hidden="true"
            className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none"
          >
            ↗
          </span>
        </button>
      </motion.div>
    </section>
  );
};

export default CTA;
