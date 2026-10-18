// Shared subscription-domain helper. Lives here (not in lib/dodopayments.ts) so
// consumers that only need access checks don't pull in the Dodo SDK.
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
