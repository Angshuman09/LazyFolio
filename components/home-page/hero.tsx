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
        <button
          onClick={() => router.push("/sign-in")}
          className="group inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-surface) text-[0.9rem] font-semibold px-6 py-3.5 rounded-2xl border-2 border-(--lf-ink) hover:bg-(--lf-surface) hover:text-(--lf-ink) transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
        >
          Get started for Free
          <span className="btn-arrow w-5 h-5 bg-(--lf-surface) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none group-hover:bg-(--lf-ink) group-hover:text-(--lf-surface)">
            ↗
          </span>
        </button>

        <a
          href="https://github.com/Angshuman09/lazyfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) transition-colors duration-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Star on GitHub
        </a>
      </div>
    </section>
  );
};

export default Hero;
