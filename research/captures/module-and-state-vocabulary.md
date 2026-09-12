# Capture — the module and state vocabulary the packs are missing

**Sources:** w3.org/WAI/WCAG22/Understanding/focus-appearance · …/target-size-minimum ·
…/non-text-contrast · ui.shadcn.com/docs/components · m3.material.io/components ·
blog.logrocket.com/ux-design/skeuomorphism-ux-design-examples · nngroup.com/articles/flat-design
**Captured:** 2026-09-04

**The finding that motivates this file.** Grepping all twelve `style.md` for interaction and
accessibility terms:

| term | packs that mention it |
|---|---|
| `focus-visible` | **0 of 12** |
| contrast ratio / `4.5:1` | **0 of 12** |
| target size | **0 of 12** (only `swiss` names `44px`, in passing) |
| nav / header | **0 of 12** |
| empty state | **0 of 12** |
| `prefers-color-scheme` | **0 of 12** (only `skeuomorphism` says "dark mode") |
| hover | 1 (`neo-brutalism`) |
| disabled | 2 (`flat`, `neumorphism`) |
| modal | 1 (`glassmorphism`) |

**The packs define a look, not a system.** They specify radius, shadow, palette and type — the
resting appearance of a surface — and say almost nothing about what happens when a user points at
it, tabs to it, breaks it, or empties it. That is the structural reason a build can satisfy a pack
completely and still be wrong.

`research/specimens/index.html` renders each pack as one ~300px tile with a handful of elements. It
was built to answer "which of these do I want", and it answers that well. It cannot answer "what
does a disabled input look like in this pack", because nothing has ever specified it.

---

## Part 1 — the state floor, with the numbers

These are standards, not preferences. They apply to every pack and no pack's `## banned` list
overrides them. Where a pack's aesthetic collides with one of these, the pack has to give.

### Focus — WCAG 2.2 SC 2.4.13 Focus Appearance

Two independent requirements:

**Area.** The indicator must be "at least as large as the area of a **2 CSS pixel thick perimeter**
of the unfocused component."

* rectangle: minimum area = `4h + 4w`
* circle: minimum area = `4πr`
* worked example from the spec: a 90×30 button needs **480px²**

A 2px solid outline is the simplest way to pass. It does not have to *be* an outline — only to meet
the area.

**Contrast.** "a contrast ratio of at least **3:1** between the same pixels in the **focused and
unfocused states**."

Note carefully: this is a *change* of contrast between two states of the same pixels, not the
contrast of the ring against its neighbour. Only the portion that actually changes counts, and that
portion alone must satisfy the area minimum. On a gradient, only pixels clearing 3:1 count.

**Exceptions:** the indicator is the user agent's and cannot be adjusted; or the author has modified
neither the default indicator nor its background.

> Since **no pack mentions `:focus-visible` at all**, every pack is currently relying on the second
> exception by accident. That works only until a pack restyles a button's background — which all
> twelve do.

### Target size — WCAG 2.2 SC 2.5.8 (Minimum)

**24 × 24 CSS pixels.** Not 44 — 44 is Apple's usability guidance and WCAG's AAA-level 2.5.5.

`engine/audit.mjs` already has this right, with the reasoning in a comment:
`minTapPx: 44, // WCAG 2.5.8 target size (minimum) is 24; 44 is the usable bar`.
The packs have it nowhere.

Five exceptions. The first is the one that matters in dense layouts:

1. **Spacing** — an undersized target passes if a **24px diameter circle** centred on its bounding
   box does not intersect another target or another target's circle. Targets with 4px between them
   pass; touching targets fail.
2. Equivalent function available elsewhere on the page
3. **Inline** targets — links inside a sentence, or constrained by surrounding line-height
4. User-agent default rendering, unmodified
5. Essential — e.g. map pins

### Non-text contrast — WCAG SC 1.4.11

**3:1** against adjacent colours, and the spec is explicit that "computed values should not be
rounded (e.g. 2.999:1 would not meet the 3:1 threshold)."

Must meet 3:1:
* active/enabled components in their default state
* focus indicators
* state indicators — checked, selected, pressed

**Do not** have to meet 3:1 — and these two exemptions are load-bearing for several packs:
* **disabled controls** — "not required to meet contrast requirements"
* **hover effects that are supplemental** — the pointer position already signals hover

A visible boundary is not required when text or an icon already identifies the control. It *is*
required when the boundary is the only thing indicating the control exists.

### What this resolves for two specific packs

**`neumorphism`.** Its whole method is one surface colour with a light and a dark shadow — which
means its control boundaries are shadows, and shadows against the same background rarely clear 3:1.
The pack acknowledges a contrast problem in prose. The rule above says precisely where it fails:
a neumorphic control whose *only* affordance is the shadow pair must clear 3:1 on that shadow. If
it carries a text label, it does not have to.

**`flat`.** Bans shadows; `audit.mjs` enforces it. NN/g's finding is that removing depth cues has
been "reducing user efficiency by complicating their understanding of what's clickable." The
exemption above is the reconciliation: hover may stay supplemental, but the **resting** state must
identify the control through type, colour, contrast or wording — because flat gave up the other
channel voluntarily.

---

## Part 2 — the module set

shadcn/ui ships ~65 components; Material 3 ships a comparable list. Neither is a specimen set — at
that size the sheet stops being comparable and becomes a component library per pack, twelve times
over.

**The selection rule: include a module only where the twelve packs would visibly disagree.**
A `Separator` is a 1px line in all twelve. A form field's error state is different in all twelve,
and is currently undefined in all twelve.

That gives eight modules:

