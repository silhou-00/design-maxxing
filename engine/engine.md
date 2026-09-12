# Engine — Layer 1

Style-neutral build rules. Loaded on every design job, before the platform profile and the style
pack.

**Inclusion test:** a rule belongs here only if it is true for **all twelve** style packs. If it
would be wrong for even one, it is Layer 2 and lives in the pack. Anything cut is recorded in
`EXCLUDED.md` with the pack it broke.

**The pack outranks this file.** Where a pack's `## banned` list contradicts anything below, the pack
wins. Say so out loud rather than splitting the difference.

Cold references, load only when needed: `design-systems.md` (install commands, canonical docs),
`vocabulary.md` (pattern names), `preflight.md` (ship checklist).

---

## 1. Read the brief before generating

Most bad output comes from jumping to a default instead of reading the room. Read, in order:

1. **Page kind** — landing (SaaS / consumer / agency / event), portfolio, redesign, editorial.
2. **Reference signals** — URLs linked, screenshots pasted, products named, competitors.
3. **Audience** — B2B procurement panel vs design-conscious consumer vs recruiter scanning. The
   audience picks the aesthetic, not your taste.
4. **Existing brand assets** — logo, colour, type, photography. On a redesign these are starting
   material, not optional input.
5. **Quiet constraints** — accessibility-first audiences, public sector, regulated industries,
   trust-first commerce, kids' products. **These override aesthetic preference, including the pack.**

Then state the read in one line before any code:

> "Reading this as: `<page kind>` for `<audience>`, built on the `<pack>` pack, leaning toward
> `<design system or native CSS>`."

**If the brief is ambiguous, ask exactly one question.** Never a multi-question dump. If you can
infer confidently, do not ask — declare the read and proceed.

## 2. Dials — parameterise the pack, do not replace it

The pack fixes the visual language. The dials tune how that language is deployed on this page.

* **`DESIGN_VARIANCE: 1-10`** — 1 symmetrical grid, 10 asymmetric and masonry
* **`MOTION_INTENSITY: 1-10`** — 1 hover states only, 10 scroll-driven choreography
* **`VISUAL_DENSITY: 1-10`** — 1 gallery-airy, 10 cockpit-packed

Never invent aliases (`LAYOUT_VARIANCE`, `ANIM_LEVEL`). Cross-references use these exact names.

| Signal in the brief | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| calm, quiet, editorial, restrained | 5-6 | 3-4 | 2-3 |
| premium consumer, brand-led | 7-8 | 5-7 | 3-4 |
| playful, experimental, agency, Awwwards | 9-10 | 8-10 | 3-4 |
| landing page or portfolio, unqualified | 7-9 | 6-8 | 3-5 |
| trust-first, public sector, regulated, a11y-critical | 3-4 | 2-3 | 4-5 |
| redesign — preserve | match existing | +1 | match existing |
| redesign — overhaul | +2 | +2 | match existing |

**A pack constrains the dial range.** `minimalism` and `swiss` do not run at `MOTION_INTENSITY 9`;
`skeuomorphism` does not run at `VISUAL_DENSITY 1`. When the brief and the pack disagree on a dial,
say so and pick the pack's range, or change pack.

Dial definitions:

* **VARIANCE 1-3** symmetrical 12-col grid, equal padding, centred · **4-7** negative-margin
  overlaps, mixed aspect ratios, left-aligned headers · **8-10** masonry, fractional grid columns
  (`2fr 1fr 1fr`), large deliberate empty zones
* **MOTION 1-3** `:hover` / `:active` only, no automatic animation · **4-7** CSS transitions and
  `animation-delay` cascades on `transform` / `opacity` · **8-10** scroll-driven reveals, parallax,
  pinning
* **DENSITY 1-3** section gaps `py-32`-`py-48` · **4-7** `py-16`-`py-24` · **8-10** tight padding,
  hairline separators instead of card boxes, monospace numerals

**Mobile override:** at VARIANCE 4-10, asymmetric layouts above `md:` collapse to strict
single-column below 768px.

## 3. Design system vs aesthetic

Do not invent CSS for something that has an official package. Do not pretend a trend is an official
system.

