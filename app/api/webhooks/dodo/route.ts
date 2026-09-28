import { NextRequest, NextResponse } from "next/server";
import { getDodoConfig, getDodoClient } from "@/lib/dodopayments";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/db/enums";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headersList: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headersList[key.toLowerCase()] = val;
    });

    const { webhookKey } = getDodoConfig();
    const client = getDodoClient();

    let event: any;
    try {
      if (webhookKey) {
        event = client.webhooks.unwrap(rawBody, {
          headers: headersList,
          key: webhookKey,
        });
      } else {
        // Fallback for development if secret not yet provided
        console.warn("DODO_PAYMENTS_WEBHOOK_KEY is not set. Unsafe unwrap used.");
        event = client.webhooks.unsafeUnwrap(rawBody);
      }
    } catch (err: any) {
      console.error("Dodo webhook verification failed:", err?.message || err);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const eventType = event.type;
    const data = event.data;

    console.log(`[Dodo Webhook] Received event: ${eventType}`, {
      subscription_id: data?.subscription_id,
      customer_id: data?.customer?.customer_id,
    });

    if (
      eventType.startsWith("subscription.") ||
      eventType.startsWith("payment.")
    ) {
      // Find user ID via metadata or email
      let userId = data?.metadata?.userId as string | undefined;

      if (!userId && data?.customer?.email) {
        const foundUser = await prisma.user.findUnique({
          where: { email: data.customer.email },
          select: { id: true },
        });
        if (foundUser) {
          userId = foundUser.id;
        }
      }

      if (!userId && data?.subscription_id) {
        const existingSub = await prisma.subscription.findUnique({
          where: { dodoSubscriptionId: data.subscription_id },
          select: { userId: true },
        });
        if (existingSub) {
          userId = existingSub.userId;
        }
      }

      if (!userId) {
        console.warn("[Dodo Webhook] Could not associate event with a user:", eventType);
        return NextResponse.json({ received: true, note: "User not found" }, { status: 200 });
      }

      const subscriptionId = data?.subscription_id || null;
      const customerId = data?.customer?.customer_id || data?.customer_id || null;
      const productId = data?.product_id || null;
      const periodStart = data?.previous_billing_date
        ? new Date(data.previous_billing_date)
        : data?.created_at
          ? new Date(data.created_at)
          : new Date();
      const periodEnd = data?.next_billing_date
        ? new Date(data.next_billing_date)
        : null;
      const cancelAtPeriodEnd = data?.cancel_at_next_billing_date ?? false;

      switch (eventType) {
        case "subscription.active":
        case "subscription.renewed":
        case "subscription.updated": {
          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              dodoSubscriptionId: subscriptionId,
              dodoCustomerId: customerId,
              status: SubscriptionStatus.ACTIVE,
              productId,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd,
            },
            update: {
              dodoSubscriptionId: subscriptionId ?? undefined,
              dodoCustomerId: customerId ?? undefined,
              status: SubscriptionStatus.ACTIVE,
              productId: productId ?? undefined,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd,
            },
          });
          break;
        }

        case "subscription.cancelled": {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              status: SubscriptionStatus.CANCELLED,
              cancelAtPeriodEnd: true,
            },
          });
          break;
        }

        case "subscription.past_due": {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              status: SubscriptionStatus.PAST_DUE,
            },
          });
          break;
        }

        case "subscription.expired":
        case "subscription.failed": {
          await prisma.subscription.updateMany({
            where: { userId },
            data: {
              status: SubscriptionStatus.EXPIRED,
            },
          });
          break;
        }

        default:
          break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Error processing Dodo webhook:", err);
    return NextResponse.json(
      { error: "Webhook handler failed: " + (err?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