| # | module | why the packs disagree |
|---|---|---|
| 1 | **Nav / header** | 0 of 12 specify one. Density, whether it is a bar or bare links, whether it sticks — every pack answers differently |
| 2 | **Hero** | the pack's loudest statement; also where `engine.md` §5's copy limits bite |
| 3 | **Button, 5 states** | default · hover · active · **focus-visible** · disabled. The state floor above lives or dies here |
| 4 | **Form field + error** | label position, border treatment, and how an error reads without relying on red alone |
| 5 | **Card / tile** | `bento` is made of these; `brutalism` and `editorial` reject the container entirely — that disagreement is the point |
| 6 | **Data list or table** | where `swiss`, `brutalism` and `bento` are strongest and `neumorphism` and `glassmorphism` visibly struggle |
| 7 | **Overlay — modal or sheet** | only `glassmorphism` mentions one. Scrim treatment is a pure style decision |
| 8 | **Empty / loading state** | 0 of 12 specify one, and it is the state most often shipped as an accident |

Two cross-cutting axes rendered per pack rather than as separate modules:

* **Dark mode** — `prefers-color-scheme`, absent from all twelve. Some packs invert cleanly
  (`bento`, `brutalism`); some are defined by a light surface and cannot (`neumorphism`); that
  difference belongs on the sheet.
* **Narrow width** — `bento`'s own Gotchas say mobile is where it breaks. Nothing renders it.

**Keep the picker sheet.** `research/specimens/index.html` stays exactly as it is — twelve tiles,
one glance, one decision. The module set is a *second* artifact, one file per pack at
`research/styles/<pack>/modules.html`, loaded only after the pack is chosen. That preserves
`ROUTER.md`'s load-order argument, where a style re-roll costs ~1.5K rather than a full reload.
Twelve full module sets in one document would cost more than the entire engine.

---

## Part 3 — content rules, per pack rather than global

`engine/audit.mjs` already enforces copy **volume** globally:

```js
charsPerViewportMax : 420,   // §5: ≤8-word headline + ≤25-word sub per section
largestBlockMax     : 320,
```

Two things are wrong with that as the whole story.

**It is one number for twelve packs that disagree about copy.** `editorial` is *"a magazine spread
that happens to be a web page"* and wants paragraphs; 420 chars per viewport fights it. `bento`
needs "a single number, chart or statement" per cell and 420 is far too loose. Both are currently
measured against the same ceiling.

**There is no measure check at all.** Line length has a formal standard and the audit does not test
it:

* **WCAG SC 1.4.8: 80 characters or fewer** per line (40 for Chinese, Japanese, Korean)
* **Emil Ruder: 50–60** characters optimal for body text — Ruder is a Basel School figure, the same
  lineage as the `swiss` pack
* working range **50–75**; implement as `max-width` in `ch`

Only two packs state a measure today: `editorial` (`58–70ch`, `34–44ch` per column) and `minimalism`
(`34–70ch`). Ten state none.

Measure is computable from rendered width and font metrics, so this is mechanically checkable — the
same class of rule as the existing `PACK_RULES`, which currently cover banned CSS only, and cover it
unevenly: `bento`'s entry is `{ 'parallax layers': p => 0 }`, a literal no-op, and `modernism`,
`hand-drawn` and `skeuomorphism` have no entry at all.

**Proposed shape** — a machine-readable block in each `style.md`, read by `audit.mjs` via `--pack`
to override the global `T` thresholds:

```yaml
copy budget:
  measure:            50-75ch        # WCAG 1.4.8 ceiling is 80
  headline words:     ≤8
  sub words:          ≤25
  button label words: ≤3             # engine.md: "ideally 1-2"
  chars per viewport: 420            # pack overrides: editorial higher, bento lower
```

---

## Part 4 — `skeuomorphism`, the thinnest-sourced pack

It cites Wikipedia and Looka, and ships **zero reference images**. Better framing, sourced:

**Etymology** — Greek *skeuos* (container/tool) + *morph* (shape). Originally described physical
products retaining the form of an earlier iteration.

**Don Norman's framing, and the reason this pack is not decoration.** Norman describes skeuomorphic
design as a **"perceived affordance"** — a visual detail telling the user an action is possible. A
raised, glossy button says *press me*. That is the same goal Rams reaches for in principle #4
("makes a product understandable… at best, it is self-explanatory") by the opposite method, and it
is why `minimalism` and `skeuomorphism` ban each other's techniques while sharing an intent.

**Techniques, specifically:** realistic textures; gradients, highlights and shadows for depth;
**bevelled edges**; simulated materials — leather, paper, metal, brushed aluminium.

**Documented downsides:**
1. **Obsolescence** — "objects mimicked in skeuomorphism have become obsolete and meaningless to
   users (e.g. the floppy disk)"
2. Visual clutter
3. **Scalability** — raster-based realism ports badly across densities
4. Performance cost
5. Ages poorly

**When it is still right:** affordance signalling; watch faces; branding where the material *is* the
product (Paperlike, Notability); financial apps where a wallet or piggy bank metaphor aids
comprehension. The rule the source gives: *use it where a real-world metaphor improves
discoverability or reduces learning; avoid decorative realism that adds clutter.*

**Timeline:** peak at iOS 6 / OS X Mountain Lion, 2012 — lined notepad in Notes, wooden shelves in
Newsstand, metal microphone in Voice Memos. iOS 7 ends it in 2013. Apple now uses skeuomorphic
*cues* rather than full mimicry.

**And the live thread worth flagging.** Apple's 2025 Liquid Glass is widely read as the first
material-realism move since iOS 6 — a real material with refraction and luminosity response, not a
flat translucency. If that reading holds, `skeuomorphism` and `glassmorphism` are converging rather
than sitting at opposite ends of the descent chain, which is how `ROUTER.md` currently frames them.
**Do not write that into the packs yet** — it is a press-and-commentary reading, not a sourced
claim. Flagged for a later pass.
