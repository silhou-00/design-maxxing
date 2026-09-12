# ROUTER

Routing table for the `design-studio` agent. Read this first, every run.

Root: `D:\GithubRepo\design-maxxing`

### Never read into context

Some files in this folder are **browser artifacts, not agent input.** They exist to be looked at by
a human, and reading one costs more than the entire engine.

| never read | open in a browser instead |
|---|---|
| `research/styles/<pack>/modules.html` | ~20KB — the eight modules, all states, dark mode, narrow width |
| `research/styles/<pack>/page.html` | ~13KB — one composition at page scale |
| `research/scroll/sections/<name>.html` | ~8KB — a live, scrollable demonstration |
| `research/specimens/*.html`, `research/scroll/specimens/*.html` | the launcher sheets |
| `research/styles/_shared/_audit-selftest.html` | the auditor's negative control — deliberately broken, must report 7 FAIL |
| any `refs/` image, `assets/` frame, or `.jpg` | |

`cat`-ing one of these blows the re-roll budget the load order below exists to protect. If you need
a value from a pack, it is in `tokens.json`. If you need a rule, it is in `style.md`.

Load order is fixed — **engine → platform → style pack → brief**. Static content first so prompt
caching holds it across re-rolls; swapping a style pack then invalidates only ~1.5K tokens.

---

## Gate 0 — Engine (always)

Load `engine/engine.md` first, every job. Style-neutral build rules: brief read, dials,
design-system map, architecture defaults, mechanical discipline, motion technique, performance and
accessibility, dark mode, universal anti-slop.

Cold files, load only when the job calls for them:

| File | Load when |
|---|---|
| `engine/design-systems.md` | the brief routes to a real design system (Fluent, Material, Carbon, Polaris, Primer, GOV.UK, USWDS, Radix, shadcn) |
| `engine/vocabulary.md` | naming or discussing a pattern, or reaching for one deliberately |
| `engine/preflight.md` | before delivering — always |
| `engine/EXCLUDED.md` | only to answer "why is rule X not in the engine" |

**A style pack outranks the engine.** Where a pack's `## banned` list contradicts an engine rule, the
pack wins, and you say so rather than splitting the difference.

The engine carries no style opinion. Typography choice, palette saturation, shadow treatment, pure
black, eyebrow usage and tile grids all live in the packs, because the packs disagree about them.
`engine/EXCLUDED.md` records each cut and the pack it would have broken.

---

## Gate 1 — Platform

Ask if the brief does not state it. Never infer from stack alone.

| Answer | Platform profile | Notes |
|---|---|---|
| web | `platform/web.md` | default |
| ios | `platform/ios.md` | also load `kowalski/.agents/skills/apple-design/SKILL.md` |
| android | `platform/android.md` | |
| cross-platform | `platform/web.md` + note the constraint | |
| brand / assets only | none | skip to Gate 2 → `brand` |

Platform profiles are stubs until written. Missing file is not an error — proceed without it.

## Gate 2 — Intent

| Intent | Runs where | Load |
|---|---|---|
| new build | product repo | engine + style pack + **Gate 2.5**. **Not** `design-taste-frontend` — the engine supersedes its sections 0-4, 6-9, 13-14. |
| redesign existing | product repo | engine + style pack + **Gate 2.5** + `taste/.agents/skills/redesign-existing-projects/SKILL.md` |
| design spec / handoff | **here** | style pack + `taste/.agents/skills/stitch-design-taste/SKILL.md` → emits `DESIGN.md` |
| brand identity | **here** | `taste/.agents/skills/brandkit/SKILL.md` |
| reference images | **here** | `taste/.agents/skills/imagegen-frontend-web/SKILL.md` (web) or `imagegen-frontend-mobile` |
| motion / animation | product repo | `kowalski/.agents/skills/animate/SKILL.md` + `animation-vocabulary` |
| pick a library | either | `kowalski/.agents/skills/pick-ui-library/SKILL.md` |
| scroll animation | product repo | engine + style pack + **the pack row in `research/scroll/compatibility.md`** + the one matching `research/scroll/techniques/<name>.md`. See Gate 3.5. |
| scroll narrative | product repo | as above with `techniques/scrollytelling.md`; content sequencing, not a visual device |
| GSAP scroll skeletons | product repo | `design-taste-frontend` **lines 365-508 only** — sticky-stack / horizontal-pan / scroll-reveal, the one part of that skill not merged into the engine |
| name an effect | either | `kowalski/.agents/skills/animation-vocabulary/SKILL.md` |

