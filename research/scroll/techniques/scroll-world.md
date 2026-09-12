# Scroll-World

> A continuous camera flight through a generated 3D world, scrubbed by scroll. The camera flies
> from outside each scene into its interior, then on to the next, with no cuts.

**Binding:** scrubbed · **Mechanism:** chained pre-rendered video (or real-time WebGL)
**Cost:** the highest in this folder — money as well as bytes · **Risk:** high
**Layer:** **ground** — it owns the background surface. This is what governs its compatibility.

## What it is

The reference implementation is `oso95/scroll-world`, which builds "an immersive, scroll-scrubbed
'fly through the world' landing page for any industry or brand — the kind where, as you scroll, a
camera flies from outside each scene into its interior, then flows on to the next scene with no
cuts. One continuous connected flight through a little generated world."

Its stated visual reference is the Emons logistics site.

**Not adopted here.** It carries heavy external requirements — two paid video/image generation CLIs
with balances, ffmpeg, Python+Pillow — and a per-build cash cost. This file records the *technique*
as research; it is not an install guide. Source capture: `../captures/scroll-world-skill.md`.

## The mechanism

Mechanically this is `video-scrub.md`: scroll sets the playhead of pre-rendered footage. The
framing that matters — **the camera genuinely moves; scroll only drives time.** It is the same
technique behind Apple's scroll-through product pages.

**The seam rule is the core engineering idea.** Connector clips between scenes are generated *from
the actual rendered frames of their neighbours*, so every join is frame-identical. Only models that
can frame-lock a seam are usable. Without this the flight cuts, and the illusion of one continuous
camera dies.

That generalises well beyond this one implementation: any chained-video scroll experience lives or
dies on frame-identical joins.

## Two camera architectures — and a correction

An earlier version of this file described "dive into each scene, then an aerial connector out to the
next" as *the* approach. That is only one of two, and it is the narrower one:

| | Architecture | Fits |
|---|---|---|
| **A** | **One continuous forward take.** Legs chained from each other's actual last frames. No pull-back. | grounded, realistic, walkthrough — and the generally recommended default |
| **B** | **Dive-in + aerial connector.** Fly into a scene, pull back out, fly to the next. | diorama / miniature / god's-eye worlds only |

The reason the distinction matters is a failure mode specific to B: even with frame-perfect seams,
**if the camera's velocity reverses — forward dive, then a connector that pulls back out — it reads
as a rewind.** Frame-matching fixes the *cut*; it does not fix an incoherent camera path. B is
inherent to the diorama look and you accept the risk; A avoids it structurally.

Practical takeaway for any scroll-world work: **decide the camera grammar before generating
anything**, because the architecture determines whether connectors exist at all, and therefore the
asset count and the cost.

## The layer rule — how it composes with the 12 styles

Scroll-world owns the **ground layer**: the background surface, its material, its palette, its
depth model. It does **not** touch the **chrome**: type, spacing, small UI, borders, overlay panels.

That single distinction predicts every compatibility rating:

| | Styles | Result |
|---|---|---|
| **Ground styles** — the background *is* the style | skeuomorphism, neumorphism, flat, bento, hand-drawn, brutalism | ✗ overwritten |
| **Chrome styles** — type and overlay UI; background negotiable | **glassmorphism ●**, minimalism ○, editorial ○ | compose |
| **Mixed** | neo-brutalism, modernism, swiss | ⚠ chrome survives, surface logic fights |

**Glassmorphism is a core fit and the pairing worth knowing.** Glass requires a rich, multi-hued
moving backdrop to read as glass at all — its own style file makes that mandatory and bans
glass-on-flat-solid. A scrubbed world is the richest backdrop available. They need each other.
Budget carefully: `backdrop-filter` compositing over decoding video is expensive.

**Minimalism composes** — that is Apple's model, and why "Apple ships video scrub inside a
minimalist language" is a true counter-example to calling this a style outright.

Full per-style reasoning: `../compatibility.md`.

## Technique or style?

Both, once you separate the layers — and the layer framing replaced an earlier, blunter conclusion
that it "never composes with anything", which rating it against all twelve styles disproved.

- **As a technique** it is legitimately rateable and its ratings are differentiated. It earns its
  column in the matrix.
- **As a style** it still ships its own art direction and your CSS still cannot reach the world
  itself.

> **scroll-world = video-scrub (technique) + a generated art direction (style), sold as one unit.**

You can take the technique without the style — that is Apple, and why minimalism rates ○. You
cannot take a generated-world style without the technique.

## Cost — why this is the expensive one

Asset generation is billed per clip, and the count scales with scene count:

```
images ≈ N            (N = number of scenes)
videos ≈ 2N − 1       (N dive-ins + N−1 connectors, under architecture B)
mobile chain          → doubles the video generations
```

Stated example: **a 6-scene 1080p chain ≈ $27**, before mobile. Architecture A needs no connectors,
so its video count is lower — another reason the camera-grammar decision comes first.

Two structural notes worth keeping even if you never use this skill:

- **Mobile is a real decision, not a toggle.** The right answer is a *native* 9:16 chain — "composed
  for phones, not a crop of the landscape film" — because a 16:9 clip on a tall phone shows only its
  centre. That doubles the video bill. Cropping is cheaper and looks it.
- **Scene order is the script.** Reordering after generation invalidates the connectors either side
  of every move, because connectors are frame-locked to specific neighbours.

Plus the runtime cost of `video-scrub.md`, doubled if you ship the mobile chain.

## Accessibility

Everything in `video-scrub.md` applies, more so:

- **The entire narrative is un-selectable, un-translatable pixels.** The DOM must carry the real
  content in parallel — otherwise the page has no accessible version at all.
- A continuous flying camera is close to a worst case for vestibular sensitivity. Under
  `prefers-reduced-motion`, show the scene stills as a static sequence, not the flight. Any
  implementation of this technique produces one still per scene anyway, so those assets exist —
  use them.
- Long pinned flights consume enormous scroll distance while producing no new DOM content.
- Bound the scrub velocity so a fast flick becomes a survivable pan rather than a lurch.

## When not to use it

- Anything that needs frequent editing, or that must be indexed on its copy.
- Any project where a per-build generation bill is not acceptable.
- Products with a strong CSS-expressible identity — you would be overriding it. Unless that identity
  is chrome-layer (glass, minimal, editorial), in which case it survives.
- As one section inside a page with a different strong **ground** style. It will win the fight.

## Specimen

None — it requires generated assets and paid APIs.
