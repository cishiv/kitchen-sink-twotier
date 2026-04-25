import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { requireEnv } from "@/lib/env";

const createDb = () =>
  drizzle(postgres(requireEnv("DATABASE_URL")), {
    schema,
    casing: "snake_case",
  });

export type DB = ReturnType<typeof createDb>;

let cached: DB | null = null;

const getDb = (): DB => {
  if (cached) return cached;
  cached = createDb();
  return cached;
};

export const db = new Proxy({} as DB, {
  get: (_, prop, receiver) => Reflect.get(getDb(), prop, receiver),
});
