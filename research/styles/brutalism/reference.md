# Brutalism — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Origin (Looka, §9 Brutalism)** — "Brutalist graphic design originated in the mid-20th century,
drawing inspiration from its architectural namesake. Brutalism was an opposing reaction to the clean,
predictable modernist movement." It has "stark typography, asymmetric layouts, and monochromatic or
contrasting color schemes. The composition and space are often littered with overlapping elements and
photos. It's a defiance of design rules!" And crucially: "This style is not about harmony or ease of
use; it's about challenging perceptions and evoking strong reactions."

**Characteristics (Looka)**
- Monochromatic and bold colour schemes — "stark contrasts, often with black, white, and grays,
  punctuated by bold flashes of colour"
- Crude typography — "oversized, makeshift fonts and unconventional typefaces that command attention"
- Exposed elements — "graphic elements appear stripped down, showcasing the 'bones' of the design"
- Asymmetrical layouts — "an unpredictable and dynamic arrangement of elements"

**Core elements (UX Planet, §23 Brutalism)** — "raw, bold, and purposefully unrefined. Borrowed from
architecture, it rejects polish for stark functionality and visual honesty. In digital, it breaks UI
norms to stand out." Core elements: "Monospaced fonts, grayscale palettes, harsh edges, solid blocks,
default buttons." Mood: "Bold, disruptive, honest."

**Web-specific (Tilda, *Brutalism & Neobrutalism*)** — "Brutalism is a bold, provocative style that
intentionally breaks design conventions... These websites often use clashing colors, oversized
typography, and oddly placed shapes or elements." Two named principles: *deliberate contrast and
chaos* ("Brutalist websites are meant to disrupt — even annoy a little — just to get noticed") and
*stand out by breaking the rules* ("sharp lines, hard shadows, and loud visuals").

**Tilda cheat sheet** — Provocative layouts · Clashing colour palettes · Heavy shadows and outlines.

**Named examples (Looka)** — Bloomberg Businessweek covers under Richard Turley; Kanye West's *Life
of Pablo* merchandise; the Balenciaga website.

**Mood & occasion** — "Bold new startups, edgy brands, or artists who want to showcase their
personality. It's perfect for portfolios that challenge the norm or companies ready to disrupt the
market" (Tilda). "Artist portfolios, experimental interfaces, or counterculture brands" (UX Planet).

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Note | brutalism is accidentally one of the most accessible packs: native controls, default link colours, pure black on pure white at 21:1, and no depth system to misread. The honesty that makes it ugly also makes it legible. |
| Link Rule | Keeping #0000ee underlined is not nostalgia — it is the single strongest clickability signifier that exists, and NN/g's flat-design critique is precisely about packs that threw it away. |
| Gradient Rule | Gradients are permitted ONLY as hard-edged texture — repeating stripes and halftone dots, where every stop is an abrupt colour change. A soft fade is still banned, because a fade exists to make an edge comfortable and comfort is the thing this pack refuses. The ban that matters is on BLUR, not on the gradient function. |
| Colour Rule | Raw, saturated, unmixed field colours. The pack bans 'muted or tasteful colour' — which is a requirement to be loud, not a licence to be plain. Every field colour here carries INK text; none of them carries white, and that is not a coincidence: saturated mid-tones almost never do. |

**Focus.** the flash colour, hard against the element with zero offset — an offset would be a comfort decision. #ff0090 on white is 4.0:1, above the 3:1 that 2.4.13 requires.

## Reference images

- `refs/uxplanet-brutalism.png` — UX Planet §23 plate: monospace, greyscale, solid blocks
- `refs/looka-brutalism.jpg` — Looka's web example
- `refs/looka-brutalism-collage.jpg` — Looka's collage of famous brutalist work
- `refs/tilda-brutalism-1.png`, `refs/tilda-brutalism-2.png` — live brutalist websites Tilda cites
- `research/specimens/index.html` → tile **04 brutalism**

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Looka §9 · UX Planet §23 · Tilda *Brutalism & Neobrutalism* + cheat sheet · dev.to comments.
