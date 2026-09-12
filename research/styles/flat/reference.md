# Flat — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Definition (Tilda, *Flat — everything is flat. Super flat*)** — "Flat design is all about simplicity
and clarity. It removes unnecessary effects and focuses on clean, functional visuals."

**Key elements (Tilda)**
- *No depth effects and minimal animation* — "Stick to basic geometric shapes — rectangles, circles,
  triangles. **Skip 3D, shadows, gloss, and bevels.**"
- *Solid colors, no gradients* — "Flat style favors clean color schemes, especially soft pastels and
  bold contrasts. Use accent colors sparingly to highlight key elements."
- *Bold headlines & clear hierarchy* — "**Use clean, sans-serif fonts like Roboto or Open Sans.**
  Break up content into digestible blocks with clear headings and subheadings."

**Tilda cheat sheet** — Total flatness — no shadows or 3D effects · Pastel tones · Clean, readable
fonts.

**Origin (Looka, §10 Flat Design)** — "Flat design emerged with the rise of smartphones and
high-resolution screens. Designers shifted towards a simpler, more universally accessible aesthetic.
It made sites faster, and easier to load, and use. The style emphasizes usability, minimalism, and
clarity, stripping away unnecessary details to focus on functionality. This movement gained momentum
in the early 2010s, with major companies like Microsoft and Apple adopting flat design in their
operating systems."

**Characteristics (Looka)** — Simplicity ("simple elements, typography, and flat colors") ·
Functionality ("design elements serve a clear purpose, improving usability") · Vivid colors
("contrasting colors to create visually engaging experiences") · Typography ("bold and easy-to-read
typefaces") · Grids and space ("extensive use of grids and open space for a balanced, cohesive
layout").

**Named examples (Looka)** — Windows 8 ("Marked a significant shift from skeuomorphic to flat design
in software, using simple, colorful tiles"), iOS 7 ("moving away from the realistic icons of previous
versions"), Google Material Design ("While incorporating some shadow and depth, Google's design
language is heavily influenced by flat design principles").

Looka's closing framing is the useful bit: "Flat design's popularity marked a turning point in
digital design philosophy. Online platforms began focusing on the digital space's unique look rather
than emulating the physical world." Flat is the direct negation of `../skeuomorphism/style.md`.

**Mood & occasion** — Tilda: "a solid choice for projects that value simplicity and speed. It works
great for corporate websites, SaaS platforms, and news portals where usability comes first."

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Signifier Warning | NN/g: flat design's missing depth cues have been 'reducing user efficiency by complicating users' understanding of what's clickable'. This pack gave up two of the three clickability channels, so the resting state MUST identify controls through type, colour, contrast and wording. Hover may stay supplemental (WCAG 1.4.11 exempts it) but rest may not. |
| Contrast Note | The canonical flat palette fails AA on white. #3498db is 2.9:1 and #2ecc71 is 1.9:1. This pack darkens every hue until it clears 4.5:1 — that is not a deviation from flat, it is flat done correctly. |
| Secondary Note | Outline buttons must use the PRESSED step for their text and border, not the base. The base primary is tuned for white-on-fill; as ink-on-ground it is 3.77:1 and fails. |
| Flat Blue Note | The canonical flat blue #3498db is 2.9:1 on white and unusable for text. Darkening to #2f7fb8 gives 4.33:1 with white — which clears LARGE text (3:1) but still fails 14px body (4.5:1). Every fill that sits under white body text therefore uses #20628f (6.3:1), and #2f7fb8 is demoted to a non-text tint. THIS IS THE FINDING: a flat palette has to be re-derived against the text sizes it will carry, not darkened until one sample passes. The self-audit surfaced it four separate times — nav pill, hero band, secondary button, primary button — before the ramp itself was corrected. |
| Palette Note | Flat is the one pack in the catalogue with a deliberately WIDE palette. Tilda and the reference galleries show 5-8 hue compositions as the norm, not the exception. The constraint is not hue COUNT, it is that every hue is a flat fill with no gradient and no depth, and that any hue carrying text is derived against that text size. |
| On Color Note | Outline/ghost controls inherit a colour derived against the page ground. On a coloured band that derivation is invalid — the flat secondary is 2.59:1 on the amber hero. Controls on a coloured band must take the same ink-or-white the band's own text uses. |
| Amber Note | #b9770e was chosen to carry WHITE text (4.6:1) but the hero band carries INK, where it is only 2.99:1 — under even the 3:1 large-text floor. A hue tuned for one text colour is not tuned for the other; the band uses #e8a33d (5.6:1 with ink) instead. Same lesson as the blue ramp, from the opposite direction. |

**Focus.** flat gave up depth, so it cannot use a shadow ring. Ink on any pack fill clears 3:1, and a 3px ring is thick enough to read without elevation.

## Reference images

- `refs/tilda-flat-1.png`, `-2.png` — live flat-design websites from Tilda's gallery
- `refs/looka-flat.jpg`, `-2.jpg` — flat branding examples
- `refs/looka-flat-collage.jpg` — Windows 8 / iOS 7 / Material Design collage
- `research/specimens/index.html` → tile **11 flat** (six-tile Metro grid, flat button, no depth
  anywhere)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Tilda *Flat* + cheat sheet · Looka §10 · dev.to (flat as the base that glass/neumorphism
depart from).
