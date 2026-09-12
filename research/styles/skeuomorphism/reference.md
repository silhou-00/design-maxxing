# Skeuomorphism — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Research note

Checked against current reference galleries before rebuilding. The modern register for this style is HARDWARE - audio interfaces, mixing consoles, calculators, instrument panels - not the beige leather-and-linen of iOS 6. The vocabulary is rotary knobs with indicator lines, faders in recessed tracks, toggle switches, LED meters and a bounded device chassis, usually two-tone (light chassis with dark controls) and often carrying one saturated accent panel. That register is also the honest one for Norman's 'perceived affordance': a knob affords grabbing in a way a leather texture does not.

## Definitions, verbatim

**Definition (Wikipedia, *Skeuomorph*)** — "a derivative object that retains ornamental design cues
(attributes) from structures that were necessary in the original." Skeuomorphs "are typically used to
make something new feel familiar and thus easier to understand and use. They employ elements that,
while essential to the original object, serve no pragmatic purpose in the new system, except for
identification." Cited example: "a software calendar that imitates the appearance of binding on a
paper desk calendar."

**Why it exists, per the same source** — Don Norman frames it as *cultural constraints*: interactions
learned only through culture. It ties to his *perceived affordances*, "where the user can tell what
an object provides or does based on its appearance, which skeuomorphism can enable." That is the
whole justification for the style: the ornament is doing usability work, not decoration work.

**Core elements**
- Real material impersonation: leather, brushed metal, linen, felt, wood, paper, glass
- One consistent light source (top, or top-left) across every element on the screen
- Bevels: an inset light edge on top, an inset dark edge on the bottom
- Cast shadows below raised things; inset shadows inside recessed things
- Stitching, rivets, screws, torn perforations, page curls, spiral bindings
- Serif or humanist type; text with a 1px light text-shadow to look debossed
- Warm, desaturated, "material" palettes — tans, greens, greys — not screen primaries

**Mood & occasion** — Familiar, tactile, reassuring. Historically 1980s–2012 desktop and mobile OS
(pre-iOS 7). Today: deliberately retro products, music/audio tools where the physical original is
the mental model (mixing desks, drum machines, cameras), kids' and accessibility interfaces where a
literal affordance genuinely helps.

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Note | Norman's 'perceived affordance': the raised look IS the signifier. That makes this pack unusually strong on discoverability and unusually weak on scale — every control must be individually rendered. |
| False Affordance Rule | A raised look on something that is NOT clickable is the pack's cardinal sin. If it looks pressable it must be pressable. |
| Radius Note | Raised to 60 because a rotary knob is border-radius:50%. On a 72px knob that resolves to 36px, which is a control geometry rather than a soft-UI decision. |
| Meter Note | An LED meter reads green/amber/red because that is what a meter does — it is instrumentation, not palette. The hue budget counts it, so the cap is raised to 6 rather than pretending the meter is decorative. The PALETTE is still two-tone chassis plus one accent. |

**Focus.** the one screen-native colour this pack permits, and only here. A material focus ring would compete with the bevels; a blue ring reads as a system affordance layered ON the material, which is what it is.

## Reference images

`refs/` is empty, and **that is a recorded finding rather than a gap left open.** None of the four
source articles illustrates skeuomorphism — Looka mentions it once, in passing, as the thing flat
design replaced — and Wikipedia's images could not be captured. `refs/notes.md` carries the full
account, the named acquisition targets (iOS 6 Game Center / Find My Friends / Podcasts, Windows
Vista/7 Aero, and photographs of real audio hardware), and what to look at meanwhile.

Visual reference is therefore local, and there is now a good deal of it:

| open in a browser | what it shows |
|---|---|
| `modules.html` | the eight modules, every state, dark mode, narrow width — self-auditing |
| `page.html` | one composition at page scale: chassis, rotary knobs, faders, LED meters |
| `research/specimens/index.html` | tile **01 skeuomorphism**, top-left — live and editable |
| `research/specimens/specimen-sheet.jpg` | the same tile, in one image beside the other eleven |

**Never read those HTML files.** They exist to be looked at; the values are in `tokens.json` and the
rules are in `style.md`.

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: Wikipedia *Skeuomorph* (definition, Norman framing) · Looka (historical context: iOS 7 and
Windows 8 as the break point) · own implementation.
