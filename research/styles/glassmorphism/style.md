# Glassmorphism

> Frosted panels floating over a colourful backdrop. The backdrop is not optional — it *is* the style.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Futuristic, premium, weightless. Works when there is a rich backdrop to look
through: a gradient mesh, a photograph, a video. On a flat white page it collapses to a grey box.

## Implementation

The canonical recipe, copied verbatim from the css.glass generator at its default settings:

```css
/* From https://css.glass */
background: rgba(255, 255, 255, 0.2);
border-radius: 16px;
box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(5px);
-webkit-backdrop-filter: blur(5px);
border: 1px solid rgba(255, 255, 255, 0.3);
```

The generator exposes exactly four knobs — **transparency, blur, colour, outline** — which map to
`background` alpha, `backdrop-filter: blur()`, `background` hue, and `border` alpha.

A harder-working variant for busy backdrops (`research/specimens/index.html`, `.glass-card.frost`):

```css
.glass-card.frost{
  background: rgba(255,255,255,.12);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0,0,0,.1);
}
```

`saturate(140%)` is what keeps the panel from going milky-grey over a photograph. Apple's own
material does the same thing.

**Measurements**
| Token | Value |
|---|---|
| Background alpha | `.10–.25` on light glass · `.05–.12` on dark glass |
| Blur | `5px` subtle (Frost UI) · `12–20px` standard · `>24px` only for full-screen overlays |
| Saturate | `120–180%` when the backdrop is photographic |
| Border | `1px solid rgba(255,255,255,.3)` — the specular edge; without it the panel has no shape |
| Radius | `16px` |
| Shadow | `0 4px 30px rgba(0,0,0,.1)` — wide, faint, no spread |
| Backdrop | mandatory: gradient, photo, or mesh. Minimum 3 hues for the effect to read |

**Layer discipline** — one glass layer over the backdrop. Glass on glass compounds the blur and
destroys text contrast.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline: 3px solid #fff; outline-offset: 3px; box-shadow: 0 0 0 6px rgba(0,0,0,.55) }
```

**Why this and not something on-style.** a glass panel's effective backdrop is unknown at author time, so a translucent focus ring has no guaranteed contrast. The ring is SOLID white with a dark outer halo so it survives any backdrop.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**Contrast.** The panel's effective background is whatever pixels sit behind it, so AA cannot be guaranteed at author time. Mitigations in order: raise background alpha, add a linear-gradient scrim under the text, or push blur high enough that the backdrop becomes an even field.

**Apple.** Apple HIG (Materials, 2025): do NOT use Liquid Glass in the content layer. Glass is for the functional layer - controls and navigation floating ABOVE content. Use it sparingly.

**Glass Budget.** at most 3 glass elements per view, and NEVER on a repeating scroll item

## Banned

- Glass over a flat solid background (nothing to refract → just a tinted rectangle)
- Nesting glass inside glass
- Body copy at 14px directly on glass over a photograph
- `backdrop-filter` on a scrolling list — this is the classic FPS killer
- Omitting the `1px` light border
- Glass on a fixed header *and* the cards *and* the modal — pick one surface

## Copy budget

Read by `engine/audit.mjs` via `--pack glassmorphism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–65ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | text on glass is already working hard; long lines over a moving backdrop are unreadable |
| sub | ≤22 words | |
| button label | ≤3 words | |
| chars per viewport | 340 | engine default is 420 |

14px body directly on glass over a photograph is BANNED. 16px minimum, weight 500+.

## Gotchas

- **Contrast is the failure mode.** The panel's effective background is unknown at author time — it
  is whatever pixels are behind it. There is no way to guarantee AA. Mitigations, in order: raise
  background alpha, add a `linear-gradient` scrim under the text, or push blur high enough that the
  backdrop becomes an even field.
- **Performance.** `backdrop-filter` forces a new compositing layer and re-blurs on every scroll
  frame. The dev.to comment thread names this exactly: "if everything has blur and glow, the content
  loses contrast and the interface starts to feel slow." Keep glass on ≤3 elements per view and never
  on a repeating list item.
- **`-webkit-` prefix is still required** for Safari. The generator emits both lines; ship both.
- **No `backdrop-filter` support** → the fallback is a plain `rgba` panel. Test it; if the fallback
  is unreadable your alpha is too low.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
