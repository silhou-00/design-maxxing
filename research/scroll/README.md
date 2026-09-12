# research/scroll

## What is here

| | |
|---|---|
| `techniques/<name>.md` | **16** technique docs — the spec for each |
| `sections/<name>.html` | **16 live, scrollable demonstrations**, each self-auditing against `engine.md` §6 |
| `sections/_selftest.html` | deliberately broken; proves the auditor catches violations |
| `specimens/index.html` | the flat overview sheet, and the launcher for all 16 sections |
| `compatibility.md` | scenario guide — where each technique serves each style, and what it spends |
| `libraries.md` | the library layer — Motion, Anime.js, GSAP, sizes and licences |
| `authoring-tools.md` | where the motion *asset* comes from — Jitter, Lottie, Rive, Threlte |
| `assets/` | real generated frame sequences for video-scrub and scroll-world |
| `captures/` | verbatim source material |
| `_shared/` | `audit.js`, `sheet.css`, `build-sections.mjs` |

**The sections are the working artifact.** Each one demonstrates its technique for real, and each
runs a self-audit against `engine/engine.md` §6 — composite-only properties, no window scroll
listener, the mandatory `@supports` fallback, a `prefers-reduced-motion` collapse, and whether the
timeline actually resolves. Those were prose that nothing enforced.

Rebuild any section from its spec:

```
node _shared/build-sections.mjs <technique>   # or --all
```

**Fourteen of the sixteen need no JavaScript at all** — including the 48-frame video scrub, which
turned out not to need it because a frame sequence has no `currentTime` to set.


Scroll-animation research for the design-maxxing catalogue. 16 techniques, 11 sources, and a
scenario guide for pairing them with the 12 styles in `../styles/`.

Built 2026-09-03; techniques 16 (`view-transition`), the live sections and the library/authoring
reference added 2026-09-05. Nothing outside this folder was touched.

## What's here

```
scroll/
  README.md            this file
  compatibility.md     scenario guide: per style, where scroll serves it and what a
                       technique spends against the pack's own bans. Not a permission table
  sources.md           11 sources, findings, method notes, gaps
  libraries.md         native CSS · Motion · Anime.js · GSAP — sizes, licences. Reference,
                       not routing: engine.md §6 still decides
  authoring-tools.md   where the motion ASSET comes from — Jitter, Lottie, Rive, Threlte
  specimens/
    states.html        START / MID / END of 14 techniques, frozen. Read this first
    state-sheet.jpg      rendered screenshot of it
    index.html         the flat overview AND the launcher for all 16 sections.
                       No screenshot: a still of scroll-driven demos only ever
                       catches their start state. state-sheet.jpg is the flat
                       image, and it freezes start/mid/end on purpose
  sections/            NEVER READ — browser only. One live, scrollable page per
                       technique, each self-auditing against engine.md §6
    _selftest.html     deliberately broken; proves the auditor catches violations
  assets/              real generated frame sequences (scrub 48, world 40)
  techniques/          one flat .md per technique
  _shared/             build-sections.mjs · audit.js · sheet.css
  captures/            verbatim source captures
```

**Everything rendered is generated.** `sections.json` is the source; edit it and rebuild:

```
node _shared/build-sections.mjs --all
```

## Start here

**`specimens/states.html`** — the reference to read first. Start / mid / end of fourteen techniques
side by side, static, each with the exact CSS and range that produces it. A live technique only ever
shows one moment of itself, which is why picking one from a live page was guesswork.

Two of the sixteen are not on that sheet and cannot be: `smooth-scroll` changes the *feel* of
scrolling rather than what anything looks like at a scroll position, and `view-transition` animates
on navigation rather than on scroll. Both are live in `sections/`.

**`specimens/index.html`** — the flat overview of ten techniques, and the launcher for all sixteen
live sections. Serve it:

```
cd research/scroll/specimens && python -m http.server 8766
```

Every technique in it was verified rendering in Chrome 152. It also carries a
`prefers-reduced-motion` block and a `@supports not (animation-timeline: scroll())` fallback, both
of which are part of the deliverable rather than decoration.

## The 16 techniques

