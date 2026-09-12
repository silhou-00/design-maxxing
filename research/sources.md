# Sources

Eight sources. Four you gave me, four I added to close gaps. All opened in Chrome on 2026-09-03.

## The four you gave me

| # | Source | Styles | What it actually gives | CSS? |
|---|---|---|---|---|
| 1 | [UX Planet — 50 Design Styles](https://uxplanet.org/50-design-styles-every-designer-should-know-for-better-prompting-56c09d55db62) | 50 | Best art direction. Uniform schema: description + Core Elements + Mood & Occasion. 1 image per style. | **No** |
| 2 | [Tilda Education — Popular Web Design Styles](https://tilda.education/en/web-design-styles) | 9 | Most actionable. Named typefaces, named palettes, step-by-step layout procedures, live-site galleries, a cheat sheet. Web-native. | **No** |
| 3 | [Looka — Graphic Design Styles](https://looka.com/blog/graphic-design-styles/) | 11 | The lineage. Who reacted against whom, and when. Explains *why* the styles contradict each other. | **No** |
| 4 | [dev.to — Modern Web Design Styles](https://dev.to/homayounmmdy/modern-web-design-styles-every-frontend-developer-must-know-2025-guide-1ijl) | 6 | Thinnest article, best comment thread. Uniquely names neumorphism + claymorphism. | **No** |

**The headline finding: none of the four contains a single line of CSS, a measurement, or a hex
value beyond a couple of colour names.** Tilda comes closest (Helvetica/Univers/Akzidenz-Grotesk;
Roboto/Open Sans; retro's orange/yellow/turquoise/pink/brown). They are art-direction and
vocabulary sources, not build specs. Every implementation number in `styles/*/style.md` therefore
comes from source 5–8 or from the local specimen.

Full verbatim captures: `captures/`.

## The four I added

| # | Source | Closes | What it gives |
|---|---|---|---|
| 5 | [neobrutalism.dev/styling](https://www.neobrutalism.dev/styling) | neo-brutalism implementation | **Live theme tokens**, read out of `getComputedStyle` on the rendered page — not eyeballed. `--main`, `--shadow: 4px 4px 0`, `--radius-base: 5px`, `--border: 2px solid #000`, weights 500/700. Plus a full component sheet screenshot. |
| 6 | [neumorphism.io](https://neumorphism.io/) | neumorphism implementation + definition | The canonical recipe at default settings, and the definition the style is usually quoted from. The four generator knobs (size/radius/distance/intensity/blur) map directly to the shadow maths. |
| 7 | [css.glass](https://css.glass/) | glassmorphism implementation | The canonical six-line recipe. Four knobs: transparency, blur, colour, outline. |
| 8 | [Wikipedia — *Skeuomorph*](https://en.wikipedia.org/wiki/Skeuomorph) | skeuomorphism, entirely | Definition, etymology, and Don Norman's framing (cultural constraints, perceived affordances) — the only *justification* for the style, as opposed to a description of it. |

## Coverage of your 12 focus styles

| Style | UX Planet | Tilda | Looka | dev.to | Added source | Implementation status |
|---|---|---|---|---|---|---|
| skeuomorphism | — | *(retro, partial)* | *(mentioned as what flat replaced)* | — | **Wikipedia** | Derived + verified in specimen |
| neumorphism | — | — | — | §2 | **neumorphism.io** | Canonical CSS |
| glassmorphism | §48 | — | — | §1, §6 | **css.glass** | Canonical CSS |
| brutalism | §23 | ✅ | §9 | — | — | Derived (subtractive; verified) |
| neo-brutalism | §50 | ✅ | — | §4 | **neobrutalism.dev** | Measured tokens |
| minimalism | §11, §38 | ✅ | §3 | §5 | — | Derived + verified |
| modernism | §22 | *(constructivism)* | §1, §2 | — | — | Derived + verified |
| editorial | §10, §33 | ✅ | — | — | — | Derived + verified |
| swiss | §49 | ✅ | §6 | — | — | Derived + verified |
| hand-drawn | §9, §35, §40 | ✅ | — | — | — | Derived + verified |
| flat | — | ✅ | §10 | — | — | Derived + verified (Flat UI palette) |
| bento | §28 | ✅ | — | — | — | Derived + verified |

"Derived + verified" = the CSS in `styles/<style>/style.md` was written from the sourced art
direction and then rendered in `specimens/index.html` to confirm it produces the described look.

## Gaps left open

- **dev.to parts 2–4 not captured.** The series continues with "Modern Web Design Styles Part 2" and
  two "UI Patterns Frontend Developers Must Know" articles. Cheapest next stop if you want more
  styles.
- **Skeuomorphism has no reference photograph.** None of the four articles illustrates it, and
  Wikipedia's image `src` attributes could not be read (the browser tool blocks query-string
  extraction on that page). The specimen tile is currently the only visual. If you want real
  reference, the targets are iOS 6 Game Center / Find My Friends / Podcasts, and Windows Vista/7
  Aero controls.
- **Looka's remaining 6 styles** (Art Deco, Pop Art, Psychedelic, Postmodernism, Contemporary,
  Bauhaus-as-separate) and **UX Planet's other 38** are captured as text but have no style pack.
  Scaffolding them is cheap now that both pages are parsed — see the note in `README.md`.
- **The Tilda `Swiss Style` gallery images** did not resolve; its heading element structure differs
  from the other sections. Swiss is covered visually by Looka's three images plus Tilda's
  Constructivism gallery.

## Method notes, for repeatability

- **The 403s from a previous session were bot-UA filtering, not blocking.** Both pages return 200
  with `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
  Chrome/131.0.0.0 Safari/537.36`. All image downloads here use that UA.
- **Tilda serves blank placeholders on its proxy path.** `tilda.education/upload/pages/<id>/tild<hash>__-__empty__<name>.png`
  returns a 3KB blank grey PNG. The real asset is
  `static.tildacdn.com/<hash>/<Name>.png` — **filename case matters** (`Screenshot_`, not
  `screenshot_`).
- **Medium images** are at `miro.medium.com/v2/resize:fit:700/<id>.png` and download fine with a
  browser UA. Heading→image mapping has to be done by walking the article in document order and
  tracking the last leaf element matching `^\d{1,2}\.\s+[A-Z]`; Medium's DOM nests figures as
  siblings of headings, not children.
- **`interaction-design.org` is blocked** for page-content reading by the browser tool's domain
  permissions. Wikipedia was used instead for skeuomorphism.
- **Reading live theme tokens beats reading docs.** `getComputedStyle(document.documentElement)`
  against a named custom-property list is how the neobrutalism.dev numbers were obtained. Faster and
  more accurate than hunting through a docs site, and it works on any deployed design system.
