"use client";
import { Highlighter } from "../ui/highlighter";

const Hero = () => {
  return (
    <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center mt-5">

      {/* Badge */}
      <div className="fade-up fade-up-1 inline-flex w-fit items-center gap-2 mt-5 mb-12 sm:mb-14 px-4 py-2 rounded-full border border-(--lf-border) bg-(--lf-surface) mx-auto">
        <div className="relative flex size-3 items-center justify-center">
          <span className="absolute w-5 h-5 rounded-full bg-orange-400 opacity-40 animate-ping"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-orange-300 z-10"></span>
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.13em] text-(--lf-muted)">
          No Code Portfolio
        </span>
      </div>

      {/* Craft a stunning portfolio, without touching the messy stuff. */}

      {/* Headline — 3-line rhythm, italic highlight */}
      <h1 className="fade-up fade-up-2 home-hero-title font-serif-display font-normal mb-10 sm:mb-12 text-(--lf-ink)">
        A polished{" "}
        <Highlighter action="underline" color="#F59E0B">
          <em>portfolio</em>
        </Highlighter>
        ,
        <br />
        without the busywork.
      </h1>

      {/* Description — use --lf-tan-text for readable warmth, not washed-out muted */}

      {/* CTA row */}
      <div className="fade-up fade-up-3 flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-3 w-full px-4 sm:px-0 max-w-[460px] mx-auto mb-10 mt-17">
        <label className="flex items-center flex-1 min-w-0 rounded-[14px] border border-(--lf-border) bg-(--lf-surface) px-6 sm:px-4 min-h-[56px] sm:min-h-[52px] gap-2 sm:gap-1 transition-colors duration-150 focus-within:border-(--lf-tan) cursor-text">
          <span className="font-mono text-[0.8125rem] text-(--lf-muted) whitespace-nowrap select-none shrink-0">
            lazyfolio.com/
          </span>
          <input
            type="text"
            placeholder="yourname"
            className="bg-transparent border-none outline-none font-mono text-[0.8125rem] font-medium text-(--lf-ink) w-full min-w-0 placeholder:text-(--lf-dimmed)"
          />
        </label>
        <button className="group inline-flex items-center justify-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.875rem] font-semibold min-h-[56px] sm:min-h-[52px] px-6 rounded-[14px] hover:opacity-85 active:scale-[0.97] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0">
          Claim username
          <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[10px] font-bold leading-none shrink-0">
            ↗
          </span>
        </button>
      </div>

      {/* Social proof */}
      {/* <div className="fade-up fade-up-3 flex items-center justify-center gap-3">
        <div className="flex">
          {["#d4b08c", "#c49478", "#b47860", "#9e6048"].map((bg, i) => (
            <div
              key={i}
              className="w-[26px] h-[26px] rounded-full border-2 border-(--lf-bg) -ml-2 first:ml-0"
              style={{ background: bg, zIndex: 4 - i }}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] tracking-wide text-(--lf-sub)">
          <span className="text-(--lf-tan-text) font-semibold">2,400+</span>{" "}
          creators already live
        </p>
      </div> */}

      <div>
        <h1 className="text-5xl font-normal pt-12 font-serif-display">How to use?</h1>
        <p>video will be attached after deployment :)</p>
      </div>

    </section>
  );
};

export default Hero;