import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { Hono } from "hono";
import { db } from "@/lib/db";
import { requireEnv } from "@/lib/env";
import { polar } from "@/lib/polar";
import {
  type PolarSubscriptionPayload,
  upsertSubscriptionFromPolar,
} from "@/services/billing.service";

const deps = { db, polar };

export const webhookRoutes = new Hono().post("/webhooks/polar", async (c) => {
  const raw = await c.req.text();
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: ReturnType<typeof validateEvent>;
  try {
    event = validateEvent(raw, headers, requireEnv("POLAR_WEBHOOK_SECRET"));
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return c.json({ error: "invalid signature" }, 401);
    }
    throw err;
  }

  switch (event.type) {
    case "subscription.created":
    case "subscription.updated":
    case "subscription.active":
    case "subscription.canceled":
    case "subscription.revoked":
      await upsertSubscriptionFromPolar(deps, toPayload(event.data));
      break;
    default:
      // Ignore checkout.* and other event types — we only persist
      // subscription state. Add cases here as needs grow.
      break;
  }

  return c.json({ received: true });
});

const toPayload = (data: unknown): PolarSubscriptionPayload => {
  const d = data as Record<string, unknown> & {
    customer?: { id?: string };
    product?: { recurringInterval?: string };
  };
  return {
    id: String(d.id),
    status: String(d.status),
    amount: Number(d.amount),
    currency: String(d.currency),
    recurringInterval: String(
      d.recurringInterval ?? d.product?.recurringInterval ?? "month",
    ),
    currentPeriodStart: d.currentPeriodStart as string | Date,
    currentPeriodEnd: d.currentPeriodEnd as string | Date,
    cancelAtPeriodEnd: Boolean(d.cancelAtPeriodEnd),
    canceledAt: (d.canceledAt as string | Date | null | undefined) ?? null,
    endedAt: (d.endedAt as string | Date | null | undefined) ?? null,
    productId: String(d.productId),
    customerId: String(d.customerId ?? d.customer?.id ?? ""),
    customerExternalId:
      (d.customerExternalId as string | null | undefined) ?? null,
    metadata: (d.metadata as Record<string, unknown> | null) ?? {},
  };
};
