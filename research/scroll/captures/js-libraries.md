# Capture — the JS scroll libraries

**Sources:** gsap.com/docs/v3/Plugins/ScrollTrigger · gsap.com/pricing · github.com/russellsamora/scrollama · github.com/darkroomengineering/lenis
**Captured:** 2026-09-03

Three libraries that do three different jobs. They are not alternatives to each other.

| | job | mechanism | when CSS can't |
|---|---|---|---|
| **GSAP ScrollTrigger** | sequenced timelines, pinning, snapping | scroll listener + tween engine | you need *order*: five things with overlaps and labels |
| **Scrollama** | stepped narrative | IntersectionObserver | you need *discrete states*, not a continuous 0→1 |
| **Lenis** | smooth/inertial scroll | wraps native scroll | never — it changes feel, not capability |

---

## GSAP ScrollTrigger

> "ScrollTrigger enables anyone to create jaw-dropping scroll-based animations with minimal code.
> Infinitely flexible. Scrub, pin, snap, or just trigger anything scroll-related, even if it has
> nothing to do with animation."

### The config surface that matters

```js
gsap.timeline({
  scrollTrigger: {
    trigger: '.container',
    pin: true,               // element sticks while active
    start: 'top top',        // trigger-position viewport-position
    end: '+=500',            // or 'bottom 50%+=100px', or a function
    scrub: 1,                // true = 1:1 with scrollbar; number = seconds to catch up
    snap: {
      snapTo: 'labels',      // or a number (increments), array, function, 'labelsDirectional'
      duration: { min: 0.2, max: 3 },
      delay: 0.2,
      ease: 'power1.inOut'
    },
    markers: true            // dev only — draws start/end lines
  }
});
```

**`scrub`** is the core distinction from CSS: `scrub: true` binds progress to the scrollbar, a
number adds catch-up smoothing. `scrub: 1` is what gives commercial scroll work its liquid feel.

### Pinning notes, verbatim from the docs

- **`anticipatePin`** — "If you pin large sections/panels you may notice what looks like a slight
  delay in pinning when you scroll quickly. That's caused by the fact that most modern browsers
  handle scroll repaints on a separate thread… The only way to counteract that is to have
  ScrollTrigger monitor the scroll velocity and anticipate the pin." `anticipatePin: 1` is usually
  right.
- **Don't animate the pinned element.** "don't animate the pinned element itself because that will
  throw off the measurements (ScrollTrigger is highly optimized for performance and pre-calculates
  as much as possible). Instead, you could nest things such that you're animating only elements
  INSIDE the pinned element."
- **`pinSpacing`** — "By default, padding will be added to the bottom… so that when the pinned
  element gets unpinned, the following content catches up perfectly. Otherwise, things may scroll
  UNDER the pinned element."
- **`pinReparent`** — for when "you probably have a `transform` or `will-change` on an ancestor
  element which breaks `position: fixed` behavior (it's a browser thing, not ScrollTrigger)."
  Reparents to `<body>`. "It's best to set up your project to avoid those because reparenting can be
  expensive." Also breaks descendant-dependent CSS selectors.
- **`pinType`** — `fixed` if the scroller is `<body>`, otherwise transforms. "Beware that if you set
  the CSS property `will-change: transform`, browsers treat it just like having a transform applied,
  breaking `position: fixed` elements."
- **Nested pinning is not supported.** `pinnedContainer` only helps non-pinning ScrollTriggers.

### Other genuinely useful bits

- **`ScrollTrigger.batch(triggers, vars)`** — "Creates a coordinated group of ScrollTriggers (one
  for each target element) that batch their callbacks… within a certain interval, delivering a neat
  Array so that you can easily do something like create a staggered animation of all the elements
  that enter the viewport around the same time." This is the main reason to use GSAP for reveals.
- **`containerAnimation`** — "Easily trigger animations inside 'horizontally' scrolling sections
  that are controlled by vertical scrolling." Required for the converted-horizontal-scroll pattern.
- **`fastScrollEnd`** — forces an animation to completion if the user leaves its area faster than
  2500px/s, avoiding overlaps.
- **`preventOverlaps`** — forces preceding scroll animations to their end state.
- **`toggleActions: 'play pause resume reset'`** — the four states, in order onEnter/onLeave/
  onEnterBack/onLeaveBack.
- **`normalizeScroll()`** — "Forces scrolling to be done on the JavaScript thread, ensuring screen
  updates are synchronized and the address bar doesn't show/hide on [most] mobile devices."
- **`refreshPriority`** — only needed if you create ScrollTriggers out of document order. Don't.
- Read-only state: `.progress`, `.direction`, `.isActive`, `.getVelocity()`, `.isTouch`.

### Licensing — this changed

> "You heard us right. **GSAP is now 100% free for all users**, thanks to Webflow's support."

Every formerly-Club plugin is included: ScrollTrigger, **ScrollSmoother**, SplitText, DrawSVG,
MorphSVG, Flip, Inertia, Observer, ScrambleText, Physics2D, MotionPath, GSDevTools. Any guidance
that treats ScrollSmoother or SplitText as paid is stale. Note the ScrollTrigger docs page still
carries an older "members-only benefit" line about ScrollSmoother.

---

## Scrollama — v3.2.0

> "Scrollama is a modern & lightweight JavaScript library for scrollytelling using
> IntersectionObserver in favor of scroll events… The goal of this library is to provide a simple
> interface for creating scroll-driven interactives. Scrollama is focused on performance by using
> IntersectionObserver to handle element position detection."

