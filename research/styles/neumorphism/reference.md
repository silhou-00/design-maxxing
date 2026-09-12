# Neumorphism (Soft UI) — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Research note

Checked against 2026 write-ups before building. Two things changed the design: (1) the style has moved toward a CLAYMORPHIC hybrid - softer, more tactile, less extreme shadow; (2) its real home is the SINGLE-PURPOSE INSTRUMENT - music player, smart-home control, calculator, health tracker - 'where the whole screen is one calm instrument'. It is not a marketing-page style, and building it as one is the commonest way it looks wrong. Modern practice also applies it SELECTIVELY and at higher contrast than the 2020 original, because early neumorphism routinely failed WCAG.

## Definitions, verbatim

**Definition (neumorphism.io)** — "Neumorphism, also known as soft UI, is a visual design trend that
combines elements of skeuomorphism and flat design. It creates a soft, extruded plastic look by using
subtle contrasting shadows to create the illusion of depth. This style mimics physical objects while
maintaining a minimal and modern aesthetic, often featuring monochromatic color schemes with low
contrast shadows and highlights."

**Core elements (dev.to, *Modern Web Design Styles*, §2 "Neumorphism (Soft UI)")** — "A soft,
extruded 3D look created with inner + outer shadows." Key features: subtle depth · rounded shapes ·
minimalistic · feels tactile. Used for "toggles, buttons, cards, minimal dashboards."

**Frost UI / soft-glass note** — the same article lists a sixth style, *Frost UI*, as the "lighter,
subtler version of glassmorphism" (low blur, soft transparency, neutral colors). Worth knowing
because Soft UI and Frost UI are frequently confused; Soft UI is opaque, Frost UI is translucent.

**Mood & occasion** — Calm, tactile, quiet-premium. Best on small surfaces: a toggle, a media
control, a single dashboard card, a calculator. It is not a page style.

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Contrast Problem | This is the pack with the most accessibility debt in the catalogue, and 2026 sources say so directly: early neumorphism routinely failed WCAG. The extrusion is made of two LOW-CONTRAST shadows against their own surface - #c3c7cd on #e4e7ee is 1.35:1, nowhere near the 3:1 that 1.4.11 needs for a control boundary. |
| Resolution | The shadow is decorative, not the affordance of record. Every control must ALSO carry a text label or an icon at 4.5:1, and interactive controls get a 44px target (not 24) because a soft edge is genuinely harder to aim at than a hard one. |
| Selective Rule | 2026 practice applies the extrusion SELECTIVELY - to the few controls that are the instrument, not to every surface. A page where everything is extruded has no hierarchy, because extrusion was the only hierarchy signal available. |
| Radius Note | Raised to 50 because a dial is border-radius:50% — on a 96px dial that resolves to 48px, which is a control geometry, not a soft-UI decision. The 16/32 rule still governs rectangles. |
| Accent Note | The classic neumorphic accent #4a5cf0 is 4.16:1 on a #e4e7ee surface — under 4.5:1. Because this pack forbids colour in the plate, the accent is only ever TEXT, so it must clear the body-text bar rather than the 3:1 non-text one. Darkened to #3d4bd1 (6.4:1). |

**Focus.** the extrusion cannot carry focus - a raised control and a focused raised control look identical. The ring is the accent, offset far enough to clear the light shadow, and it is the ONE place a hard edge is permitted.

## Reference images

- `refs/neumorphism-io-generator.jpg` — the generator at default settings with the CSS visible.
  This is the canonical look, straight from the tool the style is named after.
- `research/specimens/index.html` → tile **02 neumorphism** (raised + pressed side by side)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: neumorphism.io (definition, canonical CSS, shape variants) · dev.to *Modern Web Design
Styles* §2, §6 · own implementation.
