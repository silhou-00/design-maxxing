# Authoring tools

> Where the motion *asset* comes from. Not techniques, not libraries — the tools that produce the
> thing a technique then plays.

**Why this exists.** `ROUTER.md` Gate 2.5 establishes that a real-world object is a raster and never
CSS. The same argument extends one step: **a piece of authored motion is an asset, not hand-coded
keyframes.** Nothing in this folder recorded where those assets come from, and `Lottie` appeared
nowhere in the corpus at all.

Which techniques consume this:

- `video-scrub` — the sequence has to be produced by something. See its section: 48 procedurally
  rendered frames, 214 KB, and no library needed to play them.
- `scroll-world` — the production form is a generated chain with a real cash cost.
- Any UI motion too intricate to express in CSS but too small to justify a 3D runtime.

---

## Jitter

Web-based collaborative motion design tool. **Not a library — nothing imports it.**

> "Design in motion. Now with AI." · "Over 20,000 creative teams use Jitter to create stunning
> animations online."

What matters here is only what it emits:

> "**Batch export** — No more downloading videos one by one. Export hundreds of animations to
> **video, GIF, Lottie**, or any other format, all at once."

Also relevant to a pipeline: *Image → Video* ("turn any image into a video with AI"), *Magic Import*
("create hundreds of variations with different copy or assets"), auto-resize and auto-translate,
animated components, 400+ templates. Pricing: free to start.

**Where it slots in.** It is to motion what `imagegen-frontend-web` is to a still: the tool that
produces the asset Gate 2.5 says must exist. It is a Class A concern — the output is portable.

## Lottie

JSON, vector, scriptable playback. The format that matters for the web, because a Lottie's progress
can be driven by a scroll value exactly as a video's `currentTime` can.

**The caveat, stated before anyone reaches for it:** `lottie-web` is **heavier than every scroll
engine in `libraries.md` combined**. The `dotlottie` player is the lighter current option. Neither
has been measured here — do that before putting a number in a technique file.

A Lottie is the right answer when the motion is *vector and intricate* — an icon that transforms, a
diagram that assembles. It is the wrong answer when a CSS keyframe would do, which is most of the
time.

## Rive

Interactive vector runtime with a state machine, so the asset can respond rather than only play.
Relevant where a scroll value should drive a *state*, not a timeline position. Same weight caution as
Lottie: it is a runtime, not a file.

## Threlte and react-three-fiber

Renderers, not authoring tools, but they belong in the same decision.

`@threlte/core` binds Three.js to **Svelte**; react-three-fiber does the same for React. Threlte's
packages: `core`, `extras`, `gltf` (a CLI that turns GLTF into components), `rapier` (physics),
**`theatre`** (animation, via Theatre.js), `xr`, `flex`.

**The scroll-relevant piece is `@threlte/theatre`, not Threlte itself** — Theatre.js is the
sequencer a scroll progress value would drive.

| framework | binding | sequencer |
|---|---|---|
| React | react-three-fiber + drei | Theatre.js, or a Motion `scroll()` progress value |
| Svelte | `@threlte/core` + `@threlte/extras` | `@threlte/theatre` |
| none | Three.js directly | hand-rolled |

This is the **runtime alternative** to `scroll-world`'s generated-frame chain: no per-build cash
cost, a WebGL bundle and a GPU budget instead. `engine.md` §6 applies — *never mix GSAP or Three.js
with Motion in one component tree; they fight over the same frames.*

---

## The rule

**Produce the asset before the code that places it**, exactly as Gate 2.5 requires for stills. And
declare it: an asset that does not exist yet gets `data-asset="…-pending"` and a placeholder that
names itself, so `engine/audit.mjs` fails until it lands.

`sections/video-scrub.html` and `sections/scroll-world.html` both do this — and both then went
further and shipped real generated frames, so the placeholder path is demonstrated rather than
merely described.

**What none of these is:** a scroll technique. A style pack has no opinion about which tool drew the
asset, which is why none of this appears in `compatibility.md`.

Sources: `captures/threlte-and-jitter.md` · jitter.video · threlte.xyz.
