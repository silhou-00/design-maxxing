# Editorial — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A masthead: the title at scale, a rule under it, and small-caps section labels. No bar, no fill. This is the one pack where the header is *typography* rather than chrome.

## 2. Hero

A deck, not a headline — **the only pack that raises the engine's 8-word limit, to 9**, because a magazine deck is a sentence. The kicker above it does the work an eyebrow does elsewhere.

## 3. Button — five states

Editorial barely has buttons. The primary is a solid ink block; secondary is a ruled link. Focus uses the editorial red, which already means *the marked thing* in this pack's vocabulary.

## 4. Form field + error

A subscribe field — the only form a magazine has. Ruled underline, serif input text, error as a red rule plus a line of italic.

## 5. Card

**There is no card, and that ban is load-bearing.** The specimen shows the alternative: content separated by a column rule and space. A card grid is the exact opposite of an editorial spread.

## 6. List / table

Ruled rows, no fills, serif figures. Tabular numerals matter here — `font-variant-numeric: tabular-nums` keeps a column of figures aligned in a proportional serif.

## 7. Overlay / modal

A paper panel over a warm scrim. No radius, no shadow — the panel is identified by the rule at its head, like a sidebar in print.

## 8. Empty / loading

A kicker, a line of italic, one action. Editorial has a natural vocabulary for absence: the standfirst that says what would have been here.

---

## Dark mode

Warm paper inverts to **warm near-black** `#17150f`, not neutral grey. A cold dark mode makes serif body text read like a terminal.

Warm paper inverts to warm near-black #17150f, not neutral. A cold grey dark mode makes serif body text look like a terminal. Ink becomes #ece7dd.

## Narrow width

Two columns collapse to one and the measure caps at 62ch. The display size drops but **the 3:1 ratio does not** — that ratio is the style, and it is the first thing lost on mobile.

## Scroll

Headline technique: **scrollytelling (●)**

this style IS long-form narrative. Scrollytelling is not an effect bolted on — the sticky image with text scrolling beside it is literally a magazine spread.

Also core: `scroll-progress` · `pinned-scene` · `text-reveal` · `svg-path-draw`

**Banned for this pack:**
- scroll-snap — snapping fights reading, and this style exists to be read

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
