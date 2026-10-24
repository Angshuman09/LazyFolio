"use client";

import { useCreateCheckoutSession } from "@/hooks/subscription";
import { authClient } from "@/lib/auth/auth-client";
import { ArticlePlan } from "@/lib/types/payment";
import { Loader2, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { plans } from "@/lib/constants/sections";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { lightEase } from "@/lib/motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: lightEase },
  }),
};

interface SupportMeModalProps {
  onClose: () => void;
}

export function SupportMeModal({ onClose }: SupportMeModalProps) {
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
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.22, ease: lightEase }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="relative pointer-events-auto w-full max-w-xl bg-(--lf-bg) border border-(--lf-border) rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div className="px-7 pt-9 pb-8 text-center border-b border-(--lf-border-alpha)">
            <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-rose-500/10 flex items-center justify-center">
              <Heart size={16} className="text-rose-500" fill="currentColor" />
            </div>
            <p className="text-[0.75rem] text-(--lf-muted) mb-2">
              Support Lazyfolio
            </p>
            <h2 className="font-serif-display text-[1.6rem] font-normal text-(--lf-ink) leading-tight mb-3">
              Free for everyone,{" "}
              <span className="italic text-(--lf-accent-text)">always</span>.
            </h2>
            <p className="text-[0.85rem] text-(--lf-muted) leading-relaxed max-w-md mx-auto">
            If Lazyfolio has been useful to you, you can chip in below and get article image uploads as a small thank you.
            </p>
          </div>

          {/* Ways to chip in */}
          <div className="px-6 py-7 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {plans.map((plan, index) => {
                const isPending =
                  checkoutMutation.isPending && pendingPlan === plan.id;

                return (
                  <motion.div
                    key={plan.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    className="rounded-2xl border border-(--lf-border) bg-(--lf-surface) p-5 flex flex-col text-center hover:border-(--lf-muted) transition-colors duration-200"
                  >
                    <div className="text-[0.78rem] font-semibold text-(--lf-ink)">
                      {plan.name}
                    </div>
                    <div className="mt-1.5">
                      <span className="font-serif-display text-[1.8rem] font-normal text-(--lf-ink) tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-[0.72rem] text-(--lf-muted) mt-1.5 mb-4 flex-1">
                      {plan.subtext}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => startCheckout(plan.id)}
                      disabled={checkoutMutation.isPending || isSessionPending}
                      aria-label={`${plan.cta} ${plan.cadence}`}
                      className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-full bg-(--lf-ink) text-(--lf-bg) text-[0.78rem] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:opacity-85"
                    >
                      {isPending || isSessionPending ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>
                            {isSessionPending ? "Checking..." : "Redirecting..."}
                          </span>
                        </>
                      ) : (
                        <>
                          {plan.cta}
                          <span
                            aria-hidden="true"
                            className="btn-arrow w-5 h-5 bg-(--lf-bg) text-(--lf-ink) rounded-full inline-flex items-center justify-center text-[10px] font-bold leading-none"
                          >
                            ↗
                          </span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-5 text-center text-[0.74rem] text-(--lf-muted)">
              No pressure at all. Lazyfolio stays free either way.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
