# Flat

> Zero depth. No shadow, no gradient, no gloss, no bevel. Colour and type do all the work.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Tilda: "a solid choice for projects that value simplicity and speed. It works
great for corporate websites, SaaS platforms, and news portals where usability comes first."

## Implementation

```css
.flat{ background: #ecf0f1; color: #2c3e50; }
.flat h3{ font: 700 26px/1.1 "Roboto", "Open Sans", ui-sans-serif; }

/* Tiles: solid fills, square corners, equal gaps — the Windows 8 / Metro pattern */
.flat .tiles{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.flat .t{
  aspect-ratio: 1;
  border-radius: 0;
  display: grid; place-items: center;
  color: #fff; font-weight: 700;
}
.flat .t1{ background:#1abc9c } .flat .t2{ background:#3498db } .flat .t3{ background:#e74c3c }
.flat .t4{ background:#f1c40f } .flat .t5{ background:#9b59b6 } .flat .t6{ background:#34495e }

.flat .btn{
  background: #2980b9; color: #fff;
  border: 0; padding: 12px 22px; font-weight: 600;
}
```

**The canonical flat palette** (the "Flat UI Colors" set that defined the era, and what the specimen
uses):

| Name | Hex | Role |
|---|---|---|
| Turquoise | `#1abc9c` | success / positive |
| Peter River | `#3498db` | primary |
| Belize Hole | `#2980b9` | primary pressed |
| Amethyst | `#9b59b6` | secondary |
| Wet Asphalt | `#34495e` | dark neutral |
| Midnight Blue | `#2c3e50` | text |
| Sun Flower | `#f1c40f` | warning |
| Alizarin | `#e74c3c` | danger |
| Clouds | `#ecf0f1` | background |
| Silver | `#bdc3c7` | disabled |

**Measurements**
| Token | Value |
|---|---|
| Type | Roboto / Open Sans (Tilda names both), `700` headings, `400` body |
| Fill | one solid colour per element; `background` only |
| Radius | `0`, or one small consistent value |
| Gaps | one value throughout (`12px` in the specimen) |
| Shadows | **none** |
| Gradients | **none** |
| Icons | flat single- or two-colour, no outlines-plus-fill mixing |
| States | shift the fill one step darker (`#3498db` → `#2980b9`) |

**State model** — because there is no depth, state must be carried by *fill*. Define a two-step ramp
for every interactive colour: base and pressed. That is the entire interaction system.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #2c3e50; outline-offset:2px }
```

**Why this and not something on-style.** flat gave up depth, so it cannot use a shadow ring. Ink on any pack fill clears 3:1, and a 3px ring is thick enough to read without elevation.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Signifier.** NN/g: flat design's missing depth cues have been 'reducing user efficiency by complicating users' understanding of what's clickable'. This pack gave up two of the three clickability channels, so the resting state MUST identify controls through type, colour, contrast and wording. Hover may stay supplemental (WCAG 1.4.11 exempts it) but rest may not.

**Contrast.** The canonical flat palette fails AA on white. #3498db is 2.9:1 and #2ecc71 is 1.9:1. This pack darkens every hue until it clears 4.5:1 — that is not a deviation from flat, it is flat done correctly.

**Secondary.** Outline buttons must use the PRESSED step for their text and border, not the base. The base primary is tuned for white-on-fill; as ink-on-ground it is 3.77:1 and fails.

**Flat Blue.** The canonical flat blue #3498db is 2.9:1 on white and unusable for text. Darkening to #2f7fb8 gives 4.33:1 with white — which clears LARGE text (3:1) but still fails 14px body (4.5:1). Every fill that sits under white body text therefore uses #20628f (6.3:1), and #2f7fb8 is demoted to a non-text tint. THIS IS THE FINDING: a flat palette has to be re-derived against the text sizes it will carry, not darkened until one sample passes. The self-audit surfaced it four separate times — nav pill, hero band, secondary button, primary button — before the ramp itself was corrected.

**Palette.** Flat is the one pack in the catalogue with a deliberately WIDE palette. Tilda and the reference galleries show 5-8 hue compositions as the norm, not the exception. The constraint is not hue COUNT, it is that every hue is a flat fill with no gradient and no depth, and that any hue carrying text is derived against that text size.

**On Color.** Outline/ghost controls inherit a colour derived against the page ground. On a coloured band that derivation is invalid — the flat secondary is 2.59:1 on the amber hero. Controls on a coloured band must take the same ink-or-white the band's own text uses.

**Amber.** #b9770e was chosen to carry WHITE text (4.6:1) but the hero band carries INK, where it is only 2.99:1 — under even the 3:1 large-text floor. A hue tuned for one text colour is not tuned for the other; the band uses #e8a33d (5.6:1 with ink) instead. Same lesson as the blue ramp, from the opposite direction.

## Banned

- `box-shadow` of any kind
- `linear-gradient` / `radial-gradient`
- Bevels, insets, glossy highlights
- `text-shadow`
- Faux-3D icons or illustrations
- Depth-based elevation systems (that is Material, not flat)

## Copy budget

Read by `engine/audit.mjs` via `--pack flat`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–70ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤7 words** | flat headings are bold and large; seven words is the practical ceiling |
| sub | ≤25 words | |
| button label | ≤3 words | |
| chars per viewport | 420 | engine default is 420 |

## Gotchas

- **Discoverability is flat's documented weakness.** With no shadow and no bevel, a coloured
  rectangle and a button look identical. Compensate with: consistent colour semantics (only primary
  blue is clickable), generous hit targets, and unambiguous labels. This is exactly why Material
  Design re-introduced elevation — Looka notes Material "incorporat[es] some shadow and depth."
- **The classic flat palette has contrast holes.** `#f1c40f` on white is ~1.7:1; `#1abc9c` on white
  is ~2.2:1. Neither is usable for text or for a 3:1 UI boundary. Use them as large fills with white
  or `#2c3e50` text placed on them, and darken them for any text-on-white use.
- **"Flat" is not "minimal".** Flat forbids depth; it says nothing about quantity. The Windows 8
  start screen is flat *and* visually dense. See `../minimalism/style.md` for the other axis.
- **It is the safest style in this catalogue and also the most invisible.** Every source treats it as
  a baseline rather than a statement. If the brief asks for distinctiveness, flat is the wrong pick —
  reach for `../neo-brutalism/style.md` or `../swiss/style.md`.
- **Flat's original argument was performance** ("made sites faster, and easier to load"). That
  argument is weaker now, but it still holds against glass and neumorphism, both of which are
  paint-heavy.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
