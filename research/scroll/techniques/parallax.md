# Parallax

> Layers move at different rates so the page reads as having depth.

**Binding:** scrubbed · **Mechanism:** CSS `view()` timeline, or transform-on-scroll in JS
**Cost:** low if transform-only · **Risk:** high — this is the one WCAG names by name

## What it is

Background elements move slower than foreground elements as you scroll, producing an illusion of
depth. SVGator's FAQ defines it plainly: "background elements move slower than foreground elements
as you scroll down the page, creating an illusion of depth and dimension… commonly used in
storytelling websites, landing pages, and portfolio sites."

The oldest scroll effect still in use, and the most abused.

## Implementation — CSS native

```css
.parallax{ height:56vh; overflow:hidden; position:relative }

@keyframes drift-slow{ from{ transform:translateY(-8%) }  to{ transform:translateY(8%) } }
@keyframes drift-fast{ from{ transform:translateY(-26%) } to{ transform:translateY(26%) } }

.parallax .layer{
  position:absolute; inset:-30% 0;         /* overscan, or you see the edges */
  animation-timeline: view();
  animation-timing-function: linear;
  animation-fill-mode: both;
}
.parallax .back { animation-name: drift-slow }
.parallax .front{ animation-name: drift-fast }
```

Two rules that make or break it:

1. **Overscan the layers.** `inset: -30% 0` gives the translation somewhere to go. Without it the
   layer's edge slides into view and the illusion dies.
2. **Both layers share one timeline.** Different `translate` distances, identical range. Any drift
   between the timelines shows up as the layers "swimming".

Never use `background-attachment: fixed`. It is the old way, it forces repaints, and it is broken
on iOS.

## Implementation — JS

```js
gsap.to('.layer-back', {
  yPercent: -20, ease: 'none',
  scrollTrigger: { trigger: '.parallax', start:'top bottom', end:'bottom top', scrub: true }
});
```

`scrub: true` binds progress to the scrollbar. `scrub: 1` adds a one-second catch-up, which is what
gives commercial parallax its liquid feel — and also what makes it feel disconnected from the input
device if you push it past ~1.5.

## Cost

Cheap *if* you animate `transform` only. Parallax implemented with `top`, `background-position`, or
`margin` repaints every frame and is a classic jank source. Layer count matters more than layer
size: three composited layers are fine, twelve are not.

## Accessibility — read this before shipping it

WCAG 2.2, **Understanding SC 2.3.3 (Animation from Interactions)**, names this technique explicitly:

> "Another animation that is often non-essential is parallax scrolling. Parallax scrolling occurs
> when backgrounds move at a different rate to foregrounds."

And on the harm:

> "The impact of animation on people with vestibular disorders can be quite severe. Triggered
> reactions include nausea, migraine headaches, and potentially needing bed rest to recover."

The criterion offers three sufficient remedies; you need **one**:

1. Avoid unnecessary animation.
2. Provide an in-page control to turn non-essential animation off.
3. Honour the OS reduce-motion preference.

Option 3 is one media query. There is no excuse for skipping it:

```css
@media (prefers-reduced-motion: reduce){
  .parallax .layer{ animation:none; transform:none }
}
```

Note the criterion is **Level AAA**, so parallax without a reduced-motion path does not fail AA
conformance. That is a compliance fact, not a defence — the vestibular harm is real at any
conformance level.

## When not to use it

- Behind text the user must read.
- On mobile. Small viewports give the parallax almost no travel, so you pay the cost for an effect
  nobody perceives.
- Anywhere the "depth" contradicts the style. Flat design and Swiss style are *about* the absence of
  illusory depth — see `../compatibility.md`.
- More than once per page.

## Specimen

`../specimens/index.html` → section **03**.
