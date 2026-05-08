"use client";

import { FEATURES } from "../assets/icons-features";

const Features = () => {
  return (
    <section
      id="features"
      className="max-w-5xl mx-auto px-5 md:px-6 pb-24 scroll-mt-24"
    >
      <h2 className="font-serif-display text-4xl sm:text-5xl font-normal leading-tight tracking-tight mb-3 text-center text-(--lf-ink)">
        Everything you need. Nothing extra.
      </h2>
      <p className="text-center text-(--lf-muted) text-sm leading-relaxed max-w-xl mx-auto mb-10">
        Lazyfolio keeps the builder focused on the essentials, so the final page
        feels clean and intentional.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="rounded-lg hover:border-slate-600 border min-h-44 p-6 flex flex-col justify-between border-(--lf-border) bg-(--lf-surface)"
          >
            <div className="flex items-start justify-between">
              <span className="text-(--lf-muted)">{f.icon}</span>
              <span
                className={[
                  "text-[0.62rem] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 border",
                  "text-(--lf-muted) border-(--lf-border)",
                ].join(" ")}
              >
                {f.tag}
              </span>
            </div>
            <div className="mt-7">
              <h3
                className={[
                  "font-semibold text-[1.02rem] leading-snug mb-1.5",
                  "text-(--lf-ink)",
                ].join(" ")}
              >
                {f.title}
              </h3>
              <p
                className={[
                  "text-[0.76rem] leading-relaxed max-w-xs",
                  "text-(--lf-muted)",
                ].join(" ")}
              >
                {f.desc}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;
