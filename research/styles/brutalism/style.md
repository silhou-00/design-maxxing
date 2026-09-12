# Brutalism

> Show the bones. No polish, no comfort, no apology. The browser's defaults are a legitimate palette.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — "Bold new startups, edgy brands, or artists who want to showcase their
personality. It's perfect for portfolios that challenge the norm or companies ready to disrupt the
market" (Tilda). "Artist portfolios, experimental interfaces, or counterculture brands" (UX Planet).

## Implementation

Brutalism is defined by *subtraction*. The implementation note is mostly a list of things you do not
write. From `research/specimens/index.html` (`.brut`):

```css
.brut{
  background: #fff;
  color: #000;
  font-family: ui-monospace, "Courier New", monospace;
}
.brut h3{
  font-size: 34px;
  line-height: .9;          /* type crashes into itself */
  text-transform: uppercase;
  letter-spacing: -.02em;
  margin: 0;
}
.brut a{ color: #00e; text-decoration: underline; }   /* the browser default, on purpose */
.brut button{ font: inherit; }                        /* otherwise: unstyled */
.brut hr{ border: 0; border-top: 3px solid #000; }
.brut .blk{ background: #000; color: #fff; padding: 8px 10px; display: inline-block; }
```

**Measurements**
| Token | Value |
|---|---|
| Palette | `#000` / `#fff` / greys, plus **one** raw flash colour |
| Type | system monospace, or one oversized grotesque; no pairing subtlety |
| Display size | 34–120px, `line-height: .85–.95` |
| Radius | `0` everywhere |
| Borders | `2–4px solid #000`, hard |
| Shadows | none, or hard-offset with `0` blur |
| Links | `#00e` underlined — do not restyle |
| Buttons | native `<button>`, or a 3px black box |
| Grid | none, or a grid you visibly violate |

**The honesty test** — if a rule exists only to make the page more comfortable, delete it. Rounded
corners, easing curves, hover fades, drop shadows with blur, tidy gutters: all out.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #ff0090; outline-offset:0 }
```

**Why this and not something on-style.** the flash colour, hard against the element with zero offset — an offset would be a comfort decision. #ff0090 on white is 4.0:1, above the 3:1 that 2.4.13 requires.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Link.** Keeping #0000ee underlined is not nostalgia — it is the single strongest clickability signifier that exists, and NN/g's flat-design critique is precisely about packs that threw it away.

**Gradient.** Gradients are permitted ONLY as hard-edged texture — repeating stripes and halftone dots, where every stop is an abrupt colour change. A soft fade is still banned, because a fade exists to make an edge comfortable and comfort is the thing this pack refuses. The ban that matters is on BLUR, not on the gradient function.

**Colour.** Raw, saturated, unmixed field colours. The pack bans 'muted or tasteful colour' — which is a requirement to be loud, not a licence to be plain. Every field colour here carries INK text; none of them carries white, and that is not a coincidence: saturated mid-tones almost never do.

## Banned

- `border-radius` above `0`
- Blurred shadows
- Transitions and easing on interaction states
- A tidy, consistent gutter
- Muted or "tasteful" colour
- Stock photography, illustration systems, icon sets
- Centred layouts

## Copy budget

Read by `engine/audit.mjs` via `--pack brutalism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–90ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | display runs 34-120px |
| sub | ≤30 words | |
| button label | ≤3 words | |
| chars per viewport | 520 | engine default is 420 |

measure runs LONG here on purpose — a comfortable measure is a comfort decision. But 80ch is a WCAG ceiling, not a taste, so it holds.

## Gotchas

- **Brutalism is not a UX style, and its own sources say so.** Looka: "not about harmony or ease of
  use." Tilda: designed to "even annoy a little." Do not apply it to checkout, forms, tables, error
  states, or anything with a completion rate attached. The dev.to comment thread has the working
  compromise: "stronger brutalist accents on portfolio or campaign pages, but keep core flows closer
  to minimalist UI so forms, tables, and error states stay clear."
- **Accessibility still applies.** Raw does not mean inaccessible: `#000` on `#fff` is 21:1, native
  buttons are keyboard-reachable, and default focus rings are excellent. Brutalism is the one style
  where doing less usually *helps* a11y — as long as you keep the defaults rather than removing them.
- **Distinguish from neo-brutalism.** Brutalism is monochrome, unstyled, chaotic. Neo-brutalism is
  colourful, systematic, and usable. See `../neo-brutalism/style.md`.
- **It dates fast.** Every source lists it as a reaction, not a baseline.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
