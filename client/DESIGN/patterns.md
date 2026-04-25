# Patterns

Higher-order compositions — not single components, but layouts and
interaction idioms used across screens. Implement these once, reuse
them.

## 1. App shell

```
┌─── nav (44px) ───────────────────────────────────────────────┐
│ brand · org switcher · breadcrumb · [spacer] · ⌘K · export · avatar │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                         <Outlet />                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Single horizontal nav, no sidebar at the app level.
- Nav bg `--surface`, item rows `--row-md`.
- Brand is Space Grotesk 15px 700-weight.
- Org switcher is a `<Menu>`; shows current org, lists memberships.
- Breadcrumb: mono 11.5px, 8px gaps, `/` separator in
  `--on-surface-faint`. Current segment `--on-surface`, bolded, not
  clickable.
- `⌘K` label is rendered as `<Kbd>⌘</Kbd><Kbd>K</Kbd>`.
- Avatar opens a `<Menu>` with theme toggle, profile, sign out.

## 2. Landing layout (Projects, Project detail)

```
├── max-width: 1200px, margin: 48px auto ──────┤
│ Toolbar row (search, sort, filter, +New)    │
├──── Ribbon (4 stats, mono numerics) ────────┤
│ Stat 1  │ Stat 2  │ Stat 3  │ Stat 4        │
├── Card grid (minmax(248px, 1fr), 12px gap) ─┤
│ ... cards ...                                │
└──────────────────────────────────────────────┘
```

Ribbon row: flex with four equal cells, each a mono numeric on top
(`--t-2xl`) and a `.caps` label under (`--t-sm` muted).

Cards have a `<FormatBadge>` top-right, a `.card__thumb` mini
preview, title, and meta row.

## 3. Settings shell (Account, Integrations)

```
├── max-width: 860px, margin: 48px auto ──┤
│ ┌──────────┬─────────────────────────┐   │
│ │ 220px    │   main                  │   │
│ │ sidebar  │                         │   │
│ │ nav      │   panels / tables       │   │
│ │          │                         │   │
│ └──────────┴─────────────────────────┘   │
└───────────────────────────────────────┘
```

Sidebar nav items are `--row-md`, hover → `--surface-container`.
Selected item → `--surface-container-high` with `--primary-wash`
background and `--primary-ink` text. 12px left padding.

Main content title is `--t-xl` (19px), display font. Below it, a
`.caps` muted subtitle. Then panels.

## 4. Split-pane editor

Every editor (diagram, markdown, foreign) uses the same split pattern.

```
┌─── editor header (28px) ──────────────────────────────────┐
│ title · status dot · position         export · ⋯          │
├─── left 40–50% · splitter 4px · right 50–60% ─────────────┤
│                              │                              │
│   CODE / SOURCE              │   CANVAS / PREVIEW           │
│                              │                              │
└──────────────────────────────┴──────────────────────────────┘
```

- Splitter: 4px wide, `cursor: col-resize`, hover adds `--rule`
  accent. Drag updates a flex-basis on the left pane.
- Default ratio per editor:
  - Diagram: 40% code / 60% canvas.
  - Markdown: 50 / 50.
  - Foreign: 50 / 50.
- Split ratio persists per artifact (localStorage `split:<artifactId>`).

## 5. Code pane

```
┌── gutter 42–44px · body fill ──┐
│        1 │ title "Payments"    │
│        2 │ direction LR        │
│        3 │                     │
└──────────────────────────────────┘
```

- Gutter: right-aligned mono 10px, `--on-surface-faint`. Background
  is the same as body (no tonal shift); separation is the rule.
- Body: mono 12–12.5px, line-height 1.55–1.65.
- Syntax tokens — `.tk-key` (primary mix), `.tk-ident` (on-surface),
  `.tk-str` (tertiary mix, amber), `.tk-punct` (muted), `.tk-comment`
  (faint italic), `.tk-arrow` (muted). Foreign editors use
  `.tok--kw`, `.tok--str`, `.tok--num`, `.tok--comment`, `.tok--punct`.
- Active line highlight: `.line-hl`, `--primary-wash` at 8% opacity.

## 6. Canvas (diagram)

```
┌── canvas-pane, background: dot grid 16×16 ──┐
│                                              │
│      [service]──►[database]                  │
│                                              │
│  [toolbar BL]                  [context TR]  │
│                                              │
└─── status bar (24px, blur 6px) ──────────────┘
```

- Dot grid: `background: radial-gradient(var(--dot) 1px, transparent 1px)`, `background-size: 16px 16px`.
- Nodes: 5 shapes — rect (default), cylinder (rounded ellipse
  borders), parallelogram (skew -10deg wrapper + inner +10deg skew),
  client (inline square prefix + text), plain rect (service).
- Node fill: `--surface`. Border: `1px solid var(--rule-faint)` at
  rest; `1px solid var(--on-surface)` on hover; `1.5px solid
  var(--on-surface)` when selected; `1.5px solid var(--agent)` when
  agent-edited (plus flash animation).
- Edges: SVG path, 1px `var(--on-surface-muted)` stroke, arrow
  marker. Agent edges: 1.5px `var(--agent)`. Label at midpoint, mono
  9.5px on `--surface` pill.

## 7. Graph canvas

Larger SVG scale than the diagram canvas (intended for 50–500 nodes
across projects). Same dot grid background.

- **Clusters**: project rectangles, `--r-2` radius, subtle
  `color-mix(--on-surface 3%, --surface)` fill. Label top-left (mono
  11.5px caps); id top-right (mono 10.5px muted).
- **Nodes**: glyph ◇/¶/◢/▤/✎ + 11.5px label. Same fill/border
  treatment as diagram nodes.
- **Edges** (five kinds):
  - `references`: solid 1.0px
  - `implements`: solid 1.4px
  - `supersedes`: dashed 6-3, 1.2px
  - `derived`: dotted 2-3, 1.0px
  - `links`: dotted 1-3, 0.9px
- **Legend** (bottom-left): `<Panel>`, 140px min-width, five rows
  (swatch + kind name mono 10.5px).
- **Zoom**: bottom-right, mono text + `-` / `+` icon buttons.

### Interactions

- Click node → select, open detail panel, dim non-neighbors to
  `--surface-container-highest` (tonal dim, not opacity).
- Hover node → highlight 1-hop neighborhood (no dim on rest).
- Right-click node → `<Menu>`: Open, Rename (inline), Delete (confirm).
- Right-click empty canvas → Menu: New project, Paste (if clipboard).
- "New relationship" tool (toolbar button or `n` key): click
  source → target → `<Menu>` with 5 kinds → persists.
- Drag empty canvas → pan. ⌘/Ctrl + scroll → zoom. Pinch on trackpad
  → zoom. `f` → fit to contents; `r` → reset.

## 8. Agent affordances

All three affordances share the `--agent` / `--agent-wash` colours
and the teal glyph.

### Flash + label (on canvas)

When the agent edits a node or edge:

1. Apply `.agent-flash` class to the element → `@keyframes
   agent-flash` 1.6s ease-out: background fades `--agent-wash` →
   transparent.
2. Append an absolute-positioned `.agent-label` above the node →
   `@keyframes agent-label` 1.8s: fades in at 10%, out at 75%, with
   `translateY(-4px)`. Label text: mono 10.5px "~ agent" in
   `--agent`.

Never persist either — they're event-driven, one-shot.

### Nudge card

Fixed bottom-left (`left: 16px; bottom: 36px`), 360px wide,
`--surface` bg, `--r-2`, 16px padding. Contents:

- Title (caps, muted): "AGENT PROPOSED"
- Diff summary: compact list of changes (nodes added/removed, edges
  added/removed). Mono 11.5px.
- Actions: `<Button variant="primary" size="sm">Apply</Button>`,
  `<Button variant="ghost" size="sm">Dismiss</Button>`.

Only one nudge visible at a time. A second proposal replaces the
first.

### Prompt bar

Fixed bottom-centre, `min(560px, 72%)` wide, `--surface` bg,
`--r-2`, 8px padding.

Contents: mono input (placeholder: "Ask agent to…"), `<IconButton>`
submit. Enter submits; Shift+Enter newlines. On submit, the bar
shows a `.pill--agent` "Thinking…" for up to 20s; then either
renders a nudge card or dismisses with an error toast.

Only on diagram and markdown editors in v1.

## 9. Card menu

Triggered by a `<IconButton>` with the `more_horiz` Material glyph
sitting top-right on a card. Opens a `<Menu>` anchored top-right.

Standard items: Open · Rename · Duplicate · Archive · Delete
(danger). Rename opens inline (the card title becomes an input).

## 10. Confirm delete

`<Modal>` at 380px. Title: `--t-lg` (15px), `--on-surface-strong`.
Body: plain text explaining the action. For artifact delete: list
outgoing refs + incoming refs. For project delete: list artifact
count + ref count.

Footer: `<Button variant="ghost">Cancel</Button>` and
`<Button variant="danger">Delete</Button>`, right-aligned.

## 11. Big-choice grid (onboarding, NewFile)

Two-column grid, each choice a large tile (~240×140). Tile:
`--surface-container` bg, `--r-2`, 16px padding. Icon top-left
(Material Symbols 20px), title (`--t-md` 500-weight), description
(`--t-xs` muted, 2 lines). Hover → `-high`. Selected → `-high` +
`--primary-wash` 1px inset rule.

## 12. Step indicator (onboarding)

Horizontal. Five segments, 4px tall, 8px gap. Completed → `--on-surface`.
Current → `--primary`. Upcoming → `--surface-container-high`. Below
each bar: step label (mono 10.5px, muted).

## 13. Empty states

Plain. No illustration, no large icon. A single `<Panel>` with:

- Title (`--t-md` 500-weight).
- Body text (2–3 lines, `--on-surface-muted`).
- Primary action `<Button>`.

Centered horizontally inside the container. That's it.

## 14. Loading states

- **List/grid**: three skeleton cards (same shape, `--surface-container`
  bg, shimmer via a 1s linear-gradient animation). Max.
- **Editor**: the shell renders immediately; panes show a
  `.caps` "Loading…" while content fetches.
- **Inline**: `<Pill variant="primary">Loading</Pill>`. No spinners.

No full-screen loaders. The shell is cheap; render it and fill in.

## 15. Error states

- **Field-level**: `FormMessage` below the input, 11.5px, `--error`.
- **Toast**: sonner, 360px wide, `--error-wash` bg, `--on-surface`
  text. 5s auto-dismiss.
- **Screen-level**: inline panel in place of content. Title "Couldn't
  load", body with the error message (mono, selectable), retry
  button. No modal.

## 16. Keyboard map

Global:

- `⌘K` — command menu
- `⌘S` — save (diagram/markdown autosaves; this is a no-op with a toast)
- `⌘,` — settings (account page)
- `?` — shortcut sheet

Graph:

- `v` select · `h` pan · `n` new relationship · `+`/`-` zoom · `f`
  fit · `r` reset · `delete` on selected node

Diagram:

- `v` select · `h` pan · `shift+drag` constrain to axis · `del`
  delete selected · `a` add node (context popover)

Markdown:

- `⌘/` toggle prompt bar

Every shortcut is visible on hover tooltips and in the `?` sheet.

## 17. Print (`Fabric-print.html`)

Out of scope for v1. The design bundle includes a stacked print
layout; we'll pick it up later via a dedicated "Export PDF" route
that renders all screens sequentially on `@page landscape`. For now,
the export menu on lists shows a disabled "Export PDF (coming soon)"
item.
