# Scroll Snap

> The scroller comes to rest on defined positions instead of wherever momentum left it.

**Binding:** none — it is a rest-position rule, not an animation
**Mechanism:** native CSS `scroll-snap-type` · **Cost:** zero · **Risk:** low, if you pick `proximity`

## What it is

Pure CSS. The browser decides where a scroll gesture is allowed to settle. It is not an animation
technique at all, but it shapes every scroll technique it is combined with, so it belongs here.

```css
.rail{
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.rail > *{ scroll-snap-align: center }
```

Vertical full-page snapping is the same property on the other axis:

```css
.deck{ height:100dvh; overflow-y:auto; scroll-snap-type: y mandatory }
.deck > section{ height:100dvh; scroll-snap-align: start }
```

## `mandatory` vs `proximity`

This is the whole decision.

- **`mandatory`** — the scroller *must* land on a snap point. Crisp, deliberate, and dangerous: if a
  section is taller than the viewport, the user can become unable to reach its bottom, because the
  scroller keeps pulling back to the snap point. This is a real, common bug.
- **`proximity`** — the scroller snaps only if it stops near a point. Forgiving, and safe with
  variable-height content.

Use `mandatory` only when every item is guaranteed to fit the viewport. Otherwise `proximity`.

Related properties worth knowing:

| Property | Use |
|---|---|
| `scroll-padding` / `scroll-padding-top` | offset snap positions for a sticky header |
| `scroll-snap-stop: always` | forbid skipping past a snap point in one flick |
| `scroll-margin` | per-item adjustment |
| `overscroll-behavior: contain` | stop a nested scroller from chaining to the page |

## Cost

Zero. It is a browser layout rule, not a script.

## Accessibility

Generally positive — snapping makes carousels land predictably, which helps everyone. Three
failure modes:

- **The unreachable-content bug** described above. Test with content taller than the viewport.
- **`scroll-snap-type: y mandatory` on the document** turns the page into a slide deck. That
  fundamentally changes how the page behaves for keyboard, screen-magnifier and
  find-in-page users. Treat it as scroll-jacking (see `../smooth-scroll.md`).
- **Sticky headers eat snap points.** Fix with `scroll-padding-top: <header height>` rather than by
  nudging margins.

Under reduced motion, snapping itself is fine — it is a rest position, not motion — but full-page
`mandatory` snapping is disorienting enough to be worth relaxing:

```css
@media (prefers-reduced-motion: reduce){
  .deck{ scroll-snap-type: none }
}
```

## Interaction with the smooth-scroll libraries

**Lenis does not support CSS scroll-snap.** Its docs say so plainly under Limitations: *"no support
for CSS scroll-snap, you must use (lenis/snap)."* If your design depends on snapping, that is an
argument against adding Lenis, or an argument for using its own snap plugin instead. Do not expect
both to work together.

## When not to use it

- On long-form reading pages. Snapping fights the reader.
- With `mandatory` and variable-height items — the bug above.
- As a substitute for pagination on a long list.


## Which item is snapped — `scroll-state()`

"Which panel is active" was the single most hand-rolled scroll listener on the web. Chrome 133+
answers it in CSS.

```css
.carousel{ overflow: auto hidden; scroll-snap-type: x mandatory }
.carousel > article{
  container-type: scroll-state;      /* the snap TARGET is the container */
  scroll-snap-align: center;
  @container not scroll-state(snapped: x){ opacity:.25 }
}
```

Three elements are required: the scroll container with `scroll-snap-type`, the target with **both**
`scroll-snap-align` and `container-type: scroll-state`, and a child that carries the query.

Values: `snapped: x | y | inline | block`. Chrome/Edge only; wrap in `@supports`.

Also worth knowing for a snap carousel: **`::scroll-button()` and `::scroll-marker`** (Chrome 135+,
CSS Overflow 5) generate real, stateful, accessible controls — keyboard navigation via focusgroup,
reported to a screen reader as a tablist, no hydration and no CLS. `content: "⬅" / "Scroll Left"`
sets the icon and its accessible name in one declaration.

See `sections/scroll-snap.html` and `captures/platform-scroll-apis-2026.md`.

## Specimen

`../specimens/index.html` → section **06** (`scroll-snap-type: x mandatory` with
`scroll-snap-align: center`).
