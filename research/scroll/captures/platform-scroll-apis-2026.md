# Capture — the scroll platform features this corpus has no entry for

**Sources:** developer.chrome.com/blog/css-scroll-state-queries · developer.chrome.com/blog/carousels-with-css ·
developer.mozilla.org/en-US/docs/Web/API/View_Transition_API ·
developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline · caniuse.com/mdn-css_properties_animation-timeline
**Captured:** 2026-09-04

A grep of `research/scroll/` for these terms returns **nothing**: `view-transition`, `scroll-state`,
`scroll-marker`, `scroll-button`, `content-visibility`, `interpolate-size`. Every technique file was
written against the 2023-era platform — `animation-timeline` plus JavaScript. Three things shipped
since that remove JavaScript from jobs the corpus still routes to JavaScript.

---

## 0. First — a correction to `engine.md` §6's support claim

`engine.md` currently says: *"Chrome shipped the API in 115; Firefox 155+ and Safari 26+ now support
it, ~86% global as of March 2026."*

Checked against caniuse (`mdn-css_properties_animation-timeline`):

| browser | supported from |
|---|---|
| Chrome / Edge | **115** |
| Firefox | **158** (engine.md says 155) |
| Safari / Safari iOS | **26.0** |
| Opera | 101 · Samsung Internet 23 · Chrome & Android Browser 152 |

**Global usage: 87.22%.** Not supported: IE, Opera Mini, KaiOS, UC Browser, QQ Browser.

So the substance holds. Two fixes: Firefox is **158**, not 155, and the figure is 87.22%.

### But MDN says it is *not* Baseline, and both statements are true

> "This feature is not Baseline because it does not work in some of the most widely-used browsers."
> — MDN, `animation-timeline`, marked **Limited availability**

**Usage share and Baseline status measure different things.** Baseline "newly available" requires
support across all core browsers; "widely available" requires that to have held for 30 months.
87% of *sessions* can support a feature while the feature is still Limited by Baseline's definition,
because Baseline counts browsers, not users.

This matters for exactly one reason: **the `@supports` fallback stays mandatory.** `engine.md`
already says so and is right. Nobody should read "87%" and drop it. Record both numbers together, so
a future reader does not "correct" one with the other.

---

## 1. `scroll-state()` container queries — the biggest single gap

**Chrome 133+, January 2025. Chrome/Edge only.** No Firefox, no Safari.

Queries browser-managed scroll state from CSS. Previously all three of these required a JS scroll
listener — the thing `engine.md` §6 bans outright.

```css
.stuck-top {
  container-type: scroll-state;
  position: sticky;
  top: 0;

  > nav {
    transition: box-shadow .3s ease;
    @container scroll-state(stuck: top) {
      box-shadow: 0 4px 12px rgb(0 0 0 / .15);
    }
  }
}
```

Setup is three parts, and the third is the one people get wrong: **the queried element cannot be the
container itself.** Container declares `container-type: scroll-state`; a *child* carries the query.

### The three states

| state | values | what it solves |
|---|---|---|
| `stuck` | `top` `bottom` (also inline/block edges) | "Add a shadow when sticky navigation sticks to indicate it's floating over content" |
| `snapped` | `x` `y` `inline` `block` | "Highlight the center-snapped item in a carousel while dimming others" |
| `scrollable` | `top` `bottom` `left` `right` | "Show scroll shadows or arrow indicators only when scrolling is possible" |

`snapped` needs three elements: the scroll container with `scroll-snap-type`, the snap target with
`scroll-snap-align` **and** `container-type: scroll-state`, and a child that queries.

```css
.carousel {
  overflow: auto hidden;
  scroll-snap-type: x mandatory;

  > article {
    container-type: scroll-state;
    scroll-snap-align: center;

    @container not scroll-state(snapped: x) { opacity: .25; }
  }
}
```

Types combine: `container-type: scroll-state size`.

### Why this is the highest-value item in this file

> "Queries resolve at scroll composition time, providing the earliest hook possible for providing
> visual feedback."

Composition time — not a scroll event, not rAF. That is the same off-main-thread argument
`engine.md` §6 makes for `animation-timeline`, extended to *state* rather than *progress*.

**It lands on three existing technique files:**

* `pinned-scene.md` — "has the sticky element stuck yet" is `stuck: top`, not a JS measurement.
* `scroll-snap.md` — "which item is snapped" is `snapped: x`. This is the single most commonly
  hand-rolled scroll listener on the web.
* `horizontal-scroll.md` — "can this still scroll" is `scrollable: right`, which is how you show a
  fade or arrow honestly instead of always-on.

