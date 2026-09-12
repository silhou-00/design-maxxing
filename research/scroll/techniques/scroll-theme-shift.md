# Scroll-Driven Theme Shift

> The page's colour changes as you move through it — background, text, accents — bound to scroll
> position rather than to a click.

**Binding:** scrubbed · **Mechanism:** `view()` or `scroll()` timeline animating colour tokens
**Cost:** low · **Risk:** medium — it is the easiest way to silently break contrast

## What it is

Section-to-section colour transitions driven by scroll. Two flavours:

- **Continuous** — one long gradient of colour across the whole page, scrubbed.
- **Sectional** — each section owns a colour and the transition happens as it enters.

Tilda's brand-story examples and most agency sites use the sectional version, because it aligns the
colour change with a content boundary rather than with an arbitrary scroll offset.

## Implementation — CSS native

```css
@keyframes hue-shift{
  from{ background-color:#2a1030 }
  50% { background-color:#0f2c33 }
  to  { background-color:#31240d }
}
.theme-shift{
  animation: hue-shift auto linear both;
  animation-timeline: view();
  animation-range: cover 0% cover 100%;
}
```

The better architecture animates **custom properties**, so every token moves together:

```css
@property --bg{ syntax:'<color>'; inherits:true; initial-value:#0c0c0f }
@property --fg{ syntax:'<color>'; inherits:true; initial-value:#e8e8ea }

@keyframes theme{
  from{ --bg:#0c0c0f; --fg:#e8e8ea }
  to  { --bg:#f4f1ea; --fg:#141414 }
}
body{
  background:var(--bg); color:var(--fg);
  animation: theme auto linear both;
  animation-timeline: --page;
  animation-range: 0 100%;
}
```

`@property` with an explicit `syntax` is what makes a custom property interpolatable — without the
registration, `--bg` is just a string and jumps rather than transitions.

## Cost

Low. `background-color` animates on the compositor in modern engines, and custom-property
interpolation is cheap at this scale. Do not animate `box-shadow` or `border-color` on many elements
at once; those repaint.

## Accessibility — the real risk

**This is the one effect in the folder that can silently destroy text contrast.** Your text colour
is fixed, your background is moving, and there is some scroll position where the two are closest. It
is easy to check the start and end states, pass both, and ship a page that fails WCAG 1.4.3
somewhere in the middle.

Rules:

1. **Check every keyframe stop, not just `from` and `to`.** Then check the midpoints between them —
   interpolating between two dark colours can pass through a light one in some colour spaces.
2. **Animate foreground and background together** so the pair stays locked. That is the argument for
   the `@property` version above.
3. **Interpolate in `oklch`** where you can. RGB interpolation between distant hues passes through
   muddy, unpredictable luminance; OKLCH keeps perceptual lightness controlled.
4. If the shift crosses light and dark, remember `color-scheme`, form controls, focus rings, and
   scrollbars — they do not animate with your tokens.

Under reduced motion, a colour crossfade is much less of a vestibular problem than movement, but
the safe default is to pick one theme and hold it:

```css
@media (prefers-reduced-motion: reduce){
  .theme-shift{ animation:none }
}
```

## When not to use it

- On pages with a lot of imagery — the photographs stop sitting on a consistent ground.
- When the brand has one background colour. This effect spends brand consistency to buy novelty.
- Across a section containing a form, a table, or a code block, where readability is the priority.

## Specimen

`../specimens/index.html` → section **10** (three stops across `cover`).
