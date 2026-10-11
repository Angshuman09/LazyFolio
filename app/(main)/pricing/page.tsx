import type { Metadata } from "next";
import PricingView from "@/components/pricing/pricing-view";

export const metadata: Metadata = {
  title: "Pricing | Lazyfolio",
  description:
    "Simple Lazyfolio pricing for publishing unlimited portfolio articles with rich markdown, images, custom slugs, and SEO.",
};

export default function PricingPage() {
  return <PricingView />;
}
