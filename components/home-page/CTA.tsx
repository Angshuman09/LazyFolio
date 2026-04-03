"use client";

const CTA = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 md:px-6 mb-28">
      <div className="cta-gradient relative overflow-hidden bg-(--lf-surface) border border-(--lf-border-alpha) text-(--lf-ink) rounded-3xl px-8 py-20 text-center">
        {/* Decorative gradient orbs inside CTA */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute rounded-full"
            style={{
              width: "300px",
              height: "300px",
              top: "-20%",
              right: "-5%",
              background:
                "radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "250px",
              height: "250px",
              bottom: "-15%",
              left: "-5%",
              background:
                "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="font-serif-display text-[clamp(2rem,5vw,3rem)] font-bold leading-tight mb-4">
            Your Portfolio,
            <br />
            <span className="opacity-40">Finally Done Right.</span>
          </h2>
          <p className="text-[0.9rem] font-medium opacity-50 leading-relaxed mb-10 max-w-sm mx-auto">
            Set up in under 5 minutes. No design skills needed. Just pick your
            profession and go.
          </p>
          <a
            href="#"
            className="group inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-surface) hover:bg-(--lf-surface) border-2 border-(--lf-ink) hover:text-(--lf-ink) text-[0.88rem] font-semibold px-6 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
          >
            Start for free
            <span className="btn-arrow w-5 h-5 bg-(--lf-surface) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none group-hover:bg-(--lf-ink) group-hover:text-(--lf-surface)">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
