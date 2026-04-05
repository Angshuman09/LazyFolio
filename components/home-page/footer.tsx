"use client";

import React from "react";
import { Twitter, Instagram, Github } from "lucide-react";

const Scallops = ({ className }: { className?: string }) => {
  const pathData = Array.from({ length: 40 })
    .map((_, i) => {
      const startX = i * 50;
      return `Q${startX + 25},0 ${startX + 50},20`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 2000 40" preserveAspectRatio="none" className={className}>
      <path d={`M0,40 L0,20 ${pathData} L2000,40 Z`} />
    </svg>
  );
};

const Footer = () => {
  return (
    <footer className="w-full flex flex-col pt-10 mt-10 relative z-10 overflow-hidden">
      {/* Top Wave */}
      <Scallops className="w-full h-8 md:h-12 fill-(--lf-surface) translate-y-1 relative z-10" />

      {/* Banner Section */}
      <div className="relative bg-(--lf-surface) py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden border-y border-(--lf-border-alpha)">
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee-scroll 25s linear infinite;
            display: flex;
            white-space: nowrap;
            width: fit-content;
          }
        `}</style>

        {/* Marquee Train */}
        <div className="w-full flex items-center overflow-hidden">
          <div className="animate-marquee items-center">
            {/* We duplicate the content to make the loop seamless (50% translation) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="font-serif-display text-5xl md:text-8xl text-(--lf-ink) italic px-12 tracking-wide">
                  Built fast. Looks effortless.
                </span>
                <span className="text-(--lf-glow) text-4xl md:text-6xl">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <Scallops className="w-full h-8 md:h-12 fill-(--lf-bg) -translate-y-1 relative z-20 pointer-events-none" />

      {/* Bottom Section */}
      <div className="bg-(--lf-bg) px-6 md:px-12 pt-8 pb-16 md:pb-20 text-(--lf-ink) relative z-30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-10 w-full">
            <h2 className="font-sans-body font-normal text-xl md:text-2xl lg:text-3xl max-w-3xl leading-snug text-(--lf-dimmed)">
              From sophisticated portfolios to high-converting landing pages,{" "}
              <br className="hidden md:block" /> there's a unique setup for
              every modern creator.
            </h2>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 w-full mt-4 md:mt-8 border-t border-(--lf-border-alpha) pt-8">
              <div className="flex items-center gap-4">
                <span className="font-serif-display text-5xl md:text-7xl tracking-tight leading-none text-(--lf-ink)">
                  Lazyfolio
                </span>
                <span
                  className="text-3xl hidden sm:inline-block md:text-4xl pb-1 animate-pulse"
                  role="img"
                  aria-label="sparkles"
                >
                  ✨
                </span>
              </div>

              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-3 bg-(--lf-surface) border border-(--lf-border) text-(--lf-sub) rounded-full hover:bg-(--lf-ink) hover:text-(--lf-bg) hover:border-(--lf-ink) transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-(--lf-surface) border border-(--lf-border) text-(--lf-sub) rounded-full hover:bg-(--lf-ink) hover:text-(--lf-bg) hover:border-(--lf-ink) transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-(--lf-surface) border border-(--lf-border) text-(--lf-sub) rounded-full hover:bg-(--lf-ink) hover:text-(--lf-bg) hover:border-(--lf-ink) transition-colors duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-2 text-sm text-(--lf-sub) font-medium gap-4">
              <span>
                © {new Date().getFullYear()} Lazyfolio. Designed for creators.
              </span>
              <div className="flex gap-6">
                {["Privacy Policy", "Terms of Service", "Contact Support"].map(
                  (l) => (
                    <a
                      key={l}
                      href="#"
                      className="hover:text-(--lf-ink) transition-colors duration-150"
                    >
                      {l}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
