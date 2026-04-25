# Design Tokens

Every CSS custom property Fabric uses, with purpose and light/dark
values. The runtime source is `tokens.css` — this document is the
human-readable catalogue. If they disagree, `tokens.css` wins.

## 1. Surfaces — the tonal ladder

Separation between regions is done by stepping up this ladder, never
by drawing a line.

| Token                           | Light       | Dark        | Purpose                                     |
| ------------------------------- | ----------- | ----------- | ------------------------------------------- |
| `--surface`                     | `#fafaf7`   | `#0e0e0e`   | Default page background                     |
| `--surface-container`           | `#f3f2ec`   | `#161615`   | Cards, inputs, panels                       |
| `--surface-container-high`      | `#ecebe5`   | `#1e1e1c`   | Hover, table headers, chip bg               |
| `--surface-container-highest`   | `#e3e2db`   | `#272724…`  | Pressed / active, scrollbar thumb           |
| `--surface-inverse`             | `#14140f`   | `#f4f3ee`   | Ink-filled elements (primary buttons, dots) |

## 2. Ink (text on surface)

| Token                     | Light       | Dark        | Purpose                              |
| ------------------------- | ----------- | ----------- | ------------------------------------ |
| `--on-surface`            | `#14140f`   | `#ecebe5`   | Default text                         |
| `--on-surface-strong`     | `#000000`   | `#ffffff`   | Emphatic text, numerics              |
| `--on-surface-muted`      | `#5c5b52`   | `#8b8a82`   | Secondary text, disabled             |
| `--on-surface-faint`      | `#908f86`   | `#5c5b52`   | Tertiary, placeholders, line numbers |
| `--on-inverse`            | `#f4f3ee`   | `#14140f`   | Text on inverse surfaces             |

## 3. Semantic roles

All roles at low chroma (`oklch(* 0.09–0.13 *)`). Wash variants are
tinted backgrounds; ink is the darker interactive-text variant.

### Primary — interactive blue

| Token              | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `--primary`        | Focus rings, active indicators, ref chips      |
| `--primary-ink`    | Link text, chip text on primary-wash           |
| `--primary-wash`   | Selection bg, ref chip bg, info highlights     |
| `--primary-rule`   | Primary-colored rules (very rare)              |

### Tertiary — warning amber

| Token             | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `--tertiary`      | Warning text, caution icons              |
| `--tertiary-wash` | Warning pill/chip background             |

### Secondary — neutral slate

| Token               | Purpose                              |
| ------------------- | ------------------------------------ |
| `--secondary`       | Muted interactive elements           |
| `--secondary-wash`  | Very-subtle highlight backgrounds    |

### Error — desaturated red

| Token            | Purpose                              |
| ---------------- | ------------------------------------ |
| `--error`        | Error text, destructive action text  |
| `--error-wash`   | Error pill/chip bg, error row bg     |

### Agent — teal (peer color, not purple)

| Token           | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `--agent`       | Agent-edited node/edge borders; flash animation end  |
| `--agent-wash`  | Agent flash start, agent label bg, nudge card accent |

## 4. Rules (when tonal shift isn't enough)

Used only when two adjacent regions can't be separated by surface
shift alone — e.g. a floating toolbar over a canvas.

| Token           | Definition                                            |
| --------------- | ----------------------------------------------------- |
| `--rule-faint`  | `color-mix(in oklab, var(--on-surface) 5%, transparent)`  |
| `--rule`        | `color-mix(in oklab, var(--on-surface) 9–10%, transparent)` |

## 5. Radii

| Token    | Value | Use                                                   |
| -------- | ----- | ----------------------------------------------------- |
| `--r-1`  | 2px   | Buttons, inputs, chips, segmented controls            |
| `--r-2`  | 4px   | Cards, panels, modals                                 |

No pills. No half-rounded. Avatars use 50% as the one exception.

## 6. Typography

### Families

| Token              | Stack                                           | Used for                             |
| ------------------ | ----------------------------------------------- | ------------------------------------ |
| `--font-display`   | `"Space Grotesk", ui-sans-serif, system-ui, sans-serif`  | Screen titles, brand, hero copy |
| `--font-ui`        | `"Inter", ui-sans-serif, system-ui, sans-serif`          | Body UI, buttons, labels         |
| `--font-mono`      | `"JetBrains Mono", ui-monospace, …`                      | Code, metadata, IDs, captions    |

