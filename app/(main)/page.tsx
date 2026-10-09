import Hero from "@/components/home-page/hero";
import Features from "@/components/home-page/Features";
import FAQ from "@/components/home-page/FAQ";
import CTA from "@/components/home-page/CTA";

export default function LazyfolioLanding() {
  return (
      <div className="block">
        <Hero />
        <Features />
        <FAQ />
        <CTA />
      </div>
  );
}
