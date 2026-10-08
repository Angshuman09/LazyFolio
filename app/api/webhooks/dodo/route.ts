import { NextRequest, NextResponse } from "next/server";
import {
  ArticlePlan,
  getArticlePlanFromProductId,
  getDodoConfig,
  getDodoClient,
} from "@/lib/dodopayments";
import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/db/enums";

const articlePlans = new Set<ArticlePlan>(["monthly", "yearly", "lifetime"]);

type DodoEventData = {
  metadata?: Record<string, unknown> | null;
  customer?: {
    customer_id?: string | null;
    email?: string | null;
  } | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  subscription_ids?: string[] | null;
  product_id?: string | null;
  product_cart?: Array<{ product_id?: string | null }> | null;
  previous_billing_date?: string | null;
  created_at?: string | null;
  next_billing_date?: string | null;
  cancel_at_next_billing_date?: boolean | null;
};

function getPrimarySubscriptionId(data: DodoEventData) {
  return data?.subscription_id || data?.subscription_ids?.[0] || null;
}

function getPrimaryProductId(data: DodoEventData) {
  return data?.product_id || data?.product_cart?.[0]?.product_id || null;
}

function getPlanFromEvent(data: DodoEventData, productId?: string | null): ArticlePlan | null {
  const metadataPlan = data?.metadata?.plan;
  if (typeof metadataPlan === "string" && articlePlans.has(metadataPlan as ArticlePlan)) {
    return metadataPlan as ArticlePlan;
  }

  return getArticlePlanFromProductId(productId);
}

function getFallbackPeriodEnd(plan: ArticlePlan | null, start: Date) {
  if (plan === "monthly") {
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return end;
  }

  if (plan === "yearly") {
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    return end;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const headersList: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headersList[key.toLowerCase()] = val;
    });

    const { webhookKey } = getDodoConfig();
    const client = getDodoClient();

    let event: { type: string; data: DodoEventData };
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
    } catch (err: unknown) {
      console.error("Dodo webhook verification failed:", err instanceof Error ? err.message : err);
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

      const subscriptionId = getPrimarySubscriptionId(data);

      if (!userId && subscriptionId) {
        const existingSub = await prisma.subscription.findUnique({
          where: { dodoSubscriptionId: subscriptionId },
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

      const customerId = data?.customer?.customer_id || data?.customer_id || null;
      const productId = getPrimaryProductId(data);
      const plan = getPlanFromEvent(data, productId);
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

        case "payment.succeeded": {
          if (!plan) break;

          const isSubscriptionPayment =
            Boolean(subscriptionId) || (data?.subscription_ids?.length ?? 0) > 0;
          const currentPeriodEnd = isSubscriptionPayment
            ? periodEnd || getFallbackPeriodEnd(plan, periodStart)
            : getFallbackPeriodEnd(plan, periodStart);

          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              dodoSubscriptionId: subscriptionId,
              dodoCustomerId: customerId,
              status: SubscriptionStatus.ACTIVE,
              productId,
              currentPeriodStart: periodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd: false,
            },
            update: {
              dodoSubscriptionId: subscriptionId ?? undefined,
              dodoCustomerId: customerId ?? undefined,
              status: SubscriptionStatus.ACTIVE,
              productId: productId ?? undefined,
              currentPeriodStart: periodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd: false,
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
  } catch (err: unknown) {
    console.error("Error processing Dodo webhook:", err);
    return NextResponse.json(
      {
        error:
          "Webhook handler failed: " +
          (err instanceof Error ? err.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
