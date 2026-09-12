# Neo-Brutalism — module specs

Cold file. Load only when building one of these. Rendered proof: `modules.html` (browser only,
never read into context). Values: `tokens.json`. Rules: `style.md`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

## 1. Nav / header

Full-width bar. **No shadow at rest** — a 4/4 shadow implies a floating card, and a bar spanning the
viewport is not floating. It earns the shadow only once it sticks.

```css
.nb-nav{
  border-bottom:2px solid var(--border);
  background:#fff;
  padding:12px 16px;
  display:flex; align-items:center; gap:24px;
}
```

Sticky variant — this is the one place the pack should reach for
`scroll-state()` (see `research/scroll/captures/platform-scroll-apis-2026.md`):

```css
.nb-nav-wrap{ container-type:scroll-state; position:sticky; top:0; }

@supports (container-type: scroll-state){
  @container scroll-state(stuck: top){
    .nb-nav{ box-shadow: 0 4px 0 0 #000; }   /* y-only: the bar is full width */
  }
}
```

Note the shadow is `0 4px`, not `4px 4px`. A full-bleed bar has no right edge to cast from, and a
4px x-offset would clip. **This is the one sanctioned exception to global shadow direction** — state
it when you use it.

Active link: accent fill + 2px border + 5px radius. Never an underline; underline is `brutalism`'s
vocabulary, not this pack's.

## 2. Hero

Max 4 text elements (engine §5). Headline **≤6 words** — tighter than the engine's 8, because the
display type is large enough that 8 words wraps to four lines.

- Headline `700`, clamp `clamp(2.5rem, 6vw, 4.5rem)`, `line-height:.95`
- Sub `500`, ≤25 words, `max-width:60ch`
- One primary button (accent fill), one secondary (white fill). Both 2px/4px/5px.
- Background is the light accent tint, never white.

Do not put a 4/4 shadow on the hero container itself. Shadows belong to objects the user can act on.

## 3. Button — five states

The state table. This is the module the whole set exists for.

| state | change from rest | note |
|---|---|---|
| **default** | `bg:var(--main)` · `border:2px #000` · `radius:5px` · `shadow:4px 4px 0 0` | |
| **hover** | `transform:translate(4px,4px)` · `shadow:0 0 0 0` | slides into its own shadow |
| **active** | as hover, `transform:translate(5px,5px)` | 1px past — reads as overshoot |
| **focus-visible** | `shadow: 4px 4px 0 0 #000, 0 0 0 3px #fff, 0 0 0 6px #000` | keeps the resting shadow; adds a white gap then a black ring. An accent ring fails: 2.37:1 over the page tint |
| **disabled** | `shadow:none` · `bg:#d4d4d4` · `border:2px #000` · `cursor:not-allowed` | |

**Why disabled removes the shadow rather than fading opacity.** In this pack the shadow *is* the
raise, and the raise is the affordance. Taking it away says "not pressable" structurally, in the
pack's own vocabulary. An opacity fade is banned (`## banned` — subtle hover), and WCAG 1.4.11
exempts disabled controls from the 3:1 floor, so the grey fill is legal.

**Derive the translate from the shadow token — never type both.** A size variant that re-declares
`box-shadow` after `:hover` has already set it to `0 0 0 0` wins the cascade (same specificity, later
in source), and the button then slides out and *leaves its shadow behind* instead of landing on it.
This shipped in `page.html` and was only caught by eye. The fix is structural:

```css
.btn      { --sx:4px; --sy:4px; box-shadow: var(--sx) var(--sy) 0 0 var(--border) }
.btn:hover{ transform: translate(var(--sx), var(--sy)); box-shadow: 0 0 0 0 var(--border) }
.btn.big  { --sx:8px; --sy:8px }        /* changes the token only — never box-shadow */
```

A variant now changes two numbers and cannot desync the pair. `page.html`'s self-audit asserts
`shadow offsets == --sx/--sy` on every button, so a regression fails loudly.

**Hover and focus must be independently visible.** A user tabbing has no pointer; a pointer user may
never focus. Focus keeps the resting shadow *and* adds the ring, so the two states never collapse
into looking identical.

Secondary button: identical geometry, `background:#fff`. Destructive: `background:var(--error)`.
That is the second hue and it is the budget — no third.

## 4. Form field + error

```css
.nb-field{
  border:2px solid var(--border); border-radius:var(--radius-base);
  background:#fff; padding:8px 12px; font-weight:500;
}
.nb-field:focus-visible{ outline:none; box-shadow:0 0 0 3px #fff, 0 0 0 6px #000; }
```

Inputs get **no resting shadow** — an input is a well, not a raised object. Only the submit button
is raised. This is the distinction that keeps a form from looking like a pile of identical bricks.

