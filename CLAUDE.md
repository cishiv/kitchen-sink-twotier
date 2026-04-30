# twotier — Ways of Working

> Project-wide ways of working and constraints for every contributor —
> human or agent. Read this document before making changes.
> Complements `SPECIFICATIONS/*.md`, which define *what* to build; this
> document defines *how* to build it and what not to touch.

## 0. Hierarchy of Truth

When two sources disagree, resolve in this order:

1. An explicit instruction from the current user turn.
2. `CLAUDE.md` (this document).
3. `SPECIFICATIONS/*.md`.
4. Existing code.
5. Prior assistant messages or external docs.

If a lower source contradicts a higher one, flag it; do not silently
follow the lower source.

## 1. Specs Are The Source of Truth for "What"

- Before implementing anything that the specs describe, re-read the
  relevant spec file.
- If the spec is wrong, outdated, or ambiguous, update the spec in the
  same change that updates the code. Do not leave them out of sync.
- New endpoints, tables, or modules begin by extending the spec, then
  extending `@twotier/shared` if wire-format is involved, then the
  implementation.
- The full lifecycle (naming, frontmatter, move-to-implemented) lives in
  `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md`. Use
  `SPECIFICATIONS/SPEC_TEMPLATE.md` as the starting point for a new spec.

## Specifications and acceptance criteria

This repo follows a spec-driven workflow. See `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md` for the full lifecycle.

Every spec includes an `ACCEPTANCE_CRITERIA` section at the top. Each criterion has:

- A sectioned number (e.g. `1.1`, `1.2`, `2.1` — sections group by user flow or domain).
- A tag: `[BLOCKING]` or `[NICE_TO_HAVE]`. Untagged criteria default to `[BLOCKING]`. An optional `[USER_VERIFIES]` tag marks criteria that can't be machine-verified (typically visual or typographic).
- A `Pre-conditions:` line stating the world-state required before the criterion applies.
- The criterion text, written in EARS-flavored prose: `WHEN <event>` / `WHILE <state>` / `WHERE <feature>` / `IF <unwanted condition> THEN` / ubiquitous `the system shall <response>`. Combine patterns when expressive (e.g. `WHEN ... IF ... THEN`).

The build agent picks the verification mechanism per criterion from this repo's menu:

- A command that exits 0 (e.g. `bun run typecheck`, `bun run test`).
- An HTTP request whose response matches a documented Zod schema.
- For `[USER_VERIFIES]` criteria: manual user sign-off after the agent presents the built behavior.

Build and extend agents loop on the criteria up to 3 attempts each. Failure of a `[BLOCKING]` criterion escalates to the user. Failure of `[NICE_TO_HAVE]` surfaces as a warning.

This repo supports two spec modalities: **project mode** (the first detailed and MVP spec for a new repo) and **feature mode** (incremental additions). Mode is declared in the spec frontmatter and reflected in the filename. See `SPECIFICATIONS/HOW_TO_USE_SPECIFICATION.md` for the contract.

## 2. Architectural Invariants

These are non-negotiable without an explicit amendment to this document
or an explicit user override.

**Server**

- Controllers do not touch the database. Ever. Only services do.
- Services take their dependencies (db handle, LLM client, storage
  client) as arguments, not from module-level globals. This is what
  keeps them testable.
- Routes wire middleware and controllers. They contain no logic.
- `src/lib/` is infrastructure only. No domain logic.
- No direct imports from `src/db/` outside of `src/services/` and
  `src/lib/auth.ts`.

**Client**

- `features/` owns domain UI. `components/ui/` is for shadcn primitives
  only.
- `pages/` is composition; no fetching or business logic lives there.
- Server state lives in React Query. Local UI state lives in components.
  Do not mix them.
- Every request goes through `lib/api.ts` or `lib/auth-client.ts`.
  No ad-hoc `fetch()` calls.

**Shared**

- `shared/` never imports from `server/` or `client/`. The graph is
  one-directional.
- `shared/`'s only runtime dependency is `zod`. New runtime deps here
  require an explicit amendment.
- Every HTTP endpoint has a schema in `shared/src/api/` *before* the
  controller or hook that uses it is written.

**Lazy-init for env-dependent SDKs**

- Any SDK that needs env vars to construct must be lazy-initialised:
  read env inside a getter, build on first use, cache in module scope.
  See `server/src/lib/storage.ts` for the canonical pattern.
- The Zod schema in `server/src/lib/env.ts` treats every field as
  optional. The app boots with zero env vars set. Each integration
  reads what it needs via `requireEnv(key)` inside its getter and
  throws a named error if its specific var is missing — failures
  only surface when that integration is invoked at request time.

## 3. Changes Are Surgical

- Touch only what the task requires.
- Do not reformat, rename, or "improve" adjacent code.
- Match existing style even if you would do it differently.
- If you notice unrelated dead code or bugs, mention them in the
  response — do not silently fix them.
- Remove orphans *your* change created. Leave pre-existing dead code
  alone.
- Every changed line must trace to the stated task.

## 4. Simplicity Over Cleverness

- Minimum code that solves the problem.
- No speculative abstractions. No configuration no one asked for.
  No error handling for impossible branches.
- If a senior engineer would call it overcomplicated, it is.
- Prefer boring, well-understood tools over novel ones.

## 5. Surface Assumptions, Don't Hide Them

Before implementing a non-trivial task:

- State assumptions explicitly in the response.
- If there are multiple reasonable interpretations, present them and
  let the user pick. Do not silently choose.
- If requirements are unclear, stop and ask.
- If a simpler alternative exists, say so before writing the complex
  one.

The cost of asking a clarifying question is much lower than the cost
of rewriting a misbuilt feature.

## 6. Goal-Driven Execution

Every task has a verifiable success criterion. Translate vague asks
into concrete ones:

- "Add validation" → "Invalid input returns 400 with `ApiError` shape;
  test covers it."
- "Fix the bug" → "Write a failing test that reproduces it; make it
  pass."
- "Refactor X" → "Tests pass before and after; public API unchanged."

For multi-step tasks, write the plan down (as a TODO list or in-message
plan) before starting, and check off each step.

## 7. Tests

- A new service gets a unit test. A new endpoint gets at least a
  happy-path integration test.
- Bug fixes start with a failing test.
- `bun run typecheck` is a test. It must pass.
- Do not skip or `.only` tests in committed code.

## 8. Secrets & Config

- No secrets in the repo. Ever. `.env` files are gitignored; only
  `.env.example` is committed.
- The client bundle receives only `VITE_`-prefixed values. Anything
  there is effectively public.
- New config values are added to both `.env.example` and the relevant
  `env.ts` schema in the same commit.

## 9. Commits & Pull Requests

- Conventional-ish commit style: `feat(server): ...`, `fix(client):
  ...`, `chore(shared): ...`, `docs: ...`.
- Commit messages explain the *why*, not the *what*. The diff is the
  *what*.
- Breaking changes to `@twotier/shared` schemas are flagged with `!` in
  the commit subject (`feat(shared)!: ...`).
- One logical change per commit where reasonable.

## 10. Agent-Specific Rules

These apply to AI coding agents operating in this repo.

- **Read before writing.** Before editing a file, read it. Before
  editing a module, skim the whole module.
- **Never create files unless necessary.** Prefer editing existing
  files. No tutorial-style markdown files unless explicitly asked.
- **Don't narrate in code comments.** Comments explain non-obvious
  intent, trade-offs, or constraints — never the change itself.
- **Don't announce tool use.** Just use the tools.
- **Don't cite this document or the specs in user-facing responses.**
  Apply them.
- **Fail loudly.** If an instruction would violate this document, say
  so and ask. Do not silently comply and hope no one notices.
- **When uncertain, stop.** Ask the user rather than guessing at
  architecture or naming.

## 11. Amending This Document

This document is not a ceiling; it is a ratchet. Changes to it:

1. Happen in a dedicated commit (or co-located with the work that
   motivates them).
2. Explain the change in the commit body, not just the diff.
3. Are made by the user, or proposed by an agent and approved by the
   user.

If you (an agent) believe a rule here is wrong or obstructing the
task, raise it in the response before taking action that contradicts
it.

<!-- AGENT-WRITABLE BELOW -->

# Reference

> The content below this divider is regenerated by the build/extend skills
> when file map, recipes, or golden paths change. Hand-edits are fine,
> but expect them to be reconciled the next time a feature ships.

## Workspaces

| Workspace        | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `server/`        | Hono backend. DB, auth, services, controllers, routes.                 |
| `client/`        | React + Vite frontend. Pages, features, shadcn/ui components.          |
| `shared/`        | Cross-cutting Zod schemas + types (`@twotier/shared`). One-way deps.   |

## Server file map

| Concept                          | Path                                              |
| -------------------------------- | ------------------------------------------------- |
| Entry point                      | `server/src/index.ts`                             |
| Env (all fields optional)        | `server/src/lib/env.ts`                           |
| DB client (lazy-init)            | `server/src/lib/db.ts`                            |
| DB schema                        | `server/src/db/schema/*.ts`                       |
| Drizzle config                   | `server/drizzle.config.ts`                        |
| Migrations                       | `server/src/db/migrations/`                       |
| BetterAuth instance (lazy-init)  | `server/src/lib/auth.ts`                          |
| Auth middleware                  | `server/src/middleware/auth.ts`                   |
| Polar SDK (lazy-init)            | `server/src/lib/polar.ts`                         |
| Storage / R2 (lazy-init)         | `server/src/lib/storage.ts`                       |
| OpenRouter / LLM (lazy-init)     | `server/src/lib/llm.ts`                           |
| Errors                           | `server/src/lib/errors.ts`                        |
| Services (DB-touching logic)     | `server/src/services/*.service.ts`                |
| Controllers (HTTP layer)         | `server/src/controllers/*.controller.ts`          |
| Routes (wiring)                  | `server/src/routes/*.routes.ts`                   |
| Webhooks                         | `server/src/routes/webhooks.routes.ts`            |

## Client file map

| Concept                          | Path                                              |
| -------------------------------- | ------------------------------------------------- |
| Entry point                      | `client/src/main.tsx`                             |
| Routes (TanStack Router)         | `client/src/routes/*.tsx`                         |
| Pages (composition only)         | `client/src/pages/*.tsx`                          |
| Domain features                  | `client/src/features/<feature>/*`                 |
| shadcn primitives                | `client/src/components/ui/*`                      |
| API fetcher                      | `client/src/lib/api.ts`                           |
| Auth client                      | `client/src/lib/auth-client.ts`                   |

## Shared file map

| Concept                          | Path                                              |
| -------------------------------- | ------------------------------------------------- |
| Public Zod schemas               | `shared/src/api/*.ts`                             |
| Error shape                      | `shared/src/errors.ts`                            |
| Barrel                           | `shared/src/index.ts`                             |

## Commands

| Command                                  | Purpose                                                |
| ---------------------------------------- | ------------------------------------------------------ |
| `bun run dev`                            | Run server (`:3000`) and client (`:5173`) concurrently |
| `bun run typecheck`                      | Typecheck every workspace                              |
| `bun run lint`                           | Lint every workspace                                   |
| `bun run test`                           | Test every workspace                                   |
| `bun run --filter './server' db:generate` | Generate migrations from schema                        |
| `bun run --filter './server' db:migrate`  | Apply pending migrations                               |
| `bun run --filter './server' db:studio`   | Open Drizzle Studio                                    |
| `bun run --filter './server' db:doc`      | Print mermaid skeleton from current schema             |
| `bun run --filter './server' auth:generate` | Regenerate `auth.ts` schema from BetterAuth config   |

