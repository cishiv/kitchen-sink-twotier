import { z } from "zod";

export const SubscriptionStatusSchema = z.enum([
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  status: SubscriptionStatusSchema,
  productId: z.string(),
  amount: z.number().int().nonnegative(),
  currency: z.string(),
  recurringInterval: z.string(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.string().nullable(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionResponseSchema = z.object({
  subscription: SubscriptionSchema.nullable(),
});
export type SubscriptionResponse = z.infer<typeof SubscriptionResponseSchema>;

export const CreateCheckoutRequestSchema = z.object({
  productId: z.string().min(1),
});
export type CreateCheckoutRequest = z.infer<
  typeof CreateCheckoutRequestSchema
>;

export const CreateCheckoutResponseSchema = z.object({
  url: z.string().url(),
});
export type CreateCheckoutResponse = z.infer<
  typeof CreateCheckoutResponseSchema
>;

export const CancelSubscriptionRequestSchema = z.object({
  cancelAtPeriodEnd: z.boolean(),
});
export type CancelSubscriptionRequest = z.infer<
  typeof CancelSubscriptionRequestSchema
>;
