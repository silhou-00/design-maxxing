# design-maxxing

A centralised design studio for Claude Code. A product repo hands over a brief; this folder supplies
visual direction, assets, tokens and specs, then installs the skills the product repo needs to build
and audit the result.

**Start at [`ROUTER.md`](ROUTER.md).** It holds the gates, the style-pack catalogue, the Class A/B
split and the load order. [`CLAUDE.md`](CLAUDE.md) has the full layout and the rules.

## What's in here

| | |
|---|---|
| `engine/` | Layer 1 — style-neutral build rules, the ship checklist, and `audit.mjs`, which measures a built page against its pack and asset plan |
| `research/styles/` | 12 style packs, each with hot rules, `tokens.json`, module specs and a rendered specimen — bento · brutalism · editorial · flat · glassmorphism · hand-drawn · minimalism · modernism · neo-brutalism · neumorphism · skeuomorphism · swiss |
| `research/scroll/` | 16 scroll techniques with live self-auditing demos, a scenario guide for pairing them with the packs, and a library / authoring-tool reference |
| `research/captures/` | verbatim source articles both domains were built from |
| `platform/` | web · ios · android profiles |
| `install-class-b.mjs` | installs the in-repo skills a product repo needs |

## Running the audit

From a product repo with a dev server up:

```
node D:/GithubRepo/design-maxxing/engine/audit.mjs http://localhost:5173 --pack editorial
```

It reports density, dead viewports, gutter symmetry, page length across four breakpoints, smallest
rendered font, tap targets, scroll-technique spread, `prefers-reduced-motion`, unreplaced
placeholders, and the mechanically checkable half of the pack's banned list. Requires `playwright`
resolvable from the product repo.

## Not in this repo

- **`briefs/` and `output/`** — product briefs and generated artifacts are client work and stay local.
  The folders are kept so the structure clones intact.
- **`research/styles/*/refs/`** — reference images downloaded from the source articles. Every URL is
  in each pack's `reference.md`; the copies aren't ours to redistribute.

## Third-party skill packs

`taste/`, `kowalski/` and `impeccable/` are vendored skill packs from other authors, committed so a
fresh clone works. They are SHA-pinned in their `skills-lock.json` files and are never edited here —
see the rules in `CLAUDE.md`. Sources: [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill),
[emilkowalski/skill](https://github.com/emilkowalski/skill), and Impeccable.