### Scale

| Token      | Value    | Use                                          |
| ---------- | -------- | -------------------------------------------- |
| `--t-xs`   | 10.5px   | Mono metadata, file sizes, coordinates       |
| `--t-sm`   | 11.5px   | UI labels, caps (`text-transform: uppercase`) |
| `--t-md`   | 13px     | Body UI default                              |
| `--t-lg`   | 15px     | Section titles                               |
| `--t-xl`   | 19px     | Panel titles, modal titles                   |
| `--t-2xl`  | 26px     | Screen titles                                |
| `--t-3xl`  | 38px     | Display hero (landing, onboarding step titles) |

Line height baseline: **1.35** (set on `body`). Never override
globally; tweak per component.

## 7. Spacing (4px base)

| Token    | Value |
| -------- | ----- |
| `--s-1`  | 4px   |
| `--s-2`  | 8px   |
| `--s-3`  | 12px  |
| `--s-4`  | 16px  |
| `--s-5`  | 24px  |
| `--s-6`  | 32px  |
| `--s-7`  | 48px  |

Standard card padding is `--s-4` (16px). Standard panel padding is
the same. Spacing between cards in a grid is `--s-3` (12px).

## 8. Rows

| Token       | Height | Use                                       |
| ----------- | ------ | ----------------------------------------- |
| `--row-sm`  | 24px   | Compact UI (stepper, small button)        |
| `--row-md`  | 28px   | Default button, input, nav item           |
| `--row-lg`  | 32px   | Spacious UI (toolbar button, large input) |
| `--row-xl`  | 40px   | CTA buttons, hero inputs                  |

## 9. Layout constants

| Token        | Value | Use                                   |
| ------------ | ----- | ------------------------------------- |
| `--nav-h`    | 44px  | Top nav bar                           |

Ad-hoc (not tokenised, but consistent):

- Settings sidebar: **220px**
- Graph detail panel: **300px**
- Diagram context panel: **260px**
- Code pane gutter: **44px** (foreign gutter is 42px)
- Card grid min width: **248px**
- Landing content max width: **1200px**
- Account content max width: **860px**

## 10. Shadows

| Token       | Definition                                                    | Use                                  |
| ----------- | ------------------------------------------------------------- | ------------------------------------ |
| `--lift-1`  | `0 1px 0 …6%, 0 2px 8px …6%` (two stacked low-opacity shadows) | Floating toolbars over a canvas only |

Everything else sits on tonal hierarchy. No drop shadows on cards,
no modals with drop shadows, no menu shadows.

## 11. Dot grid

| Token    | Definition                                                    | Use                                  |
| -------- | ------------------------------------------------------------- | ------------------------------------ |
| `--dot`  | `color-mix(in oklab, var(--on-surface) 9%, transparent)`      | Radial-gradient dot patterns         |

Applied as:

```css
background: radial-gradient(var(--dot) 1px, transparent 1px);
background-size: 16px 16px;
```

Common grid sizes: 10px (tight), 16px (diagram canvas), 20px, 22px
(Excalidraw), 24px (Mermaid).

## 12. Transitions

Not tokenised; always **120ms ease**. Exceptions:

- Switch thumb: 140ms.
- `@keyframes agent-flash`: 1.6s ease-out, fades agent-wash → transparent.
- `@keyframes agent-label`: 1.8s ease-out, opacity + translateY(-4px).

## 13. Focus ring

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}
```

No glow. No double ring. Never removed.

## 14. Scrollbar

10px wide, `--surface-container-highest` thumb, transparent track,
no radius. Keeps visual weight low.

## 15. How tokens compose

- Hover on a card: step `surface-container` → `surface-container-high`.
- Pressed: `surface-container-high` → `surface-container-highest`.
- A panel over a surface: `surface-container` on `surface`. No border.
- A menu popping above a panel: `surface` on `surface-container`.
  Tonal contrast is reversed; separation is still readable.

Keep to the ladder. If you find yourself wanting a rule, ask whether
you're fighting the ladder — most of the time, stepping up or down
achieves what a border would.
