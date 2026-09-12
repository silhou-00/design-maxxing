# research

Style research for the design-maxxing style-pack catalogue. 12 focus styles, four sources you
supplied plus four I added to close implementation gaps.

Built 2026-09-03. Nothing outside this folder was touched.

## What's here

```
research/
  README.md                     this file
  sources.md                    8 sources, coverage matrix, method notes, gaps
  specimens/
    index.html                  all 12 packs as working CSS — the picker AND the launcher
    specimen-sheet.jpg          rendered screenshot of the above
  styles/<style>/               six files per pack; three are loadable, three are not
    style.md                    HOT — build rules only, ~1.6K tokens
    tokens.json                 values + a11y + copy budget. THE SOURCE the HTML is built from,
                                and what `engine/audit.mjs --pack <name>` reads for its thresholds
    modules.md                  the eight module specs (cold)
    reference.md                provenance and sourced decisions (cold)
    modules.html                NEVER READ — browser only. Eight modules, all states, self-auditing
    page.html                   NEVER READ — browser only. One composition at page scale
    refs/                       reference images captured from the sources
  styles/_shared/               build-pack.mjs · build-modules.mjs · build-page.mjs · build-docs.mjs
                                audit.js · sheet.css · _audit-selftest.html
  captures/
    uxplanet-50-design-styles.md        all 50 entries, verbatim
    tilda-web-design-styles.md          all 9 styles + cheat sheet, verbatim
    looka-graphic-design-styles.md      all 11 styles + the reaction chain, verbatim
    devto-modern-web-design-styles.md   all 6 styles + the comment thread, verbatim
```

52 reference images, ~16 MB total.

## Start here

**`specimens/index.html`** — every style rendered side by side, live, in ~340 lines of CSS. It is
the fastest way to see all 12 at once and the only place the values are proven rather than asserted.

To view it, from `research/specimens/`:

```
python -m http.server 8765
```

then open `http://127.0.0.1:8765/index.html`. (`file://` works in a normal browser too; the
browser-automation tool needs the http server.)

## The 12 styles

| Style | One-line identity | Implementation source |
|---|---|---|
| [skeuomorphism](styles/skeuomorphism/style.md) | Imitates real materials so the control explains itself | Derived; Norman's affordance argument from Wikipedia |
| [neumorphism](styles/neumorphism/style.md) | One surface colour; depth from a light shadow + a dark shadow | **neumorphism.io** canonical CSS |
| [glassmorphism](styles/glassmorphism/style.md) | Frosted panels over a colourful backdrop | **css.glass** canonical CSS |
| [brutalism](styles/brutalism/style.md) | Show the bones; browser defaults are a palette | Derived (subtractive) |
| [neo-brutalism](styles/neo-brutalism/style.md) | 2px black border, 4/4 hard shadow, 5px radius, flat fill | **neobrutalism.dev** measured tokens |
| [minimalism](styles/minimalism/style.md) | Fewest elements; each one justified | Derived |
| [modernism](styles/modernism/style.md) | Form follows function; geometry, grid, primaries | Derived |
| [editorial](styles/editorial/style.md) | A magazine spread that happens to be a web page | Derived |
| [swiss](styles/swiss/style.md) | Strict modular grid, Helvetica, flush left, one red | Derived |
| [hand-drawn](styles/hand-drawn/style.md) | Grid it, then knock everything out of true | Derived |
| [flat](styles/flat/style.md) | Zero depth; colour and type do all the work | Derived (Flat UI palette) |
| [bento](styles/bento/style.md) | Rounded compartments, tight gaps, varied spans | Derived |

Every `style.md` follows the same schema — the one already validated by `minimalist-ui` and
`industrial-brutalist-ui` in the `taste` vendor pack:

```
## art direction     what the sources say, quoted and attributed
## implementation    real CSS, real numbers, a measurements table
## banned            the explicit no-list
## gotchas           a11y, performance, the failure modes
## reference          which images, which tile, which sources
```

