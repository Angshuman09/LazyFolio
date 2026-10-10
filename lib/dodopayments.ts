import DodoPayments from "dodopayments";
import { ArticlePlan } from "./types/payment";

const ARTICLE_PLAN_LABELS: Record<ArticlePlan, string> = {
  monthly: "$5/month",
  yearly: "$39/year",
  lifetime: "$169 lifetime",
};

function cleanEnv(value?: string) {
  return (value || "").trim().replace(/^["']|["']$/g, "");
}

export function getDodoConfig() {
  const apiKey = cleanEnv(process.env.DODO_PAYMENTS_API_KEY);

  const rawEnv = cleanEnv(process.env.DODO_PAYMENTS_ENVIRONMENT).toLowerCase();

  const environment: "test_mode" | "live_mode" =
    rawEnv === "live_mode" || rawEnv === "live" ? "live_mode" : "test_mode";

  const productIds: Record<ArticlePlan, string> = {
    monthly:
      cleanEnv(process.env.DODO_PAYMENTS_ARTICLE_MONTHLY_PRODUCT_ID) ||
      cleanEnv(process.env.DODO_PAYMENTS_ARTICLE_PRODUCT_ID),
    yearly: cleanEnv(process.env.DODO_PAYMENTS_ARTICLE_YEARLY_PRODUCT_ID),
    lifetime: cleanEnv(process.env.DODO_PAYMENTS_ARTICLE_LIFETIME_PRODUCT_ID),
  };

  const productId = productIds.monthly;

  const webhookKey = cleanEnv(process.env.DODO_PAYMENTS_WEBHOOK_KEY);

  return { apiKey, environment, productId, productIds, webhookKey };
}

export function getArticleProductId(plan: ArticlePlan) {
  return getDodoConfig().productIds[plan];
}

export function getArticlePlanFromProductId(productId?: string | null): ArticlePlan | null {
  if (!productId) return null;

  const { productIds } = getDodoConfig();
  const match = (Object.entries(productIds) as Array<[ArticlePlan, string]>).find(
    ([, configuredProductId]) => configuredProductId && configuredProductId === productId,
  );

  return match?.[0] ?? null;
}

export function getArticlePlanLabel(plan?: ArticlePlan | null) {
  return plan ? ARTICLE_PLAN_LABELS[plan] : null;
}

export function getDodoClient() {
  const { apiKey, environment } = getDodoConfig();
  if (!apiKey) {
    throw new Error(
      "DODO_PAYMENTS_API_KEY is missing from environment variables."
    );
  }

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

// Lazy proxy for backwards compatibility
export const dodoClient = new Proxy({} as DodoPayments, {
  get(_target, prop) {
    const client = getDodoClient();
    return (client as unknown as Record<PropertyKey, unknown>)[prop];
  },
});
