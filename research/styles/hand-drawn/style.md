# Hand-Drawn

> Nothing is quite square. Build it on a grid, then knock everything slightly out of true.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Tilda: "Hand-drawn style gives off creative, friendly vibes — perfect for
illustrator portfolios, family cafés, or kids-focused projects."

## Implementation

The whole style is achievable in CSS with no image assets, using two tricks: **asymmetric
`border-radius` with a slash-separated second value**, and small `rotate()` values.

```css
.hand{
  background: #fffdf6;                    /* paper, warm */
  color: #2b2b2b;
  font-family: "Comic Sans MS", "Segoe Print", cursive;
}
.hand h3{ font-size: 28px; transform: rotate(-1.5deg); }

/* The wobbly-box trick: 8 different radii via the horizontal/vertical slash syntax */
.hand .doodle{
  border: 2.5px solid #2b2b2b;
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  padding: 16px;
  background: #fff;
  transform: rotate(.8deg);
}

/* Hand-circled emphasis — an ellipse, tilted */
.hand .circled{
  border: 2.5px solid #e2231a;
  border-radius: 50% / 22%;
  padding: 2px 10px;
  transform: rotate(-2deg);
  display: inline-block;
}

/* Highlighter underline — a background stripe, not text-decoration */
.hand .under{
  background: linear-gradient(#f5c518, #f5c518) 0 88% / 100% 6px no-repeat;
}
```

**Measurements**
| Token | Value |
|---|---|
| Ground | warm off-white `#fffdf6` |
| Ink | `#2b2b2b`, never `#000` (ink is never pure black) |
| Stroke | `2.5px` — the half-pixel reads as hand-drawn; `2px` and `3px` read as intentional |
| Wobble radius | `255px 15px 225px 15px / 15px 225px 15px 255px` |
| Circle-radius | `50% / 22%` |
| Rotation | `-2deg` to `+2deg`. Never more. Every element a *different* value |
| Highlighter | `linear-gradient` stripe, `6px` tall, at `88%` height |
| Accents | 2–3 marker colours: red `#e2231a`, yellow `#f5c518`, one more |
| Display type | script / handwriting, headings only |
| Body type | a clean sans — see gotchas |

**The Tilda method, restated as a procedure:**
1. Lay out on a real grid with real alignment.
2. Apply `rotate()` between −2° and +2°, a different value per element.
3. Replace box radii with the wobble syntax.
4. Add 2–3 hand marks (circle, arrow, underline, scribble).
5. Stop. The restraint is what keeps it charming rather than broken.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #1f5fd9; outline-offset:4px }
```

**Why this and not something on-style.** a wobbled outline would read as decoration rather than state. The focus ring is the one straight, machine-drawn line on the page — which is exactly why it reads as a system affordance.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Radius.** The wobble syntax uses radii up to 255px by design, so a px ceiling cannot express this pack's rule. What is banned is a UNIFORM radius, which no automated check can see.

**Gradient.** Gradients are permitted for ONE thing: the highlighter stripe, which is a hard-stopped linear-gradient standing in for a marker pass. Soft fades are still wrong here.

**Script Font.** Script and handwriting faces are BANNED in body copy — Tilda says so outright, and the reference galleries confirm the working pattern is clean bold headings with handwriting reserved for annotation.

## Banned

- Script or handwriting fonts in body copy (Tilda says this outright)
- Rotations above ±3° — reads as broken layout, not hand-made
- The *same* rotation on every element (reveals the trick instantly)
- Uniform `border-radius`
- Drop shadows and gradients
- Fully random placement with no underlying grid — "order first, chaos later"
- Comic Sans in production (it is in the specimen as a universally available stand-in only)

## Copy budget

Read by `engine/audit.mjs` via `--pack hand-drawn`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–66ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤7 words** | engine §5 default is 8 |
| sub | ≤24 words | |
| button label | ≤3 words | |
| chars per viewport | 320 | engine default is 420 |

low, because white space is doing half the work. A dense hand-drawn page reads as a cluttered notebook.

## Gotchas

- **Handwriting fonts are an accessibility problem.** Low x-height, connected letterforms and
  irregular stroke weight hurt dyslexic and low-vision readers. Keep them to display sizes and pair
  with a genuinely legible sans for everything else. Real options: Caveat, Patrick Hand, Kalam,
  Gloria Hallelujah, Architects Daughter.
- **Rotated text triggers subpixel-antialiasing loss** in some browsers, making small rotated copy
  look fuzzy. Rotate containers, not paragraphs.
- **`transform: rotate()` breaks `overflow: hidden` clipping and sticky positioning.** Keep rotated
  elements out of scroll containers and away from sticky headers.
- **Hit targets shift.** A rotated button's clickable box is the rotated box — fine — but a rotated
  parent moves children's coordinates. Test taps on mobile.
- **Reduced motion.** If you animate the wobble, gate it behind
  `@media (prefers-reduced-motion: reduce)`.
- **This style needs a real illustrator to go beyond charming.** CSS tricks get you a friendly page;
  they do not get you a distinctive one. Budget for actual drawings.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
