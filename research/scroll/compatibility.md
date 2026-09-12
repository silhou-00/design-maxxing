# Scroll × style — where each technique earns its place

A scenario guide, not a permission table. For each of the 12 packs: the situations where a scroll
technique genuinely serves the style, and the few places where a technique fights the pack's own
rules — with the rule quoted, so you know *why* and can decide for yourself.

**This file used to be a graded matrix** (●/○/⚠/✗ per cell) with a "one headline technique per
page" cap. That framing was mine, and it read as a list of what you were allowed to do. It was too
restrictive. A ✗ never meant "forbidden" — it meant "this contradicts a line in the pack's banned
list." The reasoning is kept below; the grades and the cap are gone.

**How to read this.** Nothing here overrides a brief. If the brief wants parallax on a flat page,
build it — and know that flat's own rule *"Zero depth; no shadows, no gradients"* is what you're
spending. The pack's `## banned` list in `../styles/<pack>/style.md` is the actual constraint; this
file just tells you where scroll touches it.

---

## Reading the techniques by what they *do*

Before the per-style notes, the techniques grouped by job — because the right pick usually follows
from the job, not the style:

| you want to… | reach for |
|---|---|
| bring content on as it arrives | `scroll-reveal` — once, then it stays. Never fade content *out* on exit |
| tell the reader where they are | `scroll-progress` — informational, survives reduced-motion |
| hold a stage while the scroll drives a scene | `pinned-scene` |
| step through a sequence of states | `scrollytelling` (text-driven) · `stacking-cards` (card-driven) |
| move a rail of items sideways | `horizontal-scroll` — native, with `scroll-snap` |
| make type itself the event | `text-reveal` — headlines and pull quotes only |
| draw a line, rule or diagram | `svg-path-draw` |
| shift the mood as the page progresses | `scroll-theme-shift` |
| a ticker that follows the wheel | `scroll-marquee` |
| depth from layers moving at different rates | `parallax` — the one WCAG names by name |
| a camera flying through footage | `video-scrub` · `scroll-world` |
| a transition on *arrival* rather than during scroll | `view-transition` — off this axis entirely |
| change the feel of scrolling itself | `smooth-scroll` — a modifier, not a technique |

---

## Per style — scenarios, then friction

### skeuomorphism
**Where scroll serves it.** Physical controls *detent* — a dial clicks into place, it doesn't drift.
`scroll-snap` is the interaction version of that and reinforces the metaphor directly. A
`scroll-progress` gauge is a skeuomorphic object in its own right. `stacking-cards` reads as a real
stack of real things. Depth is native here, so `pinned-scene` and modest `parallax` sit comfortably —
one light source, small travel.

**Friction.** Parallax with *large* travel moves layers past a light source the shadows were authored
for — the pack's ban on *"more than one light direction on a screen"* is what you'd be spending.
`text-reveal` splits type that's meant to be engraved *onto* a material. `scroll-theme-shift` changes
the ground the whole light model is baked into.

### neumorphism
**Where scroll serves it.** This is a component-scale style — its own sources say *"toggles, buttons,
cards, minimal dashboards."* So scroll works at component scale: a `scroll-progress` well, a
`horizontal-scroll` rail of soft controls, `scroll-snap` between them. `view-transition` is the
honest page-level choice, because navigating is the one page-scale thing an instrument does.

**Friction.** There is exactly one surface colour by definition — figure and ground are identical.
`parallax` needs layers; there are none. `scroll-theme-shift` breaks the shadow maths (dark = surface
× 0.87, light = surface + 13%) mid-scroll. `pinned-scene` and `scrollytelling` have nothing at page
scale to act on. Reveals on controls that already lack a visible boundary compound the pack's known
a11y debt.

### glassmorphism
**Where scroll serves it.** This is the best-matched style in the catalogue for scroll, and the most
dangerous. Glass *needs* a rich moving backdrop to read as glass — its own rule bans glass on a flat
solid. So `parallax` behind the panel, `scroll-theme-shift` seen through it, `video-scrub` or
`scroll-world` as the ground under a glass chrome layer: these are the signature pairings. A sticky
glass panel over moving content (`pinned-scene`, `scrollytelling`) is the premium-product idiom.

**Friction.** All of it is performance. `backdrop-filter` re-blurs every scroll frame. Never on a
repeating list item; one glass layer per view; parallax *behind* glass, never *of* glass.
`text-reveal` with blur on a blurred surface is double paint cost and unreadable mid-animation. Text
contrast on glass is unknowable at author time — add a moving backdrop and it gets worse.

