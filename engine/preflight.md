# Preflight

Run before delivering. Every box. If one cannot be honestly ticked, the work is not done.

Style-neutral only — the checks that hold under all twelve packs. **Each pack's `## banned` list is
a second checklist and it outranks this one.** Run both.

## 0. Run the audit — before anything below

```
cd <product-repo>
node D:/GithubRepo/design-maxxing/engine/audit.mjs http://localhost:5173 --pack <pack>
```

**`--pack` is not cosmetic.** With it, the audit opens that pack's `tokens.json` and grades against
the numbers the pack itself declares — `copyBudget` and `a11y`. Without it every pack is graded
against one generic ceiling, and the twelve disagree by nearly 4×: editorial's budget is 900 chars a
viewport, minimalism's is 240. The first line of the report names the budget in force; if it says
*engine defaults*, you forgot the flag.

**Zero FAILs before you tick a single box below.** Everything after this section is prose, and a
prose checklist is graded by the same model that wrote the page — which is why it always passes.
The audit measures instead: chars per viewport, dead viewports, gutter symmetry and edge bleed,
page length across four breakpoints, smallest rendered font size, tap targets, scroll-technique
spread, whether `prefers-reduced-motion` changes anything, and the mechanically checkable half of
the pack's `## banned` list.

Four of those are content and accessibility floors rather than layout:

| check | source | level |
|---|---|---|
| **measure** — longest rendered line, in `ch` | WCAG 1.4.8 ceiling of 80; the pack's own min/max inside that | FAIL past 80, WARN outside the pack range |
| **target size** | WCAG 2.5.8 — 24×24, or the pack's own floor where it is higher (neumorphism sets 44) | FAIL |
| **headline and label word counts** | the pack's `copyBudget` | WARN |
| **body size floor** | only where a pack sets one (glassmorphism: 16px on glass) | FAIL |

The measure is read off the **rendered line boxes**, not the container width, so a narrow column
inside a wide section is not reported and a wide column that genuinely runs long is.

**Scaffolding is excluded, and only scaffolding.** Anything inside `[data-audit-ignore]` (or
`.no-audit`) is removed from the DOM before measuring. Use it for a debug panel, an injected
consent banner, or a reference page's own explanatory chrome — never to quiet a finding about the
design. design-maxxing's own pack pages needed it: they were reporting a 153ch measure and 11px
body copy, every character of which belonged to the self-audit note printed underneath the
composition.

**The audit has its own negative control.** `research/styles/_shared/_audit-selftest.html` breaks a
fixed set of rules on purpose and must report exactly 7 FAIL. If it ever passes, a check has
stopped working — a passing self-test is the failure.

It exists because a delivery passed this checklist by eye and still shipped, measured on the live
page: 3 dead viewports, 818 chars in a single viewport, a panel flush to the right edge against a
192px left gutter, 2.3px text at 390px, **50 viewports of scroll on a phone against 11 on desktop**,
45 of 45 scroll animations using one identical technique, and `columns` on body flow that the
editorial pack bans outright. Nine failures, none of them caught by reading.

## Setup

- [ ] Brief read declared in one line, before any code
- [ ] Dial values stated and reasoned from the brief, not silently baseline
- [ ] Style pack named, and it is exactly **one** pack per surface
- [ ] Dial values sit inside the range the pack allows
- [ ] Design system chosen from `engine.md` §3 if applicable, or the aesthetic labelled honestly
- [ ] Redesign mode detected, audit done, IA and slugs preserved (if applicable)

## Pack compliance

- [ ] Every rule in the pack's `## banned` section checked, individually
- [ ] Values come from the pack's `## implementation` table, not from memory or approximation
- [ ] Where a vendor skill contradicted the pack, the pack won, and that was stated

## Consistency locks

- [ ] **Theme lock** — one theme across the page, no section flips mid-scroll
- [ ] **Shape lock** — one corner-radius system, or a documented rule followed everywhere
- [ ] **Accent lock** — accents used identically in every section, no new hue appearing late

## Layout

- [ ] Hero fits the viewport: headline ≤ 2 lines, subtext ≤ 20 words and ≤ 4 lines, CTA visible
      without scrolling
- [ ] Hero top padding ≤ `pt-24` at desktop
- [ ] Hero has ≤ 4 text elements, no trust strip or pricing teaser inside it
- [ ] Logo wall sits under the hero, logos only, no category labels underneath
- [ ] Navigation renders on one line at desktop, height ≤ 80px
- [ ] No layout family repeats; ≥ 4 families across 8 sections
- [ ] No 3+ consecutive image+text-split sections
- [ ] Grid cell count equals content count, no empty tiles
- [ ] Mobile collapse declared explicitly per multi-column section

