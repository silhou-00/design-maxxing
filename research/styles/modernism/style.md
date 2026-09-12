# Modernism (and Bauhaus)

> Form follows function. Geometry, grid, sans-serif, primary colour. The root of everything after it.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Rational, institutional, confident. Architecture and product brands, design
systems, education, cultural institutions.

## Implementation

```css
.mod{
  background: #f2ede4;                /* warm off-white paper, not screen white */
  color: #111;
}
.mod h3{
  font: 700 30px/1 ui-sans-serif, system-ui;
  text-transform: uppercase;
  letter-spacing: .02em;
}
/* The three primitives, flush against each other — no gaps, no rounding */
.mod .shapes{ display: flex; align-items: flex-end; gap: 0; }
.mod .sq{ width: 64px; height: 64px; background: #0a49c4; }
.mod .ci{ width: 64px; height: 64px; border-radius: 50%; background: #e01b24; }
.mod .tr{
  width: 0; height: 0;
  border-left: 32px solid transparent;
  border-right: 32px solid transparent;
  border-bottom: 64px solid #f5c518;
}
```

**Measurements**
| Token | Value |
|---|---|
| Palette | Bauhaus primaries: blue `#0a49c4` · red `#e01b24` · yellow `#f5c518` · black `#111` |
| Ground | warm off-white `#f2ede4` |
| Type | geometric sans (Futura, Poppins, Jost, Century Gothic); one family |
| Headings | `700`, uppercase, tracking `+.02em` |
| Shapes | square, circle, equilateral triangle — one size module (`64px` and its multiples) |
| Gaps | `0` between shapes; they interlock |
| Radius | `0` on rectangles, `50%` on circles. Nothing between |
| Grid | strict modular, asymmetric within it |
| Diagonals | 45° only |

**The module rule** — pick one unit (say 64px). Every shape, gap and column is that unit or an
integer multiple. This is what separates Bauhaus from "some shapes."

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:4px solid #0a49c4; outline-offset:3px }
```

**Why this and not something on-style.** a primary, at the module's own thickness. Blue on the warm ground is 7.6:1 — the strongest of the three primaries, and the yellow is unusable for this.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Yellow.** #f5c518 is 1.7:1 with white and 11.4:1 with ink. Yellow ALWAYS takes ink text. This is the pack's one hard colour rule and it is the commonest Bauhaus mistake on the web.

**Radius.** maxRadius is intentionally unset: this pack allows 0 and 50% and nothing between, which a single px ceiling cannot express. A 50% radius on a 64px circle computes to 32px and would false-positive.

**Ground As Text.** The warm off-white #f2ede4 must not be reused as text on the primaries: on red it is 4.14:1 and misses 4.5:1. Pure white is 5.2:1 there. Ground colours and text colours are separate jobs even when the palette is only five values.

**Red As Text.** The Bauhaus red is a FILL colour. Used as text on the warm ground it measures 4.14:1 and misses 4.5:1, so text uses #b0141c (6.5:1). This does not add a fourth hue — it is the same red tuned for a second role, which is what a palette actually is.

## Banned

- Gradients, shadows, texture, glow
- More than the three primaries plus black and white
- Serif or humanist type
- Arbitrary angles (only 0°, 45°, 90°)
- Decoration with no structural role
- Centred, symmetrical page layouts (asymmetric *balance* is the goal)

## Copy budget

Read by `engine/audit.mjs` via `--pack modernism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–68ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤5 words** | uppercase geometric display at scale — five words is already two lines |
| sub | ≤22 words | |
| button label | ≤2 words | |
| chars per viewport | 360 | engine default is 420 |

## Gotchas

- **Bauhaus primaries are a low-contrast trap for text.** `#f5c518` yellow on white is ~1.6:1 — never
  use it for type. Use the primaries as large flat fills and keep text black.
- **Uppercase headings hurt long-form reading.** Cap them at one line, two words.
- **Modernism vs Swiss vs Minimalism.** They are ancestor and descendants, per Looka. Modernism =
  geometry + primaries + grid. Swiss = grid + Helvetica + objective photography, colour optional.
  Minimalism = subtraction. Choose by what you want to *lead* with.
- **The style has strong institutional associations.** It reads authoritative and slightly cool — a
  poor fit for products that need to feel warm or personal. Japandi or Mid-Century are the warm
  alternatives (UX Planet §11, §39).

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
