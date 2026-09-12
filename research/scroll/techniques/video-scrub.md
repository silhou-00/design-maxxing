# Video / Image-Sequence Scrub

> Scroll position sets the playhead of pre-rendered footage. The camera genuinely moves; scroll only
> drives time.

**Binding:** scrubbed · **Mechanism:** `<video>.currentTime`, or canvas-drawn image sequence
**Cost:** the highest here — bandwidth, memory, decode · **Risk:** high

## What it is

The Apple product-page technique. Instead of animating DOM or WebGL in real time, you pre-render the
motion as frames and let scroll pick which frame is shown. Everything expensive happens at build
time; the runtime job is just seeking.

Two implementations:

### A. Image sequence on canvas

Extract N frames as images, preload, and `drawImage` the one matching scroll progress.

```js
const frames = 180, img = new Image();
const src = i => `/seq/${String(i).padStart(4,'0')}.webp`;
ScrollTrigger.create({
  trigger: '.seq', start:'top top', end:'+=3000', pin:true, scrub:0.5,
  onUpdate: self => {
    const i = Math.round(self.progress * (frames - 1));
    img.src = src(i);                     // preloaded into cache beforehand
    img.decode().then(() => ctx.drawImage(img, 0, 0));
  }
});
```

Precise and reliable — every frame is addressable. Costs a lot of requests and memory. 180 frames at
100KB is 18MB.

### B. Scrubbed video

```js
video.pause();
ScrollTrigger.create({
  trigger:'.scene', start:'top top', end:'+=2000', pin:true, scrub:true,
  onUpdate: self => { video.currentTime = self.progress * video.duration }
});
```

Far smaller files, but seeking is only accurate to keyframes. **Re-encode with a very short keyframe
interval** (ideally every frame) or the scrub will stutter and snap. This is the single most common
reason a scrubbed video "feels broken".

## The scroll-world variant

`oso95/scroll-world` builds a whole landing page out of this technique: a chain of AI-generated
isometric diorama scenes joined by camera-flight clips, "scrubbed by scroll position — the same
technique behind Apple's scroll-through product pages. The camera genuinely moves; scroll only
drives time."

Its interesting engineering contribution is the **seam rule**: connector clips between scenes are
generated *from the actual rendered frames of their neighbours*, so every join is frame-identical
and the whole thing reads as one continuous flight. It ships a portable vanilla-JS scrub engine
(blob-seek, lazy load, seam crossfade) that is framework-agnostic.

Because it carries so much art direction, it is treated separately — see `scroll-world.md` and the
verdict in `../compatibility.md`.

## Cost

The highest of any technique here, and the cost is not CPU — it is **bytes and decode**.

| | Image sequence | Video |
|---|---|---|
| Payload | very large (N × frame) | moderate |
| Seek accuracy | exact | keyframe-dependent |
| Memory | high (decoded bitmaps) | moderate |
| Mobile | often prohibitive | needs a separate portrait render |

Non-negotiables: lazy-load the asset, show a poster frame immediately, and never block first paint
on it. On mobile, either serve a portrait-native render (scroll-world renders a parallel 9:16 chain
rather than cropping the landscape one) or fall back to a static image.

## Accessibility

- **The content is pixels.** Nothing in the footage is text, selectable, translatable, or reachable
  by a screen reader. Every message carried by the video must also exist in the DOM.
- `prefers-reduced-motion` should stop the scrub entirely and show a single representative frame —
  not autoplay the video instead.
- Never put essential copy *inside* the video. It cannot be resized, restyled, or read aloud.
- Flashing or rapid camera movement can be both a vestibular and a photosensitivity risk. Keep
  scrub velocity bounded — `scrub: 0.5`–`1` damps a fast flick into a survivable pan.

## When not to use it

- On content that changes. Re-rendering a video is a production cycle; changing DOM is a commit.
- On a page that must be indexed on its copy.
- When the same effect is reachable with `../pinned-scene.md` in CSS. Many "video scrub" designs are
  three transforms in a trench coat.
- On a data-metered or low-end mobile audience.

## Specimen

Not in `../specimens/index.html` — it needs a rendered asset, and the specimen is deliberately
dependency- and asset-free.
