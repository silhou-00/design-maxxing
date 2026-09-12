# Capture — CSS Scroll-driven Animations (the native API)

**Primary source:** https://developer.chrome.com/docs/css-ui/scroll-driven-animations — Bramus,
published 5 May 2023
**Companions:** https://scroll-driven-animations.style/ · MDN `CSS_scroll-driven_animations` ·
caniuse `animation-timeline`
**Captured:** 2026-09-03

The reference for everything in `../techniques/`. This is the only implementation source with a
complete API.

---

## The problem it solves (verbatim)

> "The classic way to achieve these kinds of effects is to respond to scroll events on the main
> thread, which leads to two main problems:
> - Modern browsers perform scrolling on a separate process and therefore deliver scroll events
>   asynchronously.
> - Main thread animations are subject to jank.
>
> This makes creating performant scroll-driven animations that are in-sync with scrolling impossible
> or very difficult."

And the payoff:

> "you can now have silky smooth animations, driven by scroll, running off the main thread, with just
> a few lines of extra code."

## The two timeline types

| | **Scroll Progress Timeline** | **View Progress Timeline** |
|---|---|---|
| Bound to | scroll position of a **container** | position of a **subject** within its container |
| 0% | container at scroll start | subject about to enter the scrollport |
| 100% | container at scroll end | subject has fully left the scrollport |
| Anonymous fn | `scroll()` | `view()` |
| Named props | `scroll-timeline-name` / `-axis` | `view-timeline-name` / `-axis` / `-inset` |
| JS class | `ScrollTimeline` | `ViewTimeline` |
| Use for | progress bars, headers, marquees | reveals, parallax, stacking, per-element effects |

> "A View Progress Timeline… is somewhat comparable to how IntersectionObserver works."

## Anonymous timelines

```css
.subject{
  animation: animate-it linear;
  animation-timeline: scroll(root block);
}
```

`scroll(<scroller> <axis>)`:
- **scroller** — `nearest` (default) · `root` (document viewport) · `self`
- **axis** — `block` (default) · `inline` · `y` · `x`

`view(<axis> <inset>)` — axis as above; inset is a percentage or `auto`, adjusting when the subject
counts as in view. **You cannot specify a scroller for `view()`** — it always tracks the subject in
its nearest parent scroller.

Two rules the docs state explicitly:

> "The `animation-timeline` longhand property is not part of the `animation` shorthand and must be
> declared separately. Furthermore, `animation-timeline` must be declared **after** the `animation`
> shorthand as the shorthand will reset non-included longhands to their initial value."

> "Because an `animation-duration` set in seconds does not make sense when using a Scroll Progress
> Timeline, you must set `animation-duration` to `auto`."

## Named timelines

```css
.scroller{ scroll-timeline: --my-scroller inline; }   /* name + axis shorthand */
.scroller .subject{
  animation: animate-it linear;
  animation-timeline: --my-scroller;
}
```

Names must start with `--`. Use named timelines when you are not targeting a parent or root
scroller, when a page has several timelines, or when automatic lookup fails.

**The lookup trap**, quoted because it cost time in `../specimens/index.html`:

> "lookups for `nearest` only considers the elements that can affect its position and size. Because
> `.gallery__progress` is absolutely positioned, the first parent element that will determine its
> size and position is the `.gallery` element as it has `position: relative` applied, thereby
> jumping over the `.gallery__scrollcontainer` element. Expressed in more technical terms, **the
> lookup walks up the containing block chain to find the nearest scroll container.**"

The same applies to `position: fixed`. For root-scroller effects, declare a named timeline on `html`
— which is what the spec authors' own progress-bar demo does:

```css
html{ scroll-timeline: --page-scroll block; }
#progress{ animation: grow-progress auto linear; animation-timeline: --page-scroll; }
```

## Ranges — the craft of the whole API

```css
animation-range: entry 0% entry 100%;   /* or the shorthand: entry */
```

The six range names:

