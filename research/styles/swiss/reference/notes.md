# swiss — researched values and corrections

Values needed by a build that the pack did not carry, plus one correction to a value it does.
Appended to, never rewritten. `style.md`, `tokens.json` and `reference.md` are the pack; this file
is the working record beside it.

---

## 2026-09-07 — flag red contrast, measured

**Recorded by:** the `mbalanlay-portfolio` rev 1 build (`briefs/mbalanlay-portfolio.md`).

`tokens.json` and `modules.md` both state that `#e2231a` measures **4.9:1 on black** and **4.3:1 on
white**, and `modules.md` concludes the red is *"actually better on black than on white."*

Computed here with the WCAG 2.x relative-luminance formula, the numbers come out differently and the
conclusion reverses.

**Method.** For each 8-bit channel `C`: `c = C/255`, then
`lin = c/12.92` if `c <= 0.04045`, else `((c + 0.055)/1.055)^2.4`.
Then `L = 0.2126·R + 0.7152·G + 0.0722·B`, and
`ratio = (L_light + 0.05) / (L_dark + 0.05)`.

**`#e2231a`** — R 226, G 35, B 26

| channel | `c` | `lin` |
|---|---|---|
| R | 0.886275 | 0.760540 |
| G | 0.137255 | 0.016794 |
| B | 0.101961 | 0.010328 |

`L = 0.2126(0.760540) + 0.7152(0.016794) + 0.0722(0.010328) = 0.174448`

| pair | computed | pack states |
|---|---|---|
| `#e2231a` on `#000000` | **4.49 : 1** | 4.9 : 1 |
| `#e2231a` on `#ffffff` | **4.68 : 1** | 4.3 : 1 |
| `#ffffff` on `#e2231a` | **4.68 : 1** | not stated |

So the red is marginally **better on white**, not on black — the opposite of the note in
`modules.md` and `sheet.notes.dark`.

**Why it does not change any rule.** Every use the pack makes of the red clears its threshold on
both grounds:

- focus ring, WCAG 2.4.13, needs a 3:1 change — 4.49 and 4.68 both pass
- non-text contrast, 1.4.11, needs 3:1 — both pass
- large text, 1.4.3, needs 3:1 — both pass
- **normal body text needs 4.5:1 — 4.49 on black fails by 0.01**

**Operative rule that falls out of it:** *the flag red is a fill, a rule, a focus ring and large
display only. It never sets normal-size body text, on either ground.* That is consistent with how
the pack already uses it (bars, rules, focus, error rules) and with `sheet.notes.form`, which
requires a red state to carry a word or a rule beside it rather than standing alone.

Not fixing `tokens.json` — the pack is SHA-managed and its self-audit is the authority for pack
conformance. Recording the discrepancy here so a future build does not "correct" one number with
the other, and so nobody sets 13px body copy in red on the strength of a 4.9 that is really a 4.49.

---

## 2026-09-07 — the darkest legal structural hairline on the dark ground

**Recorded by:** the same build.

The pack sets `a11y.nonTextContrastMin: 3` but names no grey for a 1px structural line — `color.grey
#6e6e6e` / `darkMode.grey #a0a0a0` are specified for *"meta and captions"*, which is a text role, not
a rule role. A build that needs a visible cell frame on the black ground has to derive one.

Solve for the darkest grey that still reaches 3:1 against `#000000`:

```
(L + 0.05) / 0.05 = 3
L = 0.10
sRGB = 1.055 × 0.10^(1/2.4) − 0.055 = 0.34922
channel = 0.34922 × 255 = 89
```

**`#595959` — 3.00:1 on `#000000`.** Equivalent to `rgba(255,255,255,0.35)` composited on black.

The light-ground mirror, for completeness — darkest is not the question there, lightest is. Solve
`1.05/(L + 0.05) = 3` → `L = 0.30` → channel `179` → **`#B3B3B3`, 3.00:1 on `#ffffff`.**

Both sit inside the pack's "black, white, greys" palette and add no hue, so `maxHues: 1` is intact.

---

## 2026-09-07 — squared-terminal grotesques that satisfy `type.family`

**Recorded by:** the same build, which was briefed for "a modern font with block corners".

`type.family` names Helvetica / Helvetica Neue / Univers / Akzidenz-Grotesk, or Inter / Neue Haas.
The `## gotchas` section already warns that `font-family: Helvetica` silently resolves to Arial on
Windows. Two web-available faces that meet the pack's constraint (grotesque, not serif, not display)
while reading noticeably squarer than Helvetica:

