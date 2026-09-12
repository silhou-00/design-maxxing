# Scrollytelling

> A graphic holds still while stepped text scrolls past it, and each step changes the graphic.
> Narrative, not decoration.

**Binding:** stepped (discrete states), usually with scrubbed transitions between
**Mechanism:** `position: sticky` + IntersectionObserver (Scrollama) · **Cost:** medium · **Risk:** medium

## What it is

The newsroom pattern. A sticky visual — a map, a chart, a photograph, a 3D scene — sits in the
viewport while short text blocks ("steps") scroll over or beside it. Each step entering the trigger
zone changes the visual.

SVGator's framing: "Scrollytelling 2.0 uses the act of scrolling to guide users through rich,
narrative-driven experiences… This approach turns ordinary scrolling into an engaging journey."

The distinction that matters: **scrollytelling is stepped, not continuous.** A pinned scene has one
timeline from 0 to 1. Scrollytelling has *n* discrete states with an authored transition between
each. That is why it needs a step library rather than a scrub.

## The three layouts

| Layout | Structure | Best for |
|---|---|---|
| **Side by side** | sticky graphic left, text column right | charts, data, anything needing a caption |
| **Overlay** | full-screen sticky graphic, text floats on top | photography, immersive/emotional pieces |
| **Stepper** | graphic swaps entirely per step | maps, before/after comparisons |

## Implementation — Scrollama

Scrollama is the newsroom standard (ProPublica, The Pudding, WaPo, WSJ, Politico, Vox all ship it).
It uses IntersectionObserver rather than scroll events, which is why it stays smooth.

```html
<section class="scrolly">
  <figure class="sticky-graphic"><!-- chart / map / canvas --></figure>
  <div class="steps">
    <div class="step" data-step="1">First beat of the story.</div>
    <div class="step" data-step="2">Second beat — the graphic changes here.</div>
    <div class="step" data-step="3">Third beat.</div>
  </div>
</section>
```

```css
.sticky-graphic{ position: sticky; top: 0; height: 100vh }
.step{ min-height: 90vh }        /* NOT 90vh on mobile — see gotchas */
```

```js
const scroller = scrollama();
scroller
  .setup({ step: '.step', offset: 0.5, progress: true })
  .onStepEnter(({ element, index, direction }) => render(index))
  .onStepProgress(({ index, progress }) => tween(index, progress));
```

Key API surface:

- **`offset`** (default `0.5`) — how far down the viewport the trigger line sits, `0`–`1`, or a
  pixel string like `"200px"`.
- **`progress: true`** — adds `onStepProgress` with a 0–1 value, which is how you get scrubbed
  transitions *between* discrete steps.
- **`data-offset="0.25"`** on an individual step overrides the global offset.
- **`once`**, **`enable()`/`disable()`**, **`destroy()`** for lifecycle.

Since v2 Scrollama **deprecated its own container/graphic callbacks in favour of
`position: sticky`** — do not look for `onContainerEnter`, it is gone. Since v3, `order` is gone too,
and resize is handled internally by ResizeObserver.

## Gotchas

- **Scrollama's own top tip:** *"Avoid using viewport height (vh) in your CSS because scrolling up
  and down constantly triggers vh to change, which will also trigger a window resize."* On mobile
  browsers the URL bar collapsing changes `vh`, which fires a resize, which recalculates every step.
  Use `px` or `dvh` for step heights on mobile — Scrollama ships a "Mobile Pattern" example for
  exactly this.
- **The IntersectionObserver polyfill was removed in v1.4.0.** You add it yourself if you need old
  browsers. In 2026 you almost certainly do not.
- **First and last step need breathing room.** A step that is already past the trigger line on page
  load never fires `onStepEnter`.

## Cost

Medium, and mostly not the scroll library's fault. Scrollama itself is tiny and event-free. The cost
is whatever renders in the sticky graphic — a D3 redraw, a canvas repaint, a WebGL scene. Budget
there, not here.

## Accessibility

The strongest technique in this folder on accessibility grounds, because **the text is real text in
the DOM, in reading order.** A screen-reader user gets the whole narrative by reading the steps; the
graphic is an enhancement.

That only holds if you build it that way:

- Steps must be real content, not empty spacer `<div>`s with `data-step` attributes. If the
  narrative lives only in JS, the story is inaccessible.
- Give the sticky graphic a meaningful `alt`/`aria-label` per state, or mark it
  `aria-hidden="true"` if the steps already say everything.
- Under `prefers-reduced-motion`, keep the steps and the graphic but drop the tweening — jump
  between states instead of animating.

## When not to use it

- For marketing copy. Scrollytelling is expensive to build and expensive to read; it earns its place
  when there is an actual sequential argument.
- With fewer than three steps.
- When the "story" is really just a feature list — that is stacking cards.

## Specimen

Not in `../specimens/index.html` — it needs a library and real content to be honest rather than a
toy. The Scrollama examples (Sticky Side-by-Side, Sticky Overlay, Mobile Pattern) are the reference
implementations; see `../sources.md`.