### brutalism
**Where scroll serves it.** `scroll-marquee` — a scroll-bound ticker in system monospace is a 1995
`<marquee>` reborn, exactly the exposed-plumbing register the style wants. `scrollytelling` with raw
text and raw images, no transitions, is honest. `scroll-progress` as an unstyled bar. `view-transition`
at `steps(1)`. Native scroll *is* the style.

**Friction.** The pack bans *"transitions and easing on interaction states"* and *"blurred shadows"*,
and its sources describe it as *"not about harmony or ease of use."* So most polish fights it:
`smooth-scroll` most of all — intercepting the wheel to add inertia is the single most anti-brutalist
move available. Eased reveals, `stacking-cards`, `parallax`, `text-reveal` are all polish. If you use
reveal here, `linear` or `steps(1)`, no fade.

### neo-brutalism
**Where scroll serves it.** Built from `transform` and hard shadows, which is exactly what composites
cheaply — the best all-round style for scroll work. `stacking-cards` is the standout: a `4px 4px 0`
hard shadow makes the stack's depth literal. Keep the no-shrink variant. `scroll-reveal` that snaps
in — short travel, `linear`, no bounce. `horizontal-scroll` panels with hard borders. `scroll-snap`
matches the decisiveness.

**Friction.** `smooth-scroll` — inertia is soft, this style is hard; the signature hover is already
an instant `translate(4px,4px)` collapse into its own shadow. `parallax` only as hard-offset flat
planes, never atmospheric.

### minimalism
**Where scroll serves it.** One thing, done quietly. `scroll-reveal` with short travel, opacity only,
finished early. A hairline `scroll-progress`. `scrollytelling` if there's a real narrative. The
scenario question here is *how many*, not *which* — the pack bans *"filling whitespace because it
looks empty"*, and the scroll equivalent is filling scroll distance because it feels static.

**Friction.** `parallax` and `scroll-theme-shift` add a second visual event where the argument is
subtraction. `scroll-marquee` is perpetual motion in a style built on stillness. `smooth-scroll` is a
page-wide flourish.

### modernism
**Where scroll serves it.** Geometry and the module govern. `scroll-snap` is the strongest conceptual
match in this document: the style is built on a modular grid, and snap points *are* modules. Scroll
in units. `pinned-scene` for a composition assembling from square, circle, triangle. `horizontal-scroll`
as a poster sequence. `scroll-progress` — a bar is a Bauhaus object. Reveals travel along an axis at
0°/90°, no fade.

**Friction.** The pack bans *"arbitrary angles (only 0°, 45°, 90°)"* and *"decoration with no
structural role."* `parallax` is illusory depth with no structural role — the definition of what
"form follows function" rejects.

### editorial
**Where scroll serves it.** `scrollytelling` is the native form — this style *is* long-form narrative,
and scrollytelling is the newsroom's own answer to presenting it. `scroll-progress` as a reading
indicator was invented for this content. `pinned-scene` with text scrolling beside a sticky image *is*
a magazine spread. `text-reveal` on pull quotes and display headlines. `svg-path-draw` for rules,
dividers, marginalia. `parallax` behind imagery, never behind text.

**Friction.** `scroll-snap` fights reading — the style exists to be read at the reader's pace.
`stacking-cards` runs into the pack's ban on *"cards — editorial content sits on the page, not in
containers."* Reveal on body copy is hostile to someone mid-sentence; keep it to headlines.

### swiss
**Where scroll serves it.** Movement along the grid's own axes, in modular steps: `scroll-snap`,
`horizontal-scroll`. A solid red `scroll-progress` bar, 4–8px, straight out of the poster vocabulary.
`pinned-scene` if the composition stays on-grid throughout. Reveals as grid-aligned translation only.

**Friction.** The pack bans *"anything placed off-grid 'for balance'."* `parallax` puts layers
off-grid on every frame — the most direct contradiction of a strict modular grid available.
`smooth-scroll` — Swiss is objective and precise; inertia is neither. `scroll-theme-shift` runs into
the one-accent-colour rule.

### hand-drawn
**Where scroll serves it.** `svg-path-draw` is this style's signature scroll technique — the cleanest
technique-to-style match in the catalogue. A line that draws itself as you scroll is the animated
form of the style's whole premise; SVGator ties them together explicitly. `parallax` of doodle layers
is natural here in a way it isn't for structural styles. `scrollytelling` as illustrated narrative.
`scroll-reveal` with the style's own per-element wobble (−2° to +2°). `smooth-scroll` genuinely suits
the character — one of the few styles where it does.

**Friction.** `scroll-snap: mandatory` is precise, and the method is *"order first, chaos later"* —
use `proximity` if at all.

