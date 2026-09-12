# Swiss Style (International Typographic Style)

> A strict modular grid, Helvetica, flush-left ragged-right text, and objective photography.
> Nothing decorative survives.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Tilda: "Swiss design communicates order, sophistication, and professionalism —
ideal for IT companies and premium product brands." Tilda also names it, with minimalism, as the
dominant 2025 direction.

## Implementation

The grid is not a metaphor here — it is a literal, visible, countable structure.

```css
.swiss{
  background: #fff;
  color: #000;
  font-family: Helvetica, "Helvetica Neue", Arial, sans-serif;
  /* Make the grid visible while designing — delete for production, or keep at 3% */
  background-image: repeating-linear-gradient(90deg,
    rgba(0,0,0,.05) 0 1px, transparent 1px 25%);
}
.swiss h3{
  font: 700 44px/.92 Helvetica, Arial, sans-serif;
  letter-spacing: -.03em;         /* Helvetica at size needs tightening */
}
.swiss .bar{ height: 8px; background: #e2231a; width: 60%; }   /* the one red element */
.swiss .row{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  font-size: 11px;
}
.swiss .meta{ font: 400 11px/1.35 Helvetica, Arial; letter-spacing: .02em; }
```

**Measurements**
| Token | Value |
|---|---|
| Grid | 12 columns, or a **modular** grid (columns × rows) for poster layouts |
| Type family | Helvetica / Helvetica Neue / Univers / Akzidenz-Grotesk — or Inter, Neue Haas |
| Display | `700`, `44–96px`, `line-height .90–.95`, `letter-spacing -.03em` |
| Body / meta | `400`, `11–14px`, `line-height 1.35`, `letter-spacing +.02em` |
| Size contrast | large heading against small body — Tilda states this explicitly |
| Alignment | flush left, ragged right. **Always.** |
| Palette | black, white, greys + **one** flag red (`#e2231a`) |
| Rules | solid bars, `4–8px`, never hairlines-as-decoration |
| Imagery | objective colour photography, hard-cropped to grid cells |
| Radius | `0` |

**The method** — set the grid first, place type into it flush left, then let images occupy whole
cells. Asymmetry comes from *which* cells you leave empty, not from nudging things off-grid.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #e2231a; outline-offset:2px }
```

**Why this and not something on-style.** the one place the flag red does double duty. Red on white is 4.3:1 — above the 3:1 that 2.4.13 requires for a state change, and unmistakable against a black-and-white page.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | Small uppercase meta links are the pack's target-size risk: 12px with no padding is 13.33px tall, well under 24x24. Nav links carry min-height:24px. Caught by the self-audit. |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Target Size.** Small uppercase meta links are the pack's target-size risk: 12px with no padding is 13.33px tall, well under 24x24. Nav links carry min-height:24px. Caught by the self-audit.

## Banned

- Centred text or centred layouts
- Justified text (ragged right is doctrine)
- Serif or display typefaces
- More than one accent colour
- Illustration, icon sets, decorative flourishes
- `border-radius`
- Anything placed off-grid "for balance"
- Drop shadows

## Copy budget

Read by `engine/audit.mjs` via `--pack swiss`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–70ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | display runs 44-96px; six words is already three lines |
| sub | ≤24 words | |
| button label | ≤2 words | |
| chars per viewport | 420 | engine default is 420 |

size CONTRAST is the style's core move — a large heading against small body. Tilda states it explicitly.

## Gotchas

- **Helvetica is not on the web by default.** `font-family: Helvetica` resolves to Arial on Windows
  and Nimbus Sans on Linux — both change the character noticeably. Either license Neue Haas Grotesk /
  Helvetica Now, or use Inter with `font-feature-settings: "cv05","cv08"` and accept the difference.
- **Tight tracking hurts small text.** `-.03em` is for display only; body text needs `+.01–.02em`,
  the opposite sign. Getting this backwards is the most common Swiss mistake.
- **The grid must be real.** A "Swiss-inspired" page with `max-width` and centred blocks is not Swiss.
  Use CSS Grid with named columns and place every element by line number.
- **It is easy to make cold and boring.** Müller-Brockmann's posters work because of extreme scale
  contrast and one violent colour. Timid Swiss is just grey.
- **Swiss vs Modernism vs Minimalism** — Looka places Swiss *inside* modernism, alongside Bauhaus and
  minimalism. Swiss leads with grid + type; Bauhaus leads with geometry + primaries; minimalism leads
  with subtraction.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