Chrome-only, so it is strictly progressive enhancement:

```css
@supports (container-type: scroll-state) { /* … */ }
```

And per the source: always wrap motion-based styles in
`@media (prefers-reduced-motion: no-preference)`.

---

## 2. CSS carousel primitives — `::scroll-button()` and `::scroll-marker`

**Chrome 135+ / Edge 135+.** No Firefox, no Safari. Spec: CSS Overflow 5.

Browser-generated, stateful, accessible carousel controls with no JavaScript.

```css
.carousel {
  scroll-marker-group: after;

  &::scroll-button(left)  { content: "⬅" / "Scroll Left"; }
  &::scroll-button(right) { content: "⮕" / "Scroll Right"; }
  &::scroll-button(*):focus-visible { outline-offset: 5px; }

  > li::scroll-marker { content: ' '; }
  > li::scroll-marker:target-current { background: var(--accent); }
}
```

* `::scroll-button(<direction>)` generates a real `<button>` that scrolls **~85% of the scroll area**.
  It is stateful — it disables itself at the ends.
* `::scroll-marker` generates browser-managed anchors — dots, numbers, thumbnails.
  `:target-current` matches the marker for the item in view.
* `scroll-marker-group: before | after` places the generated `::scroll-marker-group` container.

What the browser handles that a JS carousel usually gets wrong, per the source: keyboard navigation
(focusgroup behaviour), screen-reader semantics (**reported as a tablist**), no hydration cost, and
no CLS because sizing resolves at paint.

The `content: "⬅" / "Scroll Left"` syntax is worth noting on its own — the part after the slash is
the accessible name. Most hand-built icon buttons ship without one.

**Where it lands:** `horizontal-scroll.md` and `scroll-snap.md` both currently describe building
this by hand. Also relevant to `bento` and `editorial`, the two packs most likely to want a
horizontal strip.

---

## 3. View Transition API — completely absent from the corpus

The corpus covers motion *within* a scrolling page and has nothing on motion *between* views. For a
scroll narrative that spans routes, that is a real hole.

### Same-document

```js
document.startViewTransition(() => { updateContent() })
```

Returns a `ViewTransition` with `.ready` and `.finished` promises and `.skipTransition()`.

### Cross-document (MPA) — no framework required

```css
@view-transition { navigation: auto; }
```

Plus `pagereveal` / `pageswap` events to intervene from the destination and source documents.

### Naming and the pseudo tree

```css
.hero-image { view-transition-name: hero; }
.gallery-item { view-transition-name: match-element; }  /* auto-names list items */
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

Support: same-document is broadly available; cross-document is Level 2 and newer. Verify before
shipping.

### Reduced motion is not automatic

```css
@media (prefers-reduced-motion: reduce) {
  *{ view-transition-name: none !important; }
}
```

Or branch in JS and update the DOM without a transition. **A view transition is page-level motion
under `engine.md` §6's rule, so it needs the same treatment as parallax.**

**Where it lands:** a new `techniques/view-transition.md`, and a row in `compatibility.md`. It is
also the honest answer for packs where nearly every scroll technique is ✗ — `brutalism` and
`neumorphism` — because a cross-document transition is not a scroll effect at all.

---

## 4. Smaller items, recorded for completeness

* **`content-visibility: auto`** — skips rendering work for offscreen content. Directly relevant to
  every long scroll page in this corpus; not mentioned anywhere. Pairs with
  `contain-intrinsic-size` to avoid scrollbar jumping.
* **`interpolate-size: allow-keywords` / `calc-size()`** — animating to and from `auto` height.
  Removes the classic max-height hack. Absent from the corpus.
* **`::column`** — pseudo-element for CSS multi-column fragments, part of the same Chrome carousel
  work. Relevant to `editorial`, which is the one pack built on `columns`.

---

## Summary of what this changes

| file | change |
|---|---|
| `engine.md` §6 | Firefox 155 → **158**; 86% → **87.22%**; add the Baseline-vs-usage distinction |
| `techniques/pinned-scene.md` | `stuck: top` replaces JS stick detection |
| `techniques/scroll-snap.md` | `snapped: x` replaces the hand-rolled active-item listener |
| `techniques/horizontal-scroll.md` | `scrollable: <edge>` for honest affordances; `::scroll-button` / `::scroll-marker` replace the JS carousel |
| **new** `techniques/view-transition.md` | page-to-page motion — the corpus has no entry |
| `compatibility.md` | new row for view transitions; note that it is available to packs where scroll techniques are mostly ✗ |

Every item here except View Transitions is **Chrome-only today**. All are progressive enhancement
behind `@supports`, never a baseline dependency.
