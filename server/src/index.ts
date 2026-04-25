import { createApp } from "@/app";
import { env } from "@/lib/env";

const app = createApp();

Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

console.log(`[server] listening on http://localhost:${env.PORT}`);
