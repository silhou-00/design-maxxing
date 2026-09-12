# Bento

> Every piece of content in its own rounded compartment. Tight gaps, varied cell spans, no empty space.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job needs
them.

**Mood & occasion** — Organized, friendly, clean. Dashboards, portfolios, productivity tools,
e-commerce — anywhere content is dense and clarity is the job. Choose it for clarity and density,
**not for distinctiveness**: Tilda says outright it is "no longer surprising or experimental."

## Implementation

Bento is a CSS Grid pattern with a **span vocabulary**. The design work is deciding *which* cells
span.

```css
.box{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 74px;        /* fixed — spans are integer multiples */
  gap: 10px;                   /* tight: 8–12px, NOT 24px */
}
.b{
  background:#1a1a1f;          /* one step off the #0d0d0f page */
  border:1px solid #2a2a31;    /* hairline, one step lighter than the fill */
  border-radius:18px;
  padding:14px;
  display:flex; flex-direction:column; justify-content:flex-end;
  font-size:12px; color:#a1a1aa;
}
.b strong{ color:#f5f5f7; font-size:18px; font-weight:600 }

/* the span vocabulary IS the layout language */
.hero{ grid-column:span 2; grid-row:span 2 }   /* one 2×2 */
.wide{ grid-column:span 2 }                    /* a couple of 2×1 */
.full{ grid-column:span 4 }                    /* one full-width */
```

**Measurements**

| Token | Value |
|---|---|
| Columns | 4 (mobile 1–2, tablet 2–3, desktop 4–6) |
| Row height | fixed `72–96px` (`74px` in the specimen) |
| Gap | **`8–12px`** — the tightness is the style |
| Radius | **`16–24px`** (`18px` in the specimen) |
| Nested radius | outer − padding → `18 − 14 = 4px` |
| Fill | one step off the page background |
| Border | `1px` hairline, one step lighter than the fill |
| Shadow | **none** — the border does the separating |
| Type | one value/label pair per cell: `18px/600` + `12px` muted |
| Palette | neutral — **colour lives in the data, not the container** |

**Span rhythm** — a good bento has *unequal* cells: one 2×2 hero, two 2×1 wides, several 1×1 units,
one full-width. **A grid of identical cells is a card list, not a bento.**

**One-line summary:** 4 columns, 74px rows, 10px gap, 18px radius, 1px hairline, no shadow.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

**Focus cannot use the hairline.** `#2a2a31` on `#1a1a1f` measures **1.24:1**, nowhere near the 3:1
that WCAG 2.4.13 needs for a focused-vs-unfocused change. Focus uses the text colour:

```css
:focus-visible{ outline:2px solid #f5f5f7; outline-offset:2px }   /* 15.8:1 on the cell */
```

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | **see the exemption below** |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` | 2px text-colour ring at 2px offset |
| Target size (2.5.8) | 24×24 | `padding:9px 14px` ≈ 33px tall; cells themselves are far larger |

**The hairline exemption, stated precisely.** `1px #2a2a31` does **not** meet 1.4.11 — it is
1.24:1. It is legal because **a bento cell is a container, not a control**, and 1.4.11 governs UI
components and the graphical objects needed to identify them. The moment a cell becomes clickable,
that border stops being sufficient and the cell needs a real affordance. Do not quietly make cells
interactive and keep the same border.

## Banned

- Wide gaps — Tilda: "very little empty space"
- Uniform cell sizes — no span variation
- Sharp corners
- Heavy shadows — the hairline border replaces them
- Decorative treatment inside cells — "no decorative or unconventional design tricks"
- More than one accent hue across the whole grid
- **Empty filler cells to make the grid resolve**

## Copy budget

Read by `engine/audit.mjs` via `--pack bento`; the numbers live in `tokens.json`. Tighter than the
engine default because the container is a compartment, not a section.

| | value | note |
|---|---|---|
| measure | `45–70ch` | WCAG 1.4.8 ceiling is 80; cells are wide, the copy inside must not be |
| headline | **≤6 words** | a headline here is a cell label |
| sub | **≤18 words** | |
| button label | ≤2 words | |
| chars per viewport | **300** | well below the engine's 420 |
| per cell | **one number, chart or statement** | if the content is paragraphs, bento fights it |

## Gotchas

- **Mobile is where bento breaks.** Four columns collapsing to one turns a considered composition
  into a long stack of boxes, and the 2×2 hero becomes a tall empty rectangle. **Change
  `grid-row: span` values at breakpoints — do not just let it reflow.**
- **The nested-radius mistake.** An `18px` cell containing an `18px` image looks wrong; concentric
  curves need decreasing radii. Use `calc(18px - 14px)` = `4px`. The most visible bento bug.
- **Content has to be summarisable.** Each cell needs a single number, chart or statement. If your
  content is paragraphs, use `../editorial/style.md`.
- **Dark bento needs the hairline, and light bento needs a darker one.** On `#0d0d0f`, a `#1a1a1f`
  cell with no border nearly disappears. On light, `#e4e4e7` on `#fafafa` is **1.09:1** and the cells
  dissolve — the border must darken to `#d4d4d8`.
- **Accessible reading order.** Grid `span` placement can make DOM order differ from visual order,
  which breaks keyboard and screen-reader flow. Keep DOM order matching reading order, or place with
  explicit `grid-area`.
- **An eyebrow alone in a cell is a filler cell.** This was a live failure in `page.html`: a
  `span 4` cell containing only a section label reads as the empty compartment the pack bans. Fold
  the label into the cell it introduces.
- **It is no longer differentiating.** Tilda says so directly. Choose bento for clarity and density.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` is built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
