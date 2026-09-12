# Glassmorphism — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` — browser only,
never read into context, and **generated** from `tokens.json` by `_shared/build-modules.mjs`.
Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

**This is the layer Apple says glass is actually for.** HIG *Materials* (2025): *"Don't use Liquid Glass in the content layer… it forms a distinct functional layer for controls and navigation that floats above the content layer."* A glass nav is correct; glass content cards are the common misuse.

## 2. Hero

Text on glass is the hardest legibility problem in the catalogue. Minimum **16px, weight 500** — 14px body on glass over a photograph is banned outright. The headline gets a scrim beneath it, not more blur.

## 3. Button — five states

Focus **cannot be translucent**. The panel's backdrop is unknown at author time, so the ring is solid white with a dark outer halo — it survives any backdrop underneath. This is the one place the pack drops glass entirely.

## 4. Form field + error

An input on glass needs a **more opaque** fill than its container, not less. Going thinner to look 'lighter' is how form fields become invisible over a photograph.

## 5. Card

Apple's rule bites here: a content card in glass is exactly what the HIG warns against. Shown because it is what everyone builds — and it is the reason the pack caps glass at **3 elements per view**.

## 6. List / table

The pack's worst module, and a genuine **✗**. Rows are repeating scroll items, and `backdrop-filter` on a repeating item is the documented FPS killer. The table sits on ONE glass panel; the rows themselves are not glass.

## 7. Overlay / modal

Glass's best module. A full-screen overlay is the one place blur above `24px` is correct, and the one place the backdrop is guaranteed to be interesting — it is the page you just came from.

## 8. Empty / loading

No glass. An empty state has nothing behind it worth refracting, so it falls back to the solid panel — which is also what the whole pack degrades to when `backdrop-filter` is unsupported. **Test this state; it is your fallback.**

---

## Dark mode

Dark glass drops fill alpha to `.05–.12` and keeps the white edge. **The backdrop stays saturated** — dark glass on a dark backdrop has nothing to refract and collapses to a flat panel.

Dark glass lowers the fill alpha to .05-.12 and keeps the same white edge. The backdrop stays saturated - a dark backdrop with dark glass has nothing to refract and collapses to a flat panel.

## Narrow width

Glass gets *more* dangerous on mobile, not less: the GPU is weaker and the backdrop is smaller, so a blurred panel covers proportionally more of what it was meant to reveal. Drop to one glass surface.

## Scroll

Headline technique: **parallax (●) — the signature pairing**

the backdrop is what glass is FOR, and moving it at a different rate is the whole effect

Also core: `scroll-world`

**Warning.** This is the best-matched and MOST DANGEROUS pairing in the catalogue. backdrop-filter re-blurs every frame. Never on a repeating scroll item. One glass panel per view.

Wired from `tokens.json` → `scroll` by `_shared/build-page.mjs`, so the technique on the page
cannot drift from the one recorded here.