## Three findings worth reading before you use any of this

**1. None of the four links you gave me contains any CSS.** Not one value, not one measurement, not
one hex code beyond a few colour names. UX Planet is a *prompting* vocabulary. Tilda is the closest
to buildable and stops at naming typefaces. Looka is history. dev.to is four bullet-words per style.
This is why sources 5–8 exist and why every number in the style packs is traceable to either a live
design system, a generator, or the specimen page.

**2. The styles genuinely contradict each other, and Looka explains why.** Its article records a
reaction chain: Bauhaus reacts against Art Nouveau; Swiss and minimalism descend from Bauhaus;
Brutalism and postmodernism react *against* modernism; flat replaces skeuomorphism; neumorphism and
glassmorphism are flat re-softened. So `minimalism` bans shadows while `skeuomorphism` is made of
them, and `swiss` demands a grid while `brutalism` demands you violate one. **These are not
reconcilable and must not be merged** — which is the same conclusion the earlier horizontal-merge
analysis reached, now with a documented historical reason rather than just observed conflict.

**3. The best paragraph across all four sources is a blog comment.** Webgamma, on the dev.to
article, states the layering principle independently: treat styles as "constraints you choose on
purpose"; use bold styles on hero and campaign surfaces but "keep core flows closer to minimalist UI
so forms, tables, and error states stay clear"; and "if you lock in typography, spacing, and
hierarchy first, you can layer a style on top later without hurting readability or UX." That last
clause is the Layer 1 Engine / Layer 2 Style-pack split, arrived at by a working agency. Quoted in
full in `captures/devto-modern-web-design-styles.md`.

## Reference-image inventory

| Style | refs | Notes |
|---|---|---|
| minimalism | 8 | Tilda ×3 live sites, Looka ×3, plus Japandi and Utilitarian variants |
| swiss | 6 | Looka ×3 incl. Helvetica/Müller-Brockmann collage, Tilda constructivism ×2, modular typography |
| brutalism | 5 | UX Planet plate, Looka ×2, Tilda live sites ×2 |
| flat | 5 | Tilda ×2, Looka ×3 incl. Windows 8 / iOS 7 / Material collage |
| modernism | 5 | Looka ×4 (modernism + Bauhaus, both with collages), UX Planet Bauhaus plate |
| bento | 4 | Tilda ×3 live dashboards, UX Planet plate |
| hand-drawn | 3 | Tilda ×2, UX Planet conceptual-sketch plate |
| editorial | 2 | Tilda ×2 live magazine sites |
| glassmorphism | 2 | css.glass generator, UX Planet plate |
| neo-brutalism | 2 | neobrutalism.dev component sheet, UX Planet plate |
| neumorphism | 1 | neumorphism.io generator with CSS visible |
| skeuomorphism | 0 | **not illustrated by any source** — see `sources.md` gaps |

## Open items

- **Skeuomorphism has no reference photograph.** The specimen tile is the only visual. Real targets:
  iOS 6 Game Center / Podcasts / Find My Friends, Windows Vista/7 Aero.
- **38 more UX Planet styles and 6 more Looka styles are captured as text but have no pack.** Both
  pages are fully parsed in `captures/`, so scaffolding the art-direction half of any of them is now
  near-free. The UI-buildable subset of the remainder is roughly: Memphis, Y2K, Art Deco, Mid-Century,
  Japandi, Utilitarian, Modular Typography, Pixel Art, Synthwave, Claymorphism.
- **dev.to parts 2–4 unread** — two more style articles and two UI-pattern articles in that series.
- **Nothing here has been wired into a skill yet.** These are research artifacts. Turning
  `styles/<style>/style.md` into Layer 2 style packs, and deciding where they live relative to the
  `kowalski` / `taste` / `impeccable` vendor packs, is still the open architecture question.
