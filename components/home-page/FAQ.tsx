"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { faqs } from "@/lib/constants/sections";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const bounce = { type: "spring", stiffness: 380, damping: 18 } as const;

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: bounce },
};

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="faq"
        className="max-w-4xl mx-auto px-5 md:px-6 py-20 scroll-mt-24"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={bounce}
            className="font-serif-display text-3xl sm:text-4xl font-normal leading-tight text-(--lf-ink)"
          >
            A few things{" "}
            <span className="text-(--lf-accent-text)">people</span> ask.
          </motion.h2>
        </div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="border-y border-(--lf-border)"
        >
          {faqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            const id = `faq-${index}`;

            return (
              <motion.div
                key={faq.question}
                variants={itemVariants}
                className="py-5 border-(--lf-border) not-last:border-b"
              >
                <motion.button
                  type="button"
                  id={`${id}-trigger`}
                  aria-expanded={isOpen}
                  aria-controls={`${id}-panel`}
                  onClick={() => toggle(index)}
                  whileTap={{ scale: 0.98 }}
                  transition={bounce}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[0.96rem] font-semibold text-(--lf-ink)"
                >
                  <span>{faq.question}</span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={bounce}
                    className="shrink-0 text-(--lf-muted)"
                  >
                    +
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`${id}-panel`}
                      role="region"
                      aria-labelledby={`${id}-trigger`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { type: "spring", stiffness: 300, damping: 24 },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 pb-1 max-w-2xl text-[0.86rem] leading-relaxed text-(--lf-muted)">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </MotionConfig>
  );
}