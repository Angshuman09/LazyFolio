import Hero from "@/components/home-page/hero";
import Features from "@/components/home-page/Features";
import CTA from "@/components/home-page/CTA";
import Footer from "@/components/home-page/footer";

export default function LazyfolioLanding() {
  return (
      <div className="block">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
  );
}
