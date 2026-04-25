import { eq } from "drizzle-orm";
import type {
  CreateCheckoutResponse,
  Subscription as ApiSubscription,
} from "@twotier/shared/api";
import { SubscriptionStatusSchema } from "@twotier/shared/api";
import type { DB } from "@/lib/db";
import type { PolarClient } from "@/lib/polar";
import { subscription } from "@/db/schema";
import type { Subscription as DbSubscription } from "@/db/schema/billing";

export type BillingDeps = {
  db: DB;
  polar: PolarClient;
};

export type CreateCheckoutInput = {
  userId: string;
  userEmail: string;
  productId: string;
  successUrl: string;
};

export const createCheckout = async (
  deps: BillingDeps,
  input: CreateCheckoutInput,
): Promise<CreateCheckoutResponse> => {
  const checkout = await deps.polar.checkouts.create({
    products: [input.productId],
    successUrl: input.successUrl,
    customerExternalId: input.userId,
    customerEmail: input.userEmail,
  });
  return { url: checkout.url };
};

export const getSubscriptionForUser = async (
  deps: BillingDeps,
  userId: string,
): Promise<ApiSubscription | null> => {
  const [row] = await deps.db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(1);
  if (!row) return null;
  return toApiSubscription(row);
};

export const cancelSubscription = async (
  deps: BillingDeps,
  userId: string,
  cancelAtPeriodEnd: boolean,
): Promise<ApiSubscription | null> => {
  const current = await getSubscriptionForUser(deps, userId);
  if (!current) return null;
  await deps.polar.subscriptions.update({
    id: current.id,
    subscriptionUpdate: { cancelAtPeriodEnd },
  });
  // Polar will fire subscription.updated; we update our row optimistically
  // so the UI reflects the change without waiting on the webhook.
  await deps.db
    .update(subscription)
    .set({ cancelAtPeriodEnd, updatedAt: new Date() })
    .where(eq(subscription.id, current.id));
  return { ...current, cancelAtPeriodEnd };
};

export type PolarSubscriptionPayload = {
  id: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: string | Date;
  currentPeriodEnd: string | Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | Date | null;
  endedAt?: string | Date | null;
  productId: string;
  customerId: string;
  customerExternalId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export const upsertSubscriptionFromPolar = async (
  deps: BillingDeps,
  payload: PolarSubscriptionPayload,
): Promise<void> => {
  const userId = payload.customerExternalId;
  if (!userId) {
    throw new Error(
      `Polar subscription ${payload.id} missing customerExternalId`,
    );
  }

  const values = {
    id: payload.id,
    userId,
    polarCustomerId: payload.customerId,
    polarProductId: payload.productId,
    status: payload.status,
    amount: payload.amount,
    currency: payload.currency,
    recurringInterval: payload.recurringInterval,
    currentPeriodStart: toDate(payload.currentPeriodStart),
    currentPeriodEnd: toDate(payload.currentPeriodEnd),
    cancelAtPeriodEnd: payload.cancelAtPeriodEnd ?? false,
    canceledAt: payload.canceledAt ? toDate(payload.canceledAt) : null,
    endedAt: payload.endedAt ? toDate(payload.endedAt) : null,
    metadata: payload.metadata ?? {},
  };

  await deps.db
    .insert(subscription)
    .values(values)
    .onConflictDoUpdate({
      target: subscription.id,
      set: { ...values, updatedAt: new Date() },
    });
};

const toApiSubscription = (row: DbSubscription): ApiSubscription => {
  const status = SubscriptionStatusSchema.safeParse(row.status);
  return {
    id: row.id,
    status: status.success ? status.data : "incomplete",
    productId: row.polarProductId,
    amount: row.amount,
    currency: row.currency,
    recurringInterval: row.recurringInterval,
    currentPeriodStart: row.currentPeriodStart.toISOString(),
    currentPeriodEnd: row.currentPeriodEnd.toISOString(),
    cancelAtPeriodEnd: row.cancelAtPeriodEnd,
    canceledAt: row.canceledAt ? row.canceledAt.toISOString() : null,
  };
};

const toDate = (value: string | Date): Date =>
  value instanceof Date ? value : new Date(value);
