"use client";

import { useCreateCheckoutSession } from "@/hooks/subscription";
import { ArrowRight, Loader2, Heart } from "lucide-react";

export function ArticlePaywall() {
  const checkoutMutation = useCreateCheckoutSession();
  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 px-2">
      <div className="rounded-2xl border border-(--lf-border) bg-(--lf-surface) shadow-sm overflow-hidden p-6 sm:p-10 transition-all duration-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-(--lf-border) bg-(--lf-bg) text-[0.72rem] font-mono text-(--lf-muted) mb-5">
          <Heart size={12} />
          <span>Support Me</span>
        </div>

        <h1 className="font-serif-display text-2xl sm:text-3xl text-(--lf-ink) tracking-tight mb-3">
          Unlock Article Publishing on Lazyfolio
        </h1>
        <p className="text-[0.88rem] sm:text-[0.95rem] text-(--lf-muted) leading-relaxed mb-8">
          Share your engineering thoughts, tutorials, and case studies directly from your personal
          brand. Subscribe to start writing and publishing without limits.
        </p>

        {/* Pricing card */}
        <div className="rounded-xl border border-(--lf-border) bg-(--lf-bg) p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-display text-4xl sm:text-5xl font-medium text-(--lf-ink)">
                $10
              </span>
              <span className="text-[0.88rem] text-(--lf-muted) font-sans-body">/ month</span>
            </div>
            <p className="text-[0.78rem] text-(--lf-muted) mt-1">
              Cancel or pause anytime. No long-term lock-in.
            </p>
          </div>

          <button
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-(--lf-ink) text-(--lf-bg) text-[0.85rem] font-semibold cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-sans-body whitespace-nowrap"
          >
            {checkoutMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Subscribe for $10/mo</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[0.78rem] text-(--lf-muted) italic">
          Your support means a lot :)
        </p>

        {checkoutMutation.isError && (
          <p className="mt-3 text-center text-[0.78rem] text-red-500 font-sans-body">
            Something went wrong starting checkout. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}