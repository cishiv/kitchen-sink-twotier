import { Hono } from "hono";
import { logger } from "hono/logger";
import { onError } from "@/lib/errors";
import { corsMiddleware } from "@/middleware/cors";
import { registerRoutes } from "@/routes";

export const createApp = (): Hono => {
  const app = new Hono();

  app.use("*", logger());
  app.use("*", corsMiddleware);

  registerRoutes(app);

  app.onError(onError);

  return app;
};
