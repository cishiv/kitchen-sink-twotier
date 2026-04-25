import { useMutation } from "@tanstack/react-query";
import {
  type CreateCheckoutRequest,
  CreateCheckoutResponseSchema,
} from "@twotier/shared/api";
import { apiFetch } from "@/lib/api";

export const useCheckout = () =>
  useMutation({
    mutationFn: async (input: CreateCheckoutRequest) => {
      const res = await apiFetch("/billing/checkout", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return CreateCheckoutResponseSchema.parse(res);
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });
