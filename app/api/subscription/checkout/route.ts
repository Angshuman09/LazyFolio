import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { dodoClient, DODO_ARTICLE_PRODUCT_ID } from "@/lib/dodopayments";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  if (!DODO_ARTICLE_PRODUCT_ID) {
    return NextResponse.json(
      {
        error:
          "DODO_PAYMENTS_ARTICLE_PRODUCT_ID is not configured in the server environment.",
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

    const sessionResponse = await dodoClient.checkoutSessions.create({
      product_cart: [
        {
          product_id: DODO_ARTICLE_PRODUCT_ID,
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
    console.error("Dodo checkout session creation failed:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to initiate checkout session with Dodo Payments.",
      },
      { status: 500 }
    );
  }
}
