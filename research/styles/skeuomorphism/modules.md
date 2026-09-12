# Skeuomorphism — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

A brushed bar with a contact shadow underneath — it sits *on* the surface rather than floating above it. The active item is recessed, not highlighted: a pressed key stays down.

## 2. Hero

A **device chassis**, not a page section: bounded, bevelled, screwed down, with its controls arranged on the face. The 4% hard break at the gradient's midpoint is what reads as a moulded panel rather than a fade.

## 3. Button — five states

Three shadows at once — bevel highlight, contact, ambient. Pressed swaps all of them for a single inset and moves the control 1px, in **60ms, because matter is stiff**. Focus is the one screen-native colour the pack permits.

## 4. Form field + error

An input is a WELL — recessed, with the light still coming from top-left, so the highlight is on the *bottom* edge. Getting that backwards is the fastest way to break the illusion.

## 5. Card

A panel, lifted by contact and ambient shadow together. **One light direction**: every highlight on this page is top-left and every contact shadow falls bottom-right.

## 6. List / table

Engraved rules on the material. This pack has no honest table vocabulary — real objects do not have data grids — so it borrows a ledger: ruled lines pressed into the surface.

## 7. Overlay / modal

A dialog that sits above the page on a strong ambient shadow. The scrim is warm, not neutral grey — a neutral scrim would sit outside the material world the rest of the page builds.

## 8. Empty / loading

A recessed well with nothing in it. This is the pack's most natural empty state: an empty slot is a real thing, and it needs no dashed border to explain itself.

---

## Dark mode

A **dark material**, not an inverted one — walnut and brushed steel rather than beige leather. The light direction stays top-left; inverting it reads as an object lit from below, which nothing on a desk ever is.

A dark material, not an inverted one — walnut and brushed steel rather than beige leather. The light direction stays top-left; inverting it would read as the object being lit from below, which no real object on a desk ever is.

## Narrow width

Bevels and shadows do not scale down: a 1px highlight on a 44px control reads correctly, on a 24px control it disappears. Controls get *larger* at narrow widths here, not smaller.

## Scroll

Headline technique: **scroll-snap (●)**

physical controls DETENT — a dial clicks into position, it does not drift. Snap is the only technique in the catalogue that models a real mechanical behaviour rather than an optical one.

**Banned for this pack:**
- text-reveal — type here is printed, engraved or embossed ONTO a material. It cannot fade in, because it is part of the surface

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
