import { prisma } from "@/lib/prisma";
import { SubscriptionStatus } from "@/db/enums";
import {
  getArticlePlanFromProductId,
  getDodoClient,
  getDodoConfig,
} from "@/lib/dodopayments";
import { ArticlePlan } from "./types/payment";

export function isSubscriptionActive(
  subscription:
    | { status?: string | null; currentPeriodEnd?: Date | string | null }
    | null
    | undefined,
): boolean {
  if (!subscription || subscription.status !== "ACTIVE") return false;

  return (
    !subscription.currentPeriodEnd ||
    new Date(subscription.currentPeriodEnd) > new Date()
  );
}

/**
 * Reconciles subscription status directly with Dodo Payments API.
 * Useful if webhooks lag or when testing in test mode (e.g. localhost where webhooks can't reach).
 */
export async function syncSubscriptionWithDodo(
  userId: string,
  userEmail?: string | null,
) {
  if (!userEmail) return null;

  try {
    const { apiKey } = getDodoConfig();
    if (!apiKey) return null;

    const client = getDodoClient();
    const customers = await client.customers.list({
      email: userEmail,
      page_size: 5,
    });

    const customerList = customers.items || [];
    if (!customerList.length) {
      await prisma.subscription.updateMany({
        where: { userId },
        data: { status: SubscriptionStatus.INACTIVE },
      });
      return await prisma.subscription.findUnique({ where: { userId } });
    }

    // Collect all succeeded refunds for this customer to detect refunded charges
    const refundedPaymentIds = new Set<string>();
    for (const customer of customerList) {
      const customerId = customer.customer_id;
      if (!customerId) continue;

      try {
        const refundsList = await client.refunds.list({
          customer_id: customerId,
          status: "succeeded",
          page_size: 20,
        });
        for (const ref of refundsList.items || []) {
          if (ref.payment_id) refundedPaymentIds.add(ref.payment_id);
        }
      } catch (err) {
        console.warn("Failed to check Dodo refunds for customer:", err);
      }
    }

    for (const customer of customerList) {
      const customerId = customer.customer_id;
      if (!customerId) continue;

      try {
        // Fetch subscriptions & payments for customer
        const [subs, payments] = await Promise.all([
          client.subscriptions.list({
            customer_id: customerId,
            page_size: 10,
          }),
          client.payments.list({
            customer_id: customerId,
            page_size: 20,
          }),
        ]);

        const activeSubs = (subs.items || []).filter(
          (s) => s.status === "active",
        );
        const paymentItems = payments.items || [];

        // 1. Check subscriptions
        for (const activeSub of activeSubs) {
          const subPayments = paymentItems.filter(
            (p) =>
              p.subscription_id === activeSub.subscription_id ||
              p.subscription_ids?.includes(activeSub.subscription_id),
          );

          // If all payments for this subscription were refunded, the subscription is not active
          const hasRefundedAllPayments =
            subPayments.length > 0 &&
            subPayments.every(
              (p) =>
                p.refund_status === "full" ||
                p.refund_status === "partial" ||
                refundedPaymentIds.has(p.payment_id),
            );

          if (hasRefundedAllPayments) {
            continue;
          }

          const productId =
            activeSub.product_id || activeSub.subscription_id || null;
          const periodEnd = activeSub.next_billing_date
            ? new Date(activeSub.next_billing_date)
            : null;
          const periodStart = activeSub.created_at
            ? new Date(activeSub.created_at)
            : new Date();

          return await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              dodoSubscriptionId: activeSub.subscription_id,
              dodoCustomerId: customerId,
              status: SubscriptionStatus.ACTIVE,
              productId,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: activeSub.cancel_at_next_billing_date ?? false,
            },
            update: {
              dodoSubscriptionId: activeSub.subscription_id,
              dodoCustomerId: customerId,
              status: SubscriptionStatus.ACTIVE,
              productId: productId ?? undefined,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: activeSub.cancel_at_next_billing_date ?? false,
            },
          });
        }

        // 2. Check successful one-off payments (e.g. lifetime plan)
        const validPayment = paymentItems.find((p) => {
          if (p.status !== "succeeded") return false;
          if (p.refund_status === "full" || p.refund_status === "partial") return false;
          if (refundedPaymentIds.has(p.payment_id)) return false;
          if (
            p.dispute_status === "dispute_lost" ||
            p.dispute_status === "dispute_accepted"
          )
            return false;
          return true;
        });

        if (validPayment) {
          const metaPlan = typeof validPayment.metadata?.plan === "string"
            ? (validPayment.metadata.plan as ArticlePlan)
            : null;
          const productId = typeof validPayment.metadata?.productId === "string"
            ? validPayment.metadata.productId
            : null;
          const plan = metaPlan || getArticlePlanFromProductId(productId) || "lifetime";

          const periodStart = validPayment.created_at
            ? new Date(validPayment.created_at)
            : new Date();
          let periodEnd: Date | null = null;
          if (plan === "monthly") {
            periodEnd = new Date(periodStart);
            periodEnd.setMonth(periodEnd.getMonth() + 1);
          } else if (plan === "yearly") {
            periodEnd = new Date(periodStart);
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
          } else if (plan === "lifetime") {
            periodEnd = null;
          }

          if (!periodEnd || periodEnd > new Date()) {
            return await prisma.subscription.upsert({
              where: { userId },
              create: {
                userId,
                dodoCustomerId: customerId,
                status: SubscriptionStatus.ACTIVE,
                productId,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
                cancelAtPeriodEnd: false,
              },
              update: {
                dodoCustomerId: customerId,
                status: SubscriptionStatus.ACTIVE,
                productId: productId ?? undefined,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
              },
            });
          }
        }
      } catch (err) {
        console.warn("Failed to check Dodo subscriptions/payments for customer:", err);
      }
    }

    // No active subscription or valid payment found: deactivate local subscription
    await prisma.subscription.updateMany({
      where: { userId },
      data: {
        status: SubscriptionStatus.INACTIVE,
      },
    });
    return await prisma.subscription.findUnique({
      where: { userId },
    });
  } catch (err) {
    console.warn("Dodo subscription sync failed:", err);
  }

  return null;
}
