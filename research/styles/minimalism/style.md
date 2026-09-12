# Minimalism

> The fewest elements that do the job. Everything left on the page has to justify being there.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Tilda: "industries where creativity, freedom, and elegance matter. For
instance, fashion brands, photographers, music stores, architecture magazines, or artist portfolios."
Tilda also names it, with Swiss, as the dominant 2025 direction: "For most websites, Minimalism and
the Swiss style will continue to dominate."

## Implementation

Minimalism is a spacing and restraint system, not a decoration system.

```css
.min{
  background: #fafafa;          /* near-white, not #fff — white is a colour choice too */
  color: #111;
}
.min h3{
  font: 300 30px/1.15 ui-sans-serif, system-ui;
  letter-spacing: -.02em;       /* large light type needs negative tracking */
}
.min p{
  color: #7a7a7a;               /* secondary text is grey, not smaller */
  max-width: 34ch;              /* the measure does the work of a decoration */
}
.min .rule{ width: 32px; height: 1px; background: #111; }   /* the only ornament allowed */
```

**Measurements**
| Token | Value |
|---|---|
| Palette | 1 background + 2 text greys + **one** accent, used once per view |
| Background | `#fafafa`–`#fff` |
| Primary text | `#111` |
| Secondary text | `#7a7a7a` (contrast, not size, separates levels) |
| Display weight | `300`, tracking `-.02em` |
| Body measure | `34–70ch` |
| Spacing scale | one ratio, e.g. 8 / 16 / 32 / 64 / 128 — and use the *large* end |
| Section padding | `96–160px` vertical on desktop |
| Radius | `0` or one small value, applied everywhere |
| Shadows | none, or one barely-there elevation |
| Borders | `1px` hairlines only |

**Tilda's own 2025 upgrade recipe**, quoted as-is: "Remove anything unnecessary. Add whitespace.
Use clear, contrast typography."

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:2px solid #111; outline-offset:3px }
```

**Why this and not something on-style.** the accent is used once per view and cannot be spent on a focus ring; ink on ground is 17.4:1

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | Bare text links in this pack land at 23.99px tall (15px x 1.6) - 0.01px under the 24x24 floor of WCAG 2.5.8. Nav links carry 6px vertical padding for that reason alone. Caught by the self-audit, not by eye. |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Affordance.** Minimalism hides affordances. A button that is just text with no border and no fill gets missed. Every interactive element needs at least one NON-COLOUR signal.

**Grey.** #7a7a7a on #fafafa is ~4.6:1 — fine for 16px body, NOT fine below 14px. This pack uses #6b6b6b (5.9:1) to buy headroom.

**Target Size.** Bare text links in this pack land at 23.99px tall (15px x 1.6) - 0.01px under the 24x24 floor of WCAG 2.5.8. Nav links carry 6px vertical padding for that reason alone. Caught by the self-audit, not by eye.

## Banned

- A second accent colour
- Decorative dividers, badges, ribbons, gradient fills
- Drop shadows used to separate things that spacing could separate
- Icons next to labels that already say the same thing
- More than two type sizes in a section
- Filling whitespace because it "looks empty" — that is the style working

## Copy budget

Read by `engine/audit.mjs` via `--pack minimalism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `34–70ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | a minimal page has one statement; six words is already generous |
| sub | ≤22 words | |
| button label | ≤2 words | |
| chars per viewport | 240 | engine default is 420 |

the LOWEST budget in the catalogue. Emptiness is the style working, not a gap to fill.

## Gotchas

- **Light weights fail contrast at small sizes.** `font-weight: 300` at 14px on `#fafafa` is thin
  enough to read as low-contrast even when the ratio passes. Keep 300 for 24px+ only.
- **Grey-on-grey secondary text is the most common AA failure in this style.** `#7a7a7a` on
  `#fafafa` is ~4.6:1 — fine for body, *not* fine below 14px. Check it.
- **Minimalism hides affordances.** If a button is just text with no border and no fill, users miss
  it. Give interactive elements at least one non-colour signal.
- **It is expensive, not cheap.** Fewer elements means each one is scrutinised: type, spacing and
  photography have to be genuinely good. There is nothing to hide behind.
- **Do not confuse with flat.** Minimalism is about *quantity* of elements; flat is about *depth*.
  A page can be flat and busy, or minimal and skeuomorphic.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
