# Modernism (and Bauhaus) — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A 64px bar with the wordmark and interlocking colour blocks. No gap between the blocks: they touch, because the module has no leftover space.

## 2. Hero

Uppercase geometric display against a composition of square, circle and triangle at 64px and 128px. **The shapes are not decoration** — they carry the asymmetric balance that replaces a centred layout.

## 3. Button — five states

A rectangle in a primary, ink text, radius 0. Hover swaps to a different primary — **geometry does not ease**, so there is no transition. Focus is a 4px blue ring at the module's own thickness.

## 4. Form field + error

A field is a 4px ink box. The error swaps the box to red and adds text — and note the label sits *inside* the module, not floating above it.

## 5. Card

A 128px block. No radius, no shadow, no border — it is identified by its fill, and hierarchy comes from which primary it takes and how many modules it spans.

## 6. List / table

4px ink rules on the module. Column heads in uppercase geometric caps. This is the least Bauhaus module in the set and the pack is honest about that: tables are information, not composition.

## 7. Overlay / modal

A flat ink scrim and a ground-coloured panel with a 64px red band at its head. The band is structural — it is what identifies the panel, since there is no shadow or radius available.

## 8. Empty / loading

A 64px yellow square, a statement, one action. Absence gets a shape rather than a dashed line, because a dashed border is decoration with no structural role.

---

## Dark mode

Ground goes warm near-black `#14120e`, matching the warm off-white it replaces. **The primaries do not change** — they are *the* Bauhaus primaries and shifting them makes this a different pack.

Ground goes #14120e (warm near-black, matching the warm off-white it replaces). The primaries do NOT change — they are the Bauhaus primaries and shifting them makes it a different pack. Yellow still takes ink text; on a dark ground that is now the only high-contrast pairing it has.

## Narrow width

The module halves to 32px rather than the layout reflowing. A Bauhaus composition that becomes a centred stack has lost the asymmetric balance that was the point.

## Scroll

Headline technique: **scroll-snap (●)**

the strongest conceptual match anywhere in the catalogue: the style is built on a module, and snap moves in modular steps. Scrolling one full unit at a time IS the grid, expressed in time.

Also core: `pinned-scene` · `horizontal-scroll` · `scroll-progress`

**Banned for this pack:**
- parallax — illusory depth is decoration with no structural role, which is the definition of what this style bans

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
