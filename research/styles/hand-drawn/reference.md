# Hand-Drawn — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Research note

Checked against reference galleries before building, and two findings corrected my assumptions. (1) The typography is CLEAN AND BOLD - handwriting is an accent for annotations and marks, not the heading face. A page set entirely in a script font reads as a greetings card, not as design. (2) The defining pairing is hand-drawn marks WITH A GREAT DEAL OF WHITE SPACE, plus 'small bursts of vibrant colour' as accent. Density is the failure mode. Custom illustration is the whole differentiator - stock doodles defeat the purpose, because the point is that these marks are yours.

## Definitions, verbatim

**Definition (Tilda, *Hand-Drawn Style — decor, decor, and more decor*)** — "Hand-drawn style mimics
hand-lettering and sketchy graphics — an easy way to stand out among minimal, grid-based websites."

**Key elements (Tilda)**
- *Handwritten fonts are a must* — "Hand-drawn style websites often use fonts that mimic handwriting
  or calligraphy. **Decorative fonts can be hard to read. Use them sparingly for charm — not in body
  copy.**"
- *Deliberately messy accents* — "Designers use rough-cut photos, bright outlines, and sketchy shapes
  to create a casual, handmade website image. Scribbles and hand-drawn doodles are common, too.
  Can't draw? Doesn't matter. Just scribble away — imperfection is part of the hand-drawn style."
- *Forget strict grids and precise alignment* — "Illustrated websites are all about freedom. Layouts
  are loose, often intentionally 'off' to emphasize the hand-drawn aesthetic. **A good trick: Start by
  laying out your content with a proper grid, then shift things around to create that perfectly
  imperfect look — order first, chaos later.**"

**Tilda cheat sheet** — Handwritten or script fonts · Sketches and brush strokes · Misaligned or
free-form layout · Intentional visual chaos.

**Mood & occasion** — Tilda: "Hand-drawn style gives off creative, friendly vibes — perfect for
illustrator portfolios, family cafés, or kids-focused projects."

**Adjacent references in the corpus**
- UX Planet §9 *Conceptual Sketch* — "mimics rough hand-drawn sketches, often used in ideation or
  artistic branding. It emphasizes spontaneity and imagination over polish." Core elements:
  "Pencil/ink lines, crosshatching, greyscale tones, annotations, sketch paper texture." Mood:
  "Experimental, informal, idea-driven."
- UX Planet §40 *Scrapbook* — "Paper textures, washi tape, Polaroid frames, hand lettering, stickers."
- UX Planet §35 *Kawaii* — the cute variant: "Pastel colors, rounded icons, baby faces, blushing
  cheeks, handwritten type."

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Radius Note | The wobble syntax uses radii up to 255px by design, so a px ceiling cannot express this pack's rule. What is banned is a UNIFORM radius, which no automated check can see. |
| Gradient Note | Gradients are permitted for ONE thing: the highlighter stripe, which is a hard-stopped linear-gradient standing in for a marker pass. Soft fades are still wrong here. |
| Script Font Rule | Script and handwriting faces are BANNED in body copy — Tilda says so outright, and the reference galleries confirm the working pattern is clean bold headings with handwriting reserved for annotation. |

**Focus.** a wobbled outline would read as decoration rather than state. The focus ring is the one straight, machine-drawn line on the page — which is exactly why it reads as a system affordance.

## Reference images

- `refs/tilda-hand-drawn-1.png`, `-2.png` — live hand-drawn websites from Tilda's gallery
- `refs/uxplanet-conceptual-sketch.png` — UX Planet §9 plate (pencil, crosshatch, annotation)
- `research/specimens/index.html` → tile **10 hand-drawn** (wobble box, circled word,
  highlighter underline, per-element rotation)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Tilda *Hand-Drawn Style* + cheat sheet · UX Planet §9, §35, §40.
