# The library layer

> Reference, not routing. `engine/engine.md` §6 decides what a build reaches for; this file records
> what exists so that decision is made with the field in view.

**Why this exists.** `captures/js-libraries.md` covers GSAP, Scrollama and Lenis, and was written as
though those were the field. They are not. Two engines have shipped native-`ScrollTimeline` scroll
APIs that are between 2× and 24× smaller than ScrollTrigger, and neither appeared anywhere in this
folder.

**What this does not do.** It does not re-route anything. `engine.md` §6's table is unchanged and
GSAP remains what it points at for sequencing. This is the information that table was written
without.

---

## The honest ordering, smallest first

| | scroll cost | core | accelerated | licence |
|---|---|---|---|---|
| **native CSS** | 0 | 0 | yes — compositor | — |
| **Motion** `scroll()` | +2.5 kb (linked) · +0.5 kb (trigger) | 2.6 kb mini · 18 kb full | **yes** | MIT |
| **Anime.js** `onScroll()` | 4.30 kb | 27.13 kb whole library, modular | no | MIT |
| **GSAP** ScrollTrigger | +12 kb | 23.5 kb | no | proprietary, free |

Sizes from each project's own published figures; the comparison table is Motion's, and it is a
vendor comparison — directionally sound, not neutral.

**Almost everything in `techniques/` needs none of them.** Fourteen of the sixteen sections in
`sections/` are pure CSS, including the 48-frame video scrub. The library question only arises for
sequencing, velocity, stepped narrative and media scrubbing.

---

## Motion — `scroll()`

> "As part of Motion's hybrid engine, `scroll` is able to run animations with the **ScrollTimeline
> API** where possible for optimal hardware-accelerated performance… ensuring animations remain
> smooth even under heavy CPU usage."

This is the same argument §6 already makes for CSS scroll-driven animations — *off the main thread* —
reachable from JavaScript. It is the missing middle rung between `animation-timeline` and GSAP.

```js
import { scroll, animate } from "motion"

scroll(progress => console.log(progress))                    // 0 → 1
scroll(animate("div", { transform: ["none","rotate(90deg)"] }, { ease: "linear" }))
scroll((progress, info) => console.log(info.y.velocity))     // velocity, without a listener
```

**Options** — `container` (default `window`), `axis` (`"y"`), `target`,
`offset` (default `["start start","end end"]`), `trackContentSize` (default `false`).
Per axis, `info` carries `current`, `offset`, `progress`, `scrollLength`, **`velocity`**.

**Pinning is structural, not a feature.** Motion's docs: *"pinning should be performed with
`position: sticky`."* It does not pin, which is why it has none of `anticipatePin`, `pinSpacing` or
`pinReparent` — three GSAP settings that exist to paper over JS pinning.

**`trackContentSize`** is off by default: *"most of the time, scrollable area remains stable, and
tracking changes to it involves a small overhead."* Turn it on for lazy-loaded or accordion content,
or a progress bar over a growing page will silently drift.

## Anime.js v4 — `onScroll()`

Since 4.0.0. A module, not a plugin, and the observer **is** the `autoplay` value — there is no
register/kill lifecycle to leak.

```js
import { animate, onScroll } from 'animejs'
animate('.square', { x: 100, autoplay: onScroll({ sync: .25, enter: 'bottom-=50 top' }) })
```

**Four sync modes**, and the third is the one with no equivalent in this corpus:

| `sync` | behaviour |
|---|---|
| a method name | triggered — fire a playback method at the threshold |
| `true` | 1:1 with scroll (GSAP's `scrub: true`) |
| **a number `0`–`1`** | **smooth scroll — eased catch-up** |
| an easing | eased scroll |

> "The closer the value gets to 0, the longer the animation takes to catch up with the current
> scroll position."

**This matters for `techniques/smooth-scroll.md`**, which is Lenis-only. Lenis smooths *the whole
page's scroll position* — a global feel change, and the reason that file carries so many
accessibility caveats. `sync: .25` smooths *one animation's catch-up* and leaves native scroll
untouched. GSAP's `scrub: 1` is the same idea. Neither was recorded as an alternative.

`debug: true` draws threshold markers, as ScrollTrigger's `markers` does.

v4.5 also added `TEXT` and `ADAPTERS` modules — SplitText territory. Not investigated.

## GSAP — unchanged

Still what `engine.md` §6 routes to for sequencing, and it keeps the one capability nothing else
has, conceded by Motion's own comparison:

> "The benefit to GSAP's timeline API is that it's **mutable**. Once playback has begun, individual
> tracks can be added and removed to the overarching sequence, an ability that Motion doesn't yet
> offer."

**Licence, verified at source** (`gsap.com/community/standard-license`, eff. 2025-04-30). The money
question is settled — commercial use free, SplitText and MorphSVG included, and AI-generated GSAP
explicitly permitted:

> "Can I really use GSAP in commercial projects without paying anything? **Yes, really!**"

Two facts worth carrying, neither a reason to change anything:

1. It is **not open source** — a revocable licence from Webflow. §V: *"Webflow may terminate this
   GSAP License… in its discretion."* Motion and Anime.js are MIT, which is irrevocable.
2. The one restriction is narrow: no shipping a **no-code visual animation builder** that competes
   with Webflow. Building a product website with it is explicitly a Permitted Use.

Motion's comparison page states this more broadly than the licence does. The licence text is the
authority.

---

## Choosing

1. **Can CSS express it?** Fourteen of sixteen sections say yes. Start there.
2. **Do you need velocity, or JS-side progress?** Motion's `scroll()`, ~3 kb, accelerated.
3. **Do you need stepped narrative states?** Scrollama — discrete states, not a continuous 0→1.
4. **Do you need a mutable timeline, or heavy orchestration?** GSAP, as §6 says.
5. **Media scrubbing?** JS — but check `sections/video-scrub.html` first: a frame sequence needs
   none, because it has no `currentTime` to set.

Sources: `captures/motion-and-animejs.md` · motion.dev/docs/scroll · animejs.com/documentation/events/onscroll ·
gsap.com/community/standard-license.
