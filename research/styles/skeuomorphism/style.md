# Skeuomorphism

> Interfaces that imitate real materials and real physics so the control explains itself.

**Hot file.** Build rules only. Provenance and quotes are in `reference.md`; the eight module specs
are in `modules.md`; machine-readable values are in `tokens.json`. Load those only when the job
needs them.

**Mood & occasion** — Familiar, tactile, reassuring. Historically 1980s–2012 desktop and mobile OS
(pre-iOS 7). Today: deliberately retro products, music/audio tools where the physical original is
the mental model (mixing desks, drum machines, cameras), kids' and accessibility interfaces where a
literal affordance genuinely helps.

## Implementation

The style is entirely a shadow-and-gradient discipline. Values below are from
`research/specimens/index.html` (`.skeu*`), verified rendering in Chrome.

```css
/* Raised control — the four-shadow stack is the whole trick */
.skeu-btn{
  font: 600 15px Georgia, serif;
  color: #4a3a20;
  padding: 12px 26px;
  border: 1px solid #7a6a48;
  border-radius: 8px;
  /* 4-stop gradient: highlight, body, hard mid-break, bounce light */
  background: linear-gradient(#f4ead2 0%, #e2d3b0 48%, #d2c199 52%, #e8dcc0 100%);
  box-shadow:
    inset 0  1px 0 rgba(255,255,255,.85),  /* top bevel highlight */
    inset 0 -1px 0 rgba(0,0,0,.18),        /* bottom bevel shade   */
    0 2px  3px rgba(0,0,0,.35),            /* contact shadow       */
    0 6px 12px rgba(0,0,0,.22);            /* ambient shadow       */
  text-shadow: 0 1px 0 rgba(255,255,255,.7);
}
/* Pressed = flip the gradient AND replace outer shadows with an inset */
.skeu-btn:active{
  background: linear-gradient(#d2c199, #e8dcc0);
  box-shadow: inset 0 2px 5px rgba(0,0,0,.4);
  transform: translateY(1px);
}

/* Recessed well — inset shadow + a highlight on the OUTSIDE bottom edge */
.skeu-well{
  background: #cdbf9e;
  border-radius: 999px;
  padding: 4px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.5);
}
.skeu-knob{
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(#fff, #d8cdb2);
  border: 1px solid #8b7a56;
  box-shadow: 0 2px 4px rgba(0,0,0,.4), inset 0 1px 0 #fff;
}

/* Surface texture — two stacked background-images, no asset needed */
.skeu-surface{
  background-color: #b8a888;
  background-image:
    linear-gradient(rgba(255,255,255,.10), rgba(0,0,0,.16)),
    repeating-linear-gradient(45deg, rgba(0,0,0,.03) 0 2px, transparent 2px 4px);
}

/* Glowing indicator */
.skeu-led{
  width: 12px; height: 12px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #9f9, #1a1);
  box-shadow: 0 0 8px #4f4, inset 0 -1px 2px rgba(0,0,0,.5);
}

/* Stitched seam */
.skeu-stitch{ border: 2px dashed #b9a271; border-radius: 6px; }
```

**Measurements**
| Token | Value |
|---|---|
| Border radius | 6–10px on controls, 10–14px on panels |
| Bevel highlight | `inset 0 1px 0 rgba(255,255,255,.8–.9)` |
| Bevel shade | `inset 0 -1px 0 rgba(0,0,0,.15–.2)` |
| Contact shadow | `0 2px 3px rgba(0,0,0,.3–.4)` |
| Ambient shadow | `0 6px 12px rgba(0,0,0,.2–.25)` |
| Pressed inset | `inset 0 2px 5px rgba(0,0,0,.4)` |
| Gradient stops | 4, with a 4% hard break at the midpoint |
| Palette saturation | low; hue warm (30–60°) or neutral |

## State floor

Standards, not preferences. These outrank the `## banned` list where they collide — see
`../../captures/module-and-state-vocabulary.md`.

```css
:focus-visible{ outline:3px solid #2f6fd0; outline-offset:2px }
```

**Why this and not something on-style.** the one screen-native colour this pack permits, and only here. A material focus ring would compete with the bevels; a blue ring reads as a system affordance layered ON the material, which is what it is.

| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | 3:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + `4h+4w` area | the ring above |
| Target size (2.5.8) | 24×24 min | controls are sized against this floor |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |

**False Affordance.** A raised look on something that is NOT clickable is the pack's cardinal sin. If it looks pressable it must be pressable.

**Radius.** Raised to 60 because a rotary knob is border-radius:50%. On a 72px knob that resolves to 36px, which is a control geometry rather than a soft-UI decision.

**Meter.** An LED meter reads green/amber/red because that is what a meter does — it is instrumentation, not palette. The hue budget counts it, so the cap is raised to 6 rather than pretending the meter is decorative. The PALETTE is still two-tone chassis plus one accent.

## Banned

- More than one light direction on a screen — this is the single most common failure
- Flat `background: <solid>` on an interactive control
- Pure `#000` shadows at full opacity; always alpha, always soft
- A raised look on something that is not clickable (false affordance)
- Screen-native accent colours (`#0af`, `#f0f`) — they break the material illusion
- Icons drawn flat and then dropped onto a textured surface

## Copy budget

Read by `engine/audit.mjs` via `--pack skeuomorphism`; the numbers live in `tokens.json`.

| | value | note |
|---|---|---|
| measure | `45–66ch` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤6 words** | engine §5 default is 8 |
| sub | ≤22 words | |
| button label | ≤2 words | |
| chars per viewport | 360 | engine default is 420 |

labels are engraved into a surface, which caps how much text a control can hold

## Gotchas

- **Contrast.** Debossed text (`text-shadow` light, dark fill) on a mid-tone material routinely fails
  WCAG AA. Check every label; darken the fill rather than removing the shadow.
- **Cost.** Four-shadow stacks plus gradients plus textures on a long list will drop frames. Promote
  only the pressed state, and never animate `box-shadow` — cross-fade two layers instead.
- **Dark mode.** Skeuomorphism does not theme. The light model is baked into the gradient stops.
  Build a second material palette or ship light-only.
- **The reason must be real.** Norman's affordance argument only holds when the imitated object *is*
  the user's mental model. A leather-bound settings screen is decoration, not affordance.

## Files

| file | load when |
|---|---|
| `tokens.json` | you need values, or `audit.mjs` runs. **Also the source `modules.html` and `page.html` are built from** |
| `modules.md` | building any of the eight modules |
| `reference.md` | citing the pack, or asked why a rule exists |
| `modules.html` | **never read into context** — generated; open in a browser |
| `page.html` | **never read into context** — one composition at page scale |
| `refs/` | images; never read |
