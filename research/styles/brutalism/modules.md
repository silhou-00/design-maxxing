# Brutalism — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

Unstyled links in a row, separated by whatever the browser does. **The default blue and the default visited purple both stay** — and that is not nostalgia, it is the strongest clickability signifier that exists.

## 2. Hero

Oversized monospace at `.85` leading, flush left, hard against the edge. No centring: a centred layout is a comfort decision, and this pack has no comfort decisions.

## 3. Button — five states

A native `` next to a 3px black box. **No transition on any state** — a transition exists to make a change comfortable, and comfort is the thing being refused.

## 4. Form field + error

A native input with a 3px border. The error is a black block with the flash colour — loud, immediate, and impossible to miss, which is what an error should be anyway.

## 5. Card

There is no card, only boxes. 3px borders, no radius, no shadow, and gutters that deliberately do not match — an even gutter is a tidiness decision.

## 6. List / table

A default HTML table with borders turned on. This is as close as any pack in the catalogue gets to shipping raw markup.

## 7. Overlay / modal

A hard black panel with a 3px border. No scrim blur, no radius, no entrance animation. It appears.

## 8. Empty / loading

A 3px dashed box and a sentence. Brutalism is the one pack where the empty state needs no softening — bluntness is already the register.

---

## Dark mode

Inverts to pure black. **The link blue is the one place this pack's honesty has to bend**: `#0000ee` on black is 2.3:1 and unreadable, so it lightens to `#6f9bff`. The browser default was never designed for a dark ground.

Inverts to pure black paper with white ink. The link blue must lighten to #6f9bff or it is 2.3:1 on black — the ONE place this pack's honesty has to bend, because the browser default was never designed for a dark ground.

## Narrow width

Nothing changes except the display size. There is no grid to collapse, no shadow to clip and no elevation to lose — brutalism is the most robust pack in the catalogue at any width.

## Scroll

Headline technique: **scroll-marquee (●)**

the fun one.  is a 1995 HTML element and a scroll-bound ticker is its honest descendant — motion that admits it is motion.

**Banned for this pack:**
- smooth-scroll — emphatically. The browser's honest defaults ARE the thesis, so lerped scroll is the single most anti-brutalist addition possible
- stacking-cards, parallax, video-scrub, text-reveal — all polish

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
