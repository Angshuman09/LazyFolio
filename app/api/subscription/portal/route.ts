import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { getDodoClient } from "@/lib/dodopayments";
import { apiError, handleApiError } from "@/lib/errors/api";
import { getRequestOrigin } from "@/lib/utils/public-url";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.dodoCustomerId) {
      return apiError("No active customer record found for this account.", 404);
    }

    const origin = getRequestOrigin(req.nextUrl.origin);

    const isMock =
      process.env.NODE_ENV !== "production" &&
      (subscription.dodoCustomerId.startsWith("mock_") ||
        subscription.dodoCustomerId.startsWith("cust_demo") ||
        !process.env.DODO_PAYMENTS_API_KEY ||
        process.env.DODO_PAYMENTS_API_KEY === "mock" ||
        process.env.DODO_PAYMENTS_API_KEY.startsWith("your-"));

    if (isMock) {
      return NextResponse.json({
        portalUrl: `${origin}/dashboard?tab=articles&portal=mock`,
      });
    }

    if (!process.env.DODO_PAYMENTS_API_KEY) {
      return apiError("Payments are not configured. Please try again later.", 500);
    }

    const client = getDodoClient();
    const portalSession = await client.customers.customerPortal.create(
      subscription.dodoCustomerId,
      {
        return_url: `${origin}/dashboard?tab=articles`,
      }
    );

    if (!portalSession?.link) {
      console.error("Dodo customer portal session created without a link");
      return apiError("Failed to open the customer portal. Please try again.", 500);
    }

    return NextResponse.json({ portalUrl: portalSession.link });
  } catch (error) {
    return handleApiError(error, "subscription/portal");
  }
}