## Gate 2.5 — Assets (every build and redesign, before any code)

Imagery used to be its own intent, which meant it only fired when the user asked for "reference
images". On a build it never fired at all — so a brief that said *"a real-life rendition of an old
computer in a room"* was rendered in `border-radius` and `linear-gradient`, because CSS was the only
vocabulary the route supplied. That is the failure this gate exists to prevent.

### The rule

**A real-world object, material, scene, person or product is a raster. It is never drawn in CSS.**

`impeccable`'s own asset agent states the principle: *"a subject that lives in photographs keeps its
photographs."* CSS renders layout, chrome and surface treatment. It does not render a CRT monitor,
a room, a fabric, a device, a plant, a face, or a physical product.

### The test — ask it out loud, every build

> Does the brief name anything that exists physically?

Concrete nouns are the signal: *monitor, desk, room, phone, hands, packaging, fabric, plant, camera,
building, food, person, product shot*. If yes, that thing is an asset, and the asset is produced
**before** the code that places it.

If the answer is genuinely no — a pure type-and-grid page — say so in one line and move on. Do not
skip the gate silently.

### Route

| Need | Runs where | Load |
|---|---|---|
| **Section comps** — the visual target to code against, one image per section | **here** (Class A) | `taste/.agents/skills/imagegen-frontend-web/SKILL.md` (web) or `imagegen-frontend-mobile` |
| **Real assets** — the actual object/scene rasters the page places | product repo (Class B) | `impeccable` → `comp-spec.mjs` → `impeccable-asset-producer` |
| **Brand marks, palette, logo** | **here** (Class A) | `taste/.agents/skills/brandkit/SKILL.md` |

`imagegen-frontend-web` has a hard output rule worth knowing before you call it: **one horizontal
image per section, never combined.** 6 sections → 6 images; "landing page" with no count defaults to
6. It also carries a hero-composition bias list, because left-text / right-image is the most
overused AI hero and it wants you to reach past it.

The impeccable chain is: approved comp → `comp-spec.mjs` writes `.impeccable/build/spec.json`
(the raster inventory — region id, kind, pixel box, sampled palette, aspect) → `asset-producer`
fills each region. It refuses to run without the spec, deliberately: "a second inventory disagrees
with the first."

### Declare it

Before writing code, write the plan to `output/<product>/assets.plan.json`:

```json
{ "assets": [
  { "id": "hero-crt", "kind": "photo", "subject": "1998 beige CRT monitor on a desk, dim room",
    "aspect": "16:9", "placement": "hero", "path": "public/assets/hero-crt.webp",
    "minWidth": 1950, "minWidthReason": "renders 810px at scale 1, camera zooms to 2.4×",
    "status": "outstanding" }
] }
```

`engine/audit.mjs` checks the built page against this file: every declared asset must exist and be
referenced. An empty `assets` array is a valid answer — it just has to be a stated one.

### `minWidth` is not optional

**Record the resolution the asset must be, and why.** An asset that exists but is too small is not a
delivered asset. A real case: a 643×632 CRT cutout was generated and correctly rejected, because the
element renders 810px before a 2.4× camera zoom — so it needed ~1950px. The reasoning was sound and
written into a code comment, where nothing could act on it. In the plan it becomes checkable.

Compute it as **rendered width × maximum scale applied to it**, and say so in `minWidthReason`.
`audit.mjs` warns on any image rendering more than 1.15× its natural width.

