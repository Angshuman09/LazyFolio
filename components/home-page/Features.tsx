'use client'

import { GlowCard } from "./card-component"
import { FEATURES } from "../assets/icons"

const Features = () => {
  return (
          <section
        id="features"
        className="max-w-5xl mx-auto px-4 md:px-6 pb-28 scroll-mt-24"
      >
        <h2 className="font-serif-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight tracking-tight mb-10 text-center text-(--lf-ink)">
          Simple, Clear, Useful for
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 max-w-4xl mx-auto">
          {FEATURES.map((f) => (
            <GlowCard
              key={f.title}
              className={[
                f.span,
                "rounded-2xl border min-h-50 p-6 flex flex-col justify-between",
                f.accent
                  ? "border-(--lf-border-alpha) bg-(--lf-tan)"
                  : "border-(--lf-border-alpha) bg-(--lf-surface)",
              ].join(" ")}
              glowColor="rgba(255,255,255,0.16)"
            >
              {/* Top row: icon + tag */}
              <div className="flex items-start justify-between">
                <span className={f.accent ? "text-(--lf-tan-text) opacity-50" : "text-(--lf-muted) opacity-60"}>
                  {f.icon}
                </span>
                <span
                  className={[
                    "text-[0.62rem] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 border",
                    f.accent
                      ? "text-(--lf-tan-text) border-current opacity-60"
                      : "text-(--lf-muted) border-(--lf-border-alpha)",
                  ].join(" ")}
                >
                  {f.tag}
                </span>
              </div>

              {/* Bottom row: title + desc */}
              <div className="mt-8">
                <h3
                  className={[
                    "font-semibold text-[1.05rem] leading-snug mb-1.5",
                    f.title === "Beautiful Templates"
                      ? "font-serif-display text-[1.4rem] font-bold"
                      : "",
                    "text-(--lf-ink)",
                  ].join(" ")}
                >
                  {f.title}
                </h3>
                <p
                  className={[
                    "text-[0.76rem] leading-relaxed max-w-xs",
                    f.accent ? "text-(--lf-tan-text)" : "text-(--lf-muted)",
                  ].join(" ")}
                >
                  {f.desc}
                </p>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>
  )
}

export default Features