## Recipes

### Add an HTTP endpoint

1. Add the request and response Zod schemas to `shared/src/api/<feature>.ts` and re-export from `shared/src/api/index.ts`. Bump `@twotier/shared` if the schema breaks wire-format.
2. Add (or reuse) a service in `server/src/services/<feature>.service.ts`. Services accept dependencies as arguments and only services touch the DB.
3. Add a controller in `server/src/controllers/<feature>.controller.ts` that validates with the shared schema, calls the service, and returns JSON.
4. Wire the controller into `server/src/routes/<feature>.routes.ts` and mount in `server/src/routes/index.ts`.
5. On the client: import the schema from `@twotier/shared/api` and use it in the React Query hook under `client/src/features/<feature>/`.

### Add a database table

1. Append the Drizzle table to a file under `server/src/db/schema/<topic>.ts`, plus any indexes and `$inferSelect` / `$inferInsert` types.
2. Re-export from `server/src/db/schema/index.ts`.
3. `bun run --filter './server' db:generate` (creates a migration).
4. Review the generated SQL.
5. `bun run --filter './server' db:migrate`.
6. Update `DATABASEMODEL.md` in a separate commit.

### Add a shadcn component

```bash
cd client && bunx --bun shadcn@latest add <component>
```

Components install into `client/src/components/ui/`.

## Golden paths

### Auth

1. Client posts to `/api/auth/sign-in` (or `sign-up`) via `lib/auth-client.ts`. The server route at `server/src/routes/auth.routes.ts` mounts BetterAuth's catch-all.
2. BetterAuth (lazy-init in `server/src/lib/auth.ts`) writes a session cookie. Drizzle adapter persists to the `users`, `sessions`, `accounts`, and `verifications` tables.
3. Protected client routes use `authClient.useSession()` and redirect on null.
4. Server endpoints apply `auth` middleware (`server/src/middleware/auth.ts`) which reads the cookie via `auth.api.getSession({ headers })` and injects `c.var.user`.

### Subscription

1. Client posts to `/api/billing/checkout` with `{ productId }`. The controller reads the user from `c.var.user`, calls `polar.checkouts.create({ ... successUrl: requireEnv("POLAR_SUCCESS_URL") })`, and returns the URL.
2. Browser follows the URL → Polar checkout → success URL.
3. Polar fires webhooks to `/api/webhooks/polar` (`server/src/routes/webhooks.routes.ts`). The route validates with `validateEvent(raw, headers, requireEnv("POLAR_WEBHOOK_SECRET"))` and the billing service writes to the `subscriptions` table.

### Upload

1. Client posts metadata to `/api/uploads/presign`. The uploads service calls `getSignedUrl` against the lazy-init `storage` client (`server/src/lib/storage.ts`) and returns `{ url, key }`.
2. Client `PUT`s the file to `url`.
3. Client posts `{ key, ... }` to `/api/uploads/complete` to write the DB row.

### LLM call

1. Client posts to `/api/<feature>` with the user's input.
2. Service calls into the lazy-init `llm` client from `server/src/lib/llm.ts`, picks a model id, and uses Vercel AI SDK helpers (`generateText`, `generateObject`, `streamText`).
3. Service returns the result. The OpenRouter provider only constructs on first use, so the route imports without env errors.

## Gotchas

- **Boot with zero env.** The Zod env schema is fully optional. If you remove a `requireEnv(key)` call from a getter, you've removed the only signal that the env is missing.
- **`shared/` is one-way.** `shared/` never imports from `server/` or `client/`. Adding any runtime dep beyond `zod` is an amendment.
- **Services own the DB.** Controllers must not import from `server/src/db/`. Services must accept dependencies (db handle, polar client, storage client) as arguments to stay testable.
- **`db:doc` is a stub.** It prints a mermaid skeleton from current schema metadata. Hand-edit `DATABASEMODEL.md` for prose.
