# Hand-Drawn — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

Clean bold labels with a single drawn underline beneath the active item. The nav itself is not wobbled — **chrome stays straight**, or the page reads as broken rather than hand-made.

## 2. Hero

**Clean bold heading, not a script face.** The reference galleries are consistent on this and Tilda bans handwriting in body copy outright. The hand shows up as a circled word, an arrow, and a great deal of air around them.

## 3. Button — five states

Wobbled border, 2.5px, rotated −1.5°. **Hover straightens it** — the wobble is the resting state and alignment is the interaction, which is the opposite of every other pack here. Focus is the one straight machine-drawn line on the page.

## 4. Form field + error

A wobbled field, rotated the other way from the button so no two elements share a rotation. The error is a drawn underline in red plus text — the mark and the words together.

## 5. Card

Three cards, three different rotations, three different wobble seeds. **Same rotation on all three and the trick is visible instantly** — that is the pack's own stated failure mode.

## 6. List / table

Ruled by hand: 2.5px drawn lines, no fills. This is where the style is weakest and it should be admitted — a data grid wants precision and this pack's whole method is imprecision.

## 7. Overlay / modal

A wobbled panel over a flat scrim, rotated barely half a degree. Big modals need *less* rotation, not more: the longer the edge, the more visible the tilt.

## 8. Empty / loading

A drawn box with a squiggle inside and one line of copy. This pack's most natural state — a blank page with a mark on it is exactly what it is imitating.

---

## Dark mode

Ink on paper becomes **chalk on board**. The marks must lighten rather than the paper simply darkening, or every doodle disappears into the ground. The highlighter yellow survives and still takes ink text.

Ink on paper inverts to chalk on board — #1e1c18 ground with #f4f0e6 marks. The marks must LIGHTEN rather than the paper darkening alone, or every doodle disappears. The highlighter yellow stays and still takes ink text.

## Narrow width

Rotation halves to ±1°. At 390px a 2° tilt on a full-width element pushes a corner past the viewport edge, and the wobble radius has to shrink with the box or it eats the whole corner.

## Scroll

Headline technique: **svg-path-draw (●)**

the clearest style/technique match in the whole catalogue: a hand-drawn mark that DRAWS ITSELF as you scroll is the technique restating the style. Arrows, circles and underlines are already SVG paths, so there is nothing to fake.

Also core: `parallax` · `scrollytelling` · `scroll-reveal`

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
