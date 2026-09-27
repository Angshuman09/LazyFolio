"use client";

import { useOpenCustomerPortal, SubscriptionInfo } from "@/hooks/subscription";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";

interface Props {
  subscription?: SubscriptionInfo | null;
}

export function SubscriptionBadge({ subscription }: Props) {
  const portalMutation = useOpenCustomerPortal();

  const formattedRenewal = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-4 rounded-xl border border-(--lf-border) bg-(--lf-surface) mb-6">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Sparkles size={14} />
        </div>
        <div>
          <div className="text-[0.82rem] font-semibold text-(--lf-ink) flex items-center gap-2">
            <span>Writer Subscription Active</span>
            <span className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium uppercase">
              $10/mo
            </span>
          </div>
          {formattedRenewal && (
            <div className="text-[0.72rem] text-(--lf-muted)">
              {subscription?.cancelAtPeriodEnd
                ? `Expires on ${formattedRenewal}`
                : `Next billing date: ${formattedRenewal}`}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => portalMutation.mutate()}
        disabled={portalMutation.isPending}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--lf-border) bg-(--lf-bg) text-[0.75rem] font-medium text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) transition-all cursor-pointer disabled:opacity-50 font-sans-body whitespace-nowrap self-start sm:self-auto"
      >
        {portalMutation.isPending ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            <span>Opening portal...</span>
          </>
        ) : (
          <>
            <span>Manage billing</span>
            <ExternalLink size={11} />
          </>
        )}
      </button>
    </div>
  );
}
