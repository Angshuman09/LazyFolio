import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import {
  getArticleProductId,
  getDodoConfig,
  getDodoClient,
} from "@/lib/dodopayments";
import { ArticlePlan } from "@/lib/types/payment";
import { apiError, handleApiError } from "@/lib/errors/api";
import { getRequestOrigin } from "@/lib/utils/public-url";

const articlePlans = new Set<ArticlePlan>(["monthly", "yearly", "lifetime"]);

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  const { apiKey, environment } = getDodoConfig();
  const body = await req.json().catch(() => ({}));
  const requestedPlan = articlePlans.has(body?.plan) ? body.plan : "monthly";
  const productId = getArticleProductId(requestedPlan);

  if (!apiKey) {
    console.error("Dodo checkout failed: DODO_PAYMENTS_API_KEY is not configured");
    return apiError("Payments are not configured. Please try again later.", 500);
  }

  if (!productId) {
    console.error(
      `Dodo checkout failed: no product id configured for plan "${requestedPlan}" in ${environment}`,
    );
    return apiError("Payments are not configured. Please try again later.", 500);
  }

  try {
    const origin = getRequestOrigin(req.nextUrl.origin);
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
      console.error("Dodo checkout session created without a checkout_url");
      return apiError("Failed to start checkout. Please try again.", 500);
    }

    return NextResponse.json({
      checkoutUrl: sessionResponse.checkout_url,
      sessionId: sessionResponse.session_id,
    });
  } catch (error: unknown) {
    const dodoError = error as { status?: number; message?: string };

    // Log full detail server-side; only surface a stable, actionable message.
    console.error("Dodo checkout session creation failed:", {
      environment,
      productId,
      requestedPlan,
      errorStatus: dodoError.status,
      errorMessage: dodoError.message || error,
    });

    if (dodoError.status === 401) {
      return apiError(
        "Payment provider rejected the request. Please try again later.",
        502,
      );
    }

    return handleApiError(error, "subscription/checkout");
  }
}
