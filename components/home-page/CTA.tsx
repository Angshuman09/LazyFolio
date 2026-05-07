"use client";

const CTA = () => {
  return (
    <section className="max-w-5xl mx-auto px-5 md:px-6 mb-24">
      <div className="bg-(--lf-surface) border border-(--lf-border) text-(--lf-ink) rounded-lg px-6 sm:px-8 py-14 text-center">
        <h2 className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-normal leading-tight mb-4">
          Ready when your work is.
        </h2>
        <p className="text-[0.92rem] text-(--lf-muted) leading-relaxed mb-8 max-w-md mx-auto">
          Start with a clean profile, add your best links, and publish a page
          that feels considered from the first view.
        </p>
        <a
          href="#"
          className="group inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-bg) border border-(--lf-ink) text-[0.88rem] font-semibold px-6 py-3.5 rounded-xl transition-opacity duration-150 hover:opacity-88"
        >
          Start for free
          <span className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
};

export default CTA;
