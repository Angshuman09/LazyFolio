import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { getArticlePlanFromProductId, getArticlePlanLabel } from "@/lib/dodopayments";
import { isSubscriptionActive } from "@/lib/subscription";
import { handleApiError } from "@/lib/errors/api";

export async function GET() {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const isActive = isSubscriptionActive(subscription);
    const plan = getArticlePlanFromProductId(subscription?.productId);

    return NextResponse.json({
      subscription: subscription || null,
      isActive,
      plan,
      planLabel: getArticlePlanLabel(plan),
    });
  } catch (error) {
    return handleApiError(error, "subscription/get");
  }
}
