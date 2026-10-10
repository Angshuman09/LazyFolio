import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import {
  getArticleProductId,
  getDodoConfig,
  getDodoClient,
} from "@/lib/dodopayments";
import { ArticlePlan } from "@/lib/types/payment";

const articlePlans = new Set<ArticlePlan>(["monthly", "yearly", "lifetime"]);

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  const { apiKey, environment } = getDodoConfig();
  const body = await req.json().catch(() => ({}));
  const requestedPlan = articlePlans.has(body?.plan) ? body.plan : "monthly";
  const productId = getArticleProductId(requestedPlan);

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "DODO_PAYMENTS_API_KEY is not configured in Vercel environment variables. Remember to Redeploy in Vercel after adding keys.",
      },
      { status: 500 }
    );
  }

  if (!productId) {
    const envName =
      requestedPlan === "monthly"
        ? "DODO_PAYMENTS_ARTICLE_MONTHLY_PRODUCT_ID"
        : requestedPlan === "yearly"
          ? "DODO_PAYMENTS_ARTICLE_YEARLY_PRODUCT_ID"
          : "DODO_PAYMENTS_ARTICLE_LIFETIME_PRODUCT_ID";

    return NextResponse.json(
      {
        error:
          `${envName} is not configured in environment variables.`,
      },
      { status: 500 }
    );
  }

  try {
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0]?.toLowerCase() || "";
    const port = host.split(":")[1] ? `:${host.split(":")[1]}` : "";
    const isLocal = hostname.endsWith(".localhost") || hostname === "localhost";
    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      (isLocal ? `http://localhost${port}` : (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"));

    const returnUrl = `${origin}/dashboard?tab=articles&checkout=success`;
    const client = getDodoClient();

    const sessionResponse = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      customer: {
        email: session.user.email,
        name: session.user.name || undefined,
      },
      metadata: {
        userId: session.user.id,
        plan: requestedPlan,
      },
      return_url: returnUrl,
    });

    if (!sessionResponse.checkout_url) {
      return NextResponse.json(
        { error: "Failed to generate Dodo checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: sessionResponse.checkout_url,
      sessionId: sessionResponse.session_id,
    });
  } catch (error: unknown) {
    const dodoError = error as { status?: number; message?: string };

    console.error("Dodo checkout session creation failed:", {
      environment,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 6) + "..." : "none",
      productId,
      requestedPlan,
      errorStatus: dodoError.status,
      errorMessage: dodoError.message || error,
    });

    let friendlyMessage = dodoError.message || "Failed to initiate checkout session.";
    if (dodoError.status === 401) {
      friendlyMessage = `Dodo Payments 401 Unauthorized: Your API key was rejected in '${environment}'. If your key is from the Dodo Test Dashboard, make sure DODO_PAYMENTS_ENVIRONMENT=test_mode is set in Vercel, or verify your key has not expired.`;
    }

    return NextResponse.json(
      {
        error: friendlyMessage,
      },
      { status: 500 }
    );
  }
}
