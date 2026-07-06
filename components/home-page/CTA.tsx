"use client";

import { useRouter } from "next/navigation";

const CTA = () => {
  const router = useRouter();

  return (
    <section
      aria-label="Call to action"
      className="max-w-5xl mx-auto px-5 md:px-6 py-20"
    >
      <div className="bg-(--lf-surface) border border-(--lf-border) text-(--lf-ink) rounded-2xl px-6 sm:px-12 py-16 text-center">
        <h2 className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-normal leading-tight mb-4">
          Ready to Share What You{" "}
          <span className="text-[#c6a87b] italic">Create</span>?
        </h2>
        <p className="text-[0.92rem] text-(--lf-muted) leading-relaxed mb-8 max-w-md mx-auto">
        Create a beautiful portfolio, share your favorite links, and publish blogs, all from a single page.
        </p>
        <button
          onClick={() => router.push("/auth")}
          aria-label="Start building your portfolio for free"
          className="group inline-flex rounded-[8px] items-center gap-2 bg-(--lf-ink) text-(--lf-bg) border border-(--lf-ink) text-[0.88rem] font-semibold px-6 py-3.5 transition-opacity duration-150 hover:opacity-85 cursor-pointer active:scale-[0.97]"
        >
          Start for free
          <span
            aria-hidden="true"
            className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none"
          >
            ↗
          </span>
        </button>
      </div>
    </section>
  );
};

export default CTA;
