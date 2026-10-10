"use client";

import { useCreateCheckoutSession } from "@/hooks/subscription";
import { authClient } from "@/lib/auth/auth-client";
import { ArticlePaywallProps, ArticlePlan } from "@/lib/types/payment";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { plans } from "@/lib/constants/sections";

export function ArticlePaywall({
  freeLimit = 2,
  inline = false,
  onClose,
}: ArticlePaywallProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const checkoutMutation = useCreateCheckoutSession();
  const pendingPlan = checkoutMutation.variables;
  const startCheckout = (plan: ArticlePlan) => {
    if (!isSessionPending && !session?.user) {
      router.push("/auth");
      return;
    }
    checkoutMutation.mutate(plan);
  };

  return (
    <div className={`w-full transition-all duration-200 ${inline ? "py-2" : "max-w-4xl mx-auto py-4 sm:py-6"}`}>
      <div
        className={`relative rounded-2xl border border-(--lf-border) bg-(--lf-surface) shadow-sm overflow-hidden ${inline ? "p-5 sm:p-7" : "p-6 sm:p-9"
          }`}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-lg border border-(--lf-border) bg-(--lf-bg) text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close pricing"
          >
            <X size={13} />
          </button>
        )}

        <div className="grid gap-3.5 lg:grid-cols-3 mb-6">
          {plans.map((plan) => {
            const isPending = checkoutMutation.isPending && pendingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl p-5 flex flex-col justify-between transition-all duration-200 ${plan.popular
                    ? "border-2 border-(--lf-ink) bg-(--lf-bg) shadow-md"
                    : "border border-(--lf-border) bg-(--lf-bg) hover:border-(--lf-muted)"
                  }`}
              >
                {/* Popular Pill Badge */}
                {plan.badge && (
                  <div
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[0.62rem] font-mono font-semibold tracking-wider shadow-xs whitespace-nowrap ${plan.popular
                        ? "bg-(--lf-ink) text-(--lf-bg)"
                        : "bg-(--lf-surface) border border-(--lf-border) text-(--lf-muted)"
                      }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mt-1 mb-1">
                    <span className="text-[0.72rem] font-mono tracking-widest text-(--lf-muted) font-semibold">
                      {plan.name}
                    </span>
                  </div>

                  <p className="text-[0.72rem] text-(--lf-muted) mb-3">
                    {plan.tagline}
                  </p>

                  <div className="flex items-baseline gap-1.5 pb-3 border-b border-(--lf-border-alpha)">
                    <span className="font-serif-display text-3xl sm:text-4xl font-normal text-(--lf-ink) tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-[0.78rem] text-(--lf-muted) font-mono">
                      {plan.cadence}
                    </span>
                  </div>

                  {plan.subtext && (
                    <div className="text-[0.7rem] text-(--lf-muted) mt-2 font-medium">
                      {plan.subtext}
                    </div>
                  )}

                  {/* Feature Bullets */}
                  <ul className="mt-4 space-y-2 mb-5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[0.74rem] text-(--lf-ink) leading-snug">
                        <Check size={13} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => startCheckout(plan.id)}
                  disabled={checkoutMutation.isPending || isSessionPending}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-4 h-9.5 rounded-xl text-[0.78rem] font-semibold cursor-pointer active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-sans-body whitespace-nowrap mt-2 ${plan.popular
                      ? "bg-(--lf-ink) text-(--lf-bg) hover:opacity-90 shadow-2xs"
                      : "border border-(--lf-border) bg-(--lf-surface) text-(--lf-ink) hover:border-(--lf-muted)"
                    }`}
                >
                  {isPending || isSessionPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>{isSessionPending ? "Checking..." : "Redirecting..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
