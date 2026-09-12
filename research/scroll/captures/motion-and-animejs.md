# Capture — Motion and Anime.js v4, the two libraries `js-libraries.md` missed

**Sources:** motion.dev/docs/scroll · motion.dev/docs/gsap-vs-motion · animejs.com/documentation/events/onscroll
(+ its `scrollobserver-thresholds` and `scrollobserver-synchronisation-modes` subpages) ·
gsap.com/community/standard-license
**Captured:** 2026-09-04
**Versions seen:** Anime.js 4.5.0 · Motion (docs undated, post-Framer-Motion rename)

`captures/js-libraries.md` covers GSAP, Scrollama and Lenis. It was written as if those were the
field. They are not. Two engines have shipped native-`ScrollTimeline` scroll APIs that are between
2× and 24× smaller than ScrollTrigger, and one of them absorbs the job Lenis was imported for.

---

## Motion — `scroll()`

> "Motion's 5.1kb `scroll()` function creates scroll animations in JavaScript, for effects like
> parallax, progress bars and scroll-driven storytelling."

### The claim that matters, verbatim

> "As part of Motion's hybrid engine, `scroll` is able to run animations with the **ScrollTimeline
> API** where possible for optimal hardware-accelerated performance, removing scroll measurements,
> improving scroll synchronisation and ensuring animations remain smooth even under heavy CPU usage."

And:

> "Because browsers render all scroll on the GPU, JS-based scroll animations are always slightly
> out-of-sync. Not so with Motion."

This is the same argument `engine.md` §6 already makes for CSS scroll-driven animations — *off the
main thread* — except reachable from JavaScript. It is the missing middle rung between
`animation-timeline: view()` and GSAP.

### API surface

```js
import { scroll, animate } from "motion"

// 1. progress callback
scroll(progress => console.log(progress))          // 0 -> 1

// 2. drive an animation (this is the accelerated path)
const animation = animate("div", { transform: ["none", "rotate(90deg)"] }, { ease: "linear" })
scroll(animation)

// 3. full info object
scroll((progress, info) => { console.log(info.y.velocity) })
```

**Options:** `container` (default `window`), `axis` (default `"y"`), `target`,
`offset` (default `["start start", "end end"]`), `trackContentSize` (default `false`).

`offset` intersections accept numbers (`0`–`1`), names (`start` / `center` / `end`), pixels
(`"100px"`, `"-50px"`), percentages, and `vh` / `vw`.

The `info` object per axis: `current`, `offset`, `progress`, `scrollLength`, **`velocity`**.

> `target` "is tracked by the element's layout position, so any CSS transform applied to it (or its
> ancestors) is ignored when measuring progress."

`scroll()` returns a cleanup function.

### Pinning — the structural difference from GSAP

> "To use the browser for best performance, **pinning should be performed with `position: sticky`**."

Motion does not pin. It expects you to pin in CSS and hands you the progress. GSAP's ScrollTrigger
pins in JS, which is why it carries `anticipatePin`, `pinSpacing` and `pinReparent` (see
`js-libraries.md`) — three settings that exist purely to paper over JS pinning. Motion has none of
them because it has no pin.

**This resolves a live tension in `techniques/pinned-scene.md`**, which is currently written around
GSAP pinning. The `position: sticky` + `scroll()` form is cheaper and has no pin-jump class of bug.

### `trackContentSize`, verbatim

> "Content size tracking is disabled by default because most of the time, scrollable area remains
> stable, and tracking changes to it involves a small overhead."

Turn it on for lazy-loaded or accordion content. This is a real footgun: a scroll progress bar over
a page that grows will silently drift without it.

---

## Anime.js v4 — `onScroll()` / ScrollObserver

Since 4.0.0. Not a plugin — a module. Lives under `events`.

```js
import { animate, onScroll } from 'animejs'
// or standalone: import { onScroll } from 'animejs/events'

animate('.square', { x: 100, autoplay: onScroll(parameters) })
```

Note the shape: the observer **is** the `autoplay` value. There is no separate register/kill
lifecycle to leak.

### Thresholds — `enter` / `leave`

Compares a target edge against a container edge. Three syntaxes, all equivalent:

```js
onScroll({ enter: { target: 'top', container: 'bottom' },
           leave: { target: 'bottom', container: 'top' } })   // object
onScroll({ enter: 'bottom', leave: 'top' })                    // container only; target defaults
onScroll({ enter: 'bottom top', leave: 'top bottom' })         // shorthand: container target
```

Defaults: `enter: 'end start'`, `leave: 'start end'`.
Also accepts numeric values, position shorthands, relative offsets (`'bottom-=50 top'`,
`'top+=60 bottom'`) and min/max.

### Synchronisation modes — the `sync` property

Four modes. This is the part with no equivalent in the current research.

