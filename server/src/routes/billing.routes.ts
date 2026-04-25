import { Hono } from "hono";
import {
  handleCancelSubscription,
  handleCreateCheckout,
  handleGetMySubscription,
} from "@/controllers/billing.controller";
import type { AuthVariables } from "@/middleware/auth";

export const billingRoutes = new Hono<{ Variables: AuthVariables }>()
  .post("/billing/checkout", handleCreateCheckout)
  .get("/billing/subscription", handleGetMySubscription)
  .post("/billing/subscription/cancel", handleCancelSubscription);