| Brief reads as | Reach for |
|---|---|
| Microsoft / enterprise SaaS / dashboards | `@fluentui/react-components` |
| Google-ish, Material-flavoured product | `@material/web` + Material 3 tokens |
| IBM-style B2B analytics | `@carbon/react` + `@carbon/styles` |
| Shopify app surfaces | Polaris (required for admin UI) |
| Atlassian / Jira-style product | `@atlaskit/*` + `@atlaskit/tokens` |
| GitHub-style devtool or community page | `@primer/css`, `@primer/react-brand` for marketing |
| UK public-sector service | `govuk-frontend` (regulatorily expected) |
| US public-sector, trust-first | `uswds` |
| Fast local-business or agency MVP | Bootstrap 5.3 |
| Accessible React foundation | `@radix-ui/themes` |
| Modern SaaS, you own the components | shadcn/ui — never ship in default state |
| Tailwind-based modern SaaS | Tailwind v4 utilities |

Install commands and canonical docs: `design-systems.md`.

**Honesty rule.** If the brief maps to a system above, install the official package. Do not recreate
its CSS by hand, and do not import its tokens then override 90% of them.

**One system per project.** No Fluent beside Carbon, no shadcn inside a Material 3 app.

**When a design system and a style pack are both in play, the system supplies structure and
accessibility; the pack supplies the visual language.** If the pack cannot be expressed without
fighting the system's tokens, say so and pick one.

## 4. Architecture defaults

Unless the brief picks a design system:

**Stack** — React or Next.js, Server Components by default. Global state works only in Client
Components; wrap providers in a `"use client"` component. Anything using motion, scroll listeners,
or pointer physics is an isolated leaf with `'use client'` at the top.

**Styling** — Tailwind v4. Use `@tailwindcss/postcss` or the Vite plugin, not the `tailwindcss`
PostCSS plugin. v3 only if the existing project demands it.

**Animation** — Motion, imported from `motion/react`. `framer-motion` still works as a legacy alias;
prefer `motion/react` in new code.

**Fonts** — `next/font`, or self-host with `@font-face` + `font-display: swap`. Never a Google Fonts
`<link>` in production.

**State**

* Local `useState` / `useReducer` for isolated UI.
* Global state only to avoid deep prop drilling — Zustand, Jotai, or context.
* **Never `useState` for continuous input-driven values** (mouse position, scroll progress, pointer
  physics). Use `useMotionValue` / `useTransform` / `useScroll`. `useState` re-renders the tree every
  frame and collapses on mobile.

**Icons** — one family per project. `@phosphor-icons/react`, `hugeicons-react`,
`@radix-ui/react-icons`, `@tabler/icons-react`. `lucide-react` only on explicit request or existing
dependency. **Never hand-roll SVG icon paths.** Standardise `strokeWidth` globally.

**Emoji** — not UI elements. Use icon glyphs. Override only when the brief asks for a playful,
chat-native voice.

