# Swiss Style (International Typographic Style) — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Definition (Looka, §6)** — "The Swiss Style, also known as the International Typographic Style,
emerged in the 1950s in Switzerland. It focused on typography, grids, and the aesthetic of
cleanliness, readability, and objectivity." Designers "Josef Müller-Brockmann and Armin Hofmann,
aimed to break away from the ornate (art deco and art nouveau) designs of the early 20th century.
The goal was to promote a universal graphic expression through structured layouts and sans-serif
typography."

**Characteristics (Looka)**
- *Grid Systems* — "Uses strict grid systems for orderly arrangements of text and images."
- *Sans-Serif Typography* — "Prefers clean, readable sans-serif typefaces, like Helvetica, which was
  developed by Swiss designers."
- *Objective Photography* — "Incorporates straightforward, unembellished photography to support clear
  communication."
- *Asymmetrical Layouts* — "Employs asymmetrical layouts for dynamic visual interest while
  maintaining balance."

Named examples: Helvetica (Max Miedinger and Eduard Hoffmann, 1957 — "still used today for its
clarity and neutrality"), Josef Müller-Brockmann's Beethoven poster, Swiss National Tourist Office
posters.

**Web-specific (Tilda, *Swiss Style — reliable as Swiss watchmaking*)** — "This design style
champions clarity, functionality, and understated elegance — and its roots lie in Swiss print design
before migrating to the web."

**Key elements (Tilda)**
- *Modular grid layouts* — "Elements align neatly within a grid, ensuring balance and harmony. The
  design is driven by function — every element has a purpose."
- *Typography is king* — "**Sans-serif fonts like Helvetica, Univers, or Akzidenz-Grotesk dominate.**
  Emphasize contrast by using large headings and smaller body text."
- *Minimalism and realism in visuals* — "In Swiss design, images are aligned with the text to create
  visual order. Most other elements are kept monochrome, while the main visual emphasis is placed on
  color photography. If you're building a Swiss-style website, start with text on a solid background —
  then add color images only where they truly enhance the layout."

**Tilda cheat sheet** — Strong modular grid · Clean sans-serif fonts · Minimal, realistic photos and
illustrations · Poster-inspired composition.

**Mood & occasion** — Tilda: "Swiss design communicates order, sophistication, and professionalism —
ideal for IT companies and premium product brands." Tilda also names it, with minimalism, as the
dominant 2025 direction.

**Adjacent** — UX Planet §49 *Modular Typography*: "breaks type into grids or building blocks. It
allows flexible systems and unique visual rhythm." Core elements: "Geometric letterforms,
typographic grids, uniform spacing, variable layouts."

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Note | the easiest pack in the catalogue to make accessible: pure black on pure white is 21:1, and there is no depth system to get wrong. |
| Target Size Note | Small uppercase meta links are the pack's target-size risk: 12px with no padding is 13.33px tall, well under 24x24. Nav links carry min-height:24px. Caught by the self-audit. |

**Focus.** the one place the flag red does double duty. Red on white is 4.3:1 — above the 3:1 that 2.4.13 requires for a state change, and unmistakable against a black-and-white page.

## Reference images

- `refs/looka-swiss.jpg`, `-2.jpg` — Swiss typographic examples
- `refs/looka-swiss-collage.jpg` — Helvetica, the Beethoven poster, Swiss Tourist Office posters
- `refs/tilda-constructivism-1.png`, `-2.png` — Tilda's constructivist gallery (the geometric,
  asymmetric web cousin of Swiss)
- `refs/uxplanet-modular-typography.png` — UX Planet §49 plate
- `research/specimens/index.html` → tile **09 swiss** (visible column grid, 44px Helvetica display,
  red bar, 4-column meta row)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Looka §6 · Tilda *Swiss Style* + cheat sheet + 2025 trends · UX Planet §49.
