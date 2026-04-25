import { cors } from "hono/cors";
import { env } from "@/lib/env";

export const corsMiddleware = cors({
  origin: env.TRUSTED_ORIGINS.split(",").map((s) => s.trim()),
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
});
