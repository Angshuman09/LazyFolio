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
