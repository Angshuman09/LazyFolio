"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home-page/navbar";
import Hero from "@/components/home-page/hero";
import HowToUse from "@/components/home-page/how-to-use";
import Features from "@/components/home-page/Features";
import CTA from "@/components/home-page/CTA";
import Footer from "@/components/home-page/footer";
export default function LazyfolioLanding() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="font-sans-body min-h-screen bg-(--lf-surface) text-(--lf-ink) relative overflow-hidden">
      {/* Floating orb decorations (dark mode only) */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden dark:block">
        <div
          className="orb"
          style={{
            width: "500px",
            height: "500px",
            top: "-10%",
            left: "15%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            animationDelay: "0s",
          }}
        />
        <div
          className="orb"
          style={{
            width: "400px",
            height: "400px",
            top: "30%",
            right: "-5%",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
            animationDelay: "4s",
          }}
        />
        <div
          className="orb"
          style={{
            width: "350px",
            height: "350px",
            bottom: "10%",
            left: "-5%",
            background:
              "radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%)",
            animationDelay: "8s",
          }}
        />
      </div>

      {/* Decorative background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-100 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="main-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="var(--lf-grid-color, var(--lf-ink))"
                strokeWidth="1"
              />
            </pattern>
            {/* Radial mask so grid fades out toward edges */}
            <radialGradient id="grid-fade" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#main-grid)"
            mask="url(#grid-mask)"
          />
        </svg>
      </div>

      {/* Noise texture overlay */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-1 hidden dark:block" />

      <div className="relative z-10 block">
        <Navbar />
        <Hero />

        {/* Shimmer divider between sections */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="shimmer-line" />
        </div>

        <HowToUse />

        <div className="max-w-2xl mx-auto mb-4">
          <div className="shimmer-line" />
        </div>

        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
