# editorial: reference notes

Values researched for jobs run on this pack that the pack itself does not carry. Recorded per the
studio traceability rule: if a build needs a value the pack does not have, research it and record the
source here rather than inventing or rounding one.

---

## Windows XP "Luna" system colours

Needed for: `output/fundr-studios` (2026-09-03). The brief was "Windows XP theme delivered with
editorial restraint", which required canonical Luna values rather than eyeballed approximations.

| Token | Value | Notes |
|---|---|---|
| `ActiveCaption` (Luna Blue) | `#0054E3` · rgb(0, 84, 227) | The active title-bar base |
| `GradientActiveCaption` (Luna Blue) | `#3D95FF` · rgb(61, 149, 255) | The title-bar gradient's light stop |
| `Highlight` (Luna Blue) | `#316AC5` · rgb(49, 106, 197) | Text selection |
| `Control` / ButtonFace (Luna Blue) | `#ECE9D8` · rgb(236, 233, 216) | The XP dialog beige |
| `ActiveCaption` (Luna Olive Green) | `#8BA169` · rgb(139, 161, 105) | For reference only, not used |
| `Control` (Luna Silver) | `#E0DFE3` · rgb(224, 223, 227) | For reference only, not used |

**Source:** "Windows System Colours (by OS)", gist by zaxbux ,
<https://gist.github.com/zaxbux/64b5a88e2e390fb8f8d24eb1736f71e0>

**Caveat worth carrying forward.** These are the Windows **system colour** values for the Luna Blue
scheme. Luna's actual `.msstyles` visual style overrides the title bar with a bitmap gradient, so
the rendered XP title bar is not exactly a two-stop interpolation between `ActiveCaption` and
`GradientActiveCaption`. The system-colour pair is the defensible traceable choice; do not claim it
is a pixel match to a screenshot.

**Accessibility finding, verified by computation, not by eye.** White text on `GradientActiveCaption
#3D95FF` is only **3.03:1**, which fails WCAG AA for the 12px bold text an XP title bar carries.
Any build reproducing a Luna title bar must confine the light stop to a thin specular band at the top
edge and place the caption text over `ActiveCaption #0054E3`, which gives **6.22:1**. This happens to
be closer to how Luna actually renders than a full-height wash is, so the accessible fix and the
accurate fix are the same fix.

Second finding: an inactive title bar derived from these values cannot carry white text. A 55% mix
from `#0054E3` toward `#ECE9D8` gives `#82A6DD`, which is 2.49:1 with white and 6.57:1 with a
`#10222B` ink. Use ink.

---

## Windows XP "Bliss" wallpaper, measured

The photograph itself carries no citable hex values, so it was measured. Method: PIL, on
`base-redesign/assets/scene.jpg` (2250 × 1500), median-cut quantisation over the whole frame and
over the sky and grass bands separately, plus point sampling at named fractional coordinates.

| Role | Value | Where |
|---|---|---|
| Sky, zenith | `#2864E8` | dominant of the top 50% band |
| Sky, mid | `#5788EF` · `#457CEF` | same band |
| Sky, near the horizon | `#93B5F2` | same band |
| Cloud and haze | `#D0DDF3` · `#DBE4F3` | same band |
| Grass, lit | `#8AB326` | point sample |
| Grass, dominant | `#6F941F` | dominant of the bottom 45% band |
| Grass, mid | `#526F1F` | same band |
| Grass, deep shadow | `#334717` · `#2B3917` | same band |

**The result worth reusing:** the measured Bliss zenith `#2864E8` and canonical Luna `ActiveCaption
#0054E3` differ by **0.035 relative luminance**. The photograph and the operating system are
effectively the same blue. Any XP-themed job can anchor its interface blue to the canonical Luna
value and stay faithful to the photograph at the same time.

**Contrast findings.** `#8AB326` (2.21 on a warm paper ground) and `#6F941F` (3.18) both fail AA for
text on every light ground. In an XP palette the bright greens are fill, rule and dot colours only.
`#526F1F` at 5.17 is the shallowest green that carries text.

---

## Asset defects found in the fundr-studios source assets

Recorded here because both are the kind of defect that survives review and neither is visible in a
thumbnail.

