# SVG Path Draw (self-drawing)

> A line draws itself as you scroll. Stroke-path animation bound to a scroll timeline.

**Binding:** scrubbed · **Mechanism:** `stroke-dashoffset` on an SVG path + `view()`/`scroll()` timeline
**Cost:** low–medium · **Risk:** low

## What it is

SVGator calls it "stroke-path animation… a powerful technique that lets you create intricate
self-drawing and self-erasing effects", and names the scroll use case directly: it is "ideal for
creating self-drawing characters, **scroll-based illustrations on landing pages**, animated
wordmarks, and even backgrounds that appear to be hand-drawn in real time."

Distinct from every other technique here because the thing being animated is a *path*, not a box.
That makes it the natural scroll effect for illustration-led and diagram-led pages — a route drawn
across a map, a signature completing, a chart line growing, a connector snaking between sections.

## Implementation — CSS native

The whole trick is that a dashed stroke with one dash the length of the path, offset by that same
length, is invisible. Animate the offset to zero and the line draws.

```css
.draw path{
  stroke: #ff5c39;
  stroke-width: 3;
  fill: none;
  stroke-linecap: round;

  /* pathLength normalises any path to 0–1, so no JS measurement is needed */
  pathLength: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;

  animation: draw auto linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 60%;
}
@keyframes draw{ to{ stroke-dashoffset: 0 } }
```

**`pathLength="1"` is the detail that makes this pleasant.** Set it as an attribute on the `<path>`
(or in CSS as above where supported) and the browser rescales the path's coordinate system so its
total length is exactly 1. Without it you must call `path.getTotalLength()` in JS and write the
number into the CSS — the old way, and it breaks whenever the artwork changes.

A long connector drawn across the whole page uses the root timeline instead:

```css
.spine path{
  animation: draw auto linear both;
  animation-timeline: --page;      /* html{ scroll-timeline: --page block } */
}
```

## Implementation — JS

GSAP's **DrawSVG** plugin handles the same effect plus the awkward cases — drawing from the middle
outward, partial ranges, and paths inside `<use>`. It is now free (see `../sources.md`).

```js
gsap.from('.draw path', {
  drawSVG: '0%', ease:'none',
  scrollTrigger:{ trigger:'.draw', start:'top 80%', end:'bottom 40%', scrub:true }
});
```

## Cost

Low for a handful of paths. `stroke-dashoffset` is a paint-level property — it does **not**
composite — so it repaints the SVG each frame. That is cheap for a simple line and expensive for a
complex illustration with hundreds of nodes. Budget by path complexity, not path count: one
1,200-point path is worse than thirty simple ones.

Keep the SVG inline in the document; a path inside an `<img>` cannot be animated at all.

## Accessibility

- Give the `<svg>` `role="img"` and a `<title>`, or `aria-hidden="true"` if it is decorative. A
  half-drawn line conveys nothing to a screen reader either way.
- If the drawing carries meaning — a route, a chart line, a process — that meaning must also exist
  as text or a table. Do not let the illustration be the only version.
- Reduced motion should show the **finished** line, not the empty one:
  ```css
  @media (prefers-reduced-motion: reduce){
    .draw path{ animation:none; stroke-dashoffset:0 }
  }
  ```
- The same applies to the no-support fallback. `stroke-dashoffset: 1` with an animation that never
  runs leaves an invisible illustration:
  ```css
  @supports not (animation-timeline: scroll()){
    .draw path{ stroke-dashoffset:0 }
  }
  ```

## When not to use it

- On dense illustrations — the repaint cost is real and the effect is illegible anyway.
- When the line is the only carrier of information.
- On text converted to outlines. Use real text with `../text-reveal.md`.

## Specimen

Not in `../specimens/index.html` — it needs real artwork to demonstrate honestly rather than a
rectangle pretending to be a drawing.
