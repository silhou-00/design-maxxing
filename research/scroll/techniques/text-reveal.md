# Text Reveal

> Type animates in by word, line or character as it crosses the viewport.

**Binding:** scrubbed or triggered · **Mechanism:** split text + per-element `view()` timelines
**Cost:** low if transform/opacity, high if `filter` · **Risk:** medium — it is text

## What it is

The headline or paragraph is split into spans, and each span gets its own view timeline. Because
each word sits at a slightly different position in the scrollport, the stagger is automatic — no
delay calculation needed.

SVGator files this under "Expressive Typography Animations": "bold, kinetic type, glitch effects,
and animated lettering… help convey brand personality, capture attention, and add energy."

## Implementation — CSS native

```css
.text-reveal span{
  display: inline-block;               /* required — transforms don't apply to inline boxes */
  animation: word-in auto linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 45%;
}
@keyframes word-in{
  from{ opacity:.12; filter:blur(4px) }
  to  { opacity:1;   filter:blur(0) }
}
```

Note `opacity: .12` rather than `0` in the `from` state. Starting from fully transparent means the
sentence does not exist until it is scrolled to; starting from faint means the reader sees the shape
of the whole line and watches it resolve. It also fails much more gracefully.

## Splitting the text

CSS cannot split text. Options:

- **Author the spans in the markup.** Fine for one headline, unmaintainable for content.
- **GSAP SplitText** — splits into chars/words/lines and handles the hard part, re-splitting on
  resize when lines reflow. Now free (see `../sources.md`).
- **A small `Intl.Segmenter` split** for words, which respects locale word boundaries:
  ```js
  const seg = new Intl.Segmenter(document.documentElement.lang, { granularity: 'word' });
  ```

Line-splitting is the hard case: line breaks depend on the final rendered width, so any resize or
font swap invalidates them.

## Cost

`opacity` and `transform` composite — cheap. **`filter: blur()` does not.** It is a paint-level
operation re-run every frame, per span. Eleven words is fine; a paragraph of eighty is not. If you
want blur on long text, blur the container once, not each word.

Character-level splitting multiplies element count by ~5× over word-level. A 60-word paragraph
becomes ~350 elements, each with its own timeline. That is a real layout cost.

## Accessibility

**This is the technique with the sharpest accessibility trade-off, because the thing you are
animating is the content itself.**

- **Splitting text destroys screen-reader phrasing.** `<span>Hello</span> <span>there</span>` may be
  announced as separate items, and character splits are announced letter by letter. Mitigation: put
  the real sentence on the container as `aria-label` and mark the spans `aria-hidden="true"`.
- **It breaks find-in-page and text selection** for character splits, and copy-paste can pick up
  stray whitespace.
- **It breaks translation tools**, which need contiguous phrases.
- **Never leave text at `opacity: 0` if the animation might not run.** The `@supports` fallback is
  mandatory here in a way it is not elsewhere:
  ```css
  @supports not (animation-timeline: scroll()){
    .text-reveal span{ opacity:1; filter:none }
  }
  @media (prefers-reduced-motion: reduce){
    .text-reveal span{ animation:none; opacity:1; filter:none }
  }
  ```
- Animating text *while the user is reading it* is hostile. Confine this to headlines and pull
  quotes, never body copy.

## When not to use it

- Body text. Ever.
- Anything the user needs to search, copy, or translate.
- More than one or two instances per page — the effect is a punctuation mark, not a paragraph style.

## Specimen

`../specimens/index.html` → section **08** (word-level, blur + opacity, eleven words).