### When no image generator is available

This is a normal path, not a blocker. Generation may be unavailable — no API key, no funded account,
no native image tool. When that happens:

1. **Still declare the asset**, with `"status": "outstanding"` and its `minWidth`.
2. **Ship a placeholder that names itself** — `data-*="…-pending"`, or a class containing
   `placeholder` / `fallback`. `audit.mjs` FAILs on any unreplaced placeholder, which is what keeps
   it visible.
3. **Say it in the delivery report**, in one line: *"the hero plate is outstanding; CSS stand-in
   shipped; audit fails until it lands."*

What must **never** happen is the silent substitution: a real object quietly rendered in CSS with no
declaration, no placeholder marker, and no mention. That is the failure mode this whole gate exists
to prevent, and it is worse than an obvious gap because it looks finished.

Do not edit vendor scripts to work around a missing key. `impeccable`'s `generate-image.mjs` gates on
`OPENAI_API_KEY` by design; `taste/`, `kowalski/` and `impeccable/` are SHA-pinned in
`skills-lock.json` and edits are reverted on the next update. `IMPECCABLE_IMAGE_GEN_FAKE=1` exists to
exercise the pipeline without spending — it writes a placeholder plus a prompt sidecar.

---

## Gate 3 — Style pack

Ask. Do not pick for the user unless the brief names a style or an unmistakable synonym.

**Ask which modules the product actually needs before picking, not after.** Nav, hero, button
states, form + error, card, list/table, overlay, empty/loading. The answer changes the pick: a brief
heavy on data tables rules out `neumorphism` and `glassmorphism`, both of which visibly struggle
with one. Asking afterwards produces a re-roll.

Each pack is six files. Three are loadable, three are not:

| file | load when |
|---|---|
| `research/styles/<name>/style.md` | **hot** — every run. Build rules only, ~1.6K tokens |
| `research/styles/<name>/tokens.json` | you need exact values. `audit.mjs --pack <name>` opens it itself — `copyBudget` and `a11y` are its thresholds, not decoration |
| `research/styles/<name>/modules.md` | building any of the eight modules |
| `research/styles/<name>/reference.md` | citing the pack, or asked *why* a rule exists |
| `research/styles/<name>/modules.html` | **never read** — browser only |
| `research/styles/<name>/page.html` | **never read** — browser only |

`tokens.json` is the source of truth: `modules.html` and `page.html` are generated from it by
`research/styles/_shared/build-pack.mjs`, and each carries a **self-audit** that measures the
rendered page against WCAG and the pack's own `## banned` list.

| Pack | Identity |
|---|---|
| `bento` | Rounded compartments, tight gaps, varied spans |
| `brutalism` | Show the bones; browser defaults as a palette |
| `editorial` | A magazine spread that happens to be a web page |
| `flat` | Zero depth; colour and type do all the work |
| `glassmorphism` | Frosted panels over a colourful backdrop |
| `hand-drawn` | Grid it, then knock everything out of true |
| `minimalism` | Fewest elements; each one justified |
| `modernism` | Form follows function; geometry, grid, primaries |
| `neo-brutalism` | 2px black border, 4/4 hard shadow, 5px radius, flat fill |
| `neumorphism` | One surface colour; depth from a light and a dark shadow |
| `skeuomorphism` | Imitates real materials so the control explains itself |
| `swiss` | Strict modular grid, Helvetica, flush left, one red |

**Deciding is two stages, and they use different artifacts.**

1. **Pick** — `research/specimens/index.html`, twelve tiles in one glance. Each tile's corner tag
   links onward.
2. **Verify** — that pack's `modules.html`. This is where a pack that looked right reveals that its
   table module is weak, or that its focus state fights its own palette. Cheaper to discover here
   than after a build.

Both are browser artifacts. **Give the user the path; do not read them.**

