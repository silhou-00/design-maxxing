# Glassmorphism — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is `style.md` and `modules.md`.

## Definitions, verbatim

**Core elements (UX Planet, *50 Design Styles*, §48 Glassmorphism)** — "Glassmorphism gives UI
elements a frosted glass look — transparent with blur and depth. It's soft, futuristic, and layered."
Core elements: "Frosted backgrounds, blur effects, semi-transparency, soft shadows, neon tints."
Mood & occasion: "Futuristic, elegant, sleek. Common in apps, OS UI, or product landing pages."

**Key features (dev.to, *Modern Web Design Styles*, §1)** — "The translucent, frosted-glass look.
Inspired by iOS and macOS blur effects." Background blur · transparent layers · soft borders ·
light, floating visuals. Used in "dashboards, cards, hero sections, modern SaaS designs."

**The lighter variant** — the same article's §6 *Frost UI (Soft Glass)*: "A lighter, subtler version
of glassmorphism." Low blur · soft transparency · neutral colors. For "mobile UI, dashboards,
premium apps."

**Mood & occasion** — Futuristic, premium, weightless. Works when there is a rich backdrop to look
through: a gradient mesh, a photograph, a video. On a flat white page it collapses to a grey box.

## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in `modules.html` / `page.html`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
| Contrast Problem | The panel's effective background is whatever pixels sit behind it, so AA cannot be guaranteed at author time. Mitigations in order: raise background alpha, add a linear-gradient scrim under the text, or push blur high enough that the backdrop becomes an even field. |
| Apple Rule | Apple HIG (Materials, 2025): do NOT use Liquid Glass in the content layer. Glass is for the functional layer - controls and navigation floating ABOVE content. Use it sparingly. |
| Glass Budget Note | at most 3 glass elements per view, and NEVER on a repeating scroll item |

**Focus.** a glass panel's effective backdrop is unknown at author time, so a translucent focus ring has no guaranteed contrast. The ring is SOLID white with a dark outer halo so it survives any backdrop.

## Reference images

- `refs/css-glass-generator.jpg` — the css.glass generator: live panel over a magenta/orange gradient,
  with the four controls and the emitted CSS
- `refs/uxplanet-glassmorphism.png` — UX Planet's art-direction plate for §48
- `research/specimens/index.html` → tile **03 glassmorphism** (blur 5 vs blur 16 + saturate,
  side by side over the same gradient)

## Related

- `../../captures/module-and-state-vocabulary.md` — the WCAG floor and where the module set came from
- `../../scroll/compatibility.md` — this pack's scroll row
- `modules.html` — eight modules, all states, dark mode, narrow width
- `page.html` — one composition at page scale, carrying the ● technique

Sources: css.glass (canonical CSS, the four parameters) · UX Planet §48 · dev.to §1 and §6 ·
own implementation.
