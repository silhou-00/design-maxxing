# design-maxxing

Centralised design studio. A product repo hands over a brief; this folder supplies visual direction,
assets, tokens, and specs, then installs the skills the product repo needs to build the result.

**Start at `ROUTER.md`.** It holds the gates, the style-pack catalogue, the Class A/B split, and the
load order.

## Layout

```
ROUTER.md              routing table — read first
engine/                Layer 1 — style-neutral build rules
  engine.md            hot core, loaded every job
  audit.mjs            checks a built page against the pack and the asset plan.
                       --pack <name> reads that pack's tokens.json for its own budget
  preflight.md         ship checklist
  design-systems.md    install commands + canonical docs (cold)
  vocabulary.md        pattern names (cold)
  EXCLUDED.md          what was cut from the merge and why
install-class-b.mjs    installs in-repo skills into a product repo
briefs/<product>.md    incoming briefs
output/<product>/      outgoing artifacts
platform/              web · ios · android profiles (stubs)

research/styles/       12 packs, six files each
  <pack>/style.md      HOT — build rules only (~1.6K tokens)
  <pack>/tokens.json   values + a11y + copy budget. The SOURCE the HTML is built from
  <pack>/modules.md    the eight module specs (cold)
  <pack>/reference.md  provenance and sourced decisions (cold)
  <pack>/modules.html  NEVER READ — browser only. Eight modules, all states, self-auditing
  <pack>/page.html     NEVER READ — browser only. One composition at page scale
  _shared/             build-pack.mjs · build-modules.mjs · build-page.mjs · build-docs.mjs
                       audit.js · sheet.css
  specimens/index.html the picker AND launcher for all 12 module sheets

research/scroll/       16 techniques
  techniques/<n>.md    the spec for each
  sections/<n>.html    NEVER READ — browser only. Live demos, self-auditing vs engine.md §6
  sections/_selftest.html   deliberately broken; proves the auditor catches violations
  compatibility.md     scenario guide — where each scroll technique serves each style
  libraries.md         native CSS · Motion · Anime.js · GSAP — sizes, licences
  authoring-tools.md   the motion ASSET — Jitter, Lottie, Rive, Threlte
  assets/              real generated frame sequences (video-scrub, scroll-world)
  specimens/index.html the flat sheet AND launcher for all 16 sections
  _shared/             build-sections.mjs · audit.js · sheet.css

research/captures/     verbatim source articles (both domains)
taste/ kowalski/ impeccable/    vendor skill packs (npx-managed)
```

## Rules

**Never edit the vendor packs.** `taste/`, `kowalski/`, and `impeccable/` are npx-managed and
SHA-pinned in `skills-lock.json`. Editing or deleting a skill inside them desyncs the lock and gets
reverted on the next update. To disable a skill, remove its symlink in `<vendor>/.claude/skills/`.

**One style pack per surface. Never blend two.** The packs contradict each other by historical
descent — `minimalism` bans shadows because `skeuomorphism` is made of them. A pack's `## banned`
list is a hard filter that outranks any vendor skill.

**Never read a browser artifact.** `modules.html`, `page.html`, `sections/*.html`, the specimen
sheets and anything in `refs/` or `assets/` exist to be *looked at*. Reading one costs more than the
whole engine. Values live in `tokens.json`; rules live in `style.md`. ROUTER opens with the full list.

**Everything rendered is generated.** `tokens.json` is the source of truth for a pack;
`sections.json` for a scroll technique. Edit the source and rebuild — hand edits to the HTML are
lost on the next build.

```
node research/styles/_shared/build-pack.mjs --all
node research/scroll/_shared/build-sections.mjs --all
```

**Load only what the router names.** `design-taste-frontend` alone is 88KB (~22K tokens). Order is
engine → platform → style pack → brief, so a style re-roll costs ~1.5K instead of a full reload.

**Class B skills cannot run here.** `impeccable` registers hooks against `${CLAUDE_PROJECT_DIR}` and
injects a script tag into a project's real `index.html`. Install those into the product repo:

```
node install-class-b.mjs <target-repo> <skill> [<skill>...] [--dry-run]
node install-class-b.mjs --list
```

The installer merges hooks into the target's `settings.local.json` and backs it up first. It never
overwrites existing hooks.

**Structure belongs to the product repo.** Component hierarchy, routing, and state come from that
repo's planning context. This folder supplies direction, assets, tokens, and specs.

**Every shipped value must be traceable.** Packs carry measured or canonical numbers with sources. If
a needed value is missing, research it and record the source in that pack's `reference/notes.md`.
