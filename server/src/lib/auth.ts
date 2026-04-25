import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import * as schema from "@/db/schema";
import { db } from "@/lib/db";
import { requireEnv } from "@/lib/env";

const createAuth = () =>
  betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true },
    plugins: [username()],
    trustedOrigins: requireEnv("TRUSTED_ORIGINS")
      .split(",")
      .map((s) => s.trim()),
    secret: requireEnv("BETTER_AUTH_SECRET"),
    baseURL: requireEnv("BETTER_AUTH_URL"),
  });

type Auth = ReturnType<typeof createAuth>;

let cached: Auth | null = null;

const getAuth = (): Auth => {
  if (cached) return cached;
  cached = createAuth();
  return cached;
};

export const auth = new Proxy({} as Auth, {
  get: (_, prop, receiver) => Reflect.get(getAuth(), prop, receiver),
});

export type Session = Auth["$Infer"]["Session"];
