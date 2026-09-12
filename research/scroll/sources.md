# Sources — scroll research

Ten sources. Two you gave me, eight I added. All opened in Chrome on 2026-09-03.

## The two you gave me

| # | Source | What it actually gives | Verdict |
|---|---|---|---|
| 1 | [SVGator — 31 Website Animation Examples](https://www.svgator.com/blog/website-animation-examples-and-effects/) | A 31-item taxonomy of *web animation* generally. Only **§2 Scrollytelling** and **§15 Vertical and Horizontal Scrolling Effects** are scroll-specific. No code. | Useful as a vocabulary and for the morphism↔animation pairings (§27 neumorphic, §28 glassmorphic, §29 claymorphic). Not an implementation source. |
| 2 | [oso95/scroll-world](https://github.com/oso95/scroll-world) | An agent skill that generates a scroll-scrubbed 3D-world landing page. Full pipeline, seam rule, cost model. | The most *specific* source here, and the one that raised the technique-vs-style question. See `compatibility.md`. |

**What was missing from both:** neither explains how scroll animation is actually built. SVGator is
a gallery; scroll-world is one highly specific application. Sources 3–10 fill that in.

## The eight I added

| # | Source | Closes | Key extraction |
|---|---|---|---|
| 3 | [Chrome for Developers — Animate elements on scroll](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) | **The native API.** The single most important source here. | Full CSS + JS API: Scroll Progress Timelines vs View Progress Timelines, `scroll()` / `view()`, named `scroll-timeline` / `view-timeline`, all six `animation-range` names, `timeline-scope` hoisting. Written by Bramus, who implemented much of it. |
| 4 | [scroll-driven-animations.style](https://scroll-driven-animations.style/) | Pattern taxonomy + reference implementations | 14 named demos: Reading Progress Indicator · Carousel Step Indicator · Carousel with markers · Reverse-Scrolling Columns · Cover Card to Fixed Header · Image Reveal Effects · Fly-in Fly-out Contact List · Cover Flow · Window Carousel · Stacking Cards · Horizontal Scroll Section · 3D Shoe Explorer · Shrinking Header + Shadow · Scroll Shadows. Plus three range visualiser tools and a DevTools extension. |
| 5 | [MDN — CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) | Reference surface | Property list: `animation-range*`, `scroll-timeline*`, `view-timeline*`, `timeline-scope`; interfaces `ScrollTimeline`, `ViewTimeline`. |
| 6 | [caniuse — `animation-timeline`](https://caniuse.com/mdn-css_properties_animation-timeline) | **Browser support** | **86.09% global.** Chrome/Edge 115+, Safari 26+, **Firefox 155+**, Opera 134+, Samsung Internet 26.6+, iOS Safari 26+. See the finding below. |
| 7 | [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | The JS standard | Full config surface: `scrub`, `pin`, `snap`, `start`/`end`, `toggleActions`, `containerAnimation`, `anticipatePin`, `pinSpacing`, `pinReparent`, `fastScrollEnd`, `preventOverlaps`, `ScrollTrigger.batch()`, `normalizeScroll()`. |
| 8 | [GSAP pricing](https://gsap.com/pricing/) | Licensing | **"GSAP is now 100% free for all users, thanks to Webflow's support."** Includes every formerly-paid plugin: ScrollTrigger, **ScrollSmoother**, SplitText, DrawSVG, MorphSVG, Flip, Inertia, Observer. |
| 9 | [russellsamora/scrollama](https://github.com/russellsamora/scrollama) | **Scrollytelling** | IntersectionObserver-based, v3.2.0. `setup({step, offset, progress, threshold, once, container, root})`, `onStepEnter/Exit/Progress`. Since v2 the container callbacks are deprecated in favour of `position: sticky`. Shipped by ProPublica, The Pudding, WaPo, WSJ, Politico, Vox, Science, Mapbox. |
| 10 | [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scroll | Full option table, and — more valuably — an honest Limitations list and a documented `prefers-reduced-motion` policy. |
| 11 | [W3C — Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | **Accessibility** | Names parallax explicitly as non-essential motion. Three sufficient remedies. The severity note quoted throughout this folder. |

---

## Three findings worth reading

### 1. Scroll-driven CSS animations are now genuinely cross-browser

This changed recently and it changes the default. Chrome shipped the API in 115 (May 2023) and for
two years it was Chromium-only. Per caniuse as of March 2026: **Firefox 155+ and Safari 26+ both
support it**, putting global coverage at **86.09%**.

The practical consequence: **the default implementation for most scroll effects is now CSS, not a
library.** Scroll-driven animations run off the main thread — which is the entire point of the spec:

> "you can now have silky smooth animations, driven by scroll, running off the main thread, with
> just a few lines of extra code."

A main-thread JS scrubbed animation cannot match that, no matter how good the library.

Reach for JS when you need something CSS genuinely cannot express: a **sequenced timeline** with
labels and overlaps (GSAP), **stepped narrative states** (Scrollama), **scroll velocity** (CSS
timelines expose position, not speed), or **video/canvas scrubbing**.

### 2. GSAP is now entirely free, which resets the old cost calculation

ScrollSmoother, SplitText, DrawSVG, MorphSVG and Inertia used to be behind "Club GreenSock". They
are not any more. Any advice that weighs "ScrollTrigger is free but ScrollSmoother costs money" is
out of date.

### 3. `getComputedStyle` cannot verify a scroll-driven animation

Found while building `specimens/index.html`, and it cost real time.

Because these animations run on the compositor, the main thread does not know their current value.
A progress bar visibly 64% full reports:

```js
getComputedStyle(el).transform          // "matrix(0, 0, 0, 1, 0, 0)"  ← scaleX(0), wrong
el.getAnimations()[0].timeline.currentTime   // null                   ← looks inactive, isn't
el.getBoundingClientRect().width        // 958.89  ← correct, reflects the applied transform
```

The first two readings sent me chasing a bug that did not exist. **Verify with
`getBoundingClientRect()` or with a screenshot.** There is a Scroll-Driven Animations DevTools
extension (source 4) for exactly this reason.

---

## Method notes

- **Named timelines over anonymous `scroll()` for root-scroller effects.** The spec authors' own
  progress-bar demo declares `html { scroll-timeline: --page-scroll block; }` and references it by
  name rather than using `scroll()`. It is explicit and sidesteps the `nearest` lookup rules, which
  walk the *containing block chain* — and so can skip past the scroller you meant for
  `position: fixed` and `position: absolute` elements. The Chrome docs flag this trap for the
  absolutely-positioned carousel indicator.
- **Do not put a static "start state" transform on an element you are also animating.** Put it in
  the `from` keyframe. The reference demos do this and it avoids a whole class of confusion.
- `caniuse.com` and `neumorphism.io` block the browser tool's JS injection ("Cookie/query string
  data"); screenshot or `get_page_text` instead.
- `developer.mozilla.org/.../CSS_scroll-driven_animations/Using` is a 404 — the guide lives at
  `/Web/CSS/Guides/Scroll-driven_animations`.

## Gaps left open

- **No performance measurement.** Nothing here is benchmarked. The cost claims in `techniques/` are
  reasoned from which CSS properties composite versus repaint, not measured on devices. If any of
  this becomes a build standard, profile it.
- **`containerAnimation`, `ScrollSmoother` and `lenis/snap` not explored in depth** — each is a
  meaningful sub-topic.
- **No WebGL / react-three-fiber scroll research.** `r3f-scroll-rig` and Locomotive Scroll are named
  in Lenis's plugin list but not investigated. That is the obvious next area if real-time 3D (as
  opposed to scroll-world's pre-rendered video) is on the table.
- **The Emons site**, named by scroll-world as its reference, was not visited.
- **Scrollama's example implementations** (Sticky Side-by-Side, Sticky Overlay, Mobile Pattern) were
  read about but not captured; they are the reference code for `techniques/scrollytelling.md`.
