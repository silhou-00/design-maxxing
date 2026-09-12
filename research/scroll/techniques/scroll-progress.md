# Scroll Progress

> UI bound to how far through something you are. Reading bars, step indicators, shrinking headers,
> scroll shadows.

**Binding:** scrubbed · **Mechanism:** CSS `scroll()` / named `scroll-timeline`
**Cost:** near zero · **Risk:** none

## What it is

A Scroll Progress Timeline converts a scroll position into 0–100% and drives an animation with it.
Unlike every other technique in this folder, most uses of it are **informational rather than
decorative** — which changes the accessibility calculus entirely (see below).

Four members of this family:

| Pattern | What it reports |
|---|---|
| Reading indicator | how far through the document |
| Carousel step indicator | which item of N you are on |
| Shrinking / morphing header | that you have left the top |
| Scroll shadows | that a container has more content off-screen |

## Implementation — CSS native

```css
/* Declare ONE named timeline on the document scroller and reuse it everywhere. */
html{ scroll-timeline: --page block; }

@keyframes grow-progress{ from{ transform:scaleX(0) } to{ transform:scaleX(1) } }

#progress{
  position:fixed; left:0; top:0; width:100%; height:5px;
  background:#ff5c39; transform-origin:0 50%;
  animation: grow-progress auto linear;
  animation-timeline: --page;
}
```

**Scale, never width.** `width` triggers layout on every frame; `transform: scaleX()` composites.

Bind an effect to an absolute distance rather than a percentage with a fixed-length range:

```css
#head{
  animation: shrink-head auto linear both;
  animation-timeline: --page;
  animation-range: 0 200px;      /* only the first 200px of scroll */
}
```

For a nested scroller, name a timeline on it and drive an indicator from the inline axis:

```css
.rail{ overflow-x:auto; scroll-timeline: --rail inline; }
.rail-bar i{ animation: grow-progress auto linear both; animation-timeline: --rail; }
```

## Gotchas found while building the specimen

- **`getComputedStyle(el).transform` lies.** Scroll-driven animations run off the main thread, so
  `getComputedStyle` reports the *un-composited base value* — a progress bar that is visibly 64%
  full still reads `matrix(0, 0, 0, 1, 0, 0)`. Same for `Animation.timeline.currentTime`, which
  reads `null`. Verify with **`getBoundingClientRect()`**, which does reflect the applied transform,
  or with a screenshot. This cost real debugging time; it will cost you the same.
- **Prefer a named timeline on `html` over anonymous `scroll()`** for root-scroller effects. It is
  what the spec authors' own demos use, it is explicit, and it sidesteps the `nearest` lookup rules
  entirely. The lookup for `nearest` walks the *containing block chain*, which for a
  `position: fixed` or `position: absolute` element can skip straight past the scroller you meant.
- **Don't set a static `transform` on the animated element** as a "starting state". Put it in the
  `from` keyframe instead.

## Cost

The cheapest technique in this folder. A single composited transform driven by the compositor.
There is no performance argument against a reading indicator.

## Accessibility

**This is the one family that usually survives `prefers-reduced-motion`.** A progress bar is not
decorative motion — it conveys position, the same information a scrollbar conveys. WCAG 2.3.3
exempts "animation essential to the functionality or the information being conveyed."

Keep progress indicators and scroll shadows under reduced motion. Kill the decorative half — a
header that *shrinks* is fine to freeze into its small state; a header that *bounces* is not.

Scroll shadows have a genuine a11y upside: they tell low-vision users a container scrolls.

## When not to use it

- A reading indicator on a short page. If there is nothing to track, it is noise.
- More than one progress affordance per view.

## Specimen

`../specimens/index.html` → sections **01**, **06** (rail), **09** (header), **12** (shadows).