| face | source | role | note |
|---|---|---|---|
| **Archivo** | Google Fonts, variable `wght 100-900`, plus an Expanded width | display and UI | Omnibus-Type grotesque in the American-gothic line. Terminals cut flat. The closest freely-hosted relative of Akzidenz that the pack names. |
| **Martian Mono** | Google Fonts, variable `wght 100-800`, `wdth 75-112.5` | data, tabular, labels | Evil Martians, square-shouldered, built for terminals. Wide — use at meta and micro sizes, never for running prose. |

Both verified resolving `200` from `fonts.googleapis.com/css2` on 2026-09-07.
`next/font/google` exports: `Archivo`, `Martian_Mono`.

**Archivo Black is not an option.** It is a display cut, and the pack bans display typefaces.

---

## 2026-09-07 (rev 2) — a softened light ground, and every value that had to move with it

**Recorded by:** the `mbalanlay-portfolio` rev 2 build, after the user rejected both pure ends:
*"black and white, white is the background, black is the texts but not entirely 00000 and FFFFF so
its not too bright."*

The pack's light ground is `#ffffff` with the role note **"the ground. White, not off-white"**, and
its ink is `#000000`, "pure black, this pack is one of the few that earns it." Softening both is a
**deviation**, not a derivation. Recording it because the knock-on effects are not obvious and a
future build that softens the ground without recomputing the rest will ship three quiet failures.

**The pair chosen:** ground `#F3F2EE` (L = 0.887320), ink `#1A1A1A` (L = 0.010330).
**Contrast 15.54:1.** Pure black on pure white is 21:1, so roughly 26% of the ratio is spent to buy
the softening. The monochrome reading survives: anything above about 12:1 still reads as
unambiguous black-on-white, which is what keeps a "binary" brief intact.

### What an 11% ground softening actually costs

| value | on `#ffffff` | on `#F3F2EE` | consequence |
|---|---|---|---|
| pack grey `#6e6e6e` | 5.10:1 | **4.55:1** | clears AA by 0.05. Too thin to build on. |
| pack red `#e2231a` | 4.68:1 | **4.18:1** | still clears 3:1, still fails 4.5:1 |
| white text on a red fill | 4.68:1 | **4.18:1** | **a red filled button stops being legal** |

Three fixes fall out:

1. **Meta grey moves to `#666666`** (5.13:1), restoring the headroom the ground cost. Still a pack
   grey, no hue added, `maxHues: 1` intact.

2. **The structural hairline is the mirror of the dark-ground problem.** On a dark ground you solve
   for the *darkest* legal line; on a light ground, the *lightest*. Solving
   `(0.887320 + 0.05) / (L + 0.05) = 3` for the pack's own `a11y.nonTextContrastMin: 3`:
   `L = 0.262440` → `1.055 × 0.262440^(1/2.4) − 0.055 = 0.54922` → `× 255 = 140` → **`#8C8C8C`,
   3.00:1.** The pure-white mirror, for the record, is `#B3B3B3`.

3. **Red may not be a fill behind text on a softened light ground.** On `#ffffff` the pack's red
   carries white text at 4.68:1 and a red button is legal. Take 11% off the ground and *neither*
   the paper (4.18:1) nor the ink (3.72:1) clears 4.5:1 on that fill. This costs the pack nothing —
   `sheet.notes.button` already specifies "a black box that inverts on hover" — but it removes an
   option a builder might otherwise assume is available. **On a softened ground, red is a rule, a
   bar, a ring and a marker. Never a fill under type.**

### The photographic re-grade reverses direction, it does not disappear

`darkMode.note` says *"photography must be re-graded or objective colour images float on a black
ground."* The requirement is ground-agnostic; the treatment is not, and a re-grade tuned for one
ground actively fails on the other.

| ground | failure mode | treatment |
|---|---|---|
| `#000000` | light screenshots **glow** | `grayscale(1) contrast(1.08) brightness(.86)` — darken |
| `#F3F2EE` | light screenshots **dissolve** into the page and lose their edges | `grayscale(1) contrast(.9) brightness(.95)` — flatten |

The light-ground check that matters: push a plate's white pixel through the filter,
`255 → (255−128)×0.9+128 = 242.3 → ×0.95 = 230`, against a ground of 243. **Nothing inside a plate
may be brighter than the page.** If it is, the plate reads as a hole rather than an object.

