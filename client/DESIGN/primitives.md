# Primitives

The component atoms. Each row maps one design bundle primitive to the
React component we'll ship under `client/src/components/ui/`. The CSS
class column references the design bundle's `primitives.css` — use
those selectors as a style reference, not an import.

## Buttons

### `<Button>`  (`.btn`)

Default 28px height, `--r-1` radius, `--font-ui` 500-weight.

| Variant            | Class               | Visual                                                       |
| ------------------ | ------------------- | ------------------------------------------------------------ |
| `primary`          | `.btn--primary`     | `background: var(--surface-inverse)`, `color: var(--on-inverse)` |
| `ghost`            | `.btn--ghost`       | Transparent; `:hover` → `--surface-container`                |
| `danger`           | `.btn--danger`      | `color: var(--error)`; ghost bg. Used in delete flows only.  |

Sizes:

| Size  | Height | Padding     | Class          |
| ----- | ------ | ----------- | -------------- |
| `sm`  | 24px   | 0 8px       | `.btn--sm`     |
| `md`  | 28px   | 0 12px      | default        |
| `lg`  | 32px   | 0 16px      | `.btn--lg`     |
| `xl`  | 40px   | 0 20px      | onboarding CTA |

Disabled: `opacity: 0.5; pointer-events: none;`. No separate token.

### `<IconButton>`  (`.btn-icon`)

Square 28×28 (sm: 24×24). Muted text by default; hover raises to
`--on-surface` and adds `--surface-container`. Pressed →
`--surface-container-highest`.

Icon is always a Material Symbols Outlined glyph at 16–18px. Prefer
the outlined filled glyph weight ≤ 400.

## Inputs

### `<Input>`  (`.input`)

28px tall, `--surface-container` bg, no border. Focus adds
`outline: 2px solid var(--primary)` at the component level (not the
global focus-visible).

Variants via className:

- Base: sans-serif UI font.
- Mono: add `.mono` class (metadata fields, coordinates, IDs).

### `<Textarea>`

Same bg and focus as `<Input>`, but free-height. `min-height: 72px`
(roughly 3 lines).

### `<Stepper>`  (`.stepper`)

24px tall inline-flex. `-` · value · `+`. Mono 9.5px for the value.
Keyboard: arrow keys increment.

## Chips / Badges / Dots

### `<Chip>`  (`.chip`)

20px tall, 6px horizontal padding, `--surface-container-high` bg,
mono 10.5px. Variants:

- `default` — used for tags.
- `ref` (`.chip--ref`) — `--primary-wash` bg, `--primary-ink` text;
  used for artifact refs in markdown preview.
- `agent` (`.chip--agent`) — `--agent-wash` bg, mixed agent text;
  used to indicate an agent author on a change.

### `<Pill>`  (`.pill`)

18px tall, 6px horizontal, mono 11px, uppercase (letter-spacing:
0.08em). Status flavours:

- `primary` — info.
- `warn` — warning (tertiary).
- `err` — error.
- `agent` — agent-authored.

### `<Dot>`  (`.dot`)

6px circle, inline-block, vertical-align middle. States: `ok`
(primary-mix), `warn` (tertiary), `err` (error), `agent` (agent),
`muted` (surface-container-highest).

### `<FormatBadge>`  (`.card__fmt-badge`)

8×8px dot positioned absolute on a card. Colour per artifact kind:

| Kind        | Colour                       |
| ----------- | ---------------------------- |
| `fab`       | `--on-surface` (native)      |
| `md`        | `--on-surface` (native)      |
| `mermaid`   | `#ff7ab2`                    |
| `plantuml`  | `#ffd873`                    |
| `excalidraw`| `#a5d8ff`                    |

## Containers

### `<Card>`  (`.card`)

`--surface-container` bg, `--r-2` radius, 16px padding. Hover
raises to `--surface-container-high` and `translateY(-1px)`. Active
returns to `translateY(0)`.

Layout: grid item. Card content uses:

- `.card__thumb` — 96px-tall dot-grid mini preview.
- `.card__title` — `--font-display` 13px 500-weight, flex + 8px gap.
- `.card__meta` — mono 10.5px, `--on-surface-muted`, space-between row.