| Technique | Binding | Cost | Risk |
|---|---|---|---|
| [scroll-reveal](techniques/scroll-reveal.md) | triggered or scrubbed | very low | low |
| [scroll-progress](techniques/scroll-progress.md) | scrubbed | ~zero | none |
| [parallax](techniques/parallax.md) | scrubbed | low | **high** |
| [pinned-scene](techniques/pinned-scene.md) | scrubbed | medium | medium |
| [stacking-cards](techniques/stacking-cards.md) | scrubbed | low | low |
| [scrollytelling](techniques/scrollytelling.md) | stepped | medium | medium |
| [horizontal-scroll](techniques/horizontal-scroll.md) | scrubbed | low / medium | low / **high** |
| [scroll-snap](techniques/scroll-snap.md) | n/a | zero | low |
| [smooth-scroll](techniques/smooth-scroll.md) | modifier | medium, page-wide | **highest** |
| [video-scrub](techniques/video-scrub.md) | scrubbed | **highest** | high |
| [scroll-world](techniques/scroll-world.md) | scrubbed | highest + **cash** | high |
| [text-reveal](techniques/text-reveal.md) | either | low–high | medium |
| [svg-path-draw](techniques/svg-path-draw.md) | scrubbed | low–medium | low |
| [scroll-theme-shift](techniques/scroll-theme-shift.md) | scrubbed | low | medium |
| [scroll-marquee](techniques/scroll-marquee.md) | scrubbed | very low | low |
| [view-transition](techniques/view-transition.md) | on navigation | very low | low |

`view-transition` is the sixteenth and the odd one: it animates on arrival, not while you scroll, so
no pack's scroll rules reach it. That makes it the honest page-level choice for `brutalism` and
`neumorphism`, where most scroll polish fights the pack.

Each file follows the same schema: what it is → CSS implementation → JS implementation → cost →
accessibility → when not to use it → specimen pointer.

One flat `.md` per technique, `scroll-world` included. Its reference implementation is a packaged
agent skill with heavy external requirements (two paid generation CLIs with balances, ffmpeg,
Python+Pillow) and a per-build cash cost — **not adopted here.** `techniques/scroll-world.md`
records the technique as research, not as an install guide.

## Four findings worth reading before you use any of this

**1. Neither of your two links explains how any of this is built.** SVGator is a 31-item gallery of
web animation in general, of which four sections touch scroll and none contain code. scroll-world
documents one highly specific application end-to-end and assumes the technique. Sources 3–11 in
`sources.md` are where the implementation actually came from.

**2. Scroll-driven CSS animations went cross-browser, and that changes the default.** Chrome shipped
the API in 115 (May 2023) and it was Chromium-only for about two years. Per caniuse as of March
2026, **Firefox 158+ and Safari 26+ now support it — 87.22% global**. Combined with the fact that
these animations run **off the main thread**, the starting point for most scroll effects is now CSS,
and a library is what you add when CSS genuinely cannot express the thing: sequencing (GSAP),
stepped narrative states (Scrollama), scroll *velocity* (CSS exposes position, not speed), or
video/canvas scrubbing.

**3. GSAP is now 100% free — including ScrollSmoother, SplitText and DrawSVG.** Webflow funds it.
Any advice weighing "ScrollTrigger is free but ScrollSmoother is paid" is stale, and the
ScrollTrigger docs page itself still carries an outdated "members-only" line.

**4. `getComputedStyle` cannot verify a scroll-driven animation.** Found the hard way while building
the specimen. Because these run on the compositor, the main thread does not know their value — a
progress bar visibly 64% full reports `matrix(0, 0, 0, 1, 0, 0)`, and
`animation.timeline.currentTime` reads `null` as though the timeline were inactive. It is not.
`getBoundingClientRect()` reflects the applied transform correctly; so does a screenshot. There is a
DevTools extension for this, and now you know why it exists.

## On your scroll-world hypothesis

You said you thought scroll-world is a style of its own, and asked me not to just adopt that. I
argued it both ways in `compatibility.md`; the short version:

**Mechanically it is video-scrub** — scroll drives a playhead over pre-rendered footage. Apple has
done that inside a minimalist design language for years without it becoming a style.

