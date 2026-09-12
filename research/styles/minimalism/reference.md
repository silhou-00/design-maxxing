# Minimalism — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Definition (Tilda, *Minimalism — when less is more*)** — "Minimalist design gets the job done using
the fewest elements possible. It looks clean, airy, and intentional. Every piece on the page has a
purpose."

**Key elements (Tilda)**
- *Clear and purposeful* — "it's all about stripping away anything unnecessary. Every visual detail
  must serve a purpose — the fewer distractions, the better."
- *Colour with intent* — "Minimalist websites usually stick to a monochrome palette. Bright or bold
  colors are used sparingly — only when you want to draw attention to something specific."
- *Whitespace is your best friend* — "Negative space (the empty areas around content) helps key
  elements stand out and gives users room to breathe. Don't crowd your layout — space helps guide
  attention."

**History (Looka, §3 Minimalism)** — "Its roots trace back to the early 20th century, but it became
mainstream in the 1960s. This design ethos is to strip design to the essentials to enhance the user
experience and make the message clearer and more direct." Dieter Rams: "Good design is as little
design as possible." Characteristics: simplicity · clean lines and negative space · limited colour
palette · bold and straightforward typography. Named examples: Apple, MUJI, ETQ Amsterdam.

**Key features (dev.to, §5 Minimalist UI)** — "Clean, simple, quiet design — less is more." Lots of
white space · thin typography · few visual distractions · fast and accessible. Used in "productivity
apps, banking apps, modern SaaS."

**Related styles worth borrowing from** — UX Planet §11 *Japandi* ("Light woods, beige/gray palettes,
clean sans-serif fonts, minimal icons"; mood: "Calm, peaceful, intentional") and §38 *Utilitarian*
("Grid layout, monospaced or industrial fonts, muted tones, absence of decoration"; mood: "Practical,
minimal, efficient"). Japandi is minimalism made warm; Utilitarian is minimalism made cold.

**Mood & occasion** — Tilda: "industries where creativity, freedom, and elegance matter. For
instance, fashion brands, photographers, music stores, architecture magazines, or artist portfolios."
Tilda also names it, with Swiss, as the dominant 2025 direction: "For most websites, Minimalism and
the Swiss style will continue to dominate."

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Affordance Warning | Minimalism hides affordances. A button that is just text with no border and no fill gets missed. Every interactive element needs at least one NON-COLOUR signal. |
| Grey Warning | #7a7a7a on #fafafa is ~4.6:1 — fine for 16px body, NOT fine below 14px. This pack uses #6b6b6b (5.9:1) to buy headroom. |
| Target Size Note | Bare text links in this pack land at 23.99px tall (15px x 1.6) - 0.01px under the 24x24 floor of WCAG 2.5.8. Nav links carry 6px vertical padding for that reason alone. Caught by the self-audit, not by eye. |

**Focus.** the accent is used once per view and cannot be spent on a focus ring; ink on ground is 17.4:1

## Reference images

- `refs/tilda-minimalism-1.png`, `-2.png`, `-3.png` — live minimalist websites from Tilda's gallery
- `refs/looka-minimalism.jpg`, `-2.jpg` — minimalist branding examples
- `refs/looka-minimalism-collage.jpg` — Apple / MUJI / ETQ collage
- `refs/uxplanet-japandi.png` — the warm variant (§11)
- `refs/uxplanet-utilitarian.png` — the cold variant (§38)
- `research/specimens/index.html` → tile **06 minimalism**

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Tilda *Minimalism* + cheat sheet + 2025 trends · Looka §3 · dev.to §5 · UX Planet §11, §38.
