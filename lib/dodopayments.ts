import DodoPayments from "dodopayments";

export function getDodoConfig() {
  const apiKey = (process.env.DODO_PAYMENTS_API_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  const rawEnv = (process.env.DODO_PAYMENTS_ENVIRONMENT || "")
    .trim()
    .toLowerCase()
    .replace(/^["']|["']$/g, "");

  // Default to 'test_mode' unless explicitly specified as 'live_mode' or 'live'
  const environment: "test_mode" | "live_mode" =
    rawEnv === "live_mode" || rawEnv === "live" ? "live_mode" : "test_mode";

  const productId = (process.env.DODO_PAYMENTS_ARTICLE_PRODUCT_ID || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  const webhookKey = (process.env.DODO_PAYMENTS_WEBHOOK_KEY || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  return { apiKey, environment, productId, webhookKey };
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
    return (client as any)[prop];
  },
});