**Packs are mutually exclusive. Never blend two.** They contradict by descent, not by accident:
Bauhaus reacts against Art Nouveau; Swiss and minimalism descend from Bauhaus; brutalism reacts
against modernism; flat replaces skeuomorphism; neumorphism and glassmorphism are flat re-softened.
`minimalism` bans shadows because `skeuomorphism` is made of them. Blending yields neither.

One pack per surface. A product may use a bold pack on marketing pages and `minimalism` on core
flows — that is two surfaces, not a blend. State it explicitly when you do.

**A pack's `## banned` section is a hard filter.** It overrides any conflicting guidance from a
vendor skill. If a vendor skill prescribes what the pack bans, the pack wins.

---

## Gate 3.5 — Scroll technique (only if the job involves scroll motion)

**Start from the job, then the pack.** `research/scroll/compatibility.md` is a scenario guide, not a
permission table — it used to grade every cell ●/○/⚠/✗ and that read as a list of what you were
allowed to do. Now it tells you, per pack, where scroll genuinely serves the style and the few places
a technique fights the pack's own `## banned` list, with the rule quoted.

1. Open `compatibility.md` at its "by what they *do*" table — pick the technique whose *job* matches
   the brief (bring content on · show position · hold a stage · step through states · move a rail…).
2. Read the `### <pack>` section for the chosen pack. About 400 tokens. If your pick appears under
   **Friction**, that's not a stop sign — it names the pack rule you'd be spending. Say so to the
   user and let them decide; the brief outranks the guide.
3. Load only that one file from `research/scroll/techniques/`. Each carries CSS, JS, cost,
   accessibility, and when not to use it.

4. To *show* the technique rather than describe it, give the user
   `research/scroll/sections/<name>.html` — a live, scrollable demonstration that self-audits
   against `engine.md` §6. Browser only; **never read it**.

**16 techniques** — `view-transition` sits off the scroll axis (it animates on arrival, not while
scrolling), so no pack's scroll rules reach it. It is the honest page-level choice for `brutalism`
and `neumorphism`, where most scroll polish fights the pack.

Two reference files, neither of which routes anything:

| file | load when |
|---|---|
| `research/scroll/libraries.md` | choosing between native CSS, Motion, Anime.js and GSAP — sizes, licences, what each is for |
| `research/scroll/authoring-tools.md` | the motion **asset** — Jitter, Lottie, Rive, Threlte / react-three-fiber |

**Fourteen of the sixteen sections need no JavaScript at all**, including a 48-frame video scrub —
a frame sequence has no `currentTime` to set. Check `sections/` before assuming a library.

16 techniques: `scroll-reveal` · `scroll-progress` · `parallax` · `pinned-scene` · `stacking-cards` ·
`scrollytelling` · `horizontal-scroll` · `scroll-snap` · `smooth-scroll` · `video-scrub` ·
`scroll-world` · `text-reveal` · `svg-path-draw` · `scroll-theme-shift` · `scroll-marquee` ·
`view-transition`

**Restraint reads as confidence — an observation, not a cap.** Professional scroll work usually
picks one or two techniques deliberately and lets the rest of the page simply be there. Two
amateur tells worth knowing by name: content that fades *out* on exit (disappearing under the
reader), and dead scroll punctuated by hard cuts (65vh of nothing, then a snap to a new state). If
scroll drives discrete states, animate the transition and give each band something that moves.

Quick orientation:

* `neo-brutalism` — the easiest style to do scroll well in; built from `transform` and hard shadows,
  which composite cheaply. Stacking cards with a hard shadow is the standout
* `glassmorphism` — the best-matched and most expensive; parallax *behind* glass is the signature
  pairing, `backdrop-filter` re-blurring every frame is the FPS killer. One glass layer per view,
  never on a repeating item
* `brutalism` — native scroll *is* the style; smooth scroll is the most anti-brutalist move
  available. The marquee is its natural scroll effect; `view-transition` at `steps(1)` its natural
  page effect
