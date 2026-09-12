# View Transition

> Motion *between* views rather than within a scrolling page. The one technique here that is not a
> scroll technique at all — which is exactly why it matters.

**Binding:** triggered by navigation or a DOM change · **Mechanism:** View Transition API
**Cost:** very low · **Risk:** low

## What it is

The browser snapshots the old view, snapshots the new one, and animates between them — for a DOM
change inside a page, or across a real navigation between two documents. Everything else in this
folder animates *while* you scroll. This animates *when you arrive*.

It is here because the corpus had a hole. A grep of `research/scroll/` for `view-transition`
returned nothing, while every technique file was written against the 2023 platform. For a scroll
narrative that spans routes, page-to-page motion is the missing half.

## Implementation — same document

```js
document.startViewTransition(() => { updateTheDOM() });
```

Returns a `ViewTransition` with `.ready` and `.finished` promises and `.skipTransition()`.

## Implementation — cross-document, no framework

```css
@view-transition { navigation: auto; }
```

Two lines of CSS give a multi-page site animated navigation. `pagereveal` and `pageswap` events let
the destination and source documents intervene.

## Naming and the pseudo tree

```css
.hero-image { view-transition-name: hero; }
.gallery-item { view-transition-name: match-element; }   /* auto-names list items */
```

```
::view-transition
└── ::view-transition-group(hero)
    └── ::view-transition-image-pair
        ├── ::view-transition-old(hero)
        └── ::view-transition-new(hero)
```

Each is animatable with ordinary CSS. `:active-view-transition` and
`:active-view-transition-type(<type>)` allow conditional styling.

**Every `view-transition-name` must be unique in a document.** Two elements sharing one is the
commonest failure, and it throws rather than degrading.

## Cost

Near zero. The browser is compositing two snapshots it already had. This is cheaper than almost any
JS page-transition library it replaces.

## Accessibility

**Not automatic.** A view transition is page-level motion under `engine.md` §6, so it needs the same
treatment as parallax.

```css
@media (prefers-reduced-motion: reduce){
  *{ view-transition-name: none !important }
}
```

Or branch in JS and update the DOM without a transition:

```js
if (matchMedia('(prefers-reduced-motion: reduce)').matches) updateTheDOM();
else document.startViewTransition(() => updateTheDOM());
```

## When not to use it

- On every navigation. A transition on a link the user follows fifty times becomes friction.
- To disguise a slow load. It animates the *arrival*; it does not make the arrival sooner.
- With a non-unique `view-transition-name` — it throws.

## Style packs

This is the honest answer for the two packs where nearly every scroll technique is ✗:

- **brutalism** — a cross-document transition is not a scroll effect, so the pack's objection to
  scroll polish does not reach it. Keep it to `steps(1)` or no easing at all.
- **neumorphism** — a component style has nothing at page scale to scroll, but it does navigate.

Elsewhere it composes with everything, because it operates on a different axis from every other
entry in this folder. It is the one technique with no ✗ in the matrix and no pack that owns it.

## Support

Same-document is broadly available. Cross-document (`@view-transition`) is Level 2 and newer —
verify before shipping. Both degrade to an ordinary instant navigation, which is the best failure
mode of anything in this folder: **the fallback is simply the web working normally.**

## Specimen

`../sections/view-transition.html` — a live same-document transition, plus the cross-document
snippet.

Sources: `developer.mozilla.org/en-US/docs/Web/API/View_Transition_API` ·
captured in `../captures/platform-scroll-apis-2026.md`.
