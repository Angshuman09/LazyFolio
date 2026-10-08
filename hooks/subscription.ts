import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface SubscriptionInfo {
  id: string;
  userId: string;
  dodoSubscriptionId?: string | null;
  dodoCustomerId?: string | null;
  status: "ACTIVE" | "INACTIVE" | "CANCELLED" | "PAST_DUE" | "EXPIRED" | "PENDING";
  productId?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionResponse {
  subscription: SubscriptionInfo | null;
  isActive: boolean;
  plan?: "monthly" | "yearly" | "lifetime" | null;
  planLabel?: string | null;
  articleUsage?: {
    count: number;
    freeLimit: number;
    remaining: number;
  };
}

export function useGetSubscription(enabled: boolean = true) {
  return useQuery<SubscriptionResponse>({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      return res.json();
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (plan: "monthly" | "yearly" | "lifetime" = "monthly") => {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }
      return data as { checkoutUrl: string; sessionId?: string };
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to initiate payment. Please try again.";
      toast.error(message);
    },
  });
}

export function useOpenCustomerPortal() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscription/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to access customer portal");
      }
      return data as { portalUrl: string };
    },
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Could not open subscription portal.";
      toast.error(message);
    },
  });
}
