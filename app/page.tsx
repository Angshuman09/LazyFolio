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
   <div className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink)">
      <Navbar />
      <Hero/>
      <HowToUse/>
      <Features/>
      <CTA/>
      <Footer/>
    </div>
  );
}