```js
const scroller = scrollama();
scroller
  .setup({ step: '.step', offset: 0.5, progress: true, threshold: 4 })
  .onStepEnter(({ element, index, direction }) => {})
  .onStepExit(({ element, index, direction }) => {})
  .onStepProgress(({ element, index, progress }) => {});
```

**Options:** `step` (required) · `offset` (0–1 or `"200px"`, default `0.5`) · `progress` (bool) ·
`threshold` (progress granularity in px, default 4) · `once` · `debug` · `parent` (shadow DOM) ·
`container` · `root`.
**Methods:** `offsetTrigger()` · `resize()` (no longer needed — built-in ResizeObserver) ·
`enable()` · `disable()` · `destroy()`.
**Per-step override:** `<div class="step" data-offset="0.25">` or `data-offset="100px"`.

### Version history that affects how you write it

- **v3.0.0+** — `order` deprecated. Built-in resize via ResizeObserver. Custom per-step offsets via
  data attributes.
- **v2.0.0+** — **`onContainerEnter` / `onContainerExit` deprecated in favour of CSS
  `position: sticky`.** Any tutorial using those callbacks is out of date.
- **v1.4.0+** — "you must manually add the IntersectionObserver polyfill for cross-browser support."

### Its own top tip, verbatim

> "Avoid using viewport height (vh) in your CSS because scrolling up and down constantly triggers vh
> to change, which will also trigger a window resize."

Mobile URL bars collapse on scroll, changing `vh`, firing resize, recalculating every step. Scrollama
ships a "Mobile Pattern" example that uses pixels instead of percentages for the offset "so it
doesn't jump around on scroll direction change."

### Reference examples

Basic · Progress · **Sticky Graphic (Side by Side)** · **Sticky Graphic (Overlay)** · Custom Offset ·
**Mobile Pattern** · iframe Embed.

### In the wild

ProPublica (*The Billionaire Playbook*, *Unchecked Power*) · The Pudding (*Women's Pockets are
Inferior*, *Life After Death on Wikipedia*) · Washington Post · Vox · WSJ · Politico · Science ·
Stuff · elDiario.es · Mapbox · YouTube.

**Named alternatives:** ScrollTrigger, Waypoints, ScrollMagic, graph-scroll.js, ScrollStory,
enter-view.

---

## Lenis

> "Lenis ('smooth' in latin) is a lightweight, robust, and performant smooth scroll library…
> perfect for creating smooth scrolling experiences on your website such as WebGL scroll syncing,
> parallax effects, and much more."

**Features:** few KB, zero runtime dependencies · **"Runs on native scroll — wraps the browser's own
scroll, so `position: sticky`, anchor links, and accessibility keep working"** · any axis · built to
drive WebGL / GSAP ScrollTrigger / parallax off one loop · React, Vue, Framer adapters ·
`lenis/snap` plugin.

```js
// minimal
const lenis = new Lenis({ autoRaf: true });

// with GSAP — the standard pairing
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

**Key options:** `lerp` (0.1) · `duration` (1.2s, ignored if `lerp` set) · `easing` ·
`orientation` · `gestureOrientation` · `smoothWheel` (true) · `syncTouch` (false, "can be unstable
on iOS<16") · `infinite` · `anchors` (**false by default — you must opt in**) ·
`allowNestedScroll` (⚠ "checks the DOM tree on every scroll event") · `prevent` (fn) ·
`autoToggle` · `stopInertiaOnNavigate` · `respectReducedMotion` (**true**).

**Escape hatches:** `data-lenis-prevent` (+ `-wheel`, `-touch`, `-vertical`, `-horizontal`).

### Documented limitations, verbatim

> - "no support for CSS scroll-snap, you must use (lenis/snap)"
> - "capped to 60fps on Safari and 30fps on low power mode"
> - "smooth scroll will stop working over iframe since they don't forward wheel events"
> - "position fixed seems to lag on MacOS Safari pre-M1"
> - "touch events may behave unexpectedly when syncTouch is enabled on iOS < 16"
> - "nested scroll containers require proper configuration to work correctly"

### Reduced motion — it gets this right by default

> "By default, Lenis honors the user's `prefers-reduced-motion` setting: when it is set to `reduce`,
> smoothing is disabled (`lerp` is forced to 1 so the scroll tracks the input device 1:1, ignoring
> duration/easing) and programmatic scrolls (`scrollTo`, anchor links) jump instantly to their
> target. Lenis keeps running so WebGL/DOM synchronization stays intact, and the preference is
> picked up live without a reload."

`respectReducedMotion: false` exists and is marked **"(not recommended)"**.

---

## Verdict for our purposes

**GSAP:** the right tool when you need *sequencing*. Now free, which removes the last reason to
avoid it. But most single-property scroll effects are cheaper and smoother in CSS — GSAP runs on the
main thread, CSS scroll-driven animations do not.

**Scrollama:** the right tool for stepped narrative, and effectively the newsroom standard. Small,
IntersectionObserver-based, no scroll listeners. Its `vh` warning is the most practically useful
gotcha in this whole capture.

**Lenis:** the best-engineered of the three and the one to be most sceptical about, because it is the
only one that changes behaviour the user already knows. Its own limitations list — no CSS scroll-snap,
Safari 60fps cap, dead over iframes — is a stronger argument against casual adoption than anything
external. Default to not using it; add it when a specific scrubbed effect visibly steps without it.
