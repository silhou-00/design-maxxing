# Neumorphism (Soft UI)

> One background colour for everything. Depth comes only from a light shadow and a dark shadow.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Calm, tactile, quiet-premium. Best on small surfaces: a toggle, a media
control, a single dashboard card, a calculator. It is not a page style.

## Implementation

The canonical recipe, copied from the neumorphism.io generator at its default settings
(`#e0e0e0`, distance 20, blur 60):

```css
border-radius: 50px;
background: #e0e0e0;
box-shadow: 20px 20px 60px #bebebe,
           -20px -20px 60px #ffffff;
```

**The rule that generates it.** Pick one surface colour. The dark shadow is that colour darkened
~13%, the light shadow is that colour lightened to near-white. Offsets are equal and opposite.

```
surface:  #e0e0e0
dark:     #bebebe   (surface × ~0.87)
light:    #ffffff   (surface lightened ~13%)
offset:   +d +d  and  -d -d
blur:     ~3 × d
```

Practical component scale (from `research/specimens/index.html`, `.neu*`):

```css
.neu-card{                       /* large surface */
  background: #e0e0e0;
  border-radius: 50px;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
.neu-btn{                        /* control — scale d down to 6px */
  background: #e0e0e0;
  border: none;
  border-radius: 16px;
  color: #4b5162;
  font-weight: 600;
  box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
}
.neu-btn.pressed{                /* the ONLY state change: same shadows, inset */
  box-shadow: inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff;
}
```

**Measurements**
| Token | Value |
|---|---|
| Surface | one colour, mid-light (`#e0e0e0` canonical); never white, never black |
| Distance `d` | 6px controls · 10–14px cards · 20px hero surfaces |
| Blur | `3 × d` |
| Dark shadow | surface × 0.87 |
| Light shadow | surface lightened ~13%, clamp at `#fff` |
| Radius | 16px controls · 50px large surfaces |
| Text colour | desaturated slate (`#4b5162`), not black |
| Border | none — a border kills the extrusion |

**Shape variants** the generator exposes, all reachable from the same four numbers: *flat* (outer
shadows), *concave* / *convex* (add a subtle gradient of the same hue to the background), *pressed*
(both shadows `inset`).

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #4a5cf0; outline-offset:4px }
```

**Why this and not something on-style.** the extrusion cannot carry focus - a raised control and a focused raised control look identical. The ring is the accent, offset far enough to clear the light shadow, and it is the ONE place a hard edge is permitted.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 44×44 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Contrast.** This is the pack with the most accessibility debt in the catalogue, and 2026 sources say so directly: early neumorphism routinely failed WCAG. The extrusion is made of two LOW-CONTRAST shadows against their own surface - #c3c7cd on #e4e7ee is 1.35:1, nowhere near the 3:1 that 1.4.11 needs for a control boundary.

**Selective.** 2026 practice applies the extrusion SELECTIVELY - to the few controls that are the instrument, not to every surface. A page where everything is extruded has no hierarchy, because extrusion was the only hierarchy signal available.

**Radius.** Raised to 50 because a dial is border-radius:50% — on a 96px dial that resolves to 48px, which is a control geometry, not a soft-UI decision. The 16/32 rule still governs rectangles.

**Accent.** The classic neumorphic accent #4a5cf0 is 4.16:1 on a #e4e7ee surface — under 4.5:1. Because this pack forbids colour in the plate, the accent is only ever TEXT, so it must clear the body-text bar rather than the 3:1 non-text one. Darkened to #3d4bd1 (6.4:1).

## Banned

- More than one surface colour — the whole illusion depends on figure and ground being identical
- Borders, outlines, dividers
- Any accent fill on the raised element itself (put colour in an icon or in text, never in the plate)
- Pure white or pure black surfaces: you lose one of the two shadows
- Dark neumorphism at low contrast — the light shadow has nowhere to go
- Text or icons inside a *pressed* well at body size

## Copy budget

Read by `engine/audit.mjs` via `--pack neumorphism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `40–60ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤5 words** | an instrument has a label, not a headline |
| sub | ≤16 words | |
| button label | ≤2 words | |
| chars per viewport | 220 | engine default is 420 |

the second-lowest budget in the catalogue. This is a COMPONENT style: if you are writing paragraphs, the page has stopped being an instrument.

## Gotchas

- **Accessibility is the known, unfixed problem.** A neumorphic button has no border and no fill
  contrast against its background; its only boundary is a soft shadow, which contributes nothing to
  WCAG 1.4.11 (Non-text Contrast, 3:1 for UI component boundaries). A pure-Soft-UI form is not
  accessible. Mitigation: keep neumorphism decorative and give every real control an additional
  non-shadow affordance — a label, an icon, a focus ring with actual contrast.
- **State is nearly invisible.** Raised → pressed is the only clear transition available. Hover,
  focus, disabled, selected, error all look the same. Budget a second signal per state.
- **Two shadows per element × a list of 40 rows** is a paint cost. Keep it off scrolling content.
- **It does not scale to a page.** Every source that recommends it names small surfaces: "toggles,
  buttons, cards, minimal dashboards."

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
