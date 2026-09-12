# Stacking Cards

> Cards pile up at the same sticky offset; the ones underneath scale back so the pile reads as depth.

**Binding:** scrubbed · **Mechanism:** `position: sticky` + `view()` timeline on the `exit-crossing` range
**Cost:** low · **Risk:** low

## What it is

A vertical list where every item sticks at the same offset. As each new card arrives it covers the
previous one, and the covered cards shrink and darken so the result reads as a deck rather than as
overlapping rectangles.

It is on the spec authors' own demo list (`Stacking Cards`, scroll-driven-animations.style) and has
become the default way to present 3–6 peer items — pricing tiers, feature blocks, case studies.

## Implementation — CSS native

```css
.stack li{
  position: sticky;
  top: 14vh;                                  /* every card, the same offset */
  animation: card-shrink auto linear both;
  animation-timeline: view();
  animation-range: exit-crossing 0% exit-crossing 100%;
}
@keyframes card-shrink{
  to{ transform: scale(.86); filter: brightness(.55) }
}
```

Three things carry this:

1. **Identical `top` on every card.** Different offsets give a fanned stack, which is a different
   (and much harder) effect.
2. **`exit-crossing` is the correct range.** It covers exactly the period during which the card
   crosses the *start* border edge of the scrollport — i.e. while it is being covered. `exit` would
   also fire for cards leaving the bottom.
3. **Scale + brightness together.** Scale alone reads as a rendering glitch; darkening supplies the
   "further away" cue that makes it depth.

## Variants

- **No shrink, hard edges.** Cards stack with a visible border and no scale change. This is the
  version that suits hard-edged styles — see neo-brutalism in `../compatibility.md`.
- **Rotate slightly.** `transform: scale(.86) rotate(-1deg)` gives a hand-stacked look.
- **Slide out as a group.** Add a wrapper with its own timeline that translates the whole stack away
  at the end.

## Cost

Low. `position: sticky` is native, and `transform` composites. **`filter: brightness()` does not** —
it is a paint-level operation. With four cards that is fine; if you are stacking a dozen, swap the
filter for an overlay pseudo-element whose `opacity` you animate instead.

## Accessibility

Better behaved than most scroll effects, because the content is never hidden — a covered card is
covered by a real element, not by `opacity: 0`.

Two things to get right:

```css
@media (prefers-reduced-motion: reduce){
  .stack li{ position: static; animation: none }
}
```

Falling back to `position: static` turns the deck into a plain vertical list, which is exactly what
it should degrade to.

Watch **focus order**: a link inside card 1 is still focusable while card 3 covers it. If the cards
contain interactive content, either accept that (the browser will scroll it back into view on focus)
or use `inert` on covered cards — but do not use `visibility: hidden`, which breaks the stack.

## When not to use it

- With more than about six cards. Past that it is a long scroll for diminishing novelty.
- When the cards need to be compared side by side. Stacking is inherently sequential; a grid is not.
- When card heights vary a lot — the sticky offsets stop lining up and the deck looks broken.

## Specimen

`../specimens/index.html` → section **05**.
