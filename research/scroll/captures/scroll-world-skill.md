# Capture — oso95/scroll-world

**Source:** https://github.com/oso95/scroll-world
**Tagline:** "A skill that turn any brand into a scrollable 3D world landing page"
**Licence:** MIT · **Captured:** 2026-09-03, Chrome via `get_page_text`

---

## What it is (verbatim)

> "An agent skill — for Claude Code, Codex, and any SKILL.md-compatible agent — that builds an
> immersive, scroll-scrubbed 'fly through the world' landing page for any industry or brand — the
> kind where, as you scroll, a camera flies from outside each scene into its interior, then flows on
> to the next scene with no cuts. One continuous connected flight through a little generated world
> (think the Emons logistics site, applied to whatever you want)."

## The technique statement

> "It generates the art with AI: cohesive isometric diorama scenes (GPT Image 2 — via Higgsfield, or
> the Codex CLI on a ChatGPT subscription) and the camera flights themselves (Seedance
> image-to-video via Monid by default, pay-per-clip; Seedance or Kling on Higgsfield credits as
> fallback — **only models that can frame-lock a seam**), **scrubbed by scroll position — the same
> technique behind Apple's scroll-through product pages. The camera genuinely moves; scroll only
> drives time.** It's framework-agnostic: you get the Higgsfield pipeline, the prompt templates, and
> a portable vanilla-JS scrub engine that drops into plain HTML, Next.js, Vue, or a Python-served
> page — nothing assumes a stack."

## The three-step process

**1. Interviews you** — "the subject/industry + pitch, a brand kit (import from a URL, hand it over,
or have it proposed), **art direction**, the ordered scenes the camera visits, whether you want the
mobile version (a second chain rendered natively in 9:16 portrait — **composed for phones, not a
crop of the landscape film**), and the budget — render tiers and stills source shown with estimated
credit costs, approved before anything generates."

**2. Generates the assets** — "one still per scene, one 'dive-in' camera clip per scene, and the
connector clips that join consecutive scenes, **generated from the actual rendered frames of their
neighbours so every seam is frame-identical.** Mobile opt-in renders a parallel portrait chain the
same way, frame-locked against its own 9:16 renders."

**3. Wires it up** — "a config-driven scroll engine that plays the whole chain as one flight,
serving the portrait clips and posters automatically on phones."

## What ships in the skill

```
skills/scroll-world/
├── SKILL.md                    the procedure + the seam rule + gotchas
└── references/
    ├── prompts.md              intake checklist + every Higgsfield prompt template
    ├── pipeline.md             copy-paste batch scripts (generate → frames → connectors → encode)
    ├── scrub-engine.js         portable, config-driven scrub engine (blob-seek, lazy load,
    │                           seam crossfade)
    ├── index-template.html     a minimal standalone page that mounts the engine
    └── knockout.py             background knockout for floating scenes
```

## Requirements

- **Monid CLI** with an API key and balance — the default video-chain backend (Seedance 2.0, billed
  per clip in USD)
- **Higgsfield CLI**, authenticated, with credits — renders the scene stills, the `kling3_0`
  fallback, and the whole chain when Monid is absent
- **ffmpeg / ffprobe** for frame extraction and encoding
- **Python 3 with Pillow** — for the mobile portrait canvases and the optional transparent-scene
  knockout
- **Codex CLI** (optional) — scene stills via Codex's built-in `image_gen` (same GPT Image model),
  billed to a ChatGPT subscription instead of Higgsfield credits

On the Monid default: "verified 2026-07-25 — first/last-frame conditioning frame-locks, so it
renders the full seamless chain; frames travel via Monid's free workspace file system. Pay-per-use
with no subscription or monthly expiry (**a 6-scene 1080p chain ≈ $27**). The skill re-checks the
endpoint schema each build and keeps qualification probes in the pipeline for when the catalog
changes; Higgsfield credits remain the fallback biller."

## Cost model (verbatim)

> "Asset generation costs money (~N image gens on Higgsfield credits + ~2N-1 video gens billed per
> clip on Monid by default; **the mobile chain doubles the video gens**) and takes a while — the
> skill runs generations in the background and polls. Monid pricing is per-token and printed per
> run; Higgsfield pricing isn't exposed by its CLI, so the skill calibrates against your live
> balance. Either way the estimated total is stated before spending."

> "The generated .mp4/.webp assets are produced per project; they're not shipped here."

## Install

```
# Claude Code — as a plugin (recommended)
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world
# then: /scroll-world

# Codex & other agents — via Vercel's skills CLI
npx skills add oso95/scroll-world
npx skills add oso95/scroll-world -a codex

# Manually
git clone https://github.com/oso95/scroll-world
cp -R scroll-world/skills/scroll-world ~/.claude/skills/
```

---

## Verdict for our purposes

**The most specific and most opinionated source in this research**, and the one that forced the
technique-versus-style question in `../compatibility.md`.

Three things it contributes that nothing else does:

1. **The seam rule.** Generating connector clips *from the actual rendered frames of their
   neighbours* is the engineering idea that makes "one continuous flight" work rather than reading
   as a sequence of cuts. It generalises: any chained-video scroll experience lives or dies on
   frame-identical joins.
2. **A real cost model for AI-generated scroll experiences.** ~$27 for a 6-scene 1080p chain,
   doubling with mobile. This is the only technique in the folder with a per-build cash cost, and it
   belongs in any decision about using it.
3. **The mobile stance.** Rendering a *native* 9:16 portrait chain rather than cropping the
   landscape film is the right answer and an expensive one — it doubles the video generations. Worth
   noting because it is the decision most teams would get wrong.

**What it is not:** a general scroll-animation reference. It documents one highly specific
application end-to-end and assumes the technique rather than teaching it. For the mechanism, source
3 (Chrome) and source 7 (GSAP) in `../sources.md` are where the learning is.

**Note on classification:** this capture is filed under scroll research, but the analysis in
`../compatibility.md` concludes it occupies a *style* slot rather than a *technique* slot — because
it replaces, rather than composes with, whatever visual language the page otherwise has.
