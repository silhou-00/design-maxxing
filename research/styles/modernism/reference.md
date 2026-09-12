# Modernism (and Bauhaus) — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Definition (Looka, §1 Modernism)** — "Modernism in graphic design marks a significant shift towards
abstraction, simplicity, and a departure from the intricate, hand-drawn, and ornamental styles that
preceded it. Emerging in the early 20th century, the modern design style sought to break away from
traditional forms and conventions, prioritizing functionality, clarity, and simplicity in design. It
was driven by the belief that design should reflect the spirit of the modern age and was heavily
influenced by the rapid advancements in technology and industry."

Looka is explicit that modernism is the *parent*: "This era was the inception of movements we cover in
detail below, like Bauhaus, Swiss Style, and Minimalism."

**Characteristics of Modernism (Looka)**
- *Sans-serif typography* — "Clean, legible sans-serif typefaces won over the decorative serifs of
  the past, emphasizing readability and modernity."
- *Geometric shapes* — "Basic geometric shapes like circles, squares, and triangles create abstract
  and symbolic designs."
- *Minimalist grid systems* — "Employs grid systems for structure and visual alignment, ensuring a
  logical, orderly layout that enhances clarity and visual impact."
- *Contrasting colors* — "Often features bold, contrasting color combinations to capture attention
  and create visual interest."

Named examples: the Bauhaus School (founded 1919), Swiss Style / International Typographic Style,
and Paul Rand's IBM work — "clean lines, bold colors, and an iconic logo that remains influential."

**Bauhaus (Looka, §2)** — "born from the influential Bauhaus school in Germany during the early 20th
century... founded by Walter Gropius and emerged as a response to the decorative excesses of Art
Nouveau." Rooted in **"form follows function", a principle that prioritizes the purpose of a design
over its aesthetic.** It "merged art, craft, and technology, aiming to create functional and
affordable designs that could be mass-produced."

Characteristics: geometric shapes · clean lines · **restricted color palette, primary colors for
contrast** · sans-serif typography for readability.

Examples: Herbert Bayer's Universal Typeface ("a geometric sans-serif... Its uniformity and absence
of uppercase letters were radical for its time"), the Bauhaus Exhibition Posters ("bold colors,
geometric shapes, and asymmetric balance"), Marcel Breuer's Wassily Chair.

**Bauhaus (UX Planet, §22)** — "functional, geometric, and minimal... favors 'form follows function'
and uses basic shapes and primary colors. It's the birth of modernist design." Core elements: "Grid
systems, sans-serif fonts, **red-blue-yellow palette**, circles/triangles/squares, minimal text."
Mood: "Rational, structured, modern. Great for architecture, product design, and clean brand systems."

**Constructivism** — Tilda's closest web-native cousin: "a functional, geometry-driven style rooted
in architecture. Websites built in this style often use asymmetrical layouts to convey motion." Key
elements: sans-serif headline fonts ("No decorative flair"), geometric shapes ("squares, triangles,
circles — underline the style's precision"), asymmetry and movement ("Layouts feel energetic and
flexible. Add subtle animations and offset elements"). Tilda's cheat sheet adds: "Elements aligned to
one side of the page." Best for "tech startups and forward-looking brands."

**Mood & occasion** — Rational, institutional, confident. Architecture and product brands, design
systems, education, cultural institutions.

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Yellow Rule | #f5c518 is 1.7:1 with white and 11.4:1 with ink. Yellow ALWAYS takes ink text. This is the pack's one hard colour rule and it is the commonest Bauhaus mistake on the web. |
| Radius Note | maxRadius is intentionally unset: this pack allows 0 and 50% and nothing between, which a single px ceiling cannot express. A 50% radius on a 64px circle computes to 32px and would false-positive. |
| Ground As Text Note | The warm off-white #f2ede4 must not be reused as text on the primaries: on red it is 4.14:1 and misses 4.5:1. Pure white is 5.2:1 there. Ground colours and text colours are separate jobs even when the palette is only five values. |
| Red As Text Note | The Bauhaus red is a FILL colour. Used as text on the warm ground it measures 4.14:1 and misses 4.5:1, so text uses #b0141c (6.5:1). This does not add a fourth hue — it is the same red tuned for a second role, which is what a palette actually is. |

**Focus.** a primary, at the module's own thickness. Blue on the warm ground is 7.6:1 — the strongest of the three primaries, and the yellow is unusable for this.

## Reference images

- `refs/looka-modernism.jpg` — modernist branding example
- `refs/looka-modernism-collage.jpg` — Bauhaus School / Swiss Style / Paul Rand IBM
- `refs/looka-bauhaus.jpg` — Bauhaus branding example
- `refs/looka-bauhaus-collage.jpg` — Bayer's Universal Typeface, exhibition posters, Wassily Chair
- `refs/uxplanet-bauhaus.png` — UX Planet §22 plate
- `research/specimens/index.html` → tile **07 modernism / bauhaus**

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Looka §1, §2 · UX Planet §22 · Tilda *Constructivism* + cheat sheet.
