import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const isPeriodValid =
      !subscription?.currentPeriodEnd ||
      new Date(subscription.currentPeriodEnd) > new Date();

    const isActive = subscription?.status === "ACTIVE" && isPeriodValid;

    return NextResponse.json({
      subscription: subscription || null,
      isActive,
    });
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    return NextResponse.json(
      { error: "Failed to retrieve subscription status" },
      { status: 500 }
    );
  }
}
