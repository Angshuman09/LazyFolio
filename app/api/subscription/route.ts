import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import {
  getArticlePlanFromProductId,
  getArticlePlanLabel,
  getDodoConfig,
} from "@/lib/dodopayments";
import { isSubscriptionActive, syncSubscriptionWithDodo } from "@/lib/subscription";
import { handleApiError } from "@/lib/errors/api";

export async function GET(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  const url = new URL(req.url);
  const shouldSync =
    url.searchParams.get("sync") === "true" ||
    url.searchParams.get("checkout") === "success";

  try {
    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const { apiKey, environment } = getDodoConfig();
    const isTestMode = environment === "test_mode";

    if (apiKey && (shouldSync || isTestMode)) {
      const synced = await syncSubscriptionWithDodo(
        session.user.id,
        session.user.email,
      );
      if (synced) {
        subscription = synced;
      }
    }

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
