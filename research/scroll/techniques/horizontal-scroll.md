# Horizontal Scroll

> Content that moves sideways. Either a genuine horizontal scroller, or vertical scroll translated
> into sideways movement — and the difference is enormous.

**Binding:** scrubbed · **Mechanism:** native `overflow-x`, or pinned section + `translateX`
**Cost:** low (native) / medium (converted) · **Risk:** low (native) / high (converted)

## Two completely different techniques with one name

### A. Native horizontal scroller

A real scroll container with `overflow-x: auto`. The user swipes, shift-scrolls, or drags. The
browser handles it.

```css
.rail{
  display:flex; gap:14px;
  overflow-x:auto;
  scroll-snap-type: x mandatory;
  scroll-timeline: --rail inline;      /* drive an indicator off the inline axis */
}
.rail > *{ flex: 0 0 62%; scroll-snap-align: center }
```

Keyboard-native, touch-native, screen-reader-native, free. A progress indicator comes almost free
too, since the scroller has its own timeline on the inline axis.

### B. Converted vertical scroll

A tall section is pinned, and vertical scroll distance is turned into horizontal `translateX`. This
is the "horizontal scroll section" of agency portfolios.

```js
const panels = gsap.utils.toArray('.panel');
gsap.to(panels, {
  xPercent: -100 * (panels.length - 1), ease: 'none',
  scrollTrigger: {
    trigger: '.rail', pin: true, scrub: 1,
    end: () => '+=' + document.querySelector('.rail').offsetWidth
  }
});
```

GSAP has a dedicated `containerAnimation` property for triggering animations on elements *inside*
such a section, because their normal scroll positions are meaningless once you have done this.

**B is scroll-jacking.** The user's vertical gesture no longer produces vertical movement. Treat it
with the same suspicion as `../smooth-scroll.md`.

## Which to use

| | Native (A) | Converted (B) |
|---|---|---|
| Keyboard | works | needs manual work |
| Touch | native swipe | vertical swipe → sideways, confusing |
| Screen reader | normal | normal DOM, disorienting visually |
| Scroll depth honesty | honest | page height is fake |
| Deep-linking / anchors | works | breaks |
| Effort | minutes | days |

Default to **A**. Reach for **B** only when the sideways movement is the point of the design — a
timeline, a gallery meant to feel like a filmstrip — and never for primary navigation.

## Cost

Native is free. Converted costs a pin plus a large `translateX` on a wide element; keep the panels
composited (`transform` only) and it holds up, but it is one of the easier ways to ship a janky page
on a low-end Android.

## Accessibility

- **Native scrollers need visible affordance.** A horizontal rail with no scrollbar, no arrows and
  no partial-item peek is invisible to most users. Always let the next item peek in (`flex: 0 0 62%`
  rather than `100%`), or pair it with `../scroll-progress.md` shadows.
- **Converted sections trap keyboard users.** Tab moves focus to an off-screen panel; the browser
  tries to scroll it into view; the pin fights back. Test with Tab before shipping.
- Under reduced motion, degrade B into A — or into a plain vertical stack:
  ```css
  @media (prefers-reduced-motion: reduce){
    .rail{ scroll-snap-type: none }
  }
  ```
- Do not use `scroll-snap-type: x mandatory` on a container whose items are taller than the
  viewport; `proximity` is the safer default when item sizes vary.

## When not to use it

- For anything the user must be able to find later. Horizontally hidden content is functionally
  hidden content.
- On a page that also has a heavy vertical narrative — two competing axes is one too many.
- With more than about eight panels.


## Honest affordances — `scroll-state()`

Most horizontal tracks show a permanent "→" that lies once you reach the end. Chrome 133+ can ask
whether there is anything left to scroll, in CSS:

```css
.track{ container-type: scroll-state; overflow-x: auto }

@supports (container-type: scroll-state){
  .hint{ opacity: 0 }
  @container scroll-state(scrollable: right){ .hint{ opacity: 1 } }
}
```

Values: `scrollable: top | bottom | left | right`. Use it for edge fades and arrow buttons so they
appear only when they are true.

**And the carousel primitives make most of this unnecessary.** Chrome 135+ ships
`::scroll-button(left|right)` — a real `<button>` that scrolls ~85% of the scroll area and disables
itself at the ends — plus `::scroll-marker` with `:target-current` for dot navigation. The browser
handles keyboard navigation and screen-reader semantics, which hand-built carousels routinely get
wrong.

Chrome/Edge only. Progressive enhancement, never a dependency.

See `sections/horizontal-scroll.html` and `captures/platform-scroll-apis-2026.md`.

## Specimen

`../specimens/index.html` → section **06** (native, with snap and an inline-axis indicator).
