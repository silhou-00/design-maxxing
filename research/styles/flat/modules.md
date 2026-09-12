# Flat — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A solid bar in the ink colour. No shadow under it, no border — the colour change alone separates it from the ground. This is flat's honest version of elevation.

## 2. Hero

Large bold type on a flat fill. **The whole hero is one rectangle of colour**; there is no card, no shadow and no layering, so hierarchy comes entirely from size and fill.

## 3. Button — five states

**NN/g's finding lands right here.** Flat gave up two of the three clickability channels, so the resting state has to identify the control through fill and weight. Hover darkens one step; there is nothing else available.

## 4. Form field + error

A field is a white box with a 2px border — the border IS the affordance, since there is no inset shadow to sink it. Error swaps the border to red AND adds text, because colour alone fails 1.4.1.

## 5. Card

A white rectangle on the grey ground. **No shadow, no border needed** — the surface/ground contrast does the separating. This is the one thing flat does more cleanly than any other pack.

## 6. List / table

Zebra striping is legitimate here and nowhere else in the catalogue: with no rules and no shadows, an alternating fill is the only separation available that is not a border.

## 7. Overlay / modal

A flat scrim and a flat panel. The dialog is distinguished by fill alone — which is exactly the limitation NN/g describes, and why the primary action carries the strongest colour on the page.

## 8. Empty / loading

A 2px dashed border in the muted ink. Flat has no shadow to remove and no material to omit, so absence has to be drawn.

---

## Dark mode

**A flat palette must be re-derived per theme, not inverted.** `#2f7fb8` is 3.4:1 on a dark ground and fails body text; it moves to `#5dade2` at 6.1:1. Inverting a flat palette is the commonest way this style ships broken in dark mode.

Ground goes #1b2631, surface #22303c. The hues LIGHTEN rather than darken — #2f7fb8 on a dark ground is 3.4:1 and fails body text, so it moves to #5dade2 (6.1:1). A flat palette must be re-derived per theme, not inverted.

## Narrow width

Flat is the most robust pack at narrow width — no shadows to clip, no grid to collapse, no depth to lose. Only the gap and the type scale change.

## Scroll

Headline technique: **scroll-theme-shift (●)**

the standout for this pack: solid colour swaps with no gradients are exactly what flat is made of, and a theme shift costs nothing to composite.

Also core: `scroll-reveal` · `scroll-progress` · `scroll-snap` · `horizontal-scroll`

**Banned for this pack:**
- parallax — the style bans depth, and parallax IS depth. There is no conditional form
- video-scrub — the heaviest possible payload, in the style whose pitch is lightness

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
