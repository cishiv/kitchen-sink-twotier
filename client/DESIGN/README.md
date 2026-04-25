# Fabric Design System

The visual language for Fabric. This directory is the source of truth
for tokens, primitives, and interaction patterns — read it before
writing UI code, update it when the design evolves.

## 1. Principle

**Paper over glass.** Fabric is a Bloomberg terminal for software
architecture. Warm off-white surfaces, tonal-only separation, tight
28px row rhythm, 2px corners max, desaturated accent colours. Every
pixel earns its place.

The aesthetic was chosen deliberately and iterated on — early drafts
trialed a dark "instrument panel" look and were rejected. Light is
primary. Dark validates that the same OKLch tokens carry contrast.

## 2. Non-negotiables

These constraints were made explicit during design and should not be
softened without a deliberate decision:

- **No solid 1px borders for separation.** Use tonal surface shifts
  (the five-tier surface ladder) instead. Borders are reserved for
  focus rings and the rare inset state.
- **2px radius maximum.** Buttons, inputs, chips → 2px (`--r-1`).
  Cards, panels, modals → 4px (`--r-2`). No pills, no fully rounded
  avatars (use a 50% radius on avatars as the one exception).
- **Desaturated colour.** All semantic colours sit at `oklch(* 0.09–0.13 *)` —
  never high chroma. Nothing shouts.
- **28px is the baseline row height.** Buttons, inputs, nav items.
  Compact (24px) and tall (32px, 40px) only where required.
- **Tight typography.** Body UI at 13px, labels at 11.5px caps,
  headers at 15–26px. 1.35 line-height base.
- **Three fonts.** Space Grotesk (display), Inter (UI), JetBrains
  Mono (code, metadata, IDs, captions). Nothing else.
- **Agent colour is teal, not purple.** `--agent: oklch(0.64 0.10 190)`.
  First-class peer, not chat assistant.
- **No shadows for elevation.** `--lift-1` exists for rare floating
  toolbars over a canvas; it's two stacked subtle shadows, not a
  blur. Everything else sits on tonal hierarchy.
- **Animations are short and purposeful.** 120ms default transitions;
  agent flash 1.6s; agent label 1.8s. Nothing else animates.

## 3. Files

- **`tokens.css`** — every CSS custom property. The runtime source
  of truth. Drop this into `client/src/index.css` via `@import`.
  Generated from the design bundle; do not hand-edit without updating
  `tokens.md`.
- **`primitives.css`** — base component classes (buttons, inputs,
  chips, cards, panels, menus, tables). The design bundle's reference
  implementation. Use as a style starting point when authoring React
  primitives; do not import this file directly in v1 (we rebuild each
  primitive as a React component — see `primitives.md`).
- **`tokens.md`** — human-readable token catalogue with purpose.
  Cross-reference when a CSS variable name isn't obvious.
- **`primitives.md`** — component primitive inventory, one-to-one
  with the React components under `client/src/components/ui/`.
- **`patterns.md`** — layout and interaction patterns that aren't a
  single component: split-pane, card grid, settings shell, agent
  affordances, graph canvas, command menu.

## 4. Import chain

```
client/src/index.css
  ├─ @import "tailwindcss";
  ├─ @import "../DESIGN/tokens.css";    (CSS custom properties)
  └─ (component-level .css files next to their React component,
       optional; most components style with Tailwind + vars)
```

`primitives.css` is **reference only** — it's useful to skim before
writing a React primitive so you have the selector names and
measurements. We don't ship it in the bundle.

## 5. Fonts

The design loads from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Material+Symbols+Outlined&display=swap" rel="stylesheet">
```

System-font fallbacks are declared in `tokens.css` so the app works
offline, but it won't look right. Material Symbols Outlined is the
only icon set we use.

## 6. How to change it

1. Update the design bundle (not maintained in this repo).
2. Re-export `tokens.css` and `primitives.css` here.
3. Update `tokens.md` / `primitives.md` / `patterns.md` with the
   rationale.
4. Run the app in both themes. Keep a single test route that renders
   the primitives sheet (design bundle's `PrimitivesSheet` equivalent)
   as a canary.

Do not drift from the design bundle silently.
