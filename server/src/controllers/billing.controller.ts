import type { Context } from "hono";
import {
  CancelSubscriptionRequestSchema,
  CreateCheckoutRequestSchema,
} from "@twotier/shared/api";
import { db } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { notFound, validationFailed } from "@/lib/errors";
import { polar } from "@/lib/polar";
import type { AuthVariables } from "@/middleware/auth";
import {
  cancelSubscription,
  createCheckout,
  getSubscriptionForUser,
} from "@/services/billing.service";

const deps = { db, polar };

export const handleCreateCheckout = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const body = CreateCheckoutRequestSchema.safeParse(await c.req.json());
  if (!body.success) {
    throw validationFailed("Invalid checkout request", body.error.flatten());
  }
  const user = c.get("user");
  const result = await createCheckout(deps, {
    userId: user.id,
    userEmail: user.email,
    productId: body.data.productId,
    successUrl: requireEnv("POLAR_SUCCESS_URL"),
  });
  return c.json(result);
};

export const handleGetMySubscription = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const user = c.get("user");
  const subscription = await getSubscriptionForUser(deps, user.id);
  return c.json({ subscription });
};

export const handleCancelSubscription = async (
  c: Context<{ Variables: AuthVariables }>,
): Promise<Response> => {
  const body = CancelSubscriptionRequestSchema.safeParse(await c.req.json());
  if (!body.success) {
    throw validationFailed("Invalid cancel request", body.error.flatten());
  }
  const user = c.get("user");
  const subscription = await cancelSubscription(
    deps,
    user.id,
    body.data.cancelAtPeriodEnd,
  );
  if (!subscription) throw notFound("No subscription for user");
  return c.json({ subscription });
};
