# Capture — Threlte and Jitter, and why neither is a scroll technique

**Sources:** threlte.xyz/docs/learn/getting-started/introduction · jitter.video
**Captured:** 2026-09-04

Both were handed to this folder alongside Motion and Anime.js, as if the four were one category.
They are not. Motion and Anime.js are scroll engines and belong in `techniques/`. These two are a
**renderer** and an **authoring tool**. Filing either under `techniques/` would be a category error
— the same class of error `ROUTER.md` Gate 2.5 exists to prevent, where a thing that is really an
asset gets treated as a thing that is really code.

---

## Threlte — a renderer, and only if the repo is Svelte

> "Threlte brings Three.js to Svelte in a declarative and state-driven way. It provides strictly
> typed components for deep reactivity and interactivity out-of-the-box."

Packages, verbatim from the introduction:

| package | what it is |
|---|---|
| `@threlte/core` | "simple, transparent Svelte binding to Three.js". `<T>` is "a thin, declarative wrapper for any Three.js class" |
| `@threlte/extras` | "a collection of plugins and components that add additional functionality" |
| `@threlte/gltf` | "a command-line tool that turns GLTF assets into declarative and re-usable Threlte components" |
| `@threlte/rapier` | physics, via the Rapier engine |
| `@threlte/theatre` | animation, via the Theatre.js animation library |
| `@threlte/xr` | VR and AR |
| `@threlte/flex` | `yoga-layout` flex engine |

Docs nav also carries a **studio** section (visual editor) and a WebGPU/TSL page under Advanced.
Threlte 8 is current; 7 is archived at `v7.threlte.xyz`.

### Why it is one line, not a file

**It requires Svelte.** Nothing in this folder targets Svelte. `engine.md` §6 names Motion (React)
and GSAP; `install-class-b.mjs` installs into React-shaped product repos. Threlte is only reachable
if a brief arrives from a SvelteKit repo, and then it is the exact counterpart of
react-three-fiber — same Three.js underneath, same job, different binding.

**The scroll-relevant piece is `@threlte/theatre`, not Threlte itself.** Theatre.js is the sequencer;
that is what a scroll progress value would drive. `techniques/scroll-world.md` currently describes
generated art direction over a ground layer and does not name a 3D runtime at all. If a brief ever
asks for genuine scroll-driven 3D rather than generated frames, the runtime row is:

| framework | binding | sequencer |
|---|---|---|
| React | react-three-fiber + drei | Theatre.js, or a Motion `scroll()` progress value |
| Svelte | `@threlte/core` + `@threlte/extras` | `@threlte/theatre` |
| none | Three.js directly | hand-rolled |

Neither r3f nor Threlte is currently named anywhere in `research/scroll/`. That is the actual gap
Threlte exposes — not Threlte itself, but the fact that **`scroll-world` has no runtime path at
all**, only a generated-frames path with a per-build cash cost.

**Cost note.** Any of these is a WebGL bundle and a GPU budget. Against `engine.md` §6's
"composite-only properties" discipline, a Three.js scene is a deliberate exception, not an
extension of it. It also collides with `engine.md`'s existing rule: *"Never mix GSAP or Three.js
with Motion in one component tree. They fight over the same frames."*

---

## Jitter — an authoring tool, and it belongs near Gate 2.5

> "Design in motion. Now with AI." · "Over 20,000 creative teams use Jitter to create stunning
> animations online."

Logos shown: Google, Gamma, Perplexity, DEPT, Deliveroo, TikTok, Huge.

Web-based collaborative motion design tool. Not a library. Nothing imports it.

**What it emits is the only part that matters here:**

> "Batch export — No more downloading videos one by one. Export hundreds of animations to **video,
> GIF, Lottie**, or any other format, all at once."

Other features, verbatim, that bear on a design pipeline:

* "Turn static designs into animated assets in no time."
* "**Image → Video** — Turn any image into a video with AI to add depth to static assets."
* "**Magic Import** — Create hundreds of variations with different copy or assets with AI-powered
  Magic Import."
* "Auto-resize, auto-translate … for various channels and languages in a single click."
* "Animated components — Animate once, reuse everywhere."
* Pen tool and morphing, gradients, animated blur, blend modes, audio and video, 1,500+ fonts.
* 400+ free templates.
* Pricing: "Start for free. Upgrade anytime."

### Where it actually slots in

`ROUTER.md` Gate 2.5 says a real-world object is a raster, never CSS. The same argument extends one
step: **a piece of authored motion is an asset, never hand-coded keyframes.** Jitter is the tool
that produces that asset, exactly as `imagegen-frontend-web` produces a still one.

Two existing techniques consume its output directly:

* `techniques/video-scrub.md` — scrubs an MP4 against scroll. Jitter is one way that MP4 gets made.
* `techniques/scroll-world.md` — currently ~$27 per six-scene chain of generated image and video
  calls. A Jitter composition is the hand-authored alternative to part of that chain, at a
  subscription rather than a per-build cost.

Lottie is the format that matters for the web: JSON, vector, scriptable playback, and its progress
can be driven by a scroll value the same way a video's `currentTime` can. Lottie is not named
anywhere in `research/scroll/` today.

**Caveat before anyone reaches for it.** A Lottie runtime is another dependency, and
`lottie-web` is heavier than every scroll engine in `motion-and-animejs.md` combined. The
`dotlottie` player is the lighter current option. Neither has been measured here — do that before
putting a number in a technique file.

---

## Verdict

| | what it is | where it goes |
|---|---|---|
| Threlte | Svelte renderer for Three.js | one row in `techniques/scroll-world.md`, under a new "runtime path" heading that also names react-three-fiber |
| Jitter | motion authoring tool, exports Lottie/MP4/GIF | a new `research/scroll/authoring-tools.md`, referenced from Gate 2.5 and from `video-scrub.md` |

Neither gets a `techniques/` file. Neither changes the compatibility matrix — a style pack has no
opinion about which tool drew the asset.
