# Scroll Marquee

> A strip of content that slides sideways — but bound to scroll position, not to a clock. It is
> still when you are still, and it runs backwards when you scroll up.

**Binding:** scrubbed · **Mechanism:** `scroll()` timeline translating a repeated strip
**Cost:** very low · **Risk:** low — much lower than a time-based marquee

## What it is

The familiar sliding ticker, with one change that matters more than it sounds: **the timeline is
scroll, not time.**

A time-based marquee (`animation: slide 20s linear infinite`) moves forever, whether or not anyone
is looking, and demands attention it did not earn. A scroll-bound marquee reports the user's own
scrolling back to them. It is motion that follows rather than motion that interrupts — and that
difference is what takes it from a WCAG 2.2.2 problem to a non-issue.

## Implementation — CSS native

```css
html{ scroll-timeline: --page block; }

.marquee{ overflow:hidden; white-space:nowrap }
.marquee span{
  display:inline-block;
  animation: slide auto linear both;
  animation-timeline: --page;
}
@keyframes slide{ from{ transform:translateX(0) } to{ transform:translateX(-42%) } }
```

**Duplicate the content** so the strip never runs out. The usual approach is to repeat the phrase
2–3× inside the span and translate by an exact fraction of the total, so the seam lands on an
identical glyph and the loop is invisible. `-42%` in the specimen is tuned to its content; the
number is not universal, and getting it right is the whole craft.

Variants:

- **Velocity-reactive** — the strip skews or accelerates with scroll speed. Needs JS
  (`ScrollTrigger.getVelocity()`); there is no CSS equivalent, because CSS timelines expose position,
  not speed.
- **Counter-directional rows** — two strips, opposite `translateX` signs, on the same timeline.
  Cheap and very effective, and one of the spec authors' own demos ("Reverse-Scrolling Columns").

## Cost

Very low. One composited `transform` on one element. Cheaper than the time-based version, which
never stops and so never lets the compositor idle.

## Accessibility

Better than a classic marquee on every axis, but not free:

- **WCAG 2.2.2 (Pause, Stop, Hide)** applies to motion that starts *automatically* and lasts more
  than five seconds. A scroll-bound marquee is user-initiated and stops when the user stops, so it
  sits outside 2.2.2 — which is precisely the reason to prefer it over the time-based one. It is
  still user-initiated non-essential motion under 2.3.3.
- **Do not put essential text in it.** Long moving text is unreadable for many users, and if it
  scrolls past the container it may never be readable at all.
- **Duplicated content is announced twice.** Mark the repeats `aria-hidden="true"` and leave one
  copy readable.
- Reduced motion should freeze it in a legible position:
  ```css
  @media (prefers-reduced-motion: reduce){
    .marquee span{ animation:none; transform:none }
  }
  ```

## When not to use it

- For navigation or any actionable content.
- More than once per page.
- When the strip's content is genuinely important — moving text is the worst place to put something
  people must read.

## Specimen

`../specimens/index.html` → section **11**.
