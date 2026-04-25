import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { requireEnv } from "@/lib/env";

// OpenRouter exposes every major provider behind one API. Services pick
// a model id at call-site (e.g. `llm.model("anthropic/claude-sonnet-4.6")`)
// and pass the result to Vercel AI SDK helpers (`generateText`,
// `streamText`, `generateObject`, …).

type OpenRouterClient = ReturnType<typeof createOpenRouter>;

let cached: OpenRouterClient | null = null;

const getOpenRouter = (): OpenRouterClient => {
  if (cached) return cached;
  cached = createOpenRouter({ apiKey: requireEnv("OPENROUTER_API_KEY") });
  return cached;
};

const openrouter = new Proxy({} as OpenRouterClient, {
  get: (_, prop, receiver) => Reflect.get(getOpenRouter(), prop, receiver),
  apply: (_, thisArg, args) =>
    Reflect.apply(getOpenRouter() as never, thisArg, args),
}) as OpenRouterClient;

export type LLMClient = {
  model: typeof openrouter;
};

export const llm: LLMClient = {
  model: openrouter,
};