| Name | Range |
|---|---|
| `cover` | the full view-progress timeline (default) |
| `entry` | while the subject is entering the visibility range |
| `exit` | while the subject is exiting it |
| `entry-crossing` | while the subject crosses the **end** border edge |
| `exit-crossing` | while the subject crosses the **start** border edge |
| `contain` | while the subject is fully contained by, or fully covers, the scrollport |

Ranges can overlap: `entry 0%`, `entry-crossing 0%` and `cover 0%` all name the same point.

**Ranges can be baked into the keyframes**, which removes the need for `animation-range` and lets
one animation cover both entry and exit:

```css
@keyframes animate-in-and-out{
  entry  0%  { opacity:0; transform:translateY(100%) }
  entry  100%{ opacity:1; transform:translateY(0) }
  exit   0%  { opacity:1; transform:translateY(0) }
  exit   100%{ opacity:0; transform:translateY(-100%) }
}
```

**Ranges use the untransformed box**, deliberately:

> "these ranges are derived from the untransformed principal box of the subject… This is a good
> thing, as this allows you to scale a subject during scroll without affecting the available scroll
> estate. If the transformed box were used, attached animations would flicker."

## `timeline-scope` — hoisting

The lookup only walks *ancestors*, so a sibling cannot see a scroller's timeline. `timeline-scope`
declares a name on a shared parent without creating the timeline there:

```css
.parent          { timeline-scope: --tl; }
.parent .scroller{ scroll-timeline: --tl; }
.parent .scroller ~ .subject{
  animation: animate linear;
  animation-timeline: --tl;
}
```

## JavaScript equivalents

```js
const tl = new ScrollTimeline({ source: document.documentElement, axis: 'block' });
const vt = new ViewTimeline({ subject: el, axis: 'block', inset: '0%' });

el.animate({ opacity: [0, 1] }, {
  timeline: vt, rangeStart: 'entry 25%', rangeEnd: 'cover 50%', fill: 'forwards'
});
```

> "The animated element `$el` and the subject do not need to be the same element. This means that
> you can track an element in its scroller while animating a distant element somewhere else in the
> DOM tree."

## Browser support (caniuse, March 2026)

**86.09% global.** Chrome 115+ · Edge 115+ · Safari 26+ · **Firefox 155+** · Opera 134+ ·
Samsung Internet 26.6+ · iOS Safari 26+.

Shipped in Chrome 115 (May 2023) and Chromium-only for roughly two years. Firefox and Safari support
is recent, which is what makes CSS a viable default rather than a progressive-enhancement bet. A
polyfill exists (source 4).

Ship a fallback regardless:

```css
@supports not (animation-timeline: scroll()){
  .reveal > *{ opacity:1; transform:none }
}
```

## The 14 reference demos on scroll-driven-animations.style

Reading Progress Indicator · Carousel Step Indicator · Carousel with markers ·
**Reverse-Scrolling Columns** · Cover Card to Fixed Header · Image Reveal Effects ·
Fly-in Fly-out Contact List · **Cover Flow** · Window Carousel · **Stacking Cards** ·
**Horizontal Scroll Section** · 3D Shoe Explorer · Shrinking Header + Shadow · **Scroll Shadows**

Plus three range/timeline visualiser tools, a 10-part video course, and a
Scroll-Driven Animations DevTools extension.

---

## The debugging gotcha (found here, not in the docs)

Because these animations run off the main thread, **the main thread cannot read their current
value.** A progress bar visibly 64% full reports:

```js
getComputedStyle(el).transform                // "matrix(0, 0, 0, 1, 0, 0)"  ← wrong
el.getAnimations()[0].timeline.currentTime    // null                        ← looks inactive
el.getBoundingClientRect().width              // 958.89                      ← correct
```

Verify with `getBoundingClientRect()`, a screenshot, or the DevTools extension. Not with
`getComputedStyle`.

---

## Verdict for our purposes

**The single most valuable source in this research.** Complete API, real code, and the reasoning
behind the design. It is also the source that changes the default recommendation: with 86% support
and off-main-thread execution, CSS is now the starting point for scroll animation, and a JS library
is what you add when CSS cannot express what you need — sequencing, stepped states, velocity, or
media scrubbing.