**Responsiveness** — breakpoints `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Contain page
width (`max-w-7xl mx-auto` or similar); never stretch full-bleed text on wide monitors. Use
`min-h-[100dvh]`, **never `h-screen`** — the iOS Safari address bar causes layout jump. Use CSS Grid,
never flexbox percentage math (`w-[calc(33%-1rem)]`).

**Dependency verification (mandatory)** — check `package.json` before importing anything. If the
package is missing, output the install command first. Never assume a library exists.

## 5. Mechanical discipline

These are correctness rules, not taste. They hold under every pack.

**Consistency locks** — pick one and hold it across the whole page:

* **Theme lock.** One theme for the page. No light section sandwiched between dark ones. A single
  deliberate theme switch is allowed once per page when the brief calls for it; random alternation
  is not.
* **Shape lock.** One corner-radius system. Mixed systems only with a documented rule ("buttons
  pill, cards 16px, inputs 8px") followed everywhere. Round buttons in a square layout is broken.
* **Accent lock.** However many accents the pack allows, they are used identically in every section.
  A site does not grow a new accent hue in section 7.

**Hero discipline**

* Fits the initial viewport. Headline ≤ 2 lines desktop, subtext ≤ 20 words and ≤ 4 lines, CTAs
  visible without scrolling.
* Plan font scale and asset size together. A 4-line hero headline is a font-size error, not a
  copy-length error.
* Top padding ≤ `pt-24` at desktop. More reads as a layout bug, not intentional space.
* Max 4 text elements: eyebrow **or** brand strip (or neither), headline, subtext, CTAs (1 primary +
  max 1 secondary). Trust strips, pricing teasers, feature bullets and social-proof avatar rows move
  to sections below.
* "Used by / Trusted by" logo walls live **under** the hero, never inside it.

**Navigation** — one line at desktop, height ≤ 80px (64-72 default). If items do not fit at `lg`,
condense labels, drop secondary items, or collapse to a menu. A two-line desktop nav is broken.

**Layout repetition** — a layout family appears at most once per page. Max 2 consecutive
image+text-split sections; the third is a failure. Eight sections need at least four families.

**Grid cell counts** — a grid has exactly as many cells as there is content. 3 items, 3 cells. An
empty cell in the middle or at the end means the grid was planned wrong. Never paste a blank tile.

**Mobile collapse is explicit per section.** Declare the `< 768px` fallback in the same component.
No "Tailwind will handle it".

**Interactive states** — always ship the full cycle, not just the success state. Skeleton loaders
shaped like the final layout, composed empty states that say how to populate, inline form errors,
contextual toasts for transient only.

**Real things are rasters (mandatory, every pack)**

* **Never draw a real-world object in CSS.** A monitor, a desk, a phone, a room, packaging, fabric,
  a plant, a face, a physical product — these are image assets. CSS renders layout, chrome and
  surface treatment; it does not render matter. A CRT built from `border-radius` + `linear-gradient`
  reads as a wireframe of a CRT, which is the opposite of the brief that asked for one.
* The tell is nesting: if a "thing" is eight nested `<div>`s with gradients and no text, it wanted
  to be a raster. `audit.mjs` flags these as `css-object` candidates.
* Route through **ROUTER Gate 2.5** before writing the markup that places it, and declare the plan
  in `output/<product>/assets.plan.json`.
* Decorative geometry is exempt — a Bauhaus circle, a Swiss rule, a neo-brutalist shadow are CSS by
  definition. The line is *matter versus mark*: if it exists physically, it is a photograph.

**Containment and responsiveness (mandatory, every pack)**

* **Every component sits inside the page gutter.** One container, one gutter, and the right gutter
  equals the left. An element may only touch a viewport edge if it is *deliberately full-bleed* —
  meaning it spans edge to edge, `left: 0` to `right: 100vw`. A block that starts at the gutter on
  the left and runs to `right: 0` is a bug, not a design decision. This is the single most common
  layout defect in generated pages.
* **A sidebar, aside, rail or panel is not exempt.** If the main column respects a 192px gutter, so
  does the panel beside it.
* **Design the small breakpoint, do not let it fall out.** Stacking desktop columns vertically is not
  a responsive design; it is the absence of one. A page that is 11 viewports at 1920px and 50 at
  390px has been designed once and abandoned. **Mobile length may not exceed ~2.5× desktop length** —
  past that, recompose: collapse pairs into one, drop decorative sections, shorten copy, convert a
  vertical list into a horizontal scroller.
* **Fluid type needs a floor and a ceiling.** `clamp(1rem, 2.5vw, 1.5rem)` — never a bare `vw`,
  `cqw` or `%` font size. A label that renders 11px at 1920px renders 2px at 390px, and 2px type is
  not small, it is broken.
* **Test at 390 / 768 / 1280 / 1920.** No horizontal overflow at any of them. Tap targets ≥ 44px at
  ≤768px.
* Run `node engine/audit.mjs <url>` — it checks every rule in this block mechanically.

**Contrast (a11y, mandatory)**

* Every CTA's text is readable against its own background. WCAG AA — 4.5:1 body, 3:1 for 18px+.
  Ghost buttons over photography need a scrim, backdrop, or stroke.
* Form inputs, placeholders, focus rings, helper and error text all pass AA against their section
  background.

**CTA hygiene** — button labels fit one line at desktop (3 words max for primary, ideally 1-2). No
two CTAs with the same intent on one page: "Get in touch" + "Let's talk" + "Start a project" are one
intent, so pick one label and use it in nav, hero and footer.

**Forms** — label above input, error below, helper text present in markup. Never
placeholder-as-label.

**Content density** — short headline (≤ 8 words) + short sub-paragraph (≤ 25 words) + one visual or
one CTA per section, unless the section's job justifies more. Lists over 5 items need a different
component (grouped columns, card grid, tabs, scroll-snap, carousel, marquee), not a longer list. No
20-row spec tables on a marketing page.

**Copy self-audit before shipping.** Re-read every visible string — headlines, eyebrows, buttons,
captions, alt text, errors. Rewrite anything grammatically broken, referentially unclear, or written
to sound thoughtful rather than to say something. Plain functional copy beats clever-but-wrong copy.

**Numbers are real or labelled.** `92%`, `4.1x`, `13.4 lb` either come from the brief, or are marked
mock, or do not ship. Do not fake precision the brand does not claim.

**Quotes** ≤ 3 lines. Attribution is name + role, optionally company. Never a bare first name.

## 6. Motion technique

Technique, not intensity. How much motion is the `MOTION_INTENSITY` dial and the pack's business.

* **Animate only `transform` and `opacity`.** Never `top`, `left`, `width`, `height`, `filter`,
  `box-shadow` or `stroke-dashoffset`. The first two composite; the rest force layout or paint every
  frame. This is the difference between 60fps and jank, and it holds under every pack.
* **`window.addEventListener("scroll", ...)` is banned.** It fires every frame with no batching.
  Same ban on `window.scrollY` in React state and on `requestAnimationFrame` loops that touch state.
  Use motion values.
* `will-change: transform` sparingly, only on elements that actually animate.
* Motion's `layout` / `layoutId` for reordering, expanding and shared elements. Do not wrap static
  content in `layout` "for safety" — it costs measurement work every frame.
* Staggered reveals via `staggerChildren` or `animation-delay: calc(var(--index) * 100ms)`. For
  `staggerChildren`, parent and children must be in the same Client Component tree.
* **Never mix GSAP or Three.js with Motion in one component tree.** They fight over the same frames.
  Motion for UI and state change, GSAP + ScrollTrigger for scrolltelling, Three.js for canvas — each
  isolated in its own leaf with cleanup.
* **`prefers-reduced-motion` is mandatory above `MOTION_INTENSITY 3`.** Infinite loops, parallax,
  scroll hijack and physics collapse to static. Non-negotiable.
  **Progress indicators are the exception** — they convey position, which WCAG 2.2 SC 2.3.3 exempts
  as essential. Decoration collapses; a reading-progress bar stays.

### Scroll — CSS first, library by exception

**Scroll-driven CSS animations are the default starting point.** Chrome shipped the API in 115;
Firefox 158+ and Safari 26+ now support it, **87.22% global** (caniuse,
`mdn-css_properties_animation-timeline`). They run **off the main
thread**, which no JavaScript approach can match.

```css
animation: reveal auto linear both;
animation-timeline: view();
animation-range: entry 10% cover 38%;   /* finish early; the default reads as sluggish */
```

Reach for a library only when CSS genuinely cannot express the thing. The four real reasons:

| need | reach for |
|---|---|
| sequencing and orchestration across elements | GSAP + ScrollTrigger |
| stepped narrative states | Scrollama |
| scroll **velocity** | JS — CSS exposes position, not speed |
| video or canvas scrubbing | JS |

GSAP is fully free as of Webflow's acquisition, ScrollSmoother, SplitText and DrawSVG included. Docs
pages still carrying a "members-only" line are stale.

**Usage share and Baseline status are different measures, and both are true.** MDN marks
`animation-timeline` **Limited availability — not Baseline**, because Baseline counts *browsers*
(all core engines, then 30 months for "widely available"). caniuse reports **87.22%**, because it
counts *sessions*. Neither number contradicts the other, and neither is a reason to drop the
fallback below. Record both together so a future reader does not "correct" one with the other.

**The `@supports` fallback is mandatory, not optional.** If a reveal ships as `opacity: 0` and the
animation never fires — no JS, unsupported timeline, an error before hydration — the content is
permanently invisible.

```css
@supports not (animation-timeline: scroll()){
  .reveal > *{ opacity:1; transform:none }
}
```

**One headline scroll technique per page.** Not a menu. In the compatibility matrix
(`research/scroll/compatibility.md`) every style has at most one or two core-fit entries, and that
is the budget.

**Which technique is a pack decision, not an engine one.** Parallax contradicts seven of the twelve
packs outright. Before proposing any scroll work, read the chosen pack's row in
`research/scroll/compatibility.md`, then load the single matching file from
`research/scroll/techniques/`.

**Cost ratings in that research are reasoned, not benchmarked** — derived from which properties
composite versus repaint. Cite them as reasoning. Profile before treating them as a build standard.

## 7. Performance and accessibility

* **Core Web Vitals** — LCP < 2.5s (hero image preloaded or `priority`), INP < 200ms, CLS < 0.1
  (reserve space for images, fonts, embeds).
* **`backdrop-filter` only on fixed or sticky elements** — navbars, overlays. Never on a scrolling
  container or a large content area; it forces continuous GPU repaints and destroys mobile frame
  rate. This binds the `glassmorphism` pack too: frosted panels are fixed or small, not the page.
* **Grain and noise** only on fixed, `pointer-events-none` pseudo-elements. Never on scrolling
  containers.
* **Z-index is systemic.** Sticky nav, modal, overlay, grain. Document the scale in a constants file.
  No arbitrary `z-50` / `z-[9999]`.
* **Bundle awareness.** Motion is not tiny, Three.js is large. Lazy-load anything below the fold.
* **`useEffect` animations always clean up.**

## 8. Dark mode

Dual-mode by default unless the brief is print-emulating editorial or the pack forbids it — check
the pack first, some are single-mode by construction.

* Pick one token strategy and hold it: Tailwind `dark:` variants, or CSS variables with semantic
  names (`--surface`, `--text-primary`, `--accent`) swapped under `[data-theme]` or
  `prefers-color-scheme`.
* Set the theme once at the page root. Individual sections never override it.
* **Do not prescribe specific colours here** — the brief, the brand and the pack decide. This file
  enforces only: WCAG AA contrast in both modes, hierarchy parity (if a CTA pops in light it pops in
  dark), and brand fidelity (do not desaturate the brand into dark mode).
* Respect `prefers-color-scheme` unless the brand insists. Add a manual toggle if either mode would
  lose brand expression.
* **Test in both modes before finishing.** Do not ship a page you have only seen in one.

## 9. Universal anti-slop

Only the tells that are wrong under every pack. Visual tells — pure black, saturated accents, flat
tile grids, hard shadows — are **not** here, because packs disagree about them. See `EXCLUDED.md`.

**Content**

* No generic names. "John Doe", "Sarah Chan" — use realistic, locale-appropriate names.
* No generic avatars. No SVG egg, no user-icon placeholder.
* No fake-perfect numbers. `99.99%`, `50%`, `1234567` — use organic values.
* No startup-slop brand names. "Acme", "Nexus", "SmartFlow", "Cloudly".
* No filler verbs. "Elevate", "Seamless", "Unleash", "Next-Gen", "Revolutionize".
* No performative-craftsman labels — "From the field", "Field notes", "Currently on the bench",
  "Quietly trusted by". Use plain functional labels or none.
* No micro-meta sentences under a heading explaining the section's own restraint.
* No generic step labels. "Stage 1 / Stage 2", "Phase 01 / Phase 02". The step content is the label.
* No locale, time or weather strips ("LIS 14:23 · 18°C") unless the brand is genuinely
  place-specific or timezone-distributed.
* No scroll cues. "Scroll", "scroll to explore", animated mouse-wheel icons. The user knows what
  scroll is.
* No version labels in the hero (`V0.6`, `BETA`, `EARLY ACCESS`) unless the brief is a launch.
* No version footers (`v1.4.2`, `Build 0048`, `last sync 4s ago`) on marketing pages.

**Assets**

* **No div-based fake screenshots.** A product UI built from styled `<div>` rectangles is the single
  clearest tell. Use a real screenshot, a generated image, a real mini component preview, or nothing.
* No hand-rolled decorative SVG illustrations as a default. Library icons are fine.
* No broken image links. Use `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}`, generated
  assets, or a clearly-labelled placeholder slot plus a note to the user listing what is needed.
* Logo walls use real SVG marks (Simple Icons, devicon) or a generated monogram, never plain text
  wordmarks. **Logos only** — no industry labels printed underneath.
* No pills, tags or photo-credit captions overlaid on images. Caption below the image or nothing.
  Real credit for a real photographer is fine.

**Typography**

* **Em-dash is completely banned in generated page copy.** Headlines, eyebrows, pills, buttons, body,
  quotes, attribution, captions, alt text. No "sparingly" allowance. Also banned as a separator in
  en-dash form; ranges use a hyphen. Permitted dashes: the regular hyphen `-`, and the minus sign in
  maths. One visible em-dash fails preflight. (This rule governs page output only, not this file.)
* No custom mouse cursors. Outdated, accessibility-hostile, performance-hostile.

## 10. Out of scope

This engine covers marketing pages, landing pages, portfolios and editorial surfaces. It is not for
dashboards and dense product UI (use Fluent, Carbon, Atlassian or Polaris), data tables (TanStack,
AG Grid), multi-step wizards, code editors (Monaco, CodeMirror), native mobile (Apple HIG, Material
directly), or realtime collaboration UI.

If the brief is one of those, **say so**, point at the right tool, and apply this engine only to the
marketing surfaces around it.
