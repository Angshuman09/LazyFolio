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
    if (!customerList.length) return null;

    for (const customer of customerList) {
      const customerId = customer.customer_id;
      if (!customerId) continue;

      // 1. Check subscriptions
      try {
        const subs = await client.subscriptions.list({
          customer_id: customerId,
          page_size: 5,
        });

        const activeSub = (subs.items || []).find(
          (s) => s.status === "active" || s.status === "on_hold",
        );

        if (activeSub) {
          const productId =
            activeSub.product_id || activeSub.subscription_id || null;
          const periodEnd = activeSub.next_billing_date
            ? new Date(activeSub.next_billing_date)
            : null;
          const periodStart = activeSub.created_at
            ? new Date(activeSub.created_at)
            : new Date();

          const synced = await prisma.subscription.upsert({
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
          return synced;
        }
      } catch (err) {
        console.warn("Failed to check Dodo subscriptions for customer:", err);
      }

      // 2. Check successful one-off payments (e.g. lifetime plan or recent payment)
      try {
        const payments = await client.payments.list({
          customer_id: customerId,
          status: "succeeded",
          page_size: 5,
        });

        const successfulPayment = (payments.items || [])[0];
        if (successfulPayment) {
          const metaPlan = typeof successfulPayment.metadata?.plan === "string"
            ? (successfulPayment.metadata.plan as ArticlePlan)
            : null;
          const productId = typeof successfulPayment.metadata?.productId === "string"
            ? successfulPayment.metadata.productId
            : null;
          const plan = metaPlan || getArticlePlanFromProductId(productId) || "lifetime";

          if (plan) {
            const periodStart = successfulPayment.created_at
              ? new Date(successfulPayment.created_at)
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

            const synced = await prisma.subscription.upsert({
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
            return synced;
          }
        }
      } catch (err) {
        console.warn("Failed to check Dodo payments for customer:", err);
      }
    }
  } catch (err) {
    console.warn("Dodo subscription sync failed:", err);
  }

  return null;
}
