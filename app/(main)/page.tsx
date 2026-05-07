import Navbar from "@/components/home-page/navbar";
import Hero from "@/components/home-page/hero";
import Features from "@/components/home-page/Features";
import CTA from "@/components/home-page/CTA";
import Footer from "@/components/home-page/footer";

export default function LazyfolioLanding() {
  return (
    <div className="font-sans-body min-h-screen bg-(--lf-bg) text-(--lf-ink)">
      <div className="block">
        <Navbar />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
