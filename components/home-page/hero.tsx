"use client";
import { Highlighter } from "../ui/highlighter";

const Hero = () => {
  return (
    <section className="home-hero max-w-5xl mx-auto px-5 sm:px-8 text-center mt-15">

      <h1 className="fade-up fade-up-2 home-hero-title font-serif-display font-normal mb-10 sm:mb-10 text-(--lf-ink)">
        A polished{" "}
        <Highlighter action="underline" color="#8B5CF6">
          portfolio
        </Highlighter>
        ,
        <br/>
        without the busywork.
      </h1>

      <p className="tracking-wider font-serif-display">Build your portfolio in <span className="text-(--lf-tan-text) font-bold"><em>minutes</em></span>, not after hours of tweaking layouts and writing everything from <span className="text-(--lf-tan-text) font-bold"><em>scratch</em></span>.</p>

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
        <button 

        className="group inline-flex items-center justify-center gap-2 bg-(--lf-ink) text-(--lf-bg) text-[0.875rem] font-semibold min-h-[56px] sm:min-h-[52px] px-6 rounded-[14px] hover:opacity-85 active:scale-[0.97] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0">
          Claim username
          <span className="btn-arrow w-5 h-5 rounded-full bg-(--lf-bg) text-(--lf-ink) inline-flex items-center justify-center text-[10px] font-bold leading-none shrink-0">
            ↗
          </span>
        </button>
      </div>

      <div>
        <h1 className="text-5xl font-normal pt-12 font-serif-display">
          How to use?
        </h1>
        <p>video will be attached after deployment :)</p>
      </div>
    </section>
  );
};

export default Hero;
