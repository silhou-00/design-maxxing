# Capture — dev.to: Modern Web Design Styles Every Frontend Developer Must Know (2025 Guide)

**Source:** https://dev.to/homayounmmdy/modern-web-design-styles-every-frontend-developer-must-know-2025-guide-1ijl
**Author:** Homayoun Mohammadi · **Posted:** 21 Nov 2025, edited 9 Dec 2025
**Tags:** frontend, ui, css, design · 28 reactions, 4 comments
**Captured:** 2026-09-03, Chrome via `get_page_text`
**Part of a 4-part series:** (1) this article, (2) Part 2, (3) UI Patterns Frontend Developers Must
Know, (4) UI Patterns Part 2.

**Honest assessment up front:** despite the `css` tag and the frontend framing, this article contains
**no CSS, no values, and no code**. Every entry is 4–5 bullet words plus a "where it's used" line.
Its real value is (a) naming two styles the other three sources miss entirely — neumorphism and
claymorphism — and (b) a comment thread that is more substantive than the article.

---

## Author's framing

"Web design evolves fast — new styles appear every year, and old trends come back with a modern
twist. For frontend developers, understanding these design languages is more than just 'knowing what
looks cool' — it's about choosing the right visual style that aligns with branding, UX, performance,
and user expectations."

---

## The six styles (complete, verbatim)

### 1. Glassmorphism ◆
"The translucent, frosted-glass look. Inspired by iOS and macOS blur effects."
- Background blur
- Transparent layers
- Soft borders
- Light, floating visuals

*Where:* "Dashboards, cards, hero sections, modern SaaS designs."

### 2. Neumorphism (Soft UI) ◆
"A soft, extruded 3D look created with inner + outer shadows."
- Subtle depth
- Rounded shapes
- Minimalistic
- Feels tactile

*Where:* "Toggles, buttons, cards, minimal dashboards."

### 3. Claymorphism
"A fun, colorful, cartoonish evolution of neumorphism."
- Thick soft shadows
- Bright colors
- 3D, playful aesthetic

*Where:* "Landing pages, playful apps, creative portfolios."

### 4. Neo-Brutalism ◆
"A modern revival of traditional brutalism — bold, raw, unapologetic."
- Strong borders
- High contrast
- Minimal gradients
- Uncomfortable on purpose

*Where:* "Portfolios, agency websites, creative brands."

### 5. Minimalist UI ◆
"Clean, simple, quiet design — less is more."
- Lots of white space
- Thin typography
- Few visual distractions
- Fast and accessible

*Where:* "Productivity apps, banking apps, modern SaaS."

### 6. Frost UI (Soft Glass) ◆ *(→ glassmorphism)*
"A lighter, subtler version of glassmorphism."
- Low blur
- Soft transparency
- Neutral colors

*Where:* "Mobile UI, dashboards, premium apps."

---

## Why the author says these matter

Five headings, each one line:
- **User Experience** — "Choosing the right style improves readability, usability, and focus."
- **Brand Identity** — "Each design style communicates a different emotional tone."
- **Performance** — "**Heavy shadows, filters, and 3D effects can hurt FPS if not optimized.**"
- **Component Design** — "Reusable components must align with the chosen visual language."
- **Trend Awareness** — "Knowing trends helps you build products that feel fresh and modern."

Conclusion: "Modern frontend developers should understand multiple UI design languages — not to use
all of them, but to choose the right one for the right project."

---

## The comment thread (the most useful content on the page)

**Webgamma**, 21 Nov 2025 — 5 likes. Quoted at length because it is the only place in any of the four
sources that states the layering principle we adopted:

> "At our UX design agency, we design and build product sites every day, and we see these styles less
> as trends and more as **constraints you choose on purpose**. Glassmorphism, claymorphism, brutalism
> and the rest work well only when three things line up: **content, brand, and the real context of
> use.**
>
> For example, we might use stronger brutalist accents on portfolio or campaign pages, but **keep
> core flows closer to minimalist UI so forms, tables, and error states stay clear on older devices
> and in bad lighting.** Same with glass or soft UI. It can look great on hero cards or key surfaces,
> but **if everything has blur and glow, the content loses contrast and the interface starts to feel
> slow.**
>
> What matters most for frontend devs is **understanding the cost of each style. Heavy shadows, blur,
> and custom components mean more CSS to maintain, more states to design, and more performance
> tuning. If you lock in typography, spacing, and hierarchy first, you can layer a style on top later
> without hurting readability or UX.**"

Author's reply, 28 Nov 2025: "You've perfectly articulated the real-world application and strategic
thinking that often gets lost in trend discussions. I couldn't agree more."

Two further comments are praise only ("Such wonderfull article" / 🙏).

---

## Verdict for our purposes

**As a style reference: weakest of the four.** No implementation, no measurements, no palettes, no
type recommendations, no images per style. Everything in it is covered better elsewhere.

**As an argument: the most valuable of the four.** Three claims we carried into the style packs:

1. **Styles are constraints chosen on purpose**, gated on content + brand + context of use.
2. **Split the page by surface, not by site** — bold style on hero/campaign surfaces, minimalist UI on
   forms, tables and error states. This is exactly the compromise recorded in
   `../styles/brutalism/style.md` under Gotchas.
3. **Typography, spacing and hierarchy get locked first; style layers on top.** This independently
   confirms the Layer 1 Engine / Layer 2 Style-pack split — a style-neutral base that packs sit on,
   rather than a set of merged, competing style opinions.

**Two styles it uniquely contributes:** Neumorphism (no other source of the four covers it) and
Claymorphism (not in our 12, but it is the direct descendant of neumorphism: same shadow model,
brighter colours, thicker shadows).

**Also worth noting:** `Frost UI` is not really a separate style — it is glassmorphism with the blur
dialled down and the hue neutralised. It is recorded in `../styles/glassmorphism/style.md` as the
low-blur variant rather than as its own pack.

**Unread:** the article is part 1 of 4. Part 2 and the two "UI Patterns" articles were not captured.
If more styles are needed later, that series is the cheapest next stop.