* `neumorphism` — component-scale, so page-scale techniques have nothing to act on. One surface, no
  layers, so parallax has nothing to move
* `hand-drawn` × `svg-path-draw` and `editorial` × `scrollytelling` — the two cleanest matches

**`scroll-world` is technique plus generated art direction sold as one unit.** It owns the ground
layer: packs that also own the ground (skeuomorphism, neumorphism, flat, bento, hand-drawn,
brutalism) are overwritten by it; chrome packs (glassmorphism, minimalism, editorial) compose with
it — glassmorphism actively benefits. It is the only item with a **per-build cash cost** — roughly N image plus 2N−1 video
generations, mobile doubling the video count, ~$27 for a six-scene 1080p chain. Confirm before
proposing it.

Engine §6 carries the style-neutral half: CSS-first defaults, the four reasons to reach for a
library, the mandatory `@supports` fallback, composite-only properties, reduced motion.

---

## Class A / Class B

**Class A — runs here.** Output is portable: specs, images, palettes, `DESIGN.md`.
`brandkit` · `imagegen-frontend-web` · `imagegen-frontend-mobile` · `stitch-design-taste` ·
`apple-design` · `emil-design-eng` · `animation-vocabulary` · `pick-ui-library` · all style packs

**Class B — must run in the product repo.** Operates on real code or needs a live dev server.
`impeccable` · `design-taste-frontend` · `redesign-existing-projects` · `animate` ·
`review-animations` · `improve-animations` · `find-animation-opportunities` · `prototype` ·
`full-output-enforcement` · `ask-sonner`

`impeccable` registers `PostToolUse` + `Stop` hooks against `${CLAUDE_PROJECT_DIR}` and injects a
script tag into the project's real `index.html`. It does nothing in this folder.

Install Class B into a product repo with:

```
node D:/GithubRepo/design-maxxing/install-class-b.mjs <target-repo> <skill> [<skill>...]
```

It merges hooks into the target's `settings.local.json` — it does not overwrite them.

---

## Handoff contract

**In / Out:** `briefs/<product>.md` — **the agent writes this, before it builds anything.** It is
both the record of what was asked and the scope contract for the next revision.

It carries: the request verbatim, the revision number, what changed since the last revision, platform
/ intent / pack, the **Gate 2.5 physical-noun answer**, and an explicit in-scope / out-of-scope list.

Two things depend on it:

* **Auditability.** Without it the request lives only in a chat transcript. A delivery once shipped
  with `DESIGN.md` stating *"the photograph carries all the visual richness"* while the build drew
  that photograph as a CSS gradient — nothing caught it, because there was nothing to check against.
* **Cost.** The *"changed since last rev"* list is what bounds a revision's reading. A mature
  `design/` folder measured ~220KB (~55K tokens); re-reading it for a spinner tweak is the
  difference between a 30K run and a 200K one. Grep the big documents, read the named ranges.

**Out:** `output/<product>/` — `DESIGN.md`, tokens, generated images, notes.

**Back to the product repo:** copy artifacts to `<product-repo>/design/`, then install the Class B
skills that intent requires. Structure decisions belong to the product repo's own planning context —
do not invent component hierarchy or routing here.

---

## Vendor packs

Sources of truth, npx-managed, SHA-pinned in `skills-lock.json`. Never edit or delete a skill inside
them; it desyncs the lock and gets restored on update.

- `taste/.agents/skills/<name>/SKILL.md` — 13 skills
- `kowalski/.agents/skills/<name>/SKILL.md` — 12 skills
- `impeccable/.claude/skills/impeccable/` — 1 skill + 4 agents, 4.4M of scripts

Sizes matter: `design-taste-frontend` is 88KB (~22K tokens). Load it only when intent requires it.

Not routed to, deliberately: `design-taste-frontend-v1` (legacy), `write-swift` (not design),
`animate-expo` (React Native only), `gpt-taste` (its bento and variance rules are superseded by the
pack catalogue), `image-to-code` (written for Codex).
