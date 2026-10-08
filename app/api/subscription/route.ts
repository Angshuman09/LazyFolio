import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { getArticlePlanFromProductId, getArticlePlanLabel } from "@/lib/dodopayments";

const FREE_ARTICLE_LIMIT = 2;

export async function GET() {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const articleCount = await prisma.blog.count({
      where: {
        profile: {
          userId: session.user.id,
        },
        type: "INTERNAL",
      },
    });

    const isPeriodValid =
      !subscription?.currentPeriodEnd ||
      new Date(subscription.currentPeriodEnd) > new Date();

    const isActive = subscription?.status === "ACTIVE" && isPeriodValid;
    const plan = getArticlePlanFromProductId(subscription?.productId);

    return NextResponse.json({
      subscription: subscription || null,
      isActive,
      plan,
      planLabel: getArticlePlanLabel(plan),
      articleUsage: {
        count: articleCount,
        freeLimit: FREE_ARTICLE_LIMIT,
        remaining: Math.max(FREE_ARTICLE_LIMIT - articleCount, 0),
      },
    });
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subscription status" },
      { status: 500 }
    );
  }
}
