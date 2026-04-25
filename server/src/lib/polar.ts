import { Polar } from "@polar-sh/sdk";
import { optionalEnv, requireEnv } from "@/lib/env";

const createPolar = (): Polar =>
  new Polar({
    accessToken: requireEnv("POLAR_ACCESS_TOKEN"),
    server:
      (optionalEnv("POLAR_SERVER") as "sandbox" | "production" | undefined) ??
      "sandbox",
  });

export type PolarClient = Polar;

let cached: Polar | null = null;

const getPolar = (): Polar => {
  if (cached) return cached;
  cached = createPolar();
  return cached;
};

export const polar = new Proxy({} as Polar, {
  get: (_, prop, receiver) => Reflect.get(getPolar(), prop, receiver),
});
