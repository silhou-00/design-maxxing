# What was cut from the engine, and why

Audit trail for the Layer 1 merge. Sources: `design-taste-frontend` (88KB), `gpt-taste` (8KB),
`high-end-visual-design` (10.7KB), `full-output-enforcement` (2.6KB).

**Test applied to every rule:** *would this be wrong for at least one of the twelve style packs?* If
yes, it is Layer 2 and belongs in a pack, not here.

Nothing listed below is deleted. The vendor packs are untouched and SHA-pinned. This file records
what the engine deliberately does not carry, so a future reader does not "restore" a rule that was
cut on purpose.

---

## Cut — superseded by the style catalogue

| Source | Section | Why |
|---|---|---|
| `high-end-visual-design` | §3 Creative Variance Engine — "Vibe Archetypes (pick 1)", "Layout Archetypes (pick 1)" | A miniature style catalogue. `research/styles/` is a better one: 12 packs, sourced, rendered, each with a banned list. Two catalogues means the router gambles between them. |
| `gpt-taste` | §1 Python-driven true randomization | Exists to stop the model repeating itself. Choosing a pack solves that deterministically. Randomness was a workaround for having no catalogue. |
| `gpt-taste` | §4 The gapless bento grid | `research/styles/bento/` owns this with measured values and a rendered tile. An engine-level bento rule would fire on the eleven jobs where it is wrong. |
| `design-taste-frontend` | §2.B aesthetic implementations (glassmorphism, bento, brutalism, editorial one-liners) | The packs cover these in far more depth. Its entries with no pack yet — dark tech, aurora / mesh gradients, kinetic typography, Apple Liquid Glass — are candidate future packs. |

## Cut — style opinion that contradicts a specific pack

| Source | Rule | Pack it breaks |
|---|---|---|
| `design-taste` §4.2 | "Max 1 accent colour. Saturation < 80%." | `flat` — the Flat UI palette is multi-hue and saturated by construction; the specimen tile shows six tiles in six hues. Also `neo-brutalism`, whose fill is one saturated hue used flat and large. |
| `design-taste` §4.4 | "When a shadow is used, tint it to the background hue. No pure-black drop shadows on light backgrounds." | `neo-brutalism` — its shadow is measured as `4px 4px 0 0` pure black on a light tint. The rule inverts the style. |
| `design-taste` §9.A | "NO pure black (`#000000`)." | `neo-brutalism` (`--border: oklch(0% 0 0)`, measured off the live theme) and `brutalism` (browser-default black is the palette). |
| `design-taste` §9.A | "NO neon / outer glows", "NO oversaturated accents." | `flat`, `neo-brutalism`. Would also break a future synthwave or Y2K pack. |
| `design-taste` §9.C | "NO 3-column equal feature cards." | `flat` — the Metro / iOS 7 lineage is an even tile grid. `bento` cell-count rules already handle the real failure (empty cells), and that mechanical part is kept in `engine.md` §5. |
| `design-taste` §4.1 | Typography — Inter discouraged, serif "very discouraged", `Fraunces` and `Instrument_Serif` banned, rotating serif pool. | `editorial` — serif display is the style. `swiss` — Helvetica is a neutral grotesque, which is the family the rule pushes away from. Type is the most pack-owned decision there is. |
| `design-taste` §4.7 | EYEBROW RESTRAINT (max 1 per 3 sections) | `swiss` — the numbered modular label strip is canonical; the rendered specimen tile shows `01 Grid · 02 Helvetica · 03 Flush left · 04 Photo`. |
| `design-taste` §9.F | "NO section-number eyebrows (`00 / INDEX`, `001 · Capabilities`)" | Same `swiss` conflict, stated more strongly. Also `industrial-brutalist`-adjacent telemetry labelling. |
| `design-taste` §4.8 | "Even minimalist sites need real images. A pure-text page is not minimalism, it is incomplete work." | `minimalism`, `swiss`, `brutalism` — all three ship type-only compositions deliberately. The rest of §4.8 (no fake screenshots, real logo SVGs, no hand-rolled decorative SVG) is style-neutral and **is** in the engine. |
| `high-end` §4 | Haptic micro-aesthetics — "Double-Bezel" nested architecture, island buttons, exaggerated squircle radii `rounded-[2rem]` | A style opinion, and a good one. Candidate 13th pack (`premium-agency`). Breaks `brutalism`, `swiss`, `flat`, `minimalism` as written. |
| `high-end` §5.A-B | Fluid Island glass nav, magnetic button physics | Same. Prescribes glass and magnetism as defaults. |
| `high-end` §7 | Execution protocol steps 1-4 | Bound to the Variance Engine and the Double-Bezel; both cut above. |
| `high-end` §8 | Pre-output checklist | Every item is style-bound ("all cards use Double-Bezel", "section padding minimum `py-24`"). `design-taste` §14, filtered, supersedes it. |
| `gpt-taste` §2, §3 | AIDA page structure, hero 2-line iron rule | A marketing-page formula, not a universal rule. Candidate future *page-archetype* layer, which is a different axis from style. |
| `gpt-taste` §5 | "Static interfaces are strictly forbidden." | `minimalism`, `swiss`, `brutalism` run at `MOTION_INTENSITY 1-3` by design. The `MOTION_INTENSITY` dial covers this properly. Its GSAP technique that is style-neutral is kept in `engine.md` §6. |
| `gpt-taste` §6 | Component arsenal — inline typography images, horizontal accordions, marquees | Component taste. `vocabulary.md` names these patterns without mandating them. |

## Cut — project-specific, not portable

`iskolar-verity/.claude/rules/frontend.md` was reviewed and deliberately **not** merged, at the
user's direction, pending a live test of this pipeline.

Worth noting for when that decision is revisited: it fails the inclusion test badly. Its rule
*"Never place a background behind an icon — no plate, circle, rounded square, tint, or shadow"*
breaks six of twelve packs (`neumorphism`, `skeuomorphism`, `glassmorphism`, `neo-brutalism`,
`bento`, `flat`), and it bans glassmorphism by name. It is a **13th style pack**, not engine
material. Its genuinely style-neutral parts — the breakpoint table through 4K, the state and
reactivity discipline, "scale by ratio not raw artboard pixels", "annotations are not copy" — are
the parts worth harvesting later.

## Kept, with the reason it survived the test

| Rule | Why it is style-neutral |
|---|---|
| Em-dash ban | Typographic tell in copy, independent of visual language. |
| `window.addEventListener("scroll")` ban | Performance, not taste. |
| `backdrop-filter` only on fixed / sticky | Performance. Binds `glassmorphism` too — that pack gets frosted panels, not a frosted scrolling page. |
| WCAG AA contrast on CTAs and forms | Accessibility floor. `neo-brutalism` satisfies it by construction; `neumorphism` has to work for it. Neither is exempt. |
| `prefers-reduced-motion` above MOTION 3 | Accessibility floor. |
| Theme / shape / accent locks | Consistency mechanics. Each pack decides *what* the value is; the lock says hold it. |
| Hero fits viewport, nav on one line, explicit mobile collapse | Broken layout is broken under any style. |
| Grid cell count matches content count | An empty tile is a planning error, not an aesthetic. |
| No div-based fake screenshots | The clearest single AI tell, and no pack calls for it. |
| Generic names, Acme, filler verbs, fake-precise numbers | Content tells, orthogonal to visual style. |
| Design-system map (§2.A) and appendices | Package selection, no visual opinion. |
| Out-of-scope list | Scope, not style. |
