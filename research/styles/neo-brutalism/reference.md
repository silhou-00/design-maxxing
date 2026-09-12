# Neo-Brutalism — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**UX Planet §50, Neo-Brutalism** — "A cleaner, more structured evolution of classic Brutalism. It
retains raw honesty but adds better UI practices — useful in digital products that want to be bold
yet functional." Core elements: "Bold colors, large type, stark layouts, minimal UI components,
purposeful asymmetry." Mood: "Confident, bold, raw-yet-usable. Ideal for design portfolios, creative
agency sites, or digital magazines."

**neobrutalism.dev** — "Neobrutalism is a mix of regular brutalism in web design and more modern
typography, illustration, and animation standards. Neobrutalism refuses the usual components of
UX-UI design and embraces uncomfortable design elements, and it is more fearless to use distinctive
color palettes."

**Tilda** — "A more refined version, known as neobrutalism, tones it down slightly while preserving
the rebellious vibe."

**dev.to §4** — "A modern revival of traditional brutalism — bold, raw, unapologetic." Strong
borders · high contrast · minimal gradients · uncomfortable on purpose. Used for "portfolios, agency
websites, creative brands."

## Where the numbers came from

Every value in `tokens.json` was read out of the live theme at `neobrutalism.dev/styling` using
`getComputedStyle`, not sampled from a screenshot or reconstructed by eye.

Measured off a rendered button on that page:

```
background-color : oklch(1 0 0)          /* white */
border           : 2px solid oklch(0 0 0)
border-radius    : 5px
box-shadow       : oklch(0 0 0) 4px 4px 0px 0px
font-weight      : 500
color            : oklch(0 0 0)
```

The theme ships `--box-shadow-x/y` **and** `--reverse-box-shadow-x/y` as separate tokens. That is
the upstream author saying shadow direction is a global decision, not a per-component one — which is
where the "shadow direction must be globally consistent" gotcha comes from.

## Decisions made here, not upstream

These are not in any source. They were derived when the module set was specified, and they are
recorded so a later reader does not mistake them for measured values.

**Every numeric claim below is now verified, not asserted.** `modules.html` measures itself on load
— rendered box sizes, real font metrics, computed colours — and prints the result in its
**Self-audit** section. Open that page rather than trusting this table; if the two ever disagree,
the page is right and this file has drifted.

Measured on 2026-09-05, viewport 1400×900:

| check | measured | required | |
|---|---|---|---|
| Smallest control (2.5.8) | 32 × 32px — the modal close button | 24 × 24 | pass |
| Focus ring area (2.4.13) | 829.04px² on an 80.42 × 39.76 control | 480.69px² (`4h+4w`) | pass, 72% headroom |
| Button label on fill (1.4.3) | 6.50:1 | 4.5:1 | pass |
| Control border on its ground (1.4.11) | 21.00:1 | 3:1 | pass |
| Longest wrapping measure (1.4.8) | 60ch | ≤ 80ch | pass |
| Hero headline | 5 words | ≤ 6 | pass |
| Hero sub | 23 words | ≤ 25 | pass |
| Card gap in a grid | 17.99px | ≥ 8px | pass |
| Page padding | 20px | ≥ 16px | pass |
| This sheet's own commentary | 78ch | ≤ 80ch | pass |

Two of those numbers only exist because the audit was written: the focus-ring **area** was asserted
as "~720px²" from a hand calculation and is actually **829.04px²** on the real control, and the
smallest control was assumed to be a text button when it is in fact the modal close button.

| decision | why |
|---|---|
| Focus = white gap + black ring | the resting border is already black, so a black ring is a 0-pixel change and fails WCAG 2.4.13's focused-vs-unfocused 3:1 test. An accent ring fails too, though not for the obvious reason: accent on *white* is 3.23:1 and passes, but the ring is drawn in pixels that were **page tint** `#dfe5f2`, where it measures only **2.37:1**. 2.4.13 measures the change in the pixels the indicator occupies |
| Disabled removes the shadow | the shadow is the raise and the raise is the affordance. Opacity fades are banned by the pack; WCAG 1.4.11 exempts disabled from contrast |
| Inputs carry no resting shadow | an input is a well, not a raised object. Without this every form looks like a pile of identical bricks |
| Sticky nav uses `0 4px` not `4px 4px` | a full-bleed bar has no right edge to cast from; a 4px x-offset clips at the viewport |
| Empty state is dashed, shadowless | the absent shadow says "no object here yet" in the pack's own vocabulary; dashed reads as a slot |
| Dark mode inverts border and shadow to white | a black border on a dark ground erases every affordance simultaneously. White is not grey, so "black or nothing" is not violated |
| Headline ≤6 words | engine §5 says 8; the display type here is large enough that 8 wraps to four lines |
| Error red is the second hue | the pack allows two accents per view. An error colour spends the budget — there is no third |

## Reference images

- `refs/neobrutalism-dev-styling.jpg` — the live component sheet: cards, accordions, buttons,
  command palette, all sharing the 2px/4px/5px system
- `refs/uxplanet-neo-brutalism.png` — UX Planet §50 plate: four poster-style layouts in bold flat
  colour with hard shadows
- `research/specimens/index.html` → tile **05 neo-brutalism** (hover a button to see the
  shadow-collapse)
- `modules.html` — the full module set, all states, dark mode, narrow width

## Related

- `../brutalism/style.md` — the parent. The difference is the system: brutalism has no shared
  numbers, this pack has four
- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack is the **best all-round scroll fit** of the twelve;
  it is built from `transform` and hard shadows, which composite cheaply

Sources: neobrutalism.dev (theme tokens read from the live page; definition) · UX Planet §50 ·
Tilda · dev.to §4 · own implementation.
