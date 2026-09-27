import DodoPayments from "dodopayments";

const apiKey = process.env.DODO_PAYMENTS_API_KEY || "";
const environment =
  (process.env.DODO_PAYMENTS_ENVIRONMENT as "test_mode" | "live_mode") ||
  (process.env.NODE_ENV === "production" ? "live_mode" : "test_mode");

export const dodoClient = new DodoPayments({
  bearerToken: apiKey,
  environment,
});

export const DODO_ARTICLE_PRODUCT_ID =
  process.env.DODO_PAYMENTS_ARTICLE_PRODUCT_ID || "";

export const DODO_WEBHOOK_KEY = process.env.DODO_PAYMENTS_WEBHOOK_KEY || "";
