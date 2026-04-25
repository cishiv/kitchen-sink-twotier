import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CancelSubscriptionRequest } from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";
import { subscriptionQueryKey } from "./useSubscription";

export const useCancelSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CancelSubscriptionRequest) =>
      apiFetch("/billing/subscription/cancel", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriptionQueryKey });
    },
  });
};
