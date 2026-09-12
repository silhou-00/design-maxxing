# Capture — canonical sources for the style packs

**Captured:** 2026-09-04

**Why this file exists.** Nine of the twelve packs cite only trend listicles — Tilda, Looka,
UX Planet, dev.to. Only `glassmorphism` (css.glass), `neo-brutalism` (neobrutalism.dev) and
`neumorphism` (neumorphism.io) reach a canonical source. `skeuomorphism` has no reference images at
all.

That is a problem for one specific reason: `ROUTER.md` argues that the packs are mutually exclusive
*by historical descent* — "Bauhaus reacts against Art Nouveau; flat replaces skeuomorphism;
neumorphism and glassmorphism are flat re-softened." That argument is load-bearing (it is why
blending is banned) and it was sourced entirely from secondary trend articles. This file puts
primary and authoritative sources behind it.

**Sources below, in order:** developer.apple.com/design/human-interface-guidelines/materials ·
vitsoe.com/us/about/good-design · en.wikipedia.org/wiki/International_Typographic_Style ·
github.com/rough-stuff/rough/wiki + roughjs.com · nngroup.com/articles/flat-design ·
en.wikipedia.org/wiki/Flat_design · brutalistwebsites.com · baymard.com/blog/line-length-readability

---

## 1. Apple Liquid Glass — the authoritative source `glassmorphism` was missing

Apple HIG *Materials*. Change log: **Liquid Glass guidance added 2025-06-09, updated 2025-09-11.**
This supersedes `css.glass` as the pack's primary source — css.glass is a CSS generator, this is a
platform design language with stated rules.

### The rule that contradicts common practice

> "**Don't use Liquid Glass in the content layer.** … including it in the content layer can result
> in unnecessary complexity and a confusing visual hierarchy."

Glass is for the **functional layer** — controls and navigation (tab bars, sidebars) that float
*above* content. Not for content cards. Most glassmorphism on the web, and the current
`glassmorphism/style.md` specimen, puts glass on content panels. Apple's position is that this is
the wrong layer.

Stated exception: a transient interactive element in the content layer — a slider or toggle —
"takes on a Liquid Glass appearance to emphasize its interactivity when a person activates it."

> "**Use Liquid Glass effects sparingly.** … overusing this material in multiple custom controls can
> provide a subpar user experience by distracting from that content."

This independently confirms the note already in `ROUTER.md` Gate 3.5 — *"one glass panel per view"*
— which was written from FPS reasoning. Apple reaches the same rule from hierarchy reasoning.

### Two variants, with the selection rule

| variant | behaviour | use when |
|---|---|---|
| **regular** | "blurs and adjusts the luminosity of background content to maintain legibility" | background may create legibility issues, or the component carries significant text — alerts, sidebars, popovers. **Most system components use this.** |
| **clear** | "highly translucent … prioritizing the visibility of the underlying content" | components floating over media — photos, video |

### The one hard number

> "If the underlying content is bright, consider adding a **dark dimming layer of 35% opacity**."

Not needed if the underlying content is already sufficiently dark, or if the platform's own media
controls supply their own dimming. This is the kind of traceable value CLAUDE.md asks for, and the
pack currently has nothing equivalent.

### Standard materials — a thickness scale

Four steps: `ultraThin` · `thin` · `regular` (default) · `thick`.

> "Thicker materials, which are more opaque, can provide better contrast for text and other elements
> with fine features. Thinner materials, which are more translucent, can help people retain their
> context."

### Vibrancy — the legibility mechanism

Text on a material must use system vibrant colors, not fixed ones. Four levels, highest contrast
first: `label` → `secondaryLabel` → `tertiaryLabel` → `quaternaryLabel`.

> "avoid using quaternary on top of the thin and ultraThin materials, because the contrast is too
> low."

And the reason it matters for any web port:

> "Avoid selecting a material or effect based on the apparent color it imparts to your interface,
> because **system settings can change its appearance and behavior**."

The web equivalent: `backdrop-filter` output depends on whatever is behind it, so a glass panel's
effective text contrast is not knowable from the CSS alone. Both variants also change under reduced
transparency and increased contrast accessibility settings. **A glass pack needs a contrast floor
that holds against the worst-case backdrop, not against the demo backdrop.**

---

## 2. Dieter Rams — the source under `minimalism` and `modernism`

Vitsœ, *Ten principles for good design*. Written late 1970s, after Rams asked himself
"is my design good design?"

Licence note: Vitsœ states these "can be shared accurately and fairly under the **Creative Commons
CC-BY-NC-ND 4.0** licence." Attribute, don't alter, non-commercial.

The ten, as titled:

