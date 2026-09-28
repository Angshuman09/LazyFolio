import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/auth-api";
import { prisma } from "@/lib/prisma";
import { getDodoClient } from "@/lib/dodopayments";

export async function POST(req: NextRequest) {
  const { errorResponse, session } = await verifySession();
  if (errorResponse || !session) return errorResponse;

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.dodoCustomerId) {
      return NextResponse.json(
        { error: "No active customer record found for this account." },
        { status: 404 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "http://localhost:3000";

    const client = getDodoClient();
    const portalSession = await client.customers.customerPortal.create(
      subscription.dodoCustomerId,
      {
        return_url: `${origin}/dashboard?tab=articles`,
      }
    );

    if (!portalSession?.link) {
      return NextResponse.json(
        { error: "Failed to generate customer portal URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ portalUrl: portalSession.link });
  } catch (error: any) {
    console.error("Failed to generate Dodo customer portal:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate customer portal session.",
      },
      { status: 500 }
    );
  }
}