| `sync` value | behaviour |
|---|---|
| method name (`'play'`, `'pause'`, `'reverse'`…) | triggered — fire a playback method at the threshold |
| `true` | playback progress bound 1:1 to scroll (GSAP's `scrub: true`) |
| a number `0`–`1` | **smooth scroll** — eased catch-up |
| an easing | **eased scroll** |

> "Smoothly animate the playback progress of the linked object to the scroll position by passing a
> value between 0 and 1. **The closer the value gets to 0, the longer the animation takes to catch
> up** with the current scroll position."

```js
animate('.square', {
  x: '15rem', rotate: '1turn', ease: 'linear',
  autoplay: onScroll({
    container: '.scroll-container',
    enter: 'bottom-=50 top',
    leave: 'top+=60 bottom',
    sync: .25,
    debug: true,
  })
})
```

**`sync: <number>` is the finding that touches `techniques/smooth-scroll.md`.** That file is
Lenis-only. Lenis smooths *the whole page's scroll position* — a global feel change, and the reason
the technique carries so many accessibility caveats. Anime's `sync: .25` smooths *one animation's
catch-up* and leaves native scroll untouched. Different mechanism, most of the same perceived
liquidity, none of the hijack. GSAP's `scrub: 1` is the same idea; neither is recorded as an
alternative to Lenis in the current write-up.

`debug: true` draws the threshold markers, same as ScrollTrigger's `markers: true`.

### Bundle

Site reports **27.13 KB** for the whole library, modular by subpath import. Per-module figures
published on the homepage: Scroll 4.30 KB, Timer 5.60 KB, Animation 5.20 KB, Draggable 6.41 KB,
WAAPI 3.50 KB.

### v4.5 additions worth knowing

Sidebar now carries **`TEXT` (new)**, **`ADAPTERS` (new)** and `LAYOUT` alongside the v4 modules.
`TEXT` is in GSAP SplitText territory. Not investigated further — flag for a follow-up pass.

---

## Size comparison

From `motion.dev/docs/gsap-vs-motion`. **Vendor's own comparison — treat as directional, not
neutral.** Sizes are plausible and consistent with each project's published figures; the framing is
not.

| | animate mini | animate (full) | GSAP |
|---|---|---|---|
| core | 2.6 kb | 18 kb | 23.5 kb |
| scroll trigger | +0.5 kb | +0.5 kb | +12 kb |
| scroll-linked | +2.5 kb | +2.5 kb | +12 kb |
| hardware accelerated | yes | yes | **no** |
| MIT | yes | yes | **no** |
| React API | — | +15 kb | — |

Anime.js sits between: 4.30 KB for its Scroll module, self-reported.

So the honest ordering for a scroll-only need, smallest first:
**native CSS (0) → Motion `scroll()` (~3 kb) → Anime `onScroll` (~4.3 kb) → GSAP ScrollTrigger
(~12 kb on top of a 23.5 kb core).**

Other Motion claims, unverified here and vendor-sourced: "2.5× faster than GSAP at animating from
unknown values, and 6× faster at animating between different value types"; "just passed 16 million
downloads per month". Do not cite these as facts without a second source.

Where GSAP still wins, per Motion's own page:

> "The benefit to GSAP's timeline API is that it's **mutable**. Once playback has begun, individual
> tracks can be added and removed to the overarching sequence, an ability that Motion doesn't yet
> offer."

That is the honest case for ScrollTrigger, and it is narrow.

---

## GSAP licence — verified at source, and `engine.md` is currently too loose

`engine.md` §6 says: *"GSAP is fully free as of Webflow's acquisition, ScrollSmoother, SplitText and
DrawSVG included."* True on the money question, incomplete on the rest.

From `gsap.com/community/standard-license`, effective 2025-04-30, last modified 2025-05-30:

> **Prohibited Uses** — "any implementation and/or use of GSAP Products in tools that allow users to
> build visual animations **without code** that encourages, induces, or materially assists in
> creating a solution that competes with Webflow's visual animation building capabilities."

> **Permitted Uses** — "the implementation and/or use of GSAP Products on any website, web
> application, or digital interface by any person or entity (which may include, for clarity, those
> of companies that compete with Webflow **in other areas of business**)."

> **V. TERMINATION** — "Webflow may terminate this GSAP License and revoke your access **in its
> discretion** if you fail to comply with any of these terms and conditions."

FAQ, verbatim:

> "Is it acceptable for AI tools like ChatGPT, Cursor, Lovable, Webstudio, etc. to generate GSAP
> code? **Absolutely! AI-generated code is not a 'Prohibited Use'.**"

> "Can I really use GSAP in commercial projects without paying anything? **Yes, really!** … All of
> GSAP including the plugins that were formerly 'members-only' like SplitText and MorphSVG can be
> used in commercial projects at no charge."

**Verdict.** Motion's page frames this as "prohibited from using GSAP in any tool that competes with
Webflow" — broader than the licence actually says. The real restriction is narrow and hits one
thing: shipping a **no-code visual animation builder**. Building a product website with GSAP,
commercially, with AI-generated code, is explicitly fine.

But two facts survive that `engine.md` does not currently carry, and they are the ones that matter
for a studio that installs skills into other people's repos:

1. **GSAP is not open source.** It is a revocable proprietary licence from Webflow. Motion and
   Anime.js are MIT — irrevocable.
2. **Webflow can amend the licence at any time.** Versions already released stay under the terms
   accepted at the time; updates do not.

Neither is a reason to drop GSAP. Both are a reason to stop writing "fully free" without a qualifier.

---

## What this changes

* `engine.md` §6's four-row "reach for" table routes **sequencing**, **stepped narrative**,
  **velocity** and **scrubbing** — and sends three of the four to GSAP or bare JS. Motion covers
  velocity (`info.y.velocity`) and scrubbing at ~3 kb, accelerated. The table predates it.
* `techniques/smooth-scroll.md` treats Lenis as the only route to smoothed scroll motion.
  `sync: <0-1>` and `scrub: <n>` are a different, less invasive mechanism for most of the same
  effect.
* `techniques/pinned-scene.md` is written around JS pinning. `position: sticky` + `scroll()` is the
  cheaper default.
* Every technique file's cost rating assumes GSAP's weight. At ~3 kb accelerated, several ⚠ ratings
  in `compatibility.md` were priced against the wrong library.