**Error state.** The border stays black (grey borders banned, and a red border alone would be
colour-only signalling — WCAG 1.4.1). Instead:

- a filled error tag below the field: `background:var(--error)`, 2px black border, black text
- the message text names the problem, not "invalid"
- `aria-invalid="true"` + `aria-describedby` pointing at the tag

Label sits above, `700`, never a placeholder. Placeholders vanish on input and are not labels.

## 5. Card

The pack's default object. `background:#fff`, 2px border, 5px radius, 4/4 shadow, 18px padding.

- Nested radius: `calc(5px - 2px)` = `3px` on anything inside touching the edge.
- Cards in a grid need **≥8px gap** or the 4px hover shift collides with the neighbour.
- A card that is not interactive should not hover. Reserve the shadow-collapse for things that do
  something.

## 6. List / table

Where this pack is strong — hard rules are already its native vocabulary.

```css
.nb-table{ border-collapse:separate; border-spacing:0;
  border:2px solid #000; border-radius:5px; overflow:hidden; }
.nb-table th{ background:var(--main); font-weight:700; text-align:left; }
.nb-table th, .nb-table td{ border-bottom:2px solid #000; padding:10px 14px; }
.nb-table tr:last-child td{ border-bottom:0; }
```

Radius on the outer container only; cells are square. `overflow:hidden` clips the corner cells to
the container radius. No shadow on the table — it is a surface, not a control.

Zebra striping: not needed and slightly off-pack. The 2px rules already separate rows.

## 7. Overlay / modal

Scrim `var(--overlay)` = 80% black, no blur (blur is banned).

Dialog is a card: white, 2px border, 5px radius, **4/4 shadow — not larger.** The temptation is to
scale the shadow to signal elevation; resist it. Depth here comes from the scrim, and the four
numbers are the system.

- Close button is a real button with the full five states, min 24×24 (2.5.8) — icon-only controls
  need explicit sizing because padding alone won't get there.
- Focus trapped inside; `Esc` closes; focus returns to the trigger.
- `prefers-reduced-motion`: no entrance transform, opacity only.

## 8. Empty / loading state

Specified in **zero of twelve packs**, and the state most often shipped by accident.

**Empty:** 2px **dashed** black border, 5px radius, **no shadow**, no fill. The missing shadow is the
message — there is no object here yet. Dashed is the one place the pack's solid-border rule bends,
and it bends deliberately: dashed reads as a slot.

Centre a `700` line stating what is missing, plus one primary button offering the fix. Never an
apology, never a shrug illustration.

**Loading:** solid 2px border, no shadow, a skeleton block filled `#d4d4d4`. No shimmer — a shimmer
is a gradient, and gradients are banned. If motion is wanted, step the opacity between two values
with `steps(2)`; never fade smoothly.

---

## Dark mode

Absent from all twelve packs. Here it is not a background swap.

**A black border on a dark ground disappears — and in this pack the border is the entire affordance
system.** So border and shadow invert to white; the accent does not change.

```css
@media (prefers-color-scheme: dark){
  :root{
    --border:#fff; --ring:#fff;
    --shadow:4px 4px 0 0 #fff;
    --surface:#111; --background:#1b2233;
  }
}
```

Focus ring inverts too: `0 0 0 3px #111, 0 0 0 6px #fff`. The gap colour must match the surface, not
stay white, or the ring reads as a halo.

**And the rule that is easy to miss: the accent does not invert, so text sitting on the accent must
not invert either.** Anything filled with `--main` or `--error` keeps `color:#000` in both themes.
Let it inherit `var(--border)` and dark mode silently turns it white-on-blue — measured at
**3.23:1**, below the 4.5 floor. This was a live failure on `page.html`, caught by its self-audit;
every accent-filled surface now hard-codes black text.

This does not violate "grey borders — black or nothing." White is not grey. The rule bans the
*low-contrast* middle, and white on `#111` is 18.9:1.

## Narrow width

`bento` warns that mobile is where a pack breaks; this pack breaks differently and just as reliably.

- **≥16px page padding, always.** The shadow extends 4px right and 4px down; at 0 padding it clips.
- The 4px hover shift needs the same clearance. On touch there is no hover — but there *is* `:active`,
  and it moves 5px.
- Display type: `clamp()` from `2.5rem`. A 6-word headline at 4.5rem is four lines on a 390px screen.
- Buttons go full width and stack with 12px gaps. Two 4/4 shadows 8px apart on a narrow column read
  as noise.
- The table scrolls horizontally in its own `overflow-x:auto` container. It never reflows to cards —
  that is `bento`'s move, not this pack's.
