# Bento — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Tilda, *Bento — box it all up, the neat way*** — "Inspired by the Japanese bento box, this style
uses clean, separated sections to neatly organize content. Each piece of content lives in its own
visual 'container' — just like rice, veggies, and tempura in a lunchbox. Marketers and designers
adapted this idea into a layout approach where almost all content is placed inside neatly defined
'tiles' or 'panels.'"

**Tilda, key elements**
- *Tidy blocks* — "**Each content cell should be rectangular with softly rounded corners.** If you're
  building a website in Bento style, start by creating a grid and adding neatly rounded containers."
- *Minimal whitespace* — "**Bento layout uses space efficiently. Everything fits together neatly,
  without looking cramped.**"
- *Clear, readable typography* — "Stick to simple shapes, minimal decorative touches, and soft or
  muted colors."

**Tilda cheat sheet** — Many rectangular, rounded content blocks · **Very little empty space** ·
No decorative or unconventional design tricks.

**UX Planet §28, Bento Box** — "Bento UI is a trend in interface design that presents content in
neatly organized, block-like sections — like compartments in a bento box. It makes complex layouts
feel digestible and modern." Core elements: "Rounded modular blocks, subtle shadows, icons with
labels, micro-animations, neutral palettes." Mood: "Organized, friendly, clean. Ideal for dashboards,
portfolios, or productivity tools."

**Maturity note (Tilda, 2025 trends)** — "One of the biggest trends in recent years has been the
Bento style. **While it's still widely used, it's no longer surprising or experimental.** Tile-based
layouts are everywhere now — with good reason."

**Mood & occasion (Tilda)** — "websites where the combination of minimalism, functionality, and
visual harmony is important. It's especially popular in dashboards, e-commerce, and web services
where clarity is key and content is dense."

## A note on "subtle shadows"

UX Planet lists "subtle shadows" among the core elements; Tilda does not, and the sourced specimen
has none. **This pack resolves it to none**, and puts the burden on the hairline border instead. The
reason is mechanical rather than aesthetic: at `8–12px` gaps, adjacent shadows overlap and the grid
turns muddy — the tightness that defines the style is exactly what makes shadows unworkable in it.

If a brief genuinely needs elevation inside a compartment grid, that is a different pack.

## Decisions made here, not upstream

Not in any source. Derived when the module set was specified, and recorded so a later reader does not
mistake them for measured values.

| decision | why |
|---|---|
| Focus = 2px text-colour ring | the `#2a2a31` hairline is **1.24:1** on the cell fill — nowhere near 2.4.13's 3:1 change. `#f5f5f7` is 15.8:1 |
| The hairline is exempt from 1.4.11 | a cell is a **container**, not a control. 1.4.11 governs UI components and the objects needed to identify them. This stops being true the moment a cell is clickable |
| Button radius `10px`, not `18px` | a control inside a cell is nested, and nested radius decreases |
| Inputs are **darker** than their cell | the inverse of most packs — here the recessed thing sinks rather than the raised thing lifting |
| Error is a text row, not a border | a red border alone is colour-only signalling (1.4.1), and a heavy treatment is banned |
| Table gets one `span 4` cell | expressing rows as cells produces the card list the pack bans |
| Empty state uses a **dashed** hairline | a blank compartment is the one thing Tilda bans outright |
| Accent `#4ade80`, one hue only | UX Planet: neutral palettes, "colour lives in the data". Darkens to `#16a34a` on light, where `#4ade80` is 1.7:1 |
| Headline ≤6 words, sub ≤18 | engine §5 says 8/25; a cell is smaller than a section |
| `charsPerViewport` 300 | engine default is 420; compartments hold less |

## Reference images

- `refs/tilda-bento-1.png`, `-2.png`, `-3.png` — live bento websites from Tilda's gallery
- `refs/uxplanet-bento-box.png` — UX Planet §28 plate
- `research/specimens/index.html` → tile **12 bento**
- `modules.html` — eight modules, all states, dark/light, narrow width
- `page.html` — one composition, with the ● scroll technique

## Related

- `../editorial/style.md` — where to go when the content is paragraphs rather than values
- `../neo-brutalism/style.md` — the other grid-and-container pack; note it is built from shadows,
  which is precisely what bento refuses
- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — reveal (●) staggered across cells is the signature entrance;
  **parallax is ✗** because cells are flat containers with nothing behind them

Sources: Tilda *Bento* + cheat sheet + 2025 trends · UX Planet §28.
