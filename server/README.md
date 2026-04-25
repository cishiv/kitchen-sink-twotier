# `@twotier/server`

Bun + Hono + Better Auth + Drizzle + Polar REST API.

See [`SPECIFICATIONS/backend.md`](../SPECIFICATIONS/backend.md) for the
architectural contract and [`CLAUDE.md`](../CLAUDE.md) at the repo root
for ways of working.

## Prerequisites

- Bun (latest stable) — `bun --version`
- PostgreSQL 16 running locally (or a `DATABASE_URL` pointing at one)

## Quick start

```sh
cp .env.example .env            # fill in BETTER_AUTH_SECRET and DATABASE_URL
bun install                     # from repo root
bun run --filter '@twotier/server' db:generate
bun run --filter '@twotier/server' db:migrate
bun run --filter '@twotier/server' dev
```

The server listens on `http://localhost:3000`.

## Scripts

| Script           | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `dev`            | `bun --hot` development server                 |
| `start`          | Non-hot production start                       |
| `typecheck`      | `tsc --noEmit`                                 |
| `lint` / `format`| Biome                                          |
| `test`           | `bun test`                                     |
| `db:generate`    | Emit migration SQL from `src/db/schema/*`      |
| `db:migrate`     | Apply migrations to `DATABASE_URL`             |
| `db:studio`      | Drizzle Studio                                 |
| `auth:generate`  | Regenerate Better Auth schema (needs live DB)  |

All scripts are invoked via `bunx --bun <tool>` so they work even when
`node` is on `PATH` ahead of Bun.