Anchor point for `⋯` menu button (top-right, `position: absolute`).

### `<Panel>`  (`.panel`)

`--surface-container` bg, `--r-2` radius. Flex column. Header
(32px) is `--surface-container-high`; body is `--surface-container`.
No border between them — tonal shift.

### `<Modal>`

`--r-2` radius, `--surface` bg. Overlay: fixed full-screen,
`background: color-mix(in oklab, var(--on-surface) 18%, transparent)`,
`backdrop-filter: blur(2px)`. Max width per use:

- Confirm dialogs: 380px.
- Forms (NewFile, Invite): 480–560px.
- Full-screen editors: no modal.

## Controls

### `<SegmentedControl>`  (`.seg`)

Inline-flex, `--surface-container` wrapper, 2px gap between buttons.
Selected button (`aria-pressed="true"`) → `--surface` bg, inset 1px
rule. 22px tall internal buttons.

### `<Switch>`  (`.switch`)

26×14 rounded. Off: `--surface-container-highest` track,
`--on-surface-muted` thumb. On (`aria-checked="true"`): `--on-surface`
track, `--surface` thumb translated right. 140ms transition.

### `<Kbd>`  (`<kbd>`)

16px tall, `--surface-container-high` bg, 4px padding, mono 10px.
Used in menu items and command palette to show shortcuts.

## Text helpers

### `.caps` / `.caps-strong`

Uppercase 11.5px with 0.12em letter-spacing. `.caps` is muted;
`.caps-strong` is `--on-surface`. Used for section labels, empty
state heads, mono tool output.

### `.mono`

`--font-mono` with `font-feature-settings: "tnum", "zero"` for
tabular numbers and slashed zero. Used everywhere numeric or IDish.

## Avatar

### `<Avatar>`  (`.avatar`)

Circle. Sizes:

| Size  | Dim    | Font                |
| ----- | ------ | ------------------- |
| `sm`  | 22px   | mono 9px caps       |
| `md`  | 28px   | mono 10px caps      |
| `lg`  | 56px   | mono 18px caps      |

Background is a tonal gradient derived from a hash of the user's id.
Initials over it.

## Table

### `<Table>` family  (`.tbl`)

`border-collapse: separate; border-spacing: 0`. Header row is
`--surface-container-high`, mono 10.5px caps. Body rows are
`--surface-container`, hover to `-high`. Cell min padding 10px.

Sub-components: `<TableRow>`, `<TableHeader>`, `<TableCell>`.
Compose; do not style `<table>` directly.

## Menu

### `<Menu>`  (`.card-menu`, `.gv__ctxmenu`)

Anchor-positioned popover. `--surface` bg, `--r-2` radius, 4px
padding, no shadow (tonal step-up separates it from the panel below).
Items are 28px tall, hover to `--surface-container-high`, dangerous
items use `--error` text.

Closes on:

- Click outside (via `stopPropagation` on open).
- Escape.
- Selecting an item.

## Toolbar

### `<Toolbar>`

Inline-flex wrapper with 2px gaps, `--surface` bg, 2px padding,
2px radius, optional `--lift-1` shadow when floating over a canvas.
Children are `<IconButton>`s with 4px padding.

Divider: 1px × 14px, `--rule-faint`, inline-block; used between
groups of toolbar buttons (select/pan vs zoom, etc.).

## Sonner (toasts)

Use the existing `client/src/components/ui/sonner.tsx` but retune
styles to tokens:

- `--surface-container` bg, `--r-2` radius, `--s-4` padding.
- Max width 360px.
- Position: bottom-right, 16px inset.

## Form (react-hook-form helpers)

Keep the existing `form.tsx` shape (`<Form>`, `<FormField>`,
`<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`). Style
pass:

- `FormLabel`: `.caps` (11.5px, muted).
- `FormMessage`: 11.5px, `--error`.
- Field gap: `--s-2` (8px).
- Between fields: `--s-3` (12px).

## Not shadcn

A word of caution: we inherited shadcn primitives during the bootstrap.
Those are a decent starting point but they're **not the design** —
they have default Tailwind colours, larger radii, dropshadows, etc.
Every component above must be rewritten to read from our token
custom properties before shipping. Don't let shadcn defaults leak
through.
