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
    <div className="font-sans-body min-h-screen bg-(--lf-surface) text-(--lf-ink) relative">
      {/* Decorative background grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-10 z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="main-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="var(--lf-ink)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#main-grid)" />
        </svg>
      </div>

      <div className="relative z-10 block">
        <Navbar />
        <Hero />
        <HowToUse />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
