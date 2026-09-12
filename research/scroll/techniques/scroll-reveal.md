# Scroll Reveal

> Elements animate in as they enter the viewport. The most-used scroll effect on the web, and the
> cheapest to get right.

**Binding:** triggered *or* scrubbed (both work) · **Mechanism:** CSS `view()` timeline, or IntersectionObserver
**Cost:** very low · **Risk:** low

## What it is

An element starts hidden or offset and animates to its resting state when it crosses into the
scrollport. Two variants that are often confused:

- **Triggered** — the animation fires once, on its own clock, when the element enters. Scroll
  position starts it and then stops mattering. This is what IntersectionObserver and
  `ScrollTrigger` (without `scrub`) give you.
- **Scrubbed** — the animation's progress is bound to how far the element has crossed the
  scrollport. Scroll up and it plays backwards. This is what CSS `view()` gives you by default.

Scrubbed feels more responsive and never leaves an element half-revealed. Triggered is better when
the motion has personality (a bounce, an overshoot) that shouldn't run backwards.

## Implementation — CSS native

```css
@keyframes reveal{
  from{ opacity:0; transform:translateY(28px) }
  to  { opacity:1; transform:translateY(0) }
}
.reveal > *{
  animation: reveal auto linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 38%;   /* done well before centre screen */
}
```

`animation-range` is the whole craft here. Left at its default (`cover`), the element is still
animating when it is halfway up the screen, which reads as sluggish. `entry 10% cover 38%` finishes
it early. No stagger logic is needed — each element's position in the scrollport *is* the stagger.

## Implementation — JS

```js
// IntersectionObserver — triggered, once
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target) } })
}, { rootMargin: '0px 0px -20% 0px' });
document.querySelectorAll('.reveal > *').forEach(el => io.observe(el));
```

```js
// GSAP — batched, so elements entering together animate together
ScrollTrigger.batch('.card', {
  onEnter: b => gsap.from(b, { opacity:0, y:28, stagger:0.08, overwrite:true })
});
```

`ScrollTrigger.batch()` is the reason to reach for GSAP here: it groups elements that enter within
the same interval so a grid reveals as a wave rather than row-by-row.

## Cost

Negligible if you animate **only `opacity` and `transform`** — both composite off the main thread.
Animating `height`, `width`, `top`, `margin` or `filter` forces layout or paint every frame and will
drop frames on a long list.

## Accessibility

The safest scroll technique there is, but still non-essential motion under WCAG 2.3.3.

```css
@media (prefers-reduced-motion: reduce){
  .reveal > *{ animation:none; opacity:1; transform:none }
}
```

**The failure that matters:** if the reveal is implemented as `opacity: 0` in CSS and the reveal
never fires — no JS, no `animation-timeline` support, an error before hydration — the content is
permanently invisible. Always ship a `@supports not (animation-timeline: scroll())` or
`.no-js` fallback that sets `opacity: 1`.

## When not to use it

- Above the fold. Content in the initial viewport should already be there.
- On every element. If everything reveals, nothing is emphasised and the page feels laggy.
- On text the user is trying to read while scrolling.

## Specimen

`../specimens/index.html` → section **02**.
