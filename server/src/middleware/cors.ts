import { cors } from "hono/cors";
import { optionalEnv } from "@/lib/env";

const resolveOrigins = (): Array<string> => {
  const raw = optionalEnv("TRUSTED_ORIGINS");
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim());
};

export const corsMiddleware = cors({
  origin: (origin) => {
    const allowed = resolveOrigins();
    if (allowed.length === 0) return undefined;
    return allowed.includes(origin) ? origin : null;
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
});
