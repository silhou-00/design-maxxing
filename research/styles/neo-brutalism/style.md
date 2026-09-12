# Neo-Brutalism

> Brutalism's attitude, run through a design system. Loud, flat, hard-edged — and actually usable.

**Hot file.** Build rules only. Provenance, quotes and sources are in `reference.md`; the eight
module specs are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when
the job needs them.

**Mood & occasion** — Confident and playful. The style of choice when a product wants personality
without giving up conversion: marketing sites, dashboards for creative tools, indie SaaS.

## Implementation

**Measured values**, read out of the live theme on `neobrutalism.dev/styling` via `getComputedStyle`
— not reconstructed by eye.

```css
:root{
  --main:    oklch(67.47% .1725 259.61);  /* the accent — a strong periwinkle blue (~#5b8def) */
  --overlay: oklch(0% 0 0 / .8);          /* modal scrim */
  --border:  oklch(0% 0 0);               /* pure black */
  --ring:    oklch(0% 0 0);

  --shadow: 4px 4px 0px 0px oklch(0% 0 0);
  --box-shadow-x: 4px;  --box-shadow-y: 4px;
  --reverse-box-shadow-x: -4px;  --reverse-box-shadow-y: -4px;

  --radius-base: 5px;
  --base-font-weight: 500;
  --heading-font-weight: 700;
}

.nb-card{
  background:#fff; border:2px solid var(--border);
  border-radius:var(--radius-base); box-shadow:var(--shadow); padding:18px;
}
.nb-btn{
  background:var(--main); border:2px solid var(--border);
  border-radius:var(--radius-base); box-shadow:var(--shadow);
  font-weight:500; padding:8px 16px;
  transition:transform .1s, box-shadow .1s;
}
/* The signature interaction: the element slides INTO its own shadow */
.nb-btn:hover{ transform:translate(4px,4px); box-shadow:0 0 0 0 #000; }
```

**Measurements**

| Token | Value |
|---|---|
| Border | `2px solid #000` — every element, no exceptions |
| Shadow | `4px 4px 0 0 #000` — **zero blur, zero spread** |
| Radius | `5px` (small, not sharp — the tell vs. brutalism) |
| Body weight | `500` · Heading weight `700` |
| Accent | one saturated hue, used as a large flat fill |
| Background | a light tint of the accent, not white |
| Hover | `translate(4px,4px)` + shadow to `0` |
| Gradients | none |

**One-line summary:** 2px black border, 4/4 hard shadow, 5px radius, flat saturated fill.
Everything else follows.

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

**Focus is the one this pack nearly fails.** Resting state is already a 2px black border, so a black
focus ring produces *zero* pixel change and fails WCAG 2.4.13's 3:1 focused-vs-unfocused test. The
accent is not the answer either — it clears 3:1 on white but reaches only **2.37:1 over the page
tint**, and 2.4.13 measures the change in the pixels the ring actually occupies.
**Focus is a second hard ring, offset in white:**

```css
.nb-btn:focus-visible{
  outline:none;
  box-shadow: var(--shadow), 0 0 0 3px #fff, 0 0 0 6px #000;
}
```

Black-on-white is 21:1, and the 3px ring clears the 2.4.13 area floor (`4h+4w`; a 90×30 control
needs 480.69px²; the rendered ring measures 829.04px² — see modules.html → Self-audit). On-style: hard, unblurred, black.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | satisfied by construction — 2px black on every control |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the white/black double ring above |
| Target size (2.5.8) | 24×24 min | `padding:8px 16px` on 16px text ≈ 38px tall. Icon-only controls need explicit sizing |
| Disabled | exempt from contrast | shadow removed — see `modules.md` |

## Banned

- Blur on any shadow (`4px 4px 0` — the `0` is the style)
- Gradients, glass, glow
- Grey borders — black or nothing
- More than two accent hues per view (an error red counts as the second)
- Subtle hover (opacity fades, colour shifts) — the shadow-collapse is the interaction
- Large border radii; above ~8px it reads as friendly-app, not neo-brutalist

## Copy budget

Read by `engine/audit.mjs` via `--pack neo-brutalism`; the numbers live in `tokens.json`.
Tighter than the engine default because the type is large — the same word count occupies far more
space here than in `minimalism`.

| | value | note |
|---|---|---|
| measure | `50–75ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | engine default is 8; large display type overflows first |
| sub | ≤25 words | |
| button label | ≤3 words, ideally 1–2 | |
| chars per viewport | 380 | below the engine's 420 — the type is bigger |

## Gotchas

- **Contrast is free here, and there is no excuse for failing it.** Black on saturated fills, 2px
  black borders on every control. Do not undo that with a low-contrast accent.
- **The hover moves layout-adjacent pixels.** `transform` is compositor-only so it is cheap, but a
  4px shift inside a tight grid looks like a jump. Give elements 8px+ of breathing room, and never
  less than **16px page padding** — the shadow extends 4px right and down and will clip at the
  viewport edge.
- **The hover translate must be derived from the shadow offsets, not typed twice.** A variant that
  re-declares `box-shadow` after `:hover` zeroed it wins on source order, and the element slides out
  leaving its shadow behind — the opposite of the signature interaction. Use `--sx`/`--sy` tokens;
  see `modules.md` → Button.
- **Shadow direction must be globally consistent** — all 4/4, or all -4/-4 for a "reverse" variant.
  Mixing directions on one screen reads as a bug. The theme ships both as separate tokens for
  exactly this reason.
- **It is a system, not chaos.** The difference from brutalism is that every element obeys the same
  four numbers. Break them and you have neither style.
- **Dark mode inverts the border, not just the background.** A black border on a dark ground
  disappears, which removes every affordance at once. See `modules.md` → Dark mode.
- **The accent does not invert — so text on the accent must not either.** Hard-code `color:#000` on
  every accent-filled surface. Inheriting `var(--border)` gives white-on-blue in dark mode at
  **3.23:1**, under the 4.5 floor.
- **`oklch()`** needs a fallback for older browsers; hex equivalents ≈ `--main:#5b8def`,
  `--border:#000`.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — open in a browser. Components in isolation, all states |
| `page.html` | **never read into context** — one composition at page scale, carrying the pack's ● scroll technique. Reference, not structure |
| `refs/` | images; never read |
