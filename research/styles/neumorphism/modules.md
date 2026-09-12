# Neumorphism (Soft UI) — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A pressed track holding raised pills. **The active item is RECESSED** — in a single-surface world, the only two states available are up and down.

## 2. Hero

Not a hero — **an instrument label**. Five words maximum. The 2026 sources are explicit that this style's home is the single-purpose screen: a player, a thermostat, a calculator. Build it as a marketing page and it looks wrong immediately.

## 3. Button — five states

**Focus cannot use the extrusion**, because a raised control and a focused raised control are identical. The ring is the accent at 4px offset — far enough to clear the light shadow, and the one place a hard edge is permitted.

## 4. Form field + error

An input is a pressed well. Note the rule the pack states against itself: *no text at body size inside a pressed well* — the inner shadow crosses the first line of text. Labels sit outside.

## 5. Card

d=12, blur 36. And the 2026 correction that matters most: **extrude selectively**. A page where every surface is raised has no hierarchy, because extrusion was the only hierarchy signal there was.

## 6. List / table

The pack's weakest module by a distance. Rows cannot be extruded — 30 raised strips is noise — so the table sits *inside* one pressed well and uses type alone. Honest answer: if you need a data grid, this is the wrong pack.

## 7. Overlay / modal

A raised panel over a soft scrim. There is no other elevation available, so the scrim does the separating and the panel simply uses the largest d on the page.

## 8. Empty / loading

A pressed well with nothing in it. Like skeuomorphism, this pack has a natural vocabulary for absence: an empty socket needs no explanation.

---

## Dark mode

**The hard case.** On `#2a2d35` the light shadow can only reach `#343842` — a 1.15:1 lift. Dark neumorphism leans on the dark shadow and accepts a shallower extrusion. That is a real limitation of the technique, not a tuning problem.

The hard case, and the sources agree: on a dark surface the LIGHT shadow has almost nowhere to go. #2a2d35 gives a light shadow of only #343842 - a 1.15:1 lift. Dark neumorphism therefore leans on the dark shadow and accepts a shallower extrusion; it is a real limitation, not a tuning problem.

## Narrow width

Targets go to **44px**, not 24 — a soft edge is genuinely harder to aim at than a hard one, and this is the one pack where the WCAG minimum is not enough.

## Scroll

Headline technique: **scroll-reveal (⚠ — constrained)**

the style's own scope is the constraint: every source describes it as a COMPONENT style, so page-scale techniques have nothing to act on. A soft staggered reveal of the instrument's own controls is the honest ceiling.

**Banned for this pack:**
- parallax - impossible on first principles. One surface colour means no figure and no ground to separate
- scroll-theme-shift - the dark shadow IS surface x 0.87, so shifting the theme means recomputing every shadow on every frame

**This pack has no ● entry.** Its own scope is the constraint — every source describes it as a
component style, so page-scale techniques have nothing to act on. Per ROUTER Gate 3.5 a ⚠ is built in
its **constrained form**: the reveal animates `transform` only and starts at `opacity: 1`, never 0.
A control whose only affordance is a pair of low-contrast shadows must never begin invisible.

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
