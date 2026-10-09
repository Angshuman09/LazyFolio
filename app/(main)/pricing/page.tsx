import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { ArticlePaywall } from "@/components/dashboard/articles/article-paywall";

export const metadata: Metadata = {
  title: "Pricing | Lazyfolio",
  description:
    "Simple Lazyfolio pricing for publishing unlimited portfolio articles with rich markdown, images, custom slugs, and SEO.",
};

const highlights = [
  "2 free articles included",
  "Unlimited writing on any paid plan",
  "Markdown, images, custom slugs, and SEO",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-(--lf-bg) text-(--lf-ink) font-sans-body">
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-18 pb-8">

        <div className="text-center max-w-2xl mx-auto">
          <p className="font-mono text-[0.72rem] tracking-widest uppercase text-(--lf-muted) mb-4">
            Pricing
          </p>
          <h1 className="font-serif-display text-[2.7rem] sm:text-[4rem] leading-[1.02] font-normal tracking-tight mb-5">
            Publish more without clutter.
          </h1>
          <p className="text-[0.95rem] sm:text-[1.05rem] text-(--lf-muted) leading-relaxed">
            Keep the dashboard clean and choose the writing plan that fits how
            often you publish on your portfolio.
          </p>
        </div>

        <ul className="mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {highlights.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-[0.76rem] text-(--lf-muted)"
            >
              <Check size={12} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <ArticlePaywall freeLimit={2} />
      </section>
    </div>
  );
}
