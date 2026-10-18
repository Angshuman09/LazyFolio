import type { ArticlePlan } from "@/lib/types/payment";

// Single source of truth for article-support plan pricing. Imported by both
// server (API routes, dodo client) and client (paywall, pricing UI), so it
// must stay free of server-only imports.
export const ARTICLE_PLANS: ArticlePlan[] = ["monthly", "yearly", "lifetime"];

export const PLAN_PRICES: Record<ArticlePlan, string> = {
  monthly: "$5",
  yearly: "$39",
  lifetime: "$169",
};

// Human-readable price label, e.g. "$5/month".
export const PLAN_PRICE_LABELS: Record<ArticlePlan, string> = {
  monthly: `${PLAN_PRICES.monthly}/month`,
  yearly: `${PLAN_PRICES.yearly}/year`,
  lifetime: `${PLAN_PRICES.lifetime} lifetime`,
};

// Copy fragment listing every plan, used in upgrade prompts.
export const PLAN_PRICE_SUMMARY = `${PLAN_PRICES.monthly}/month, ${PLAN_PRICES.yearly}/year, or ${PLAN_PRICES.lifetime} lifetime`;

// Number of internal articles a non-supporter can publish.
export const FREE_ARTICLE_LIMIT = 2;
