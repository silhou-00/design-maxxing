# Editorial

> A magazine spread that happens to be a web page. Type carries the voice; the image sets the room.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Tilda: "content-heavy platforms like digital magazines, blogs, and news
platforms." Also: brand storytelling pages, annual reports, long-form case studies, fashion and
food.

## Implementation

Editorial is the one style where CSS typography features earn their keep: `columns`, `::first-letter`,
`column-rule`.

```css
.ed{ background: #faf7f2; color: #141414; }        /* paper, not white */

/* The kicker — tiny, tracked out, coloured. Sets the section. */
.ed .kicker{
  font: 600 10px/1 ui-sans-serif;
  letter-spacing: .28em;
  text-transform: uppercase;
  color: #a33;
}

/* Display: large serif, tight leading, negative tracking */
.ed h3{
  font: 400 46px/.94 Georgia, "Times New Roman", serif;
  letter-spacing: -.02em;
}

/* Drop cap */
.ed .drop::first-letter{
  float: left;
  font: 400 62px/.72 Georgia, serif;
  padding: 6px 8px 0 0;
}

/* Multi-column body with a hairline rule between */
.ed .cols{
  columns: 2;
  column-gap: 22px;
  column-rule: 1px solid #ddd;
  font: 14px/1.6 Georgia, serif;
}

/* Pull quote — rules top and bottom, italic, larger */
.ed .pull{
  border-top: 2px solid #141414;
  border-bottom: 2px solid #141414;
  padding: 10px 0;
  font: italic 400 19px/1.25 Georgia, serif;
}
```

**Measurements**
| Token | Value |
|---|---|
| Ground | warm paper `#faf7f2` |
| Ink | `#141414`, never `#000` |
| Display / body ratio | **≥3:1** (46px display vs 14px body). This is the style's core move |
| Display leading | `.92–.98` |
| Display tracking | `-.02em` |
| Body | serif, `14–17px`, `line-height 1.6` |
| Measure | `58–70ch` single column · `34–44ch` per column when using `columns` |
| Kicker | `10–11px`, `letter-spacing .24–.3em`, uppercase |
| Column rule | `1px solid #ddd` |
| Pull-quote rules | `2px solid` ink, top and bottom |
| Accent | one editorial red/ink colour, used on kickers and pull quotes only |
| Image treatment | full-bleed or hard-cropped; never rounded, never shadowed |

**Layout rhythm** — alternate: full-bleed image → two-column text → pull quote → single wide column.
The variation *is* the design. A uniform stack of cards is the opposite of editorial.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:2px solid #9b2226; outline-offset:3px }
```

**Why this and not something on-style.** the editorial red is already reserved for kickers and pull quotes, so it reads as 'the marked thing' — which is exactly what a focus ring is. 5.9:1 on paper.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | Small-caps section labels are this pack's target-size risk: 11px uppercase renders under 24px tall. Nav links carry padding plus min-height:25px. |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Target Size.** Small-caps section labels are this pack's target-size risk: 11px uppercase renders under 24px tall. Nav links carry padding plus min-height:25px.

**Asset.** ROUTER Gate 2.5 — imagery is a RASTER, never CSS. page.html ships a declared placeholder (data-asset='...-pending') with a flat fill, which engine/audit.mjs fails on until the real photograph lands. A gradient stand-in would break the pack's own ban as well.

**Measure.** Editorial's measure is 58-70ch and that is a pack rule, not a per-element choice. It is declared once at main p and elements only tighten it. Widening the page from 1080 to 1320 pushed an uncapped paragraph to 95ch — proof that a measure inherited from the container is not a measure at all.

## Banned

- Cards. Editorial content sits on the page, not in containers
- Rounded corners and shadows on imagery
- A single type size for headings and body (kills the contrast that defines the style)
- Sans-serif body text at long measure
- Centred body copy
- Stock photography — Tilda: "be especially selective with your photography"
- Uniform, repeating section rhythm

## Copy budget

Read by `engine/audit.mjs` via `--pack editorial`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `58–70ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤9 words** | the ONLY pack that raises the engine's limit — a magazine deck is a sentence, not a label |
| sub | ≤40 words | |
| button label | ≤3 words | |
| chars per viewport | 900 | engine default is 420 |

the HIGHEST budget in the catalogue. This style exists to be READ; the engine's 420 would gut it.

## Gotchas

- **`columns` and screen reading fight each other.** Multi-column body text forces vertical scrolling
  *and* horizontal eye return. Only use `columns: 2` in short, boxed passages (a sidebar, a pull
  section) — never for the main article flow on a scrolling page.
- **`::first-letter` is fragile.** It ignores most box properties; `float` + `line-height` is the only
  reliable combination, and it breaks if the paragraph starts with a quotation mark or a link.
- **Editorial needs real content.** It is the style most likely to collapse under lorem ipsum: the
  hierarchy is built from actual headlines, decks, kickers, captions and quotes. If the content model
  has only `title` and `body`, pick a different style.
- **Display type at 46px+ needs optical sizing.** Set `letter-spacing` negative and check the largest
  breakpoint; defaults look loose and amateurish at size.
- **Web fonts are the performance cost here**, not effects. Two serif weights plus a sans is 4+ files.
  Subset them and `font-display: swap`.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
