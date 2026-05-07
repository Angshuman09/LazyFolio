"use client";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="hero-gradient max-w-3xl mx-auto px-6 pt-28 pb-32 text-center relative">
      {/* Subtle badge above headline */}
      <div className="fade-up fade-up-1 inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-(--lf-border-alpha) bg-(--lf-accent-soft) text-[0.75rem] font-medium tracking-wide text-(--lf-muted)">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
        Templates for creators & devs
      </div>

      <h1 className="fade-up fade-up-2 font-serif-display text-[clamp(3rem,7vw,4.8rem)] font-normal leading-[1.07] tracking-tight mb-6 text-(--lf-ink)">
        Build your portfolio <br />
        <strong className="font-serif-display font-bold">
          in{" "}
          <span className="inline-block text-violet-400 dark:gradient-text animate-[glow_2s_ease-in-out_infinite]">
            minutes
          </span>
        </strong>
      </h1>

      <p className="fade-up fade-up-3 text-[1.05rem] text-(--lf-muted) leading-relaxed max-w-md mx-auto mb-10">
        No deployment. No setup. Just create and share.
        <br />
        {/* <span className="text-(--lf-dimmed) text-[0.9rem]">
          Beautiful portfolios in under 5 minutes.
        </span> */}
      </p>

      <div className="fade-up fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-3">
        <input type="text" placeholder="Enter your username" />
        <button className="group inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-surface) text-[0.9rem] font-semibold px-3 py-3.5 rounded-2xl border-1 border-(--lf-ink) transition-all duration-300 ">
          Get your username
          <span className="btn-arrow w-5 h-5 bg-(--lf-surface) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
            ↗
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;
