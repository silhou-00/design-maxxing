# Swiss Style (International Typographic Style) — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A rule and a row of labels. No bar, no fill, no radius. The active item is marked by **weight**, not by a pill — a pill would be a rounded container in a pack that bans radius.

## 2. Hero

**Size contrast is the whole move.** Tilda states it directly: large headings against small body text. A 46px display over 12px meta is more Swiss than any amount of grid.

## 3. Button — five states

A black box that inverts on hover. No transition — **Swiss is objective and precise; easing is neither**. Focus is the one place the flag red does double duty, at 4.3:1 on white.

## 4. Form field + error

A field is a box with a 2px rule under it. The error is a red rule plus text — red alone would be colour-only signalling, and this pack has exactly one red to spend.

## 5. Card

There is no card. Content occupies grid cells. The specimen shows cells with a top rule, which is the closest this pack comes to a container.

## 6. List / table

Swiss at its most natural — this is what the style was built for. Column heads at 11px +.02em uppercase, rules at 2px, everything flush left.

## 7. Overlay / modal

A flat black scrim and a white panel with a red rule. No radius, no shadow, no blur. The panel is identified by the rule, not by elevation.

## 8. Empty / loading

A red rule, a statement, one action. The pack has no dashed-border vocabulary — a dashed line is decorative, so absence is signalled by the red rule instead.

---

## Dark mode

Inverts to pure black. The red stays `#e2231a` and is actually *better* on black (4.9:1) than on white (4.3:1). **Photography must be re-graded** or objective colour images float on a black ground.

Inverts to pure black ground with white type. The red stays #e2231a — on black it is 4.9:1, slightly better than on white. Photography must be re-graded or it floats.

## Narrow width

12 columns collapse to 4, then to 1 — but the grid stays *visible*. A Swiss page that becomes a centred single column at mobile has stopped being Swiss.

## Scroll

Headline technique: **scroll-progress (●)**

a solid red bar, 4-8px, is straight out of the poster vocabulary. It is also the cheapest technique in the catalogue and survives reduced motion, because a progress indicator conveys position (WCAG 2.3.3 exempts it).

Also core: `scroll-snap` · `horizontal-scroll`

**Banned for this pack:**
- parallax — layers moving independently place elements off-grid on every frame
- smooth-scroll — Swiss is objective and precise; inertia is neither

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
