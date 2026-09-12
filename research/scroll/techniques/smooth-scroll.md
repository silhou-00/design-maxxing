# Smooth Scroll (and scroll-jacking)

> Not a technique — a **modifier** applied to every other technique on the page. It changes how
> scrolling itself feels, and it is the single most consequential decision in this folder.

**Binding:** n/a · **Mechanism:** JS interception of wheel/touch events (Lenis, ScrollSmoother)
**Cost:** medium and page-wide · **Risk:** the highest here

## What it is

The browser's native scroll moves the page 1:1 with the input device. Smooth-scroll libraries
intercept that input and interpolate towards the target, adding inertia and easing.

The reason people add it is real: **it makes scrubbed animations look better.** Native wheel scroll
arrives in discrete jumps, so a scrubbed animation advances in steps. Lerped scroll produces
in-between values, so the animation flows. Every award-site look depends on this.

The reason to be careful is also real: you have replaced a core browser behaviour that the user
already knows how to operate.

## Lenis — what it actually does

Lenis is the current default. From its own README:

- **"Runs on native scroll"** — it wraps the browser's scroll rather than replacing the scroll
  container, so `position: sticky`, anchor links and accessibility keep working. This is the main
  reason it superseded Locomotive Scroll.
- Zero dependencies, a few KB, adapters for React, Vue and Framer.
- Built to drive WebGL scenes, GSAP ScrollTrigger and parallax from one loop.

```js
const lenis = new Lenis({ autoRaf: true });
```

Wiring it to GSAP is the standard combination:

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Settings that matter most: `lerp` (0.1 default — interpolation intensity), `duration` (1.2s, ignored
if `lerp` is set), `orientation`, `syncTouch`, and `prevent` / `data-lenis-prevent` for excluding
modals and nested scrollers.

## The documented limitations

Straight from the Lenis README, because these decide projects:

- **No support for CSS scroll-snap.** You must use `lenis/snap` instead.
- **Capped to 60fps on Safari**, and 30fps in low-power mode.
- **Smooth scroll stops working over iframes**, since they do not forward wheel events.
- `position: fixed` lags on pre-M1 macOS Safari.
- Nested scroll containers need explicit configuration — `allowNestedScroll: true` works but checks
  the DOM tree on every scroll event, which has a performance cost; `data-lenis-prevent` is the
  cheaper fix.
- Anchor links are **disabled by default** — you must pass `anchors: true`.

## Accessibility

Lenis handles the most important part properly, by default:

> "By default, Lenis honors the user's `prefers-reduced-motion` setting: when it is set to `reduce`,
> smoothing is disabled (`lerp` is forced to 1 so the scroll tracks the input device 1:1, ignoring
> duration/easing) and programmatic scrolls (`scrollTo`, anchor links) jump instantly to their
> target."

`respectReducedMotion: false` exists and the docs mark it **"(not recommended)"**. Do not set it.

What is still on you:

- **Scroll velocity and distance stop matching the input device.** For users with vestibular
  sensitivity, inertia is itself the problem, and `prefers-reduced-motion` is the only signal you
  get. Honour it.
- **Find-in-page, screen magnifiers and "scroll to top" gestures** behave differently once scroll is
  interpolated. Test them.
- **Never disable scrolling to run an animation.** Section-locking ("you cannot leave until the
  sequence finishes") is the version of scroll-jacking that draws genuine complaints.

## The honest recommendation

Ask what it is for. If the page has **scrubbed animation that visibly steps** without it, smooth
scroll is buying you something. If the page is content with reveals, it is buying you nothing and
costing you native behaviour, a dependency, and a class of bugs on Safari and in iframes.

CSS scroll-driven animations weaken the case further: they are compositor-driven and sample scroll
at the compositor's rate, so they are already smoother under native scroll than a main-thread
scrubbed animation is.

**Default: no smooth scroll.** Add it when a specific scrubbed effect demands it.

## Interaction with the styles

This modifier is the clearest style conflict in `../compatibility.md`. Brutalism's whole argument is
that the browser's honest defaults are the design; adding inertia to a brutalist page is a
contradiction in terms. Minimalism and Swiss have the same objection more quietly.

## Specimen

Deliberately absent from `../specimens/index.html` — the specimen is dependency-free, and adding
Lenis would change the feel of all twelve techniques at once, which is exactly the point being made
here.
