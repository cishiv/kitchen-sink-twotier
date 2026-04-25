import { useQuery } from "@tanstack/react-query";
import { SubscriptionResponseSchema } from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";

export const subscriptionQueryKey = ["billing", "subscription"] as const;

export const useSubscription = () =>
  useQuery({
    queryKey: subscriptionQueryKey,
    queryFn: async () =>
      SubscriptionResponseSchema.parse(await apiFetch("/billing/subscription")),
  });