The 1px cell frame also does more work on a light ground than on a dark one: on black, a pale plate
separates itself; on off-white, the frame is the only thing separating it. On a light ground the
frame is not optional.

### Full-bleed changes the asset floor, not just the layout

Worth recording because it caught this build out. Removing the page `max-width` made the lead cell
of a `span 7 of 12` wall render roughly **1250 CSS px** at a 2560px viewport, against roughly 419px
in the same design at a 1280px centred container — a 3x jump in required source resolution from a
layout decision alone. `audit.mjs` warns above 1.15x natural width, so a full-bleed grid needs its
largest cell assigned to the asset with the widest source, not to the most important project.


---

## 2026-09-07 (rev 3) - a disclosure widget for a pack with no shadows, no radius and no easing

**Recorded by:** the `mbalanlay-portfolio` rev 3 build, which had to demote two sections the user
called "not exactly important" without adding a device the pack forbids.

The pack removes every component a conventional accordion is built from: `radius 0`,
`shadow: none`, `allowGradient: false`, and `motion.note` "no easing. Swiss is objective and precise;
a transition is neither." Its `banned` list also rules out icon sets, so there is no chevron to
rotate - and a rotating chevron would be eased motion, banned twice over.

**Answer: native `<details>` / `<summary>`, styled as a rule.** It is the only disclosure primitive
that survives the whole list. Correct semantics, keyboard support, screen-reader announcement of
expanded state, no script, and critically **no default animation**, which is what the pack wants
rather than a limitation to work around.

Details that are not obvious and cost this build a rewrite:

- **A preview row must sit OUTSIDE the `<details>`, not inside it.** A closed `<details>` hides every
  child except `<summary>`, and no amount of `display` on a descendant overrides that. Placing the
  preview outside makes the `<summary>` mean "N more", which is also what it honestly does. A first
  attempt put the preview inside and drove it with JS; it cannot work.
- **State marker as two spans toggled by `details[open]`**, not CSS generated content, so screen
  readers get real text. `[ + ]` and `[ - ]` as typed monospace characters need no icon family.
- `summary { list-style: none }` plus `summary::-webkit-details-marker { display: none }` to remove
  the default triangle, which is a decorative glyph in a pack that bans them.
- **Do not attach a scroll-driven reveal to disclosure content.** A `view()` timeline cannot resolve
  against a `display: none` subtree; content revealed by opening a `<details>` may appear already
  past its `animation-range` and settle at `opacity: 0` with no scroll left to drive it. Same bug
  class as a reveal shipping without its `@supports` fallback.

**The demotion that actually works is typographic, not structural.** Dropping the two secondary
bands from the heading size to the sub size (here 32-48px down to 18-24px) reads as secondary
immediately and costs zero vertical space. In a pack whose entire hierarchy is size and weight, this
does more than the collapse does.

---

## 2026-09-07 (rev 3) - where the icon-set ban actually falls

**Recorded by:** the same build, after a user overrode an earlier reading of mine.

The pack bans "illustration, icon sets, decorative flourishes". In rev 1 I read that as covering
brand marks and converted GitHub / LinkedIn / Facebook logos into the words `github` / `linkedin` /
`facebook`. The user rejected it and asked for the marks back.

**They were right, and the inconsistency is worth recording so the next build does not repeat it.**
The same page already rendered Oracle, ISC2, APNIC and TESDA logos in its credentials list, which the
pack permits as objective imagery of real marks. Treating those as legitimate and the GitHub mark as
banned was not a defensible line.

**The line that is defensible:** a *brand mark* is a real-world object rendered objectively, the same
category as the pack's "objective photography". A word cannot replace it, because a mark is
recognised pre-attentively and a word must be read. An *icon set* is a system of invented pictograms
standing in for verbs and states - chevrons, hamburgers, play triangles, arrow glyphs, gear symbols.
That is what "illustration, icon sets, decorative flourishes" is about, and it stays banned.

Two constraints hold on the marks regardless:

- **Monochrome is mandatory.** `fill: currentColor`. Three brand colours would take a `maxHues: 1`
  pack to four hues instantly. This is the part that is genuinely not negotiable.
- **Source them, do not draw them.** Simple Icons via `@icons-pack/react-simple-icons`. The engine
  forbids hand-rolled SVG icon paths and names Simple Icons as correct; the repo this replaced had
  three hand-rolled paths.

Alignment note worth keeping: a mark has no baseline, so aligning its bounding box bottom to a text
baseline sits it visibly low. Centre the box on the row's cap height instead.
