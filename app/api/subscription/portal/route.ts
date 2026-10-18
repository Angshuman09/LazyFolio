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
