# Pinned Scene

> An element sticks in place while the page keeps scrolling, and the scroll drives what happens
> inside it.

**Binding:** scrubbed · **Mechanism:** `position: sticky` + a named view timeline, or GSAP `pin`
**Cost:** medium · **Risk:** medium

## What it is

The workhorse of "premium" scroll design. A stage holds still in the viewport; scroll distance
becomes a timeline for whatever plays on that stage. Everything from Apple product pages to agency
showreels is some version of this.

The key mental shift: **scroll distance is your duration.** A 300vh container gives you two
viewport-heights of animation time. You are budgeting screen-space, not seconds.

## Implementation — CSS native

No JS, no pin-spacer, no layout shift:

```css
/* The TALL parent carries the timeline */
.pin-wrap{
  height: 260vh;
  position: relative;
  view-timeline-name: --pin;
  view-timeline-axis: block;
}
/* The sticky child is the stage */
.pin-stage{ position: sticky; top:0; height:100vh; display:grid; place-items:center }

@keyframes pin-spin{
  from{ transform:rotate(0deg) scale(.55); border-radius:50%; background:#ff5c39 }
  to  { transform:rotate(200deg) scale(1.25); border-radius:6px; background:#39c2ff }
}
.pin-box{
  animation: pin-spin auto linear both;
  animation-timeline: --pin;
  animation-range: contain 0% contain 100%;   /* ← the important part */
}
```

**`contain` is the range you want for pinned scenes.** It covers exactly the window during which the
tall parent fully covers the scrollport — which is precisely the window during which the sticky
child is actually stuck. Using the default `cover` range starts the animation while the section is
still sliding in, so the first third of your animation plays off-screen.

## Implementation — JS

```js
gsap.timeline({
  scrollTrigger: {
    trigger: '.section', pin: true,
    start: 'top top', end: '+=1500', scrub: 1,
    anticipatePin: 1
  }
})
.from('.headline', { yPercent: 40, opacity: 0 })
.to('.art', { scale: 1.2 }, 0);
```

GSAP notes worth knowing, straight from its docs:

- **`anticipatePin: 1`** — browsers repaint scroll on a separate thread, so on fast scroll you can
  see one frame of un-pinned content. This applies the pin slightly early to hide it.
- **Never animate the pinned element itself.** ScrollTrigger pre-measures it; animate children
  instead.
- **`pinSpacing`** adds padding so following content catches up. Turning it off makes the next
  section scroll *under* the pin — sometimes what you want, usually a bug.
- **`pinReparent: true`** is the escape hatch when an ancestor has a `transform` or `will-change`,
  which breaks `position: fixed` at the browser level. It is expensive; fixing the ancestor is
  better.

## CSS vs GSAP here

This is the technique where the choice actually matters. CSS `sticky` + view timeline is free,
composited, and cannot desynchronise. GSAP wins when you need a **sequenced timeline** — five things
happening in a specific order with overlaps and labels — because expressing that in one
`@keyframes` block gets unreadable fast.

Rule of thumb: one or two properties → CSS. A choreographed sequence → GSAP.

## Cost

Medium. The pin itself is free in CSS. The cost is whatever you animate inside it, multiplied by the
fact that it is on screen for a long time. Keep to `transform`/`opacity` and it holds 60fps.

## Accessibility

- **Pinning steals scroll distance.** A 300vh pin means 3 viewport-heights of scrolling that produce
  no new content for a screen-reader user or anyone who does not see the animation. Keep pins short
  and make sure the DOM contains the actual content, not just animation targets.
- Under `prefers-reduced-motion`, drop the animation and let the section be a normal, static block:
  ```css
  @media (prefers-reduced-motion: reduce){
    .pin-wrap{ height:auto }
    .pin-stage{ position:static; height:auto }
    .pin-box{ animation:none }
  }
  ```
- Do not pin anything containing a focusable element that is invisible at the current scroll
  position — keyboard focus will jump into an element the user cannot see.

## When not to use it

- On mobile, where 260vh of pinning is a very long thumb journey for one animation.
- When the content inside is text the user needs to read at their own pace.
- More than twice per page — pins compound into a site that feels like it will not let you leave.


## Knowing when it is stuck — `scroll-state()`

Until Chrome 133 (January 2025), "has this stuck yet" required a scroll listener — the thing
`engine.md` §6 bans outright. Every sticky-shadow effect on the web was that banned listener.

```css
.bar{ container-type: scroll-state; position: sticky; top: 0 }

@supports (container-type: scroll-state){
  @container scroll-state(stuck: top){
    .bar{ box-shadow: 0 4px 0 0 currentColor }
  }
}
```

**Queries resolve at scroll composition time** — the earliest hook available, and off the main
thread. Three parts: the container declares `container-type: scroll-state`, and a **child** carries
the query. The queried element cannot be the container itself.

Chrome/Edge only. Strictly progressive enhancement behind `@supports`.

See `sections/pinned-scene.html` (the bar at the top uses it) and
`captures/platform-scroll-apis-2026.md`.

## Specimen

`../specimens/index.html` → section **04**.