1. Good design is innovative
2. Good design makes a product useful
3. Good design is aesthetic
4. Good design makes a product understandable
5. Good design is unobtrusive
6. Good design is honest
7. Good design is long-lasting
8. Good design is thorough down to the last detail
9. Good design is environmentally-friendly
10. **Good design is as little design as possible** — "Less, but better"

### Which packs this actually supports

**#10 is `minimalism`'s thesis**, and the pack currently asserts it ("Fewest elements; each one
justified") without a source. Rams is the source.

**#5, unobtrusive** — "neither decorative objects nor works of art … neutral and restrained, to leave
room for the user's self-expression." This is the argument behind minimalism's ban on decoration,
and it is a *functional* argument, not a taste one.

**#4, understandable** — "At best, it is self-explanatory." Note this is the same claim
`skeuomorphism/style.md` makes for itself ("imitates real materials so the control explains
itself"). Two packs that ban each other's methods share one goal. Worth stating in both, because it
explains *why* the blend ban is about method, not intent.

**#6, honest** — "does not make a product more innovative, powerful or valuable than it really is."
Reads directly onto engine.md's anti-slop section.

**#7, long-lasting** — "avoids being fashionable and therefore never appears antiquated." This is
the counterweight to the maturity notes in `bento` ("no longer surprising or experimental") and is
worth quoting whenever a brief picks a pack for novelty.

---

## 3. International Typographic Style — the source under `swiss`, `modernism`, `editorial`

| | |
|---|---|
| **Ernst Keller** | Kunstgewerbeschule Zürich, from 1918. Design solutions should emerge from *content* |
| **Josef Müller-Brockmann** | sought an "absolute and universal form of graphic expression through objective and impersonal presentation" |
| **Max Bill, Théo Ballmer** | early pioneers |
| **Max Miedinger & Edouard Hoffmann** | Helvetica |
| **Rudolph de Harak** | first major American adopter |

Dates: Basel School of Design modified its foundational course around grid-work in **1908**; the
style emerged **1920s–30s**; flourished internationally **1950s–60s**; *New Graphic Design* journal
launched **1959**.

Formal elements, as documented:

* **Grid** — "the most legible and harmonious means for structuring information"
* **Sans-serif** — Helvetica, Univers, Akzidenz-Grotesk
* **Flush left, ragged right**
* **Asymmetric** composition
* **Photography over illustration**, as "objective symbols"

Canonical texts: Müller-Brockmann, *Grid Systems in Graphic Design*; Meggs, *History of Graphic
Design*; Hollis, *Swiss Graphic Design* (2006).

`swiss/style.md` currently cites Looka §6, Tilda and UX Planet §49 for all of this. The three books
above are what those articles are summarising.

**Note the `photography over illustration` rule.** That is a hard content constraint on the pack and
it interacts directly with `ROUTER.md` Gate 2.5 — a Swiss surface should never resolve a real-world
subject as an illustration or a CSS drawing. Currently unstated in the pack.

---

## 4. Rough.js — the canonical implementation under `hand-drawn`

MIT, "less than 9kB gzipped", Canvas and SVG. This is to `hand-drawn` what `neumorphism.io` is to
`neumorphism`: the implementation everyone is actually copying.

**Defaults, from the project wiki** — the pack currently ships no numbers at all:

| option | default |
|---|---|
| `roughness` | **1** |
| `bowing` | **1** |
| `seed` | 0 (none — new randomness each render) |
| `stroke` | `#000000` |
| `strokeWidth` | 1 |
| `fillStyle` | `hachure` |
| `fillWeight` | half the `strokeWidth` |
| `hachureAngle` | **−41°** |
| `hachureGap` | four times the `strokeWidth` |
| `curveStepCount` | 9 |
| `curveFitting` | 0.95 |
| `simplification` | 0 |
| `dashOffset` / `dashGap` / `zigzagOffset` | default to `hachureGap` |
| `preserveVertices` | false |
| `disableMultiStroke` | false |

`fillStyle` values: `hachure`, `solid`, `zigzag`, `cross-hatch`, `dots`, `sunburst`, `dashed`,
`zigzag-line`.

Two of these are design decisions worth lifting into the pack:

* **`hachureAngle: -41`** — not −45. Off the diagonal on purpose; a true 45° reads as a machine
  pattern rather than a hand one. Same family of reasoning as the pack's existing "grid it, then
  knock everything out of true".
* **`seed: 0` means re-randomising on every render.** For a UI this is a bug, not a feature — a
  button that redraws differently on hover is noise. **Set a fixed seed per element.** This belongs
  in the pack's Gotchas; it is the hand-drawn equivalent of bento's nested-radius mistake.

---

## 5. Flat, skeuomorphism, and the descent chain — now with dates

### The lineage, sourced

| year | event |
|---|---|
| 1950s–60s | International Typographic Style — the acknowledged ancestor of flat |
| **2010** | **Microsoft Metro**, Windows Phone 7. "large and bright shapes … sans-serif typography from the Segoe font family, flat images, and a menu with a grid-like pattern" |
| **2013** | **iOS 7** — Apple abandons skeuomorphism. "brighter colors, typography, as well as blurred, translucent overlays" |
| **2014** | **Google Material Design**, Android 5.0 Lollipop. "index card-like sheets and the use of shadows to promote depth and hierarchy" |
| mid-2020s | glassmorphism displaces flat aesthetically |
| **2025** | Apple Liquid Glass (§1 above) |

Contemporary framing, documented: Google's Matias Duarte considered iOS "too skeuomorphic", while
Windows Phone resembled "airport lavatory signage."

Note the loop this closes: **iOS 7's flat included "blurred, translucent overlays" from the start.**
Glassmorphism is not a reaction against flat — it is a component of flat that grew. And Liquid Glass
returns to a stated depth hierarchy 12 years later. Worth recording in both packs; it is more
accurate than "flat re-softened."

### NN/g — the usability argument, and the one that matters for `audit.mjs`

Nielsen Norman Group, *Flat Design: Its Origins, Its Problems, and Why Flat 2.0 Is Better for Users*.

> flat design "tends to sacrifice users' needs for the sake of trendy aesthetics"

> "long-term exposure to these flat yet clickable elements has been slowly **reducing user
> efficiency** by complicating their understanding of what's clickable and what isn't."

Users read clickability from three kinds of clue:

1. **Traditional signifiers** — blue underlined text, raised buttons
2. **Reminiscent** — underlined text in any colour, boxed content
3. **Contextual** — actionable wording, placement conventions

**Flat 2.0** is their prescription: "mostly flat, but it makes use of subtle shadows, highlights, and
layers to create some depth." Material Design is the worked example.

**This is a direct conflict with `flat/style.md`, which bans shadows outright** — and `audit.mjs`
enforces that ban mechanically (`flat: { 'shadows': countShadow, 'gradients': countGradient }`).

The conflict is real and should be recorded rather than resolved by preference. The pack's ban is
correct *as a style definition*; NN/g's finding is correct *as a usability outcome*. The reconciling
rule is that a flat surface must carry clickability in **type, colour, contrast and wording** —
because it has given up the other two channels. That is a content rule, and it belongs in the pack.

NN/g publish no specific timing or eye-tracking numbers in this article. Do not invent any.

---

## 6. Brutalist Websites — the registry under `brutalism`

brutalistwebsites.com, a curated gallery. Its own characterisation:

> "In its ruggedness and lack of concern to look comfortable or easy, Brutalism can be seen as a
> reaction by a younger generation to the lightness, optimism, and frivolity of today's web design."

The site carries no manifesto, no author statement and no account of the term's relation to
architectural brutalism. **It is a specimen source, not a definition source** — useful for `refs/`,
not for the pack's opening definition. The pack's existing Looka/Tilda/UX Planet citations remain
the definitional ones.

---

## 7. Line length — the cross-cutting content rule

From Baymard, plus the standard it cites.

* **WCAG 2.x SC 1.4.8 (Visual Presentation): 80 characters or fewer** per line — 40 for Chinese,
  Japanese, Korean. This is an accessibility standard, not a preference.
* **Emil Ruder: 50–60 characters** including spaces, is optimal for body text. (Ruder is a Basel
  School figure — this rule and the `swiss` pack come from the same place.)
* Working range in practice: **50–75**.

Failure modes, both directions:

| too wide (>80) | too narrow (<50) |
|---|---|
| eyes struggle to find the start of the next line | eyes travel back too often, rhythm breaks |
| line-skipping in long blocks | reader stress |
| 100+ chars causes fatigue; "intimidating and overwhelming" | words skipped by starting the next line early |

Implementation: `max-width` in font-relative units, ~`70ch`. Mobile portrait rarely violates this;
**landscape does**, and that is the case to check.

### Where this lands in this folder

Only two of the twelve packs state a measure today — `editorial` (`58–70ch`, `34–44ch` per column)
and `minimalism` (`34–70ch`). Both sit inside the 50–75 window at the top end; minimalism's `34ch`
is deliberately below it, and that is defensible for a short pull-quote but not for body copy.

`engine/audit.mjs` already enforces copy volume globally — `charsPerViewportMax: 420`,
`largestBlockMax: 320` — but has **no measure check at all**, and no per-pack override. An 80-char
ceiling is mechanically checkable from `getComputedStyle` width and font metrics, and it is the one
content rule with a formal standard behind it rather than a house preference.
