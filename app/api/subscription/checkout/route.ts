import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { getDodoConfig, getDodoClient } from "@/lib/dodopayments";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  const { apiKey, productId, environment } = getDodoConfig();

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
    return NextResponse.json(
      {
        error:
          "DODO_PAYMENTS_ARTICLE_PRODUCT_ID is not configured in environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "http://localhost:3000";

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
  } catch (error: any) {
    console.error("Dodo checkout session creation failed:", {
      environment,
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 6) + "..." : "none",
      productId,
      errorStatus: error?.status,
      errorMessage: error?.message || error,
    });

    let friendlyMessage = error?.message || "Failed to initiate checkout session.";
    if (error?.status === 401) {
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
