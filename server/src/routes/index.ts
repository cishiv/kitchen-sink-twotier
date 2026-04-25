import { Hono } from "hono";
import type { AuthVariables } from "@/middleware/auth";
import { requireSession } from "@/middleware/auth";
import { authRoutes } from "@/routes/auth.routes";
import { billingRoutes } from "@/routes/billing.routes";
import { helloRoutes } from "@/routes/hello.routes";
import { uploadsRoutes } from "@/routes/uploads.routes";
import { webhookRoutes } from "@/routes/webhooks.routes";

export const registerRoutes = (app: Hono): void => {
  // Liveness — no auth.
  app.get("/api/health", (c) => c.json({ ok: true }));

  // Better Auth owns /api/auth/*. No middleware in front of it.
  app.route("/", authRoutes);

  // Webhooks — must be unauthenticated; signature verified inline.
  app.route("/api", webhookRoutes);

  // Authenticated application routes under /api.
  const api = new Hono<{ Variables: AuthVariables }>();
  api.use("*", requireSession);
  api.route("/", helloRoutes);
  api.route("/", billingRoutes);
  api.route("/", uploadsRoutes);
  app.route("/api", api);
};