## Containment and responsiveness

- [ ] **Right gutter equals left gutter.** No element runs to the viewport edge unless it is
      deliberately full-bleed, edge to edge. A block starting at the gutter and ending at `right: 0`
      is a bug — audit reports it as `gutter FAIL`
- [ ] Sidebars, rails and asides obey the same gutter as the main column
- [ ] No horizontal overflow at 390 / 768 / 1280 / 1920
- [ ] **Mobile length ≤ ~2.5× desktop length.** If it is 4×, the desktop columns are just stacking —
      recompose rather than reflow
- [ ] Every fluid font size is `clamp()`d with a floor. No bare `vw` / `cqw` / `%` font sizes
- [ ] Smallest rendered text ≥ 12px at every breakpoint
- [ ] Tap targets ≥ 44px at ≤768px
- [ ] `min-h-[100dvh]`, never `h-screen`

## Content

- [ ] Every visible string re-read; nothing grammatically broken, referentially unclear, or written
      to sound thoughtful rather than to say something
- [ ] **Zero em-dashes** anywhere visible: headlines, eyebrows, pills, buttons, body, quotes,
      attribution, captions, alt text
- [ ] No duplicate CTA intent ("Get in touch" + "Let's talk" on one page is a fail)
- [ ] CTA labels fit one line at desktop
- [ ] Numbers are real, or explicitly marked mock
- [ ] Quotes ≤ 3 lines, attribution is name + role
- [ ] No generic names, Acme-style brand names, filler verbs, or performative-craftsman labels
- [ ] No scroll cues, locale/weather strips, version labels in hero, or version footers
- [ ] Lists over 5 items use a real component, not a longer `<ul>`

## Assets

- [ ] Real images used — generated, sourced, or explicit labelled placeholder slots with a note
      listing what is still needed
- [ ] No div-based fake screenshots
- [ ] No hand-rolled decorative SVG illustrations
- [ ] Logo walls use real SVG marks or generated monograms, not text wordmarks
- [ ] No pills, tags or photo-credit captions overlaid on images
- [ ] Icons from one allowed library, no hand-rolled paths, `strokeWidth` standardised

## States and accessibility

- [ ] Loading, empty and error states all provided
- [ ] Every CTA passes WCAG AA against its own background (4.5:1 body, 3:1 at 18px+)
- [ ] Form inputs, placeholders, focus rings, labels, helper and error text all pass AA
- [ ] Labels above inputs, errors below, no placeholder-as-label
- [ ] Dark mode tokens defined and the page opened in both modes

## Motion and performance

- [ ] Every animation justifiable in one sentence — hierarchy, feedback, state, or storytelling
- [ ] Motion actually present if `MOTION_INTENSITY > 4`, not merely claimed
- [ ] `prefers-reduced-motion` handled for everything above `MOTION_INTENSITY 3` — progress
      indicators exempt, decoration is not
- [ ] **At most one headline scroll technique on the page**
- [ ] Each scroll technique used rates ● or ○ for the chosen pack in
      `research/scroll/compatibility.md`, or its ⚠ constraint was stated out loud and honoured
- [ ] **`@supports not (animation-timeline: scroll())` fallback present** — no element can end up
      permanently `opacity: 0` if the animation never fires
- [ ] Scroll-driven animation verified with `getBoundingClientRect()` or a screenshot, **not
      `getComputedStyle`** — compositor-run animations report a stale matrix and a `null` timeline
      `currentTime` even while visibly running
- [ ] No `window.addEventListener('scroll')`, no `window.scrollY` in state, no rAF loops touching
      state
- [ ] Only `transform` and `opacity` animated
- [ ] GSAP / Three.js / Motion never mixed in one component tree
- [ ] `backdrop-filter` only on fixed or sticky elements
- [ ] Grain and noise only on fixed `pointer-events-none` pseudo-elements
- [ ] `useEffect` animations have cleanup
- [ ] Z-index systemic and documented, no arbitrary `z-50` / `z-[9999]`
- [ ] Core Web Vitals plausibly met — LCP < 2.5s, INP < 200ms, CLS < 0.1

## Dependencies

- [ ] Every third-party import verified against `package.json`, install commands given for anything
      missing
- [ ] One design system only, not mixed
