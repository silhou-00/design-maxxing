#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-page.mjs — generate a pack's page example from its tokens.json

     node _shared/build-page.mjs <pack> | --all

   The COMPOSITION is authored per pack (tokens.json → sheet.page), because
   composition is the entire point of this artifact — a generated layout would
   give twelve identical pages in different colours. What is generated is the
   boilerplate that must be identical everywhere: the head, the "not a template"
   banner, the audit wiring, the reduced-motion guard, and the pack's chosen
   scroll technique from tokens.json → scroll.

   That last part is the reason this exists. The scroll technique is a ROUTER
   Gate 3.5 decision recorded in tokens.json; wiring it by hand twelve times is
   twelve chances to ship the wrong one.

   PAGE WIDTH is also a pack decision, not a house default. Set
   sheet.page.layout to "contained" (default), "wide", or "full", and
   sheet.page.pad to override the padding floor. Inside a contained page,
   class="bleed" breaks a section out to the viewport edge and class="edge"
   does the same with no padding at all — so a reading-led pack can still
   run a full-screen band without abandoning its measure.
   ═════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const q = s => String(s ?? '').replace(/"/g, '&quot;');

/* Scroll technique implementations. CSS-first per engine §6, every one behind
   the mandatory @supports fallback and a prefers-reduced-motion collapse. */
const TECHNIQUES = {
  'scroll-reveal': (o = {}) => `
.reveal{ animation:rv auto linear both; animation-timeline:view();
  animation-range:entry ${o.from || '8%'} cover ${o.to || '26%'} }
@keyframes rv{ from{opacity:${o.fromOpacity ?? 0};transform:translateY(${o.dist || '14px'})}
               to{opacity:1;transform:none} }
/* stagger: children of .reveal-group each get their own view timeline, offset by index.
   This is what makes a reveal read as a deliberate technique rather than a slow paint. */
.reveal-group > *{ animation:rv auto linear both; animation-timeline:view();
  animation-range:entry calc(${o.from || '8%'} + var(--i, 0) * ${o.stagger || '5%'})
                  cover calc(${o.to || '26%'} + var(--i, 0) * ${o.stagger || '5%'}) }
@supports not (animation-timeline: view()){
  .reveal, .reveal-group > *{opacity:1;transform:none;animation:none} }`,

  'stacking-cards': (o = {}) => `
.stack .panel{ position:sticky; top:calc(${o.top || '96px'} + var(--i) * ${o.step || '18px'}) }`,

  'scroll-progress': (o = {}) => `
.progress{ position:fixed; inset:0 0 auto 0; height:${o.h || '6px'}; transform-origin:0 50%;
  background:${o.color || 'currentColor'}; z-index:99;
  animation:prg auto linear both; animation-timeline:scroll(root block) }
@keyframes prg{ from{transform:scaleX(0)} to{transform:scaleX(1)} }
@supports not (animation-timeline: scroll()){ .progress{display:none} }`,

  'scroll-snap': (o = {}) => `
.snap{ scroll-snap-type:y mandatory; overflow-y:auto; max-height:${o.h || '78vh'} }
.snap > *{ scroll-snap-align:${o.align || 'start'}; scroll-snap-stop:always }`,

  'horizontal-scroll': (o = {}) => `
.hscroll{ display:flex; gap:${o.gap || '16px'}; overflow-x:auto; scroll-snap-type:x mandatory;
  padding-bottom:8px }
.hscroll > *{ flex:0 0 ${o.w || 'min(78%, 420px)'}; scroll-snap-align:start }`,

  'scroll-marquee': (o = {}) => `
.marquee{ overflow:hidden; white-space:nowrap }
.marquee .run{ display:inline-block; animation:mq auto linear both;
  animation-timeline:scroll(root block); animation-range:0 100% }
@keyframes mq{ from{transform:translateX(0)} to{transform:translateX(${o.dist || '-40%'})} }
@supports not (animation-timeline: scroll()){ .marquee .run{transform:none} }`,

  'text-reveal': (o = {}) => `
.tr span{ animation:trv auto linear both; animation-timeline:view();
  animation-range:entry 10% cover ${o.to || '40%'} }
@keyframes trv{ from{opacity:.18} to{opacity:1} }
@supports not (animation-timeline: view()){ .tr span{opacity:1;animation:none} }`,

  'svg-path-draw': (o = {}) => `
.draw path{ stroke-dasharray:1; stroke-dashoffset:1; pathLength:1;
  animation:dw auto linear both; animation-timeline:view();
  animation-range:entry 5% cover ${o.to || '55%'} }
@keyframes dw{ to{stroke-dashoffset:0} }
@supports not (animation-timeline: view()){ .draw path{stroke-dashoffset:0;animation:none} }`,

  /* The base background matters: with keyframes alone the element is transparent
     until the timeline resolves, so text sits on the page ground for a frame and
     any contrast check (or a slow paint) sees the wrong pair. */
  'scroll-theme-shift': (o = {}) => `
.shift{ background:${o.from || '#fff'};
  animation:th auto linear both; animation-timeline:view(); animation-range:cover 12% cover 76% }
@keyframes th{ from{background:${o.from || '#fff'}} to{background:${o.to || '#111'}} }
@supports not (animation-timeline: view()){ .shift{ background:${o.from || '#fff'}; animation:none } }`,

  'pinned-scene': (o = {}) => `
.pin{ position:sticky; top:${o.top || '12vh'} }
.pin-track{ min-height:${o.track || '210vh'} }`,

  /* A parallax backdrop is position:fixed, and a fixed element never enters or
     leaves the viewport — so view() progress never advances and nothing moves.
     scroll() tracks the document, which is what a backdrop must follow. */
  'parallax': (o = {}) => `
.plx{ animation:px auto linear both; animation-timeline:scroll(root block) }
/* no animation-range: scroll() already spans the whole document. Adding
   an explicit 0%-100% range collapses to zero length and nothing moves. */
@keyframes px{ from{transform:translateY(${o.dist || '-6%'}) scale(1.12)}
               to{transform:translateY(${o.dist2 || '6%'}) scale(1.12)} }
@supports not (animation-timeline: scroll()){ .plx{transform:none;animation:none} }`,

  'scrollytelling': (o = {}) => `
.story{ display:grid; grid-template-columns:${o.cols || '1fr 1fr'}; gap:${o.gap || '40px'}; align-items:start }
.story .sticky{ position:sticky; top:${o.top || '14vh'} }
@media(max-width:820px){ .story{grid-template-columns:1fr} .story .sticky{position:static} }`,
};

function buildPage(pack) {
  const dir = join(ROOT, pack);
  const T = JSON.parse(readFileSync(join(dir, 'tokens.json'), 'utf8'));
  const S = T.sheet || {}, P = S.page || {};
  if (!P.markup) return null;

  const A = T.a11y || {}, CB = T.copyBudget || {}, SC = T.scroll || {};
  const techKey = (SC.headline || '').split(' ')[0].replace(/[^a-z-]/g, '');
  const techFn = TECHNIQUES[techKey];
  const techCss = techFn ? techFn(SC.options || {}) : `/* no generator for "${techKey}" — see tokens.json → scroll */`;

  const data = [
    `data-pack="${q(pack)}"`,
    `data-audit-scope="main *, footer *"`,
    `data-audit-controls="${q(P.controls || 'main a.btn, main button, main nav a')}"`,
    `data-audit-focus-target="${q(P.focusTarget || 'main a.btn, main button')}"`,
    `data-audit-copy="main p"`,
    `data-audit-headline="#hero-h"`,
    `data-audit-sub="#hero-s"`,
    `data-audit-wrap="main .wrap"`,
    A.maxRadiusPx !== undefined ? `data-max-radius="${A.maxRadiusPx}"` : '',
    A.maxHues !== undefined ? `data-max-hues="${A.maxHues}"` : '',
    A.allowBlur !== undefined ? `data-allow-blur="${A.allowBlur ? 1 : 0}"` : '',
    A.allowGradient !== undefined ? `data-allow-gradient="${A.allowGradient ? 1 : 0}"` : '',
    T.focus?.gapPx ? `data-focus-gap="${T.focus.gapPx}"` : '',
    T.focus?.ringPx ? `data-focus-ring="${T.focus.ringPx}"` : '',
    CB.headlineMaxWords ? `data-headline-words="${CB.headlineMaxWords}"` : '',
    CB.subMaxWords ? `data-sub-words="${CB.subMaxWords}"` : '',
    T.spacing?.minPagePadding ? `data-min-page-padding="${T.spacing.minPagePadding}"` : '',
    S.hoverCollapse ? `data-hover-collapse="${q(S.hoverCollapse)}"` : '',
    `data-scroll-technique="${q(SC.headline || 'none')}"`,
    (SC.banned || []).some(b => /smooth/.test(b)) ? `data-smooth-scroll="banned"` : '',
  ].filter(Boolean).join('\n      ');

  const pad = T.spacing?.minPagePadding || 16;
  /* DEFAULT IS FULL-WIDTH. Compressing inward is easy; prying a centred
     column outward means fighting every rule that assumes it. A pack opts IN
     to containment when its own style demands a measure (editorial, minimalism). */
  const layout = P.layout || 'full';
  const LAYOUT =
    layout === 'full' ? `max-width:none;margin:0;padding-inline:${P.pad ?? pad}px`
  : layout === 'wide' ? `max-width:${P.wrap || '1440px'};margin:0 auto;padding-inline:${P.pad ?? pad}px`
  :                     `max-width:${P.wrap || '1160px'};margin:0 auto;padding-inline:${P.pad ?? pad}px`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(T.displayName || pack)} — Page Example</title>
<style>
/* ═════════════════════════════════════════════════════════════════════════
   ${(T.displayName || pack).toUpperCase()} — one composition.
   GENERATED by _shared/build-page.mjs from tokens.json. Edit tokens.json
   (sheet.page.markup / sheet.css / sheet.page.css), then rebuild.

   Headline scroll technique: ${SC.headline || 'none'}
   ${SC.reason ? '   why: ' + SC.reason : ''}
   ${(SC.banned || []).length ? '   banned for this pack: ' + SC.banned.join(', ') : ''}
   ${SC.warning ? '   WARNING: ' + SC.warning : ''}
   ═════════════════════════════════════════════════════════════════════════ */
*{box-sizing:border-box}
html{scroll-behavior:auto;overflow-x:clip}   /* clip, not hidden: hidden breaks position:sticky */
body{margin:0;overflow-x:clip}
/* ── page width strategy ─────────────────────────────────────────────
   tokens.json -> sheet.page.layout:
     "full" (DEFAULT)       edge-to-edge; only the page-padding floor.
     "wide"                 contained but generous (1440px).
     "contained"            max-width + auto margins. Opt in — reading-led packs only.
   Any section can break out of a contained wrap with class="bleed",
   and .edge strips the padding too for a true full-screen band. */
.wrap{${LAYOUT}}
.bleed{margin-inline:calc(50% - 50vw)}
.bleed > .wrap{${LAYOUT}}
.edge{margin-inline:calc(50% - 50vw);padding-inline:0}
/* on a full-width page, prose still needs a measure — this is the opt-in */
.measure{max-width:68ch}
.hold{max-width:${P.wrap || '1240px'};margin-inline:auto}
.pk-disclaimer{padding:9px 16px;font:600 11px/1.5 ui-monospace,monospace;letter-spacing:.05em;
  text-align:center;background:#18181b;color:#fafafa}
.pk-disclaimer a{color:#fafafa}

/* ── the pack ───────────────────────────────────────────────────────── */
${S.css || ''}

/* ── page-only additions ────────────────────────────────────────────── */
${P.css || ''}

/* ── headline scroll technique: ${SC.headline || 'none'} ─────────────── */
${techCss}
@media (prefers-reduced-motion: reduce){
  *{animation:none!important;transition:none!important}
  .reveal,.tr span,.draw path{opacity:1!important;transform:none!important;stroke-dashoffset:0!important}
}

/* ── audit panel ────────────────────────────────────────────────────── */
.audit{margin-top:30px;border-top:1px solid rgba(128,128,128,.35)}
.audit summary{cursor:pointer;padding:14px 0;font:600 11px/1 ui-monospace,monospace;
  letter-spacing:.12em;text-transform:uppercase;opacity:.75}
.audit table{width:100%;border-collapse:collapse;font:500 13px/1.4 ui-monospace,monospace}
.audit th,.audit td{border-bottom:1px solid rgba(128,128,128,.25);padding:9px 10px;text-align:left;
  vertical-align:top}
.audit th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;opacity:.6}
.audit .pill{display:inline-block;font:600 10px/1 ui-monospace,monospace;letter-spacing:.08em;
  text-transform:uppercase;padding:4px 7px;border-radius:4px;background:rgba(128,128,128,.22)}
.audit .pill.pass{background:#dcfce7;color:#15803d}
.audit .pill.fail{background:#fee2e2;color:#b91c1c}
.audit .anote{opacity:.55;font-size:11px}
.audit .isok{color:#15803d}.audit .isbad{color:#b91c1c}
.audit p{opacity:.75;font-size:13px;max-width:74ch;padding:0 0 16px}
</style>
</head>
<body ${data}>

<!-- data-audit-ignore: sheet chrome, not the pack. engine/audit.mjs strips these
     subtrees before measuring, so the reference frame never grades itself. -->
<div class="pk-disclaimer" data-audit-ignore>
  ONE COMPOSITION — NOT A TEMPLATE. Structure belongs to the product repo (ROUTER.md).
  Scroll technique: ${esc(SC.headline || 'none')}
  &nbsp;·&nbsp; <a href="modules.html">module sheet</a>
  &nbsp;·&nbsp; <a href="../../specimens/index.html">all 12 packs</a>
</div>

<main class="pk">
${P.markup}
</main>

<footer class="pk" data-audit-ignore>
  <div class="wrap">
    <details class="audit">
      <summary>▸ Self-audit — measured from this page on load</summary>
      <p>Computed from the live DOM: rendered boxes, real font metrics, resolved colours. It scans
      every element against this pack's banned list, so a violation anywhere surfaces here rather
      than in a review.</p>
      <table id="auditTable"><tr><th>Check</th><th>Measured</th><th>Required</th><th></th></tr></table>
      <p id="auditSummary"></p>
    </details>
  </div>
</footer>

<script src="../_shared/audit.js"></script>
</body>
</html>
`;
  writeFileSync(join(dir, 'page.html'), html, 'utf8');
  return html.length;
}

const args = process.argv.slice(2);
const packs = args.includes('--all')
  ? readdirSync(ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name)
      .filter(p => existsSync(join(ROOT, p, 'tokens.json')))
  : args.filter(a => !a.startsWith('--'));

for (const p of packs) {
  try {
    const n = buildPage(p);
    console.log(n ? String(n).padStart(7) + ' bytes   ' + p : '   skip           ' + p + ' (no sheet.page in tokens.json)');
  } catch (e) {
    console.error('FAILED   ', p, '—', e.message);
  }
}
