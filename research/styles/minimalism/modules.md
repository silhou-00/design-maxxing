# Minimalism — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

Text links and one rule. No bar, no fill, no shadow — the header is separated by space, not by a container.

## 2. Hero

One statement, one supporting line, one action. **Four text elements is the ceiling and this uses three.** Weight 300 is safe here because the display size is well above 24px.

## 3. Button — five states

**This is the pack's weak point and the state floor forces the fix.** A text-only button gets missed, so the primary carries a fill and the secondary carries a 1px rule — a non-colour signal on both, per the affordance warning.

## 4. Form field + error

A field is a bottom rule, not a box. The error is text plus a mark — the accent is already spent, so red is not available as a signal here.

## 5. Card

There is no card. Content sits on the ground, separated by space. The specimen shows the *only* permitted container: a 1px hairline, no fill, no shadow.

## 6. List / table

Where minimalism is quietly excellent — rules at 1px, generous row padding, no zebra, no borders on the outside.

## 7. Overlay / modal

A flat scrim and a plain panel. No blur, no shadow. The panel is identified by its ground, not by elevation.

## 8. Empty / loading

The one state where emptiness is a problem rather than the style. It needs a statement and an action, or it reads as a broken page.

---

## Dark mode

Inverts cleanly because there is almost nothing to invert. Secondary grey moves to `#9a9a9a` (6.3:1) — `#6b6b6b` on a dark ground would be 3.1:1 and fail body text.

Inverts cleanly because there is almost nothing to invert. Ground #0f0f0f, ink #f0f0f0, grey #9a9a9a (6.3:1).

## Narrow width

Section padding compresses from 160px to 48px, but never below — the space *is* the design. Measure stays capped at 34ch minimum so lines do not become too short.

## Scroll

Headline technique: **scroll-reveal (●)**

The rule is not WHICH technique, it is HOW MANY. One for the whole page, opacity-led with short travel. 22px and a 6% stagger is the ceiling — past that it stops being restraint and becomes an effect.

**Banned for this pack:**
- parallax
- scroll-theme-shift
- scroll-marquee — perpetual motion in a style built on stillness

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
