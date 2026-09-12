# Editorial — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Definition (Tilda, *Editorial Style — think Cosmopolitan, Vogue, and similar high-end
publications*)** — "Inspired by traditional print magazines, this style transforms websites into
immersive editorial experiences."

**Key elements (Tilda)**
- *Contrasting typography* — "Large decorative headlines paired with small, legible sans-serif body
  text. Place headlines directly on images or in separate blocks."
- *Multilayer composition* — "Complex compositions reminiscent of magazine spreads. Take cues from
  top-tier publications like Esquire, GQ, or Harper's Bazaar."
- *Focus is on visual content* — "Images and videos are bold and eye-catching, designed to
  immediately draw the user's attention. Strong visuals are key, so be especially selective with your
  photography."
- *Decorative elements* — "Lines, frames, icons, and other graphics add visual interest and
  personality. Quotes or key phrases are often highlighted with large type or color to stand out. Use
  these accent and decorative elements to break up content and build a clear visual structure."

**Tilda cheat sheet** — Print-inspired design · High contrast in fonts · Large visuals · Plenty of
decorative elements.

**Mood & occasion** — Tilda: "content-heavy platforms like digital magazines, blogs, and news
platforms." Also: brand storytelling pages, annual reports, long-form case studies, fashion and
food.

**Adjacent references in the corpus** — UX Planet §10 *Luxury Typography* is editorial's high-end
cousin: "refined letterforms to exude elegance and class... pairs minimalist layout with expressive
serif fonts or custom logotypes, allowing typography alone to carry the brand identity." Core
elements: "Serif fonts, high letter spacing, gold foil, monochrome palettes, bespoke ligatures."
UX Planet §33 *Mixed Media* covers the collage half: "Cutouts, overlays, analog + digital collage,
hand-drawn + photo elements, paper textures."

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Note | long-form body text at 17px/1.6 on warm paper is the most readable configuration in the catalogue. The risk here is not contrast, it is MEASURE. |
| Target Size Note | Small-caps section labels are this pack's target-size risk: 11px uppercase renders under 24px tall. Nav links carry padding plus min-height:25px. |
| Asset Rule | ROUTER Gate 2.5 — imagery is a RASTER, never CSS. page.html ships a declared placeholder (data-asset='...-pending') with a flat fill, which engine/audit.mjs fails on until the real photograph lands. A gradient stand-in would break the pack's own ban as well. |
| Measure Rule | Editorial's measure is 58-70ch and that is a pack rule, not a per-element choice. It is declared once at main p and elements only tighten it. Widening the page from 1080 to 1320 pushed an uncapped paragraph to 95ch — proof that a measure inherited from the container is not a measure at all. |

**Focus.** the editorial red is already reserved for kickers and pull quotes, so it reads as 'the marked thing' — which is exactly what a focus ring is. 5.9:1 on paper.

## Reference images

- `refs/tilda-editorial-1.png`, `-2.png` — live editorial websites from Tilda's gallery
- `research/specimens/index.html` → tile **08 editorial** (kicker, 46px serif display, pull quote
  with rules, two-column body with drop cap and column rule)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Tilda *Editorial Style* + cheat sheet · UX Planet §10 (Luxury Typography), §33 (Mixed Media).
