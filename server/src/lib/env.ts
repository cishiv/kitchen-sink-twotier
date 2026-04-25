import { z } from "zod";

// Every field is optional. The app boots with zero env vars set.
// Each integration reads the env it needs via `requireEnv(key)` inside
// its getter and throws a named error if its specific var is missing —
// failures only surface when that integration is invoked at request time.
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),
  TRUSTED_ORIGINS: z.string().min(1).optional(),

  DATABASE_URL: z.string().url().optional(),

  POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
  POLAR_SERVER: z.enum(["sandbox", "production"]).optional(),
  POLAR_WEBHOOK_SECRET: z.string().min(1).optional(),
  POLAR_SUCCESS_URL: z.string().url().optional(),

  OPENROUTER_API_KEY: z.string().min(1).optional(),

  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
export type Env = typeof env;

export const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not set`);
  return value;
};

export const optionalEnv = (key: string): string | undefined => {
  return process.env[key];
};