### flat
**Where scroll serves it.** Cheap techniques, because flat's original argument (Looka) was that it
*"made sites faster, and easier to load."* `scroll-theme-shift` is the standout — solid colour swaps
with no gradients are what the style is made of, and it's one of the cheapest effects there is.
`scroll-reveal`, `scroll-progress`, `scroll-snap`, `horizontal-scroll` — all cheap, all flat.
`stacking-cards` in the hard-edged variant: drop the `scale()` and `brightness()`, separate with
colour.

**Friction.** The pack bans depth. `parallax` is depth — there's no constrained version. `video-scrub`
is the heaviest payload in the folder, in the style whose pitch is lightness.

### bento
**Where scroll serves it.** The cell grid is the unit. `scroll-reveal` staggered across cells is the
signature entrance — and with `view()` timelines the stagger is free, because each cell sits at a
different scrollport position. `pinned-scene` with the grid held and cells animating inside.
`stacking-cards` — cells and cards share a geometry. Motion *inside one cell*: a `scroll-marquee`, a
scrubbed clip. That's how real bento dashboards use it.

**Friction.** Cells are flat containers with hairline borders — `parallax` has nothing to go behind
them. `scrollytelling` is sequential; bento is simultaneous; they fight. Watch DOM order vs
`grid-area`: reveals make a mismatch between visual and reading order obvious.

---

## scroll-world — the ground-versus-chrome rule

Scroll-world owns the **ground layer**: background surface, material, palette, depth model. It
doesn't touch the **chrome**: type, spacing, small UI, overlay panels. That single distinction tells
you how it composes with any style:

- **Chrome styles compose with it** — glassmorphism (actively benefits: glass needs a rich moving
  backdrop and a scrubbed world is the richest one there is), minimalism (Apple's model — sparse type
  over full-bleed motion), editorial (type-led chrome captioning a world).
- **Ground styles are overwritten by it** — skeuomorphism, neumorphism, flat, bento, hand-drawn,
  brutalism. Each *is* its surface; a video ground leaves it nothing to be.
- **Mixed styles keep their chrome and lose their surface logic** — neo-brutalism, modernism (one
  real rhyme: isometric dioramas and Bauhaus axonometric drawing agree on geometry), swiss
  (grid-over-photograph is a Swiss idiom, but the pack wants *objective* photography and a generated
  world is the opposite).

Both classifications hold once you separate the layers. `scroll-world = video-scrub (technique) +
a generated art direction (style), sold as one unit.` You can take the technique without the style —
that's Apple. You can't take the style without the technique. It's also the only item here with a
**per-build cash cost** — roughly N image + 2N−1 video generations, mobile doubling the video count,
~$27 for a six-scene 1080p chain.

## view-transition — off this axis

Every other technique animates *while* you scroll; this one animates when you *arrive*. No pack owns
it and no pack's scroll rules reach it. It's the honest page-level choice for **brutalism** (a
navigation transition isn't scroll polish — keep it `steps(1)`) and **neumorphism** (a component
style has nothing to scroll at page scale, but it navigates). Cross-document is two lines of CSS,
zero JS, and its failure mode is an ordinary instant navigation. `prefers-reduced-motion` is **not**
automatic — same treatment as parallax. See `techniques/view-transition.md`.

---

## What holds across every style

**Restraint reads as confidence.** Not a cap — an observation. Most professional scroll work uses one
or two techniques deliberately and lets the rest of the page simply *be there*. A page where
everything reveals has no hierarchy, because reveal was the only hierarchy signal. Content that fades
*out* on exit — disappearing under the reader — is the single strongest amateur tell. Reveal once,
then stay.

**Continuous beats stepped.** Dead scroll punctuated by hard cuts — 65vh of nothing, then a snap to
a new state — is the second tell. If scroll drives discrete states, give each band something that
moves *during* it, and animate the transition between states rather than swapping in one frame.

**Composite-only.** `transform` and `opacity` composite. `width`, `height`, `top`, `filter`,
`box-shadow`, `stroke-dashoffset` repaint. This is the difference between 60fps and jank under every
style.

**The three styles with existing a11y debt need the most care.** Neumorphism (no component
contrast), glassmorphism (unknowable text contrast), brutalism (deliberately hostile) all start
from a deficit. Motion on a style that's already hard to perceive compounds it.

**`prefers-reduced-motion` is style-independent.** WCAG 2.2 SC 2.3.3 names parallax explicitly and
notes reactions including *"nausea, migraine headaches, and potentially needing bed rest to recover."*
Progress indicators survive it — they convey position, which 2.3.3 exempts as essential. Decoration
doesn't.
