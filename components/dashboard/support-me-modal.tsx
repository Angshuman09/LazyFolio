"use client";

import { useCreateCheckoutSession } from "@/hooks/subscription";
import { authClient } from "@/lib/auth/auth-client";
import { ArticlePlan } from "@/lib/types/payment";
import { ArrowRight, Check, Loader2, X, Heart } from "lucide-react";
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
          className="relative pointer-events-auto w-full max-w-2xl bg-(--lf-bg) border border-(--lf-border) rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-(--lf-border-alpha)">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg border border-(--lf-border) bg-(--lf-surface) text-(--lf-muted) hover:text-(--lf-ink) hover:border-(--lf-muted) flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={13} />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-full bg-rose-500/12 flex items-center justify-center">
                <Heart size={13} className="text-rose-500" fill="currentColor" />
              </div>
              <span className="text-[0.68rem] tracking-widest text-(--lf-muted)">
                Support Lazyfolio
              </span>
            </div>
            <h2 className="font-serif-display text-[1.4rem] font-medium text-(--lf-ink) leading-tight mb-1.5">
              Writing is free. Always.
            </h2>
            <p className="text-[0.82rem] text-(--lf-muted) leading-relaxed max-w-lg">
              Everything in Lazyfolio is free. You can publish unlimited articles, use custom slugs, add SEO, choose templates, and more.

              If Lazyfolio is useful to you and you want to support the project, you can chip in. Supporters also get image uploads in articles as a small thank you :)
            </p>
          </div>

          {/* Plans */}
          <div className="px-6 py-5">
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
                    className={`relative rounded-xl p-4.5 flex flex-col justify-between transition-shadow duration-200 ${plan.popular
                        ? "border-2 border-(--lf-ink) bg-(--lf-bg) shadow-md"
                        : "border border-(--lf-border) bg-(--lf-surface) hover:border-(--lf-muted)"
                      }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[0.6rem] font-mono font-semibold tracking-wider shadow-xs whitespace-nowrap ${plan.popular
                            ? "bg-(--lf-ink) text-(--lf-bg)"
                            : "bg-(--lf-surface) border border-(--lf-border) text-(--lf-muted)"
                          }`}
                      >
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div className="text-[0.68rem] font-mono tracking-widest text-(--lf-muted) font-semibold mb-1 mt-1">
                        {plan.name}
                      </div>
                      <p className="text-[0.71rem] text-(--lf-muted) mb-2.5">
                        {plan.tagline}
                      </p>

                      <div className="flex items-baseline gap-1.5 pb-3 border-b border-(--lf-border-alpha)">
                        <span className="font-serif-display text-3xl font-normal text-(--lf-ink) tracking-tight">
                          {plan.price}
                        </span>
                        <span className="text-[0.75rem] text-(--lf-muted) font-mono">
                          {plan.cadence}
                        </span>
                      </div>

                      {plan.subtext && (
                        <div className="text-[0.68rem] text-(--lf-muted) mt-2 font-medium">
                          {plan.subtext}
                        </div>
                      )}

                      <ul className="mt-3.5 space-y-1.5 mb-4">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-[0.72rem] text-(--lf-ink) leading-snug"
                          >
                            <Check
                              size={11}
                              className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => startCheckout(plan.id)}
                      disabled={checkoutMutation.isPending || isSessionPending}
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-[0.76rem] font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans-body whitespace-nowrap mt-1 ${plan.popular
                          ? "bg-(--lf-ink) text-(--lf-bg) hover:opacity-90 shadow-2xs"
                          : "border border-(--lf-border) bg-(--lf-bg) text-(--lf-ink) hover:border-(--lf-muted)"
                        }`}
                    >
                      {isPending || isSessionPending ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>
                            {isSessionPending ? "Checking..." : "Redirecting..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>{plan.cta}</span>
                          <ArrowRight size={12} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
