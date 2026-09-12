# Bento — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` (browser only, never
read into context — it is **generated** from `tokens.json` by `_shared/build-modules.mjs`).
Values: `tokens.json`. Rules: `style.md`.

**The constraint that shapes every module below: bento has no sections, only cells.** Every other
pack in the catalogue composes in horizontal bands. This one composes in a grid, and a module is a
cell or a group of cells within it.

---

## 1. Nav / header

A cell like any other — `span 4`, same radius, same hairline. **It does not float and casts no
shadow**, because nothing in this pack casts a shadow.

```css
.nav-cell{ grid-column:span 4; padding:10px 14px }
```

Active link: a filled pill at `#26262c` (dark) / `#e4e4e7` (light), not an underline and not a
border. A second border inside a bordered cell reads as a nested compartment.

Do not make the nav sticky by default. A sticky bar re-introduces the floating layer the pack
removed; if the product needs one, it becomes a bar and stops being a cell — say so explicitly.

## 2. Hero

**The hero is the `2×2` cell, not a full-bleed band.** That is the single biggest difference from
every other pack here.

- Headline **≤6 words** — it has to fit a compartment
- Sub ≤18 words, `max-width:46ch`
- Display size `clamp(28px, 4.4vw, 46px)`, `line-height:.95`
- The surrounding 1×1 and 2×1 cells carry the supporting numbers

A hero that spans the full width and sets its own background is a band, and a band is another pack's
vocabulary.

## 3. Button — five states

| state | change from rest | note |
|---|---|---|
| **default** | `background:#1a1a1f` · `border:1px #2a2a31` · `radius:10px` | a small cell |
| **hover** | `border-color:#52525b` | **border only** — no lift, no shadow, no fill change |
| **active** | `border-color:#52525b`, `opacity:.9` | |
| **focus-visible** | `outline:2px solid #f5f5f7; outline-offset:2px` | the hairline is 1.24:1 and cannot carry a state |
| **disabled** | `opacity:.45` | legal — 1.4.11 exempts inactive components |

Primary is the **only** place the accent is allowed to touch a container. Everywhere else colour
lives in the data.

Button radius is `10px`, not the cell's `18px` — a control inside a cell is a nested element, and
nested radius decreases.

## 4. Form field + error

An input is a cell with a **darker** fill (`#101014`), which is the inverse of most packs: here the
recessed thing is darker than its container rather than raised above it.

**Error cannot use a red border alone** — that is colour-only signalling (WCAG 1.4.1) — and cannot
use a heavy shadow. So the error is a text row inside the cell:

```html
<input class="pk-field" aria-invalid="true" aria-describedby="e1">
<p class="pk-err" id="e1" role="alert"><b>!</b> Add everything after the @ — e.g. .com</p>
```

Label above at `12px` muted, never a placeholder.

## 5. Card

**In bento the card *is* the cell.** There is no separate card component — which is exactly why span
variation has to carry all the hierarchy.

- Nested radius `4px` = `18 − 14`
- Interactive cells get `cursor:pointer` and the border-hover; non-interactive cells get neither
- Never add a shadow to signal "this one is important". Use a bigger span

## 6. List / table

Bento's weakest module, and worth saying so. A table wants rules and alignment; a cell wants a single
summarisable value.

When the content is genuinely tabular, give the table **one full-width `span 4` cell** with
`grid-row: span 3` and let it be a table inside it. Do not try to express rows as cells — you get the
card list the pack bans.

```css
table{ border-collapse:collapse }
th{ font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:#a1a1aa }
td{ border-top:1px solid #2a2a31; padding:9px 0 }
```

Row separators are the same hairline as the cell border. No zebra striping — a tint is a second
value competing with the one-accent rule.

## 7. Overlay / modal

**No blur.** `backdrop-filter` is glassmorphism's vocabulary and reaching for it here blends two
packs. Scrim is flat `rgba(0,0,0,.72)`.

The dialog is simply a cell that happens to be centred — same fill, same hairline, same `18px`
radius. It does not grow a shadow to signal elevation.

Focus trapped, `Esc` closes, focus returns to the trigger.

## 8. Empty / loading

**This is the module where bento's own ban applies to itself.** Tilda: *no empty filler cells to
make the grid resolve.* So an empty state is never a blank compartment — it is a cell with a
**dashed hairline** that states what is missing plus one action.

```css
.empty{ border:1px dashed #2a2a31; border-radius:18px; padding:22px; text-align:center }
```

**Loading:** solid hairline, flat `#26262c` skeleton bars at `6px` radius. No shimmer — a shimmer is
a gradient, and gradients are banned.

A live failure worth recording: a `span 4` cell containing only a section eyebrow **is** a filler
cell. Fold the label into the cell it introduces.

---

## Dark mode

**Bento is dark-first.** The sourced specimen is `#0d0d0f`; light is the variant, and it is the
variant that breaks.

```css
@media (prefers-color-scheme: light){
  :root{ --page:#f4f4f5; --cell:#fff; --line:#d4d4d8; --text:#18181b; --muted:#52525b }
}
```

The hairline is the load-bearing token in both directions. `#e4e4e7` on `#fafafa` is **1.09:1** —
the cells dissolve into the page. `#d4d4d8` on `#ffffff` is 1.47:1, still low but visible, and still
legal under the container exemption in `style.md`.

The accent must also darken on light: `#4ade80` on white is 1.7:1 and unreadable as text.

## Narrow width

**This is where bento breaks, and the pack's own gotchas say so.**

Deliberate span changes at each step — never a bare reflow:

```css
@media (max-width:820px){                 /* 4 → 2 columns */
  .box{ grid-template-columns:repeat(2,1fr) }
  .hero{ grid-column:span 2; grid-row:span 2 }
  .full{ grid-column:span 2 }
}
@media (max-width:520px){                 /* 2 → 1 */
  .box{ grid-template-columns:1fr; grid-auto-rows:70px }
  .hero{ grid-column:span 1; grid-row:span 2 }
}
```

The 2×2 hero is the specific failure: at one column it becomes a tall empty rectangle unless its
`grid-row` span is reduced with it. Keep 16px page padding — not for a shadow, which this pack does
not have, but so the hairline does not sit flush against the viewport edge and read as a page border.
