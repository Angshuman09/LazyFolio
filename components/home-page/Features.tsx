"use client";

import { FEATURES } from "../assets/icons-features";
import {
  TemplatesAnimation,
  AnalyticsAnimation,
  PublishAnimation,
  DomainAnimation,
} from "./feature-animations";

const Features = () => {
  const animations = [
    <TemplatesAnimation key="temp" />,
    <AnalyticsAnimation key="anal" />,
    <PublishAnimation key="pub" />,
    <DomainAnimation key="dom" />,
  ];

  return (
    <section
      id="features"
      className="max-w-7xl mx-auto px-5 md:px-6 pb-24 scroll-mt-24"
    >
      <h1 className="text-xl sm:text-xl font-semibold leading-tight text-center text-(--lf-ink) w-full flex items-center justify-center mb-4">
        <span className="block w-fit text-[#c6a87b] tracking-wide">
        ~Features~
        </span>
      </h1>

      {/* 2x2 Square Grid */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-7">
        {FEATURES.map((f, i) => (
          <article
            key={f.title}
            className="group w-full aspect-square rounded-2xl border border-(--lf-border)/60 bg-(--lf-surface) p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-zinc-200/30 dark:hover:shadow-black/30 hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            {/* Illustration */}
            {/* Illustration — takes ~70% of card height */}
            <div className="w-full flex-1 min-h-0 basis-[70%] rounded-xl overflow-hidden border border-zinc-200/60 dark:border-zinc-500/40">
              {animations[i]}
            </div>

            {/* Content pinned to bottom */}
            <div className="shrink-0">
              <h3 className="font-serif-display pt-3 text-[1.2rem] leading-snug mb-1 text-(--lf-ink)">
                {f.title}
              </h3>
              <p className="text-[0.72rem] leading-relaxed text-(--lf-muted)">
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