**`hills.png` (2250 × 1500 RGBA).** Pixel column `x = 2249`, the rightmost column, is `alpha 255` and
coloured `rgb(88,132,237)` sky-blue for its entire 1500px height, running straight up through the
transparent sky region. Two consequences: a 1px sky-blue stripe at the right viewport edge at zoom
1.0, and `getbbox()` returning the full canvas, which silently defeats any automated crop-to-content
step. Repair: zero all alpha above row 795. The measured silhouette minimum across all columns is
row 802, so 795 is safe.

Second, the same mask has only 242 semi-transparent pixels in the entire image (0.007%), i.e. a hard
aliased edge. It steps visibly against the sky at any scale above 1.0 on a high-DPR display. A 1.2px
Gaussian feather on the alpha channel fixes it.

**`mark-fundr.png` (1682 × 684 RGBA).** `alpha = 255` on **0.0%** of the image; 50.3% is
semi-transparent, including the letter cores. Mean luminance of the low-alpha halo pixels is 132/255,
so over a bright sky it reads as a translucent decal with a grey bloom rather than an object in the
scene. Repair: alpha gain of 1.6 clamped, which brings 38.4% to full opacity and tightens the halo
without removing the intended Y2K glow.

---

## Pack-level note: the serif question under `stitch-design-taste`

`taste/.agents/skills/stitch-design-taste/SKILL.md` bans generic serifs by name, **including
Georgia**, which is the face this pack's own implementation CSS uses. The pack's `## banned` list
outranks the vendor skill, so the pack's requirement for a serif reading face stands. But the
conflict does not have to be won by force: stitch's own permitted list names `Fraunces`,
`Instrument Serif`, `Editorial New` and `Gambarino`, and **Fraunces satisfies both documents at
once** because its `opsz` axis directly answers this pack's stated gotcha that *"display type at 46px+
needs optical sizing"*. Reach for it before overruling anything.

---

## Windows XP / Luna reference values, sourced 2026-09-04

Recorded for the `fundr. studios` build (revision 03), which renders Luna chrome inside an
`editorial` page. Every value below has a source. Nothing here was chosen by eye.

### The boot progress bar is stepped, not sliding

ReactOS `ntoskrnl/inbv/bootanim.c`, `InbvRotationThread()`, is the open reimplementation of the
XP-era boot animation. Two modes, two clocks:

| mode | frame delay | advance per tick | buffer |
|---|---|---|---|
| square cells (the XP boot screen's three blocks) | `Delay.QuadPart = -800000LL` = **80 ms** | `Index++`, `Total = 18` | `RotBarBuffer[24 * 9]`, X origin `ProgressBarLeft + 2` |
| progress bar (the later gradient sweep) | `Delay.QuadPart = -600000LL` = **60 ms** | `Index += 32` px | `RotLineBuffer[SCREEN_WIDTH * 6]` |

**So the canonical XP boot bar is 18 discrete positions at 80 ms each = a 1.44 s cycle.** It does
not interpolate between positions. In CSS that is `animation: <name> 1.44s steps(18, end) infinite`,
and the stutter is carried by the 80 ms hold rather than by pixel snapping.

Source: <https://github.com/reactos/reactos/blob/master/ntoskrnl/inbv/bootanim.c>

### Luna taskbar and start button gradients

| element | stops |
|---|---|
| taskbar body | `#3168D5` to `#1941A5` |
| start button | `#388238` to `#307443` |
| system tray (notification area) | `#16ADF0` to `#1580D9` |
| running-task indicator | `#3358B5` to `#163E95` |

The taskbar body is described as a five-stop linear gradient; the intermediate stops are not given.

**The finding that matters: the Luna tray is *lighter* and cyan-shifted, not a darker recess.**
Most reproductions get this backwards. It also means white tray text on real Luna sits at roughly
3:1, so an accessible reproduction has to depart from the source here and say so.

Source: <https://deepwiki.com/ramensoftware/windows-11-taskbar-styling-guide/4.1-windows-xp-theme>

### Not found, deliberately left unmeasured

The XP taskbar's default pixel height at 96 DPI (commonly repeated as 30 px, one row) has no
primary Microsoft source in reach; the only documented 30 px figure found is Vista's. Any build
needing it should measure a real screenshot rather than cite the folklore.
