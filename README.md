# twotier

A two-tier (server + client) TypeScript template for shipping
authenticated, billable MVPs in a few hours instead of a few weeks. The
server is a Bun + Hono REST API. The client is a Vite + React SPA. They
share Zod-typed wire contracts via a third workspace package.

Use this template when you need:

- A separate client and server (different deploy targets, multiple
  clients on one API, or non-trivial server-side processing).
- Auth + database + billing + file storage + LLM access on day one.

If you don't need a separate API tier, prefer the single-bundle
TanStack Start variant: [`cishiv/kitchen-sink-ts`](https://github.com/cishiv/kitchen-sink-ts).
Same features, one deployable.

---

## What's wired

| Concern        | Tech                                                                | Status |
| -------------- | ------------------------------------------------------------------- | ------ |
| Server runtime | Bun + Hono                                                          | ✅     |
| Auth           | Better Auth (email/password + `username` plugin)                    | ✅     |
| Database       | PostgreSQL via Drizzle ORM                                          | ✅     |
| Billing        | Polar (`@polar-sh/sdk`) — checkout, subscription read/cancel, webhook | ✅     |
| Wire contracts | Zod schemas in `@twotier/shared`                                    | ✅     |
| Client         | React 19 + Vite + Tailwind v4 + shadcn/ui                           | ✅     |
| Server state   | TanStack Query                                                      | ✅     |
| Forms          | react-hook-form + zod resolver                                      | ✅     |
| File storage   | Cloudflare R2 (S3-compatible) — presigned upload + list + delete    | ✅     |
| LLM            | OpenRouter via Vercel AI SDK (`@openrouter/ai-sdk-provider` + `ai`) | ✅     |

---

## Layout

```
twotier/
├── server/                    # @twotier/server — Bun + Hono REST API
│   ├── src/
│   │   ├── index.ts           # Bun.serve entrypoint
│   │   ├── app.ts             # Hono app composition
│   │   ├── routes/            # Route registration (no logic)
│   │   ├── controllers/       # Parse request → call service → JSON response
│   │   ├── services/          # All business logic + DB + external APIs
│   │   ├── middleware/        # cors, requireSession
│   │   ├── lib/               # Infra: db, auth, env, polar, errors, llm, storage
│   │   └── db/
│   │       ├── schema/        # Drizzle tables (one file per domain)
│   │       └── migrations/    # Generated SQL — do not hand-edit
│   ├── drizzle.config.ts
│   └── .env.example
│
├── client/                    # @twotier/client — Vite + React SPA
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx            # react-router routes
│   │   ├── pages/             # Route-level composition only
│   │   ├── routes/            # ProtectedRoute wrapper
│   │   ├── features/          # Domain UI (one folder per domain)
│   │   │   ├── auth/
│   │   │   ├── billing/
│   │   │   └── hello/
│   │   ├── components/ui/     # shadcn primitives only
│   │   └── lib/               # api.ts, auth-client.ts, query-client.ts
│   └── .env.example
│
├── shared/                    # @twotier/shared — wire contracts (zod)
│   └── src/
│       ├── api/               # Request/response schemas per endpoint
│       └── errors.ts          # ApiError shape + ErrorCode enum
│
├── CLAUDE.md                  # Ways of working — read before contributing
└── package.json               # Bun workspaces root
```

The dependency graph is one-directional: `client` and `server` both
depend on `shared`. `shared` depends on neither.

---

## Architectural rules (read before coding)

These are enforced by `CLAUDE.md` and apply to humans and agents alike.

**Server**

- Controllers do not touch the database. Only services do.
- Services receive their dependencies (`db`, `polar`, …) as a `deps`
  object argument — never module-level globals. This is what makes them
  unit-testable.
- Routes wire middleware and controllers. They contain no logic.
- `src/lib/` is infrastructure only. No domain logic.
- Only `src/services/*` and `src/lib/auth.ts` may import from `src/db/`.

**Client**

- `features/` owns domain UI. `components/ui/` is shadcn primitives only.
- `pages/` is composition; no fetching or business logic lives there.
- Server state lives in TanStack Query. Local UI state lives in
  components. Don't mix them.
- Every request goes through `lib/api.ts` or `lib/auth-client.ts`.
  No ad-hoc `fetch()` calls.

**Shared**

- `shared/` never imports from `server/` or `client/`.
- `shared/`'s only runtime dependency is `zod`.
- Every HTTP endpoint has a schema in `shared/src/api/` *before* the
  controller or hook that uses it is written.

---

## Quick start

```sh
# 1. Install
bun install                                 # at repo root

# 2. Configure
cp server/.env.example server/.env          # fill in secrets
cp client/.env.example client/.env          # default points at localhost:3000

# 3. Database
createdb twotier                            # or use any Postgres URL
bun run --filter '@twotier/server' db:migrate

# 4. Run both tiers (in two terminals or via the root dev script)
bun run dev                                 # spawns server + client
# server: http://localhost:3000
# client: http://localhost:5173
```

### Required environment variables

`server/.env`:

| Var                   | Required        | Notes                                                                       |
| --------------------- | --------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`        | always          | Postgres connection string                                                  |
| `BETTER_AUTH_SECRET`  | always          | Random ≥32-byte string (`openssl rand -base64 32`)                          |
| `BETTER_AUTH_URL`     | always          | Public URL the server is reachable at                                       |
| `TRUSTED_ORIGINS`     | always          | Comma-separated origins allowed to talk to the API (incl. the client URL)   |
| `POLAR_ACCESS_TOKEN`  | always          | From Polar dashboard. Sandbox token for local dev.                          |
| `POLAR_SERVER`        | always          | `sandbox` or `production`                                                   |
| `POLAR_WEBHOOK_SECRET`| always          | From the Polar webhook endpoint config                                      |
| `POLAR_SUCCESS_URL`   | always          | Where Polar redirects after checkout (a route in your client)               |
| `OPENROUTER_API_KEY`  | always          | API key from openrouter.ai                                                  |
| `R2_ACCOUNT_ID`       | always          | Cloudflare account ID                                                       |
| `R2_ACCESS_KEY_ID`    | always          | R2 token's access key                                                       |
| `R2_SECRET_ACCESS_KEY`| always          | R2 token's secret                                                           |
| `R2_BUCKET`           | always          | R2 bucket name                                                              |

`client/.env`:

| Var            | Notes                                  |
| -------------- | -------------------------------------- |
| `VITE_API_URL` | Base URL of the API (default `:3000`)  |

The env schema is enforced at server boot in `server/src/lib/env.ts`. A
missing required var throws before the server listens.

---

## Endpoints provided

| Method | Path                              | Auth | Purpose                                       |
| ------ | --------------------------------- | ---- | --------------------------------------------- |
| GET    | `/api/health`                     | —    | Liveness                                      |
| any    | `/api/auth/*`                     | —    | Better Auth (sign-in, sign-up, sessions, …)   |
| GET    | `/api/hello`                      | ✅   | Reference endpoint — replace with your own    |
| POST   | `/api/billing/checkout`           | ✅   | Create a Polar checkout, returns redirect URL |
| GET    | `/api/billing/subscription`       | ✅   | Current user's subscription (or `null`)       |
| POST   | `/api/billing/subscription/cancel`| ✅   | Toggle `cancelAtPeriodEnd`                    |
| POST   | `/api/webhooks/polar`             | sig  | Polar webhook — signature-verified inline     |
| POST   | `/api/uploads/presign`            | ✅   | Returns a presigned R2 PUT URL + creates row  |
| GET    | `/api/uploads`                    | ✅   | Lists current user's uploads with view URLs   |
| DELETE | `/api/uploads/:id`                | ✅   | Removes object from R2 + row from DB          |

---

## How-to: extend the template

### Add an authenticated endpoint

The hello example (`shared/src/api/hello.ts`,
`server/src/{services,controllers,routes}/hello.*`,
`client/src/features/hello/useHello.ts`) is the canonical reference.
Copy it.

1. **Schema first.** Define request/response in
   `shared/src/api/<feature>.ts` and re-export from
   `shared/src/api/index.ts`.
2. **Service.** `server/src/services/<feature>.service.ts` — pure
   functions taking a `deps` object. No `Hono` types.
3. **Controller.** `server/src/controllers/<feature>.controller.ts` —
   parse request with the shared schema, call service, return JSON.
4. **Route.** `server/src/routes/<feature>.routes.ts`, then mount
   inside the authenticated `api` group in `server/src/routes/index.ts`.
5. **Client hook.** `client/src/features/<feature>/use<Feature>.ts`
   using `apiFetch` and the shared response schema for runtime
   validation.

### Add a database table

1. Add a Drizzle table in `server/src/db/schema/<domain>.ts`. Re-export
   from `schema/index.ts`.
2. `bun run --filter '@twotier/server' db:generate` — emits SQL into
   `server/src/db/migrations/`.
3. Review the generated SQL.
4. `bun run --filter '@twotier/server' db:migrate` — applies to the
   database in `DATABASE_URL`.

### Add a Polar product / pricing tier

Products live in Polar — not in this database. Create them in the
Polar dashboard and reference them by ID from the client (e.g. a hardcoded
constant or a small `pricingPlans` config). The `subscription` table
materialises Polar's state via the webhook; nothing in the codebase
needs to change to add a new product.

### Call an LLM from a service

`server/src/lib/llm.ts` exports a typed `llm` client backed by OpenRouter.
Services consume it via DI alongside `db` and pass models to the Vercel
AI SDK helpers:

```ts
// server/src/services/summarize.service.ts
import { generateText } from "ai";
import type { DB } from "@/lib/db";
import type { LLMClient } from "@/lib/llm";

export type SummarizeDeps = { db: DB; llm: LLMClient };

export const summarize = async (
  deps: SummarizeDeps,
  text: string,
): Promise<string> => {
  const { text: out } = await generateText({
    model: deps.llm.model("anthropic/claude-sonnet-4.6"),
    prompt: `Summarize in one sentence:\n\n${text}`,
  });
  return out;
};
```

The model id is any string OpenRouter supports — see
[openrouter.ai/models](https://openrouter.ai/models). Use `streamText`
for token streaming and `generateObject` for typed structured output.

### Upload a file from the client

```tsx
import { useUploadFile } from "@/features/uploads/useUploadFile";
import { useUploads } from "@/features/uploads/useUploads";
import { useDeleteUpload } from "@/features/uploads/useDeleteUpload";

const upload = useUploadFile();
const { data } = useUploads();
const remove = useDeleteUpload();

<input
  type="file"
  onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])}
/>
```

`useUploadFile` does the two-leg dance internally: it requests a presigned
URL from `/api/uploads/presign`, then `PUT`s the file straight to R2.
The list invalidates on success.

R2 bucket needs CORS configured to allow `PUT` from your client origin.
Use the Cloudflare dashboard or `wrangler r2 bucket cors put`.

### Configure the Polar webhook

In the Polar dashboard, add a webhook endpoint pointing at
`https://<your-server>/api/webhooks/polar` and copy its signing secret
into `POLAR_WEBHOOK_SECRET`. For local dev, expose `:3000` with `ngrok`
or `cloudflared` and use the tunnel URL.

The handler currently persists `subscription.created`,
`.updated`, `.active`, `.canceled`, and `.revoked` events. Add cases in
`server/src/routes/webhooks.routes.ts` for any others you need.

---

## Scripts

Root (`bun run <script>`):

| Script      | Effect                                    |
| ----------- | ----------------------------------------- |
| `dev`       | Run server and client concurrently        |
| `typecheck` | `tsc --noEmit` across all packages        |
| `lint`      | Biome across all packages                 |
| `test`      | Vitest (client) + `bun test` (server)     |

Server (`bun run --filter '@twotier/server' <script>`):

| Script         | Effect                                                |
| -------------- | ----------------------------------------------------- |
| `dev`          | `bun --hot` development server                        |
| `start`        | Production start                                      |
| `db:generate`  | Emit migration SQL from `src/db/schema/*`             |
| `db:migrate`   | Apply migrations to `DATABASE_URL`                    |
| `db:studio`    | Drizzle Studio                                        |
| `auth:generate`| Regenerate Better Auth schema (needs a live DB)       |

---

## Deployment

The two tiers deploy independently.

**Server.** Any host that runs Bun (Fly, Railway, a VM, a container).
Set all `server/.env` vars in the host's secret store. Run
`bun run --filter '@twotier/server' db:migrate` once after each
deploy that includes a new migration.

**Client.** Static build (`bunx --bun vite build` inside `client/`)
deployed to any static host (Vercel, Netlify, Cloudflare Pages,
S3+CloudFront). Set `VITE_API_URL` to the deployed server URL at build
time.

**Polar webhooks.** Update the Polar dashboard webhook URL to point at
the deployed server. The signing secret stays the same; rotate it
together in both places when you do.

---

## Conventions and source of truth

- `CLAUDE.md` is the ways-of-working contract. Read it before making
  non-trivial changes.
- `SPECIFICATIONS/*.md` (gitignored by default) defines *what* to
  build per project. `CLAUDE.md` defines *how*.
- The hierarchy of truth, when sources disagree, is: explicit user
  instruction → `CLAUDE.md` → `SPECIFICATIONS/` → existing code →
  prior assistant messages.

## License

TBD.
