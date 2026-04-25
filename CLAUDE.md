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
