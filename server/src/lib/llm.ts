import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/lib/env";

// OpenRouter exposes every major provider behind one API. Services pick
// a model id at call-site (e.g. `llm.model("anthropic/claude-sonnet-4.6")`)
// and pass the result to Vercel AI SDK helpers (`generateText`,
// `streamText`, `generateObject`, …).
const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

export type LLMClient = {
  model: typeof openrouter;
};

export const llm: LLMClient = {
  model: openrouter,
};