**But three things separate it:** it specifies *content* ("a camera flies from outside each scene
into its interior, with no cuts") rather than just mechanism; **your CSS cannot reach it at all**,
because the world is pixels in a video, so none of the twelve style packs' palettes, type, borders
or radii apply; and the skill interviews you for brand kit and art direction and then generates its
own cohesive isometric dioramas — which is a style pack's job description.

**Then rating it against all twelve styles corrected me.** I had excluded it from the matrix on the
grounds that it "never composes." That was wrong, and the exercise of filling in the column is what
showed it. Three styles compose with it, and one — **glassmorphism — is a core fit**, because glass
requires a rich moving backdrop to read as glass at all and a scrubbed world is the richest one
available.

The right rule is a **layer** distinction:

> **scroll-world owns the ground layer** — background surface, material, palette, depth model. It
> does not touch the chrome — type, spacing, small UI, overlay panels.

- **Ground styles** (skeuomorphism, neumorphism, flat, bento, hand-drawn, brutalism) → ✗ overwritten
- **Chrome styles** (glassmorphism ●, minimalism ○, editorial ○) → compose
- **Mixed** (neo-brutalism, modernism, swiss) → ⚠ chrome survives, surface logic fights

Minimalism composing is exactly why "Apple ships video scrub inside a minimalist language" was a
valid counter-example all along.

Both classifications hold once the layers are separated: `scroll-world = video-scrub (technique) + a
generated art direction (style), sold as one unit`. You can take the technique without the style —
that is Apple. You cannot take this skill's style without the technique.

It is also the only item in this research with a **per-build cash cost**: ~N image generations plus
~2N−1 video generations, mobile doubling the video count, stated example ~$27 for a 6-scene 1080p
chain.

## What the matrix says at a glance

- **Best all-round style for scroll work:** `neo-brutalism` — it is built from `transform` and hard
  shadows, which is exactly what composites cheaply.
- **Best-matched and most dangerous:** `glassmorphism` — parallax behind glass is the signature
  pairing, and `backdrop-filter` re-blurring every scroll frame is the documented FPS killer.
- **Most constrained:** `neumorphism` — a component-scale style, so most page-scale techniques have
  nothing to act on; parallax is impossible on first principles because the style has only one
  surface.
- **Most self-denying:** `brutalism` — nearly everything is ✗ or ⚠, correctly. Native scroll *is* the
  style, which makes smooth scroll the single most anti-brutalist addition available. Its one core
  fit is the marquee.
- **Cleanest technique-to-style match in the document:** `hand-drawn` × `svg-path-draw`. A line that
  draws itself as you scroll is the animated form of the style's whole premise.
- **Only style whose native narrative form is a scroll technique:** `editorial` × `scrollytelling`.

Cross-cutting: restraint reads as confidence — an observation, not a cap; `transform`/`opacity` only;
and `prefers-reduced-motion` is assumed throughout, because WCAG 2.2 SC 2.3.3 names
parallax explicitly and notes reactions including "nausea, migraine headaches, and potentially
needing bed rest to recover."

## Open items

- **Nothing here is benchmarked.** Cost ratings are reasoned from which CSS properties composite
  versus repaint, not measured. Profile before this becomes a build standard.
- **No WebGL / react-three-fiber research.** `r3f-scroll-rig` and Locomotive Scroll are named in
  Lenis's plugin list but not investigated. That is the next area if real-time 3D — as opposed to
  scroll-world's pre-rendered video — is on the table.
- **Scrollytelling, video-scrub, scroll-world and svg-path-draw have no specimen**, because each
  needs a library, a paid API, or real artwork to demonstrate honestly rather than as a toy.
- **`containerAnimation`, `ScrollSmoother`, `lenis/snap`** each merit their own pass.
- **Not wired into a skill.** These are research artifacts, same as `../styles/`. Whether techniques
  become part of a Layer 1 motion engine or ride along with Layer 2 style packs is still open —
  though `compatibility.md` argues they are Layer 1 material, since the same technique serves many
  styles with only its parameters changing.
