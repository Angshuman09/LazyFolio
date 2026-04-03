"use client";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section className="hero-gradient max-w-3xl mx-auto px-6 pt-28 pb-32 text-center">
      <h1 className="fade-up fade-up-2 font-serif-display text-[clamp(3rem,7vw,4.8rem)] font-normal leading-[1.07] tracking-tight mb-6 text-(--lf-ink)">
        Build your portfolio <br />
        <strong className="font-serif-display font-bold">
          in{" "}
          <span className="inline-block text-fuchsia-400 animate-[glow_2s_ease-in-out_infinite]">
            minutes
          </span>
        </strong>
      </h1>
      <p className="fade-up fade-up-3 text-[1rem] text-(--lf-muted) leading-relaxed max-w-sm mx-auto mb-10">
        No deployment. No setup. Just create and share.
      </p>
      <button
        onClick={() => router.push("/sign-in")}
        className="fade-up fade-up-3 inline-flex items-center gap-2 bg-(--lf-ink) text-(--lf-surface) text-[0.9rem] font-semibold px-4 py-3.5 rounded-2xl border-2 border-(--lf-ink) hover:bg-(--lf-surface) hover:text-(--lf-ink) transition-all duration-300"
      >
        Get started for Free
        <span className="btn-arrow w-5 h-5 bg-(--lf-surface) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none">
          ↗
        </span>
      </button>
    </section>
  );
};

export default Hero;
