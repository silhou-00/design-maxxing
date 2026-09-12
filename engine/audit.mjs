#!/usr/bin/env node
/**
 * audit.mjs — mechanical preflight for a built page.
 *
 * preflight.md is 40+ prose checkboxes; an agent grading its own output passes
 * itself every time. This file turns the checkable subset into numbers.
 *
 *   node audit.mjs http://localhost:5173 --pack editorial
 *   node audit.mjs http://localhost:5173 --plan output/<product>/assets.plan.json
 *   node audit.mjs http://localhost:5173 --widths 390,768,1280,1920 --json report.json
 *
 * Requires playwright resolvable from the CWD (most product repos already have it).
 * Run it from the product repo, not from design-maxxing.
 */

import { createRequire } from 'node:module';
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ── resolve playwright from the caller's project, not from this file ──────────
let chromium;
try {
  const req = createRequire(path.join(process.cwd(), 'package.json'));
  ({ chromium } = req('playwright'));
} catch {
  try { ({ chromium } = await import('playwright')); }
  catch {
    console.error(
      'Cannot resolve `playwright`.\n' +
      'Run this from a repo that has it installed:\n' +
      '  cd <product-repo> && node D:/GithubRepo/design-maxxing/engine/audit.mjs <url>\n' +
      'or install it there:  npm i -D playwright && npx playwright install chromium'
    );
    process.exit(2);
  }
}

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const url = argv.find(a => !a.startsWith('--'));
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : (argv[i + 1] ?? d);
};
if (!url) { console.error('usage: node audit.mjs <url> [--pack <name>] [--widths a,b,c] [--json out]'); process.exit(2); }

const pack     = flag('pack', null);
const widths   = flag('widths', '390,768,1280,1920').split(',').map(Number);
const primary  = Number(flag('primary', 1440));
const jsonOut  = flag('json', null);
const settle   = Number(flag('settle', 2500));   // ms for boot/intro animations

// ── the pack's own numbers ───────────────────────────────────────────────
// Every pack carries a `copyBudget` and an `a11y` block written for this file.
// Until now this file never opened one, so twelve packs that disagree by nearly
// 4x were all graded against a single 420-char ceiling: editorial's budget is
// 900, minimalism's is 240. Both were being marked wrong by the same number.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = flag('tokens',
  pack ? path.join(HERE, '..', 'research', 'styles', pack, 'tokens.json') : null);
let TOK = null;
if (tokensPath) {
  try { TOK = JSON.parse(readFileSync(tokensPath, 'utf8')); }
  catch (e) { console.error(`  ! no pack tokens at ${tokensPath} — using engine defaults (${e.code || e.message})`); }
}
const CB   = TOK?.copyBudget ?? {};
const A11Y = TOK?.a11y ?? {};

// ── thresholds — the numbers preflight.md only implies ───────────────────────
const T = {
  charsPerViewportMax : 420,   // engine.md §5: ≤8-word headline + ≤25-word sub per section
  charsPerViewportWarn: 300,
  largestBlockMax     : 320,   // one paragraph past this is a wall; ~25 words is ~160
  deadViewportChars   : 60,    // below this, with no media, the viewport is dead
  deadMediaAreaPct    : 12,    // media covering ≥ this % rescues a low-text viewport
  maxPageViewports    : 9,     // a landing page past this is asking a lot
  maxDeadViewports    : 1,
  techniqueMaxShare   : 0.75,  // if >75% of animated els use one technique it's monotone
  minFontPx           : 12,
  absoluteMinFontPx   : 9,     // below this it is not small type, it is a broken unit
  minTapPx            : 44,    // WCAG 2.5.8 target size (minimum) is 24; 44 is the usable bar
  mobileLengthMultiplierMax: 2.5,  // mobile may be longer than desktop, not 4× longer
  gutterAsymmetryPct  : 40,    // right gutter may differ from left by at most this %
  edgeBleedPx         : 8,     // closer than this to the viewport edge = touching it
};

// A number the pack states beats the engine's generic one; anything the pack
// leaves unsaid keeps the engine default. Nothing here can loosen a WCAG floor.
if (CB.charsPerViewportMax) {
  T.charsPerViewportMax  = CB.charsPerViewportMax;
  T.charsPerViewportWarn = Math.round(CB.charsPerViewportMax * 0.7);
}
// 320 chars / 25 words is the engine's own ratio. Hold the ratio, rescale it.
if (CB.subMaxWords) T.largestBlockMax = Math.round(CB.subMaxWords * 12.8);
T.measureMinCh        = CB.measureMinCh        ?? 45;
T.measureMaxCh        = CB.measureMaxCh        ?? 75;
T.measureCeilingCh    = CB.measureCeilingCh    ?? 80;   // WCAG 1.4.8 — a standard, not a taste
T.headlineMaxWords    = CB.headlineMaxWords    ?? 8;
T.subMaxWords         = CB.subMaxWords         ?? 25;
T.buttonLabelMaxWords = CB.buttonLabelMaxWords ?? 3;
T.bodyMinPx           = CB.minBodySizePx       ?? 0;    // only glassmorphism sets one
// WCAG 2.5.8 is the hard floor and fails; T.minTapPx (44) stays the comfort bar
// and only warns. Two different bars, deliberately.
T.targetSizeMinPx     = A11Y.targetSizeMinPx   ?? 24;

// Real device heights. A width times a constant ratio is wrong and badly so:
// 390 x 0.62 is a 242px-tall window, which made a normal page look ~3.5x longer
// on "mobile" than it is. Phones are tall, desktops are wide.
const viewportHeight = (w) =>
  w <= 430  ? 844  :   // iPhone 14/15 class
  w <= 820  ? 1024 :   // tablet portrait
  w <= 1440 ? 800  :   // laptop
              1080;    // desktop

// ── mechanically checkable pack bans ────────────────────────────────────
// Only rules a browser can actually verify. The prose bans still need a human.
//
// CONTRACT: each function returns the NUMBER OF VIOLATIONS, not a census.
// That was not always true and two packs were broken by it — neumorphism
// returned the count of distinct surface colours, so a correct page with
// exactly one surface reported "1 occurrence" and failed; glassmorphism
// returned the count of backdrop-filters, so every correct glass page failed
// for using the one property the style is made of.
const PACK_RULES = {
  editorial: {
    'multi-column body flow': p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      return cs.columnCount !== 'auto' && +cs.columnCount > 1 && e.textContent.trim().length > 400;
    }).length),
    'rounded imagery': p => p.$$eval('img,picture,figure', els => els.filter(e => parseFloat(getComputedStyle(e).borderTopLeftRadius) > 2).length),
    'card containers':  p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      return cs.boxShadow !== 'none' && parseFloat(cs.borderTopLeftRadius) > 4 && e.textContent.trim().length > 80;
    }).length),
  },
  minimalism:   { 'shadows': p => countShadow(p), 'gradients': p => countGradient(p) },
  flat:         { 'shadows': p => countShadow(p), 'gradients': p => countGradient(p) },
  swiss:        { 'rounded corners': p => countRadius(p, 2), 'gradients': p => countGradient(p) },
  brutalism:    { 'rounded corners': p => countRadius(p, 0.5), 'blurred shadows': p => countShadow(p), 'transitions': p => p.$$eval('*', e => e.filter(x => getComputedStyle(x).transitionDuration !== '0s').length) },

  'neo-brutalism': {
    'blurred shadows': p => p.$$eval('*', els => els.filter(e => { const s = getComputedStyle(e).boxShadow; return s !== 'none' && !/ 0px [^,]*$/.test(s) && /px/.test(s); }).length),
    'border-radius above 8px': p => countRadius(p, 8),
    // "grey borders" — the border is meant to be ink. Achromatic, and neither
    // near-black nor near-white, is the grey the pack means.
    'grey borders': p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      if (cs.borderTopStyle === 'none' || parseFloat(cs.borderTopWidth) < 1) return false;
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(cs.borderTopColor);
      if (!m) return false;
      const r = +m[1], g = +m[2], b = +m[3];
      return Math.max(r, g, b) - Math.min(r, g, b) <= 12 && Math.max(r, g, b) > 40 && Math.min(r, g, b) < 215;
    }).length),
  },

  neumorphism: {
    // The ban is on the SECOND colour onward, not on having a surface at all.
    'multiple surface colours': p => p.$$eval('*', els => {
      const seen = new Set();
      for (const e of els) {
        const b = e.getBoundingClientRect();
        if (b.width < 48 || b.height < 24) continue;         // a chip is not a surface
        const c = getComputedStyle(e).backgroundColor;
        if (c === 'rgba(0, 0, 0, 0)' || /,\s*0\)$/.test(c)) continue;
        seen.add(c);
      }
      return Math.max(0, seen.size - 1);
    }),
    // "borders, outlines, dividers" — border only. The focus ring is an
    // `outline` and is required, so it must not be counted here.
    'borders and dividers': p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      return parseFloat(cs.borderTopWidth) >= 1 && cs.borderTopStyle !== 'none'
          && cs.borderTopColor !== 'rgba(0, 0, 0, 0)';
    }).length),
  },

  glassmorphism: {
    'glass nested inside glass': p => p.$$eval('*', els => els.filter(e => {
      if ((getComputedStyle(e).backdropFilter || 'none') === 'none') return false;
      for (let a = e.parentElement; a; a = a.parentElement)
        if ((getComputedStyle(a).backdropFilter || 'none') !== 'none') return true;
      return false;
    }).length),
    // tokens.a11y.glassBudget — "at most 3 glass elements per view"
    'glass elements over budget': p => p.$$eval('*', (els, budget) => Math.max(0,
      els.filter(e => (getComputedStyle(e).backdropFilter || 'none') !== 'none').length - budget),
      A11Y.glassBudget ?? 3),
    // "backdrop-filter on a scrolling list item — the documented FPS killer"
    'glass on a repeating list item': p => p.$$eval('li,tr,[role="listitem"]', els =>
      els.filter(e => (getComputedStyle(e).backdropFilter || 'none') !== 'none').length),
  },

  bento: {
    // Was the literal no-op `p => 0`. Four of bento's seven bans are measurable.
    // Tilda's defining observation is "very little empty space"; 12px is the top
    // of the pack's own gapRange and 24px+ is a card grid, a different style.
    'gaps wider than the pack allows': p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      if (!cs.display.includes('grid') || e.childElementCount < 3) return false;
      return Math.max(parseFloat(cs.rowGap) || 0, parseFloat(cs.columnGap) || 0) > 12;
    }).length),
    'cells outside the 16-24px radius range': p => p.$$eval('*', els => els.filter(e => {
      if (!e.parentElement || !getComputedStyle(e.parentElement).display.includes('grid')) return false;
      const b = e.getBoundingClientRect();
      if (b.width < 80 || b.height < 60) return false;       // a chip is not a cell
      const r = parseFloat(getComputedStyle(e).borderTopLeftRadius) || 0;
      return r < 16 || r > 24;                               // tokens.radius.range
    }).length),
    'heavy shadows on cells': p => p.$$eval('*', els => els.filter(e => {
      if (!e.parentElement || !getComputedStyle(e.parentElement).display.includes('grid')) return false;
      const s = getComputedStyle(e).boxShadow;
      if (s === 'none') return false;
      const px = (s.match(/(-?[\d.]+)px/g) || []).map(parseFloat);
      return px.length >= 3 && px[2] >= 6;                   // third length is the blur
    }).length),
    // "uniform cell sizes - no span variation" is the one ban a browser can
    // settle outright: if every cell is the same box, the grid has no rhythm.
    'uniform cell sizes': p => p.$$eval('*', els =>
      els.filter(e => getComputedStyle(e).display.includes('grid') && e.childElementCount >= 4)
         .filter(g => {
           const boxes = [...g.children].map(c => c.getBoundingClientRect()).filter(b => b.width > 40 && b.height > 40);
           if (boxes.length < 4) return false;
           return new Set(boxes.map(b => `${Math.round(b.width / 8)}x${Math.round(b.height / 8)}`)).size === 1;
         }).length),
  },

  modernism: {
    'gradients': p => countGradient(p),
    'shadows':   p => countShadow(p),
    // "serif or humanist type". The generic keyword is what a browser can see;
    // a named serif face with no generic fallback slips through. That one stays
    // human work, and reference.md says so.
    'serif type': p => p.$$eval('*', els => els.filter(e => {
      if (e.childElementCount || !e.textContent.trim().length) return false;
      const ff = getComputedStyle(e).fontFamily;
      return /\bserif\b/i.test(ff) && !/sans-serif/i.test(ff);
    }).length),
    // "arbitrary angles — only 0, 45, 90"
    'off-grid rotation': p => p.$$eval('*', els => els.filter(e => {
      const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(e).transform || '');
      if (!m) return false;
      const n = m[1].split(',').map(Number);
      const deg = Math.abs(Math.atan2(n[1], n[0]) * 180 / Math.PI) % 45;
      return deg > 0.5 && deg < 44.5;
    }).length),
  },

  'hand-drawn': {
    'rotation past 3 degrees': p => p.$$eval('*', els => els.filter(e => {
      const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(e).transform || '');
      if (!m) return false;
      const n = m[1].split(',').map(Number);
      return Math.abs(Math.atan2(n[1], n[0]) * 180 / Math.PI) > 3.05;
    }).length),
    // "the SAME rotation on every element — it reveals the trick instantly"
    'one rotation reused everywhere': p => p.$$eval('*', els => {
      const angles = [];
      for (const e of els) {
        const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(e).transform || '');
        if (!m) continue;
        const n = m[1].split(',').map(Number);
        const d = Math.atan2(n[1], n[0]) * 180 / Math.PI;
        if (Math.abs(d) >= 0.05) angles.push(Math.abs(Math.round(d * 10) / 10));
      }
      return angles.length >= 4 && new Set(angles).size === 1 ? angles.length : 0;
    }),
    // "uniform border-radius" — four identical corners is a machine-drawn box.
    // Percentages are excluded: a circle is a legitimate drawn shape.
    'uniform border-radius': p => p.$$eval('*', els => els.filter(e => {
      const cs = getComputedStyle(e);
      const c = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius];
      if (c.some(v => v.includes('%') || parseFloat(v) < 2)) return false;
      const b = e.getBoundingClientRect();
      if (b.width < 60 || b.height < 40) return false;
      return new Set(c).size === 1;
    }).length),
    'drop shadows': p => countShadow(p),
  },

  skeuomorphism: {
    // "more than one light direction on a screen — the single most common
    // failure". Inset shadows are the SAME light read from inside a recess, so
    // they are excluded; only outer shadows vote. The minority sign is the error.
    'conflicting light direction': p => p.$$eval('*', els => {
      const ys = [];
      for (const e of els) {
        const s = getComputedStyle(e).boxShadow;
        if (!s || s === 'none' || /inset/.test(s)) continue;
        for (const one of s.split(/,(?![^(]*\))/)) {
          const n = (one.match(/(-?[\d.]+)px/g) || []).map(parseFloat);
          if (n.length < 2 || Math.abs(n[1]) < 0.5) continue;
          ys.push(Math.sign(n[1]));
        }
      }
      if (ys.length < 4) return 0;
      const down = ys.filter(v => v > 0).length;
      return Math.min(down, ys.length - down);
    }),
    // "pure #000 shadows at full opacity — always alpha, always soft"
    'opaque black shadow': p => p.$$eval('*', els => els.filter(e => {
      const s = getComputedStyle(e).boxShadow;
      return s !== 'none' && /rgb\(0,\s*0,\s*0\)/.test(s);
    }).length),
    // "flat solid background on an interactive control". A fully transparent
    // control is a link-button and is exempt — it is not pretending to be hardware.
    'flat interactive control': p => p.$$eval('button,[role="button"],input[type=submit],select', els => els.filter(e => {
      const cs = getComputedStyle(e);
      if (cs.backgroundColor === 'rgba(0, 0, 0, 0)' && cs.backgroundImage === 'none') return false;
      return !/gradient/.test(cs.backgroundImage) && cs.boxShadow === 'none';
    }).length),
  },
};
const countShadow   = p => p.$$eval('*', els => els.filter(e => getComputedStyle(e).boxShadow !== 'none').length);
const countGradient = p => p.$$eval('*', els => els.filter(e => /gradient/.test(getComputedStyle(e).backgroundImage)).length);
const countRadius   = (p, max) => p.$$eval('*', (els, m) => els.filter(e => parseFloat(getComputedStyle(e).borderTopLeftRadius) > m).length, max);

// ── scaffolding that is not the design ────────────────────────────────────────
// A reference page carries its own explanatory chrome, and grading that chrome
// is grading the frame instead of the picture: design-maxxing's own pack pages
// were reporting a 153ch measure and 11px body copy, every character of which
// belonged to the self-audit note underneath the composition.
//
// Marked subtrees are REMOVED, not hidden. Hiding leaves box-shadow, gradients
// and border colours readable by the pack checks, so the chrome would still
// trip them; removal settles it. On a product page there is no such attribute
// and this is a no-op.
const strip = pg => pg.evaluate(() => {
  const n = [...document.querySelectorAll('[data-audit-ignore], .no-audit')];
  n.forEach(e => e.remove());
  return n.length;
});

// ── in-page measurement ──────────────────────────────────────────────────────
async function measure(page) {
  return page.evaluate((T) => {
    const vw = innerWidth, vh = innerHeight;
    const H = document.documentElement.scrollHeight;

    const visible = el => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const all = [...document.querySelectorAll('body *')].filter(visible);
    const y0 = scrollY;
    const abs = el => { const r = el.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top + y0, b: r.bottom + y0, w: r.width, h: r.height }; };

    // ---- per-viewport density -------------------------------------------------
    const leaves = all.filter(e => e.childElementCount === 0 && e.textContent.trim().length);
    const media  = all.filter(e => /^(IMG|VIDEO|CANVAS|SVG|PICTURE)$/.test(e.tagName));
    const slices = [];
    for (let i = 0; i < Math.ceil(H / vh); i++) {
      const a = i * vh, b = a + vh;
      let chars = 0, mediaArea = 0, largestBlock = 0, blocks = 0;
      for (const e of leaves) {
        const g = abs(e);
        if (g.b > a && g.t < b) {
          const n = e.textContent.trim().length;
          chars += n;
          if (n > 60) blocks++;
          if (n > largestBlock) largestBlock = n;
        }
      }
      for (const e of media)  { const g = abs(e); if (g.b > a && g.t < b) mediaArea += g.w * Math.min(g.b, b) - g.w * Math.max(g.t, a); }
      slices.push({ i, chars, largestBlock, blocks, mediaPct: Math.round(Math.max(0, mediaArea) / (vw * vh) * 100) });
    }

    // ---- gutters & edge bleed -------------------------------------------------
    // establish the page's dominant content left edge
    // An element inside a clipping or scrolling ancestor is MEANT to extend past
    // the viewport — a marquee, a horizontal card rail. Measuring its right
    // gutter against the page gutter reports the technique as a layout bug, and
    // did: neo-brutalism's scroll-marquee failed three times for working.
    const clipped = el => {
      // body and html are excluded on purpose: clipping at the root is how a
      // page-level overflow bug gets HIDDEN, so counting it as a legitimate
      // clipper would silence the exact finding this check exists for.
      for (let a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (/hidden|clip|auto|scroll/.test(cs.overflowX + ' ' + cs.overflowY)) return true;
      }
      return false;
    };
    const blocks = all.filter(e => { const g = abs(e); return g.w > 160 && g.h > 24 && e.textContent.trim().length > 0; })
                      .filter(e => !clipped(e));
    const lefts = {};
    blocks.forEach(e => { const l = Math.round(abs(e).l / 4) * 4; if (l >= 0 && l < vw / 2) lefts[l] = (lefts[l] || 0) + 1; });
    const gutter = Number(Object.entries(lefts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0);

    const isFullBleed = g => g.l <= 2 && g.r >= vw - 2;
    const bleeders = [], asym = [];
    for (const e of blocks) {
      const g = abs(e);
      if (isFullBleed(g)) continue;
      const rightGutter = vw - g.r;
      if (rightGutter <= T.edgeBleedPx && g.l > T.edgeBleedPx) {
        bleeders.push({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 48), left: Math.round(g.l), rightGutter: Math.round(rightGutter) });
      } else if (gutter > 8 && rightGutter < gutter * (1 - T.gutterAsymmetryPct / 100) && g.l >= gutter * 0.5) {
        asym.push({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 48), left: Math.round(g.l), rightGutter: Math.round(rightGutter) });
      }
    }

    // ---- overflow -------------------------------------------------------------
    const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const overflowers = all.filter(e => abs(e).r > vw + 1 && !clipped(e)).slice(0, 8)
      .map(e => ({ tag: e.tagName, cls: (e.className || '').toString().slice(0, 48), right: Math.round(abs(e).r) }));

    // ---- type & targets -------------------------------------------------------
    const tiny = leaves.filter(e => parseFloat(getComputedStyle(e).fontSize) < T.minFontPx)
      .slice(0, 8).map(e => ({ px: parseFloat(getComputedStyle(e).fontSize), text: e.textContent.trim().slice(0, 32) }));
    const targets = [...document.querySelectorAll('a,button,[role="button"],input,select')].filter(visible)
      .map(e => { const g = abs(e); return { tag: e.tagName, w: Math.round(g.w), h: Math.round(g.h), text: (e.textContent || '').trim().slice(0, 24) }; })
      .filter(t => t.h < T.minTapPx || t.w < T.minTapPx);

    // ---- motion ---------------------------------------------------------------
    // Count distinct ANIMATIONS, not distinct timeline functions. `view()` is the
    // timeline nearly every scroll technique runs on — reveal, text-reveal, path
    // draw, stacking and parallax all use it — so counting timelines reports a
    // varied page as monotone. The keyframe name is the technique.
    const tl = {};
    all.forEach(e => {
      const cs = getComputedStyle(e);
      const t = cs.animationTimeline;
      if (t && t !== 'auto' && t !== 'none') {
        const name = (cs.animationName || 'unnamed').split(',')[0].trim();
        tl[name] = (tl[name] || 0) + 1;
      }
    });
    const anims = document.getAnimations();
    const kinds = {};
    anims.forEach(a => { const k = a.timeline?.constructor?.name || 'none'; kinds[k] = (kinds[k] || 0) + 1; });
    const sticky = all.filter(e => getComputedStyle(e).position === 'sticky').length;

    // ---- assets: real rasters vs objects hand-drawn in CSS ---------------------
    const rasters = all.filter(e => /^(IMG|VIDEO|PICTURE)$/.test(e.tagName)).length;
    const bgImages = all.filter(e => /url\(/.test(getComputedStyle(e).backgroundImage)).length;
    const inlineSvg = document.querySelectorAll('svg').length;

    // A "CSS object" is a large, text-free, image-free element whose visual
    // substance is a solid painted gradient / thick border — i.e. a physical
    // thing rendered as a box. Calibrated against a real failure: a CRT monitor
    // shipped as ONE div, 37.8% of the viewport, 0 children, 0 text, one opaque
    // linear-gradient. Child count is irrelevant; a single div is worse.
    //
    // Deliberately NOT flagged: repeating-* gradients and gradients whose stops
    // are all translucent — those are textures, scanlines and scrims, which are
    // legitimately CSS.
    const cssObjects = [];
    for (const e of all) {
      if (!/^(DIV|SECTION|FIGURE|ASIDE|SPAN)$/.test(e.tagName)) continue;
      const g = abs(e);
      const areaPct = (g.w * g.h) / (vw * vh) * 100;
      if (areaPct < 8 || areaPct > 95) continue;
      if (e.textContent.trim().length > 40) continue;
      if (e.querySelector('img,video,picture,canvas,svg')) continue;

      const cs = getComputedStyle(e);
      const bg = cs.backgroundImage || 'none';
      const hasGradient = /gradient/.test(bg);
      const isTexture = /repeating-/.test(bg);
      // all colour stops translucent => scrim/overlay, not a painted body
      const stops = bg.match(/rgba?\([^)]*\)/g) || [];
      const allTranslucent = stops.length > 0 && stops.every(s => {
        const m = /rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/.exec(s);
        return m ? parseFloat(m[1]) < 1 : false;
      });
      const thickBorder = parseFloat(cs.borderTopWidth) >= 6 || parseFloat(cs.borderLeftWidth) >= 6;
      const painted = (hasGradient && !isTexture && !allTranslucent) || thickBorder;
      if (!painted) continue;

      cssObjects.push({
        tag: e.tagName, cls: (e.className || '').toString().slice(0, 52),
        areaPct: Math.round(areaPct), children: e.querySelectorAll('*').length,
        why: thickBorder ? `border ${cs.borderTopWidth}` : 'opaque gradient body',
      });
    }

    // ---- placeholders that were never replaced --------------------------------
    // The failure this catches: a build shipped `<div data-plate="placeholder">`
    // with a comment saying "replace this when the plate exists". The plate never
    // arrived, nobody noticed, and the page shipped with a CSS-drawn stand-in for
    // a photograph. A placeholder that announces itself should not be able to hide.
    const PLACEHOLDER_RE = /placeholder|fallback|\bstub\b|\btodo\b|\bfpo\b|coming-soon|temp-asset/i;
    const placeholders = [];
    for (const e of all) {
      const g = abs(e);
      if (g.w * g.h < vw * vh * 0.02) continue;          // ignore trivia
      const cls = (e.className || '').toString();
      // Only class, id and data-* count. `placeholder` is a legitimate native
      // attribute on form controls and is not a stand-in for a missing asset.
      const attrs = [...e.attributes]
        .filter(a => a.name === 'id' || a.name.startsWith('data-'))
        .map(a => `${a.name}=${a.value}`).join(' ');
      if (!PLACEHOLDER_RE.test(cls) && !PLACEHOLDER_RE.test(attrs)) continue;
      placeholders.push({
        tag: e.tagName,
        cls: cls.slice(0, 48),
        marker: (PLACEHOLDER_RE.exec(cls) || PLACEHOLDER_RE.exec(attrs) || [''])[0],
        areaPct: Math.round((g.w * g.h) / (vw * vh) * 100),
      });
    }

    // ---- measure (WCAG 1.4.8) -------------------------------------------------
    // The one content rule with a formal standard behind it, and the only one
    // this file never checked. Measured off the RENDERED line boxes, not the
    // container: a 900px-wide column whose text wraps at 60ch is fine, and a
    // 400px column set in 11px type is not.
    const chCtx = document.createElement('canvas').getContext('2d');
    const chOf = cs => {
      chCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      return chCtx.measureText('0').width || parseFloat(cs.fontSize) * 0.5;
    };
    // Rects come back per inline fragment, so a paragraph containing a link
    // yields several per line. Band them by top edge and take each line's extent.
    const lineWidths = el => {
      const rg = document.createRange(); rg.selectNodeContents(el);
      const bands = {};
      for (const q of rg.getClientRects()) {
        if (q.width < 1 || q.height < 1) continue;
        const k = Math.round(q.top / 2);
        const bd = bands[k] || (bands[k] = { l: q.left, r: q.right });
        bd.l = Math.min(bd.l, q.left); bd.r = Math.max(bd.r, q.right);
      }
      return Object.values(bands).map(b => b.r - b.l);
    };
    const measures = [];
    for (const e of leaves) {
      if (e.textContent.trim().length < 200) continue;     // a label has no measure
      const cs = getComputedStyle(e);
      const ws = lineWidths(e);
      if (ws.length < 2) continue;                         // one line — not wrapped copy
      ws.sort((a, b) => b - a);
      measures.push({
        ch: Math.round(ws[0] / chOf(cs)),
        px: Math.round(ws[0]), font: Math.round(parseFloat(cs.fontSize)),
        text: e.textContent.trim().slice(0, 40),
      });
    }
    measures.sort((a, b) => b.ch - a.ch);

    // ---- body copy set below the pack's own floor -----------------------------
    const smallBody = !T.bodyMinPx ? [] : leaves
      .filter(e => e.textContent.trim().length >= 120 && parseFloat(getComputedStyle(e).fontSize) < T.bodyMinPx)
      .slice(0, 6)
      .map(e => ({ px: parseFloat(getComputedStyle(e).fontSize), text: e.textContent.trim().slice(0, 40) }));

    // ---- copy budgets the pack actually stated --------------------------------
    const wordsIn = e => (e.value || e.textContent || '').trim().split(/\s+/).filter(Boolean).length;
    const longHeads = [...document.querySelectorAll('h1,h2,h3')].filter(visible)
      .map(e => ({ tag: e.tagName, words: wordsIn(e), text: e.textContent.trim().slice(0, 40) }))
      .filter(x => x.words > T.headlineMaxWords);
    const longLabels = [...document.querySelectorAll('button,[role="button"],input[type=submit],.btn,.button')]
      .filter(visible)
      .map(e => ({ words: wordsIn(e), text: (e.value || e.textContent || '').trim().slice(0, 32) }))
      .filter(x => x.words > T.buttonLabelMaxWords);

    // ---- targets under the WCAG floor, not merely under the comfort bar -------
    // 2.5.8 exempts a target that is inline in a sentence, so an anchor whose
    // parent carries substantially more text than the anchor does is skipped.
    const undersized = [...document.querySelectorAll('a,button,[role="button"],input,select')].filter(visible)
      .filter(e => {
        // A link is exempt only if it sits INSIDE a sentence. The precise test
        // is whether its parent holds loose text of its own: `<p>see <a>this</a>
        // page</p>` does, `<nav><a>..</a><a>..</a></nav>` does not. Comparing
        // parent text length instead exempts every nav bar, which is wrong.
        if (e.tagName !== 'A' || !e.parentElement) return true;
        if (!getComputedStyle(e).display.startsWith('inline')) return true;
        return ![...e.parentElement.childNodes]
          .some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      })
      .map(e => { const g = abs(e); return { tag: e.tagName, w: Math.round(g.w), h: Math.round(g.h), text: (e.textContent || '').trim().slice(0, 24) }; })
      .filter(t => t.h < T.targetSizeMinPx || t.w < T.targetSizeMinPx);

    // ---- hero -----------------------------------------------------------------
    const heroChars = slices[0]?.chars ?? 0;
    const h1 = document.querySelector('h1');

    return {
      vw, vh, H, viewports: +(H / vh).toFixed(1),
      slices, gutter, bleeders, asym,
      overflowX, overflowers, tiny, targets: targets.slice(0, 10), targetCount: targets.length,
      timelines: tl, animationKinds: kinds, animationTotal: anims.length, sticky,
      heroChars, h1Words: h1 ? h1.textContent.trim().split(/\s+/).length : null,
      measures: measures.slice(0, 6), measureMax: measures[0]?.ch ?? null, measureCount: measures.length,
      smallBody, longHeads: longHeads.slice(0, 6), longHeadCount: longHeads.length,
      longLabels: longLabels.slice(0, 6), longLabelCount: longLabels.length,
      undersized: undersized.slice(0, 8), undersizedCount: undersized.length,
      rasters, bgImages, inlineSvg, cssObjects: cssObjects.slice(0, 8), cssObjectCount: cssObjects.length,
      placeholders: placeholders.slice(0, 8), placeholderCount: placeholders.length,
      naturalSizes: [...document.querySelectorAll('img')].map(i => ({
        src: (i.currentSrc || i.src || '').split('/').pop().split('?')[0],
        natural: i.naturalWidth, rendered: Math.round(i.getBoundingClientRect().width),
      })).filter(x => x.natural > 0 && x.rendered > 0),
    };
  }, T);
}

// ── run ──────────────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const report = { url, pack, generatedAt: new Date().toISOString(), widths: {}, findings: [] };
const add = (level, area, msg, data) => report.findings.push({ level, area, msg, ...(data ? { data } : {}) });

report.budget = { source: TOK ? tokensPath : 'engine defaults', ...CB };
add('INFO', 'budget', TOK
  ? `${pack}/tokens.json — ${T.charsPerViewportMax} chars/vp · ${T.measureMinCh}-${T.measureMaxCh}ch measure · headline ≤${T.headlineMaxWords}w · label ≤${T.buttonLabelMaxWords}w · target ≥${T.targetSizeMinPx}px`
  : `engine defaults — ${T.charsPerViewportMax} chars/vp. Pass --pack <name> to grade against a pack's own budget.`);

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: viewportHeight(w) } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
  await page.waitForTimeout(settle);
  await strip(page);
  const m = await measure(page);
  report.widths[w] = m;

  const at = `@${w}px`;
  if (m.overflowX > 1) add('FAIL', 'responsive', `horizontal overflow of ${m.overflowX}px ${at}`, m.overflowers);
  if (m.bleeders.length) add('FAIL', 'gutter', `${m.bleeders.length} element(s) flush to the viewport edge while the page gutter is ${m.gutter}px ${at}`, m.bleeders.slice(0, 5));
  if (m.asym.length) add('WARN', 'gutter', `${m.asym.length} element(s) with right gutter far below the ${m.gutter}px left gutter ${at}`, m.asym.slice(0, 5));
  const smallest = Math.min(...m.tiny.map(t => t.px), Infinity);
  if (smallest < T.absoluteMinFontPx) add('FAIL', 'type', `text rendering at ${smallest.toFixed(1)}px ${at} — unreadable, almost always a vw/cqw unit with no floor`, m.tiny);
  else if (m.tiny.length) add('WARN', 'type', `${m.tiny.length} text node(s) under ${T.minFontPx}px ${at}`, m.tiny);
  if (w <= 768 && m.targetCount) add('WARN', 'targets', `${m.targetCount} tap target(s) under ${T.minTapPx}px ${at}`, m.targets);

  await ctx.close();
}

// ── cross-breakpoint: does the page explode on small screens? ────────────────
{
  const vps = Object.entries(report.widths).map(([w, m]) => [Number(w), m.viewports]).sort((a, b) => a[0] - b[0]);
  const smallest = vps[0], largest = vps[vps.length - 1];
  add('INFO', 'responsive', `page length by width — ${vps.map(([w, v]) => `${w}px:${v}vp`).join('  ')}`);
  if (smallest && largest && smallest[1] > largest[1] * T.mobileLengthMultiplierMax) {
    add('FAIL', 'responsive',
      `page is ${smallest[1]} viewports at ${smallest[0]}px vs ${largest[1]} at ${largest[0]}px ` +
      `(${(smallest[1] / largest[1]).toFixed(1)}× — ceiling ${T.mobileLengthMultiplierMax}×). ` +
      `Desktop columns are stacking instead of recomposing.`);
  }
}

// density / motion judged at the primary desktop width
const ctx = await browser.newContext({ viewport: { width: primary, height: viewportHeight(primary) } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
await page.waitForTimeout(settle);
report.strippedNodes = await strip(page);
if (report.strippedNodes)
  add('INFO', 'scope', `${report.strippedNodes} [data-audit-ignore] subtree(s) removed before measuring — page scaffolding, not the design`);
const m = await measure(page);
report.primary = m;

const dead = m.slices.filter(s => s.chars < T.deadViewportChars && s.mediaPct < T.deadMediaAreaPct);
const heavy = m.slices.filter(s => s.chars > T.charsPerViewportMax);
const charsSorted = m.slices.map(s => s.chars).sort((a, b) => a - b);
const median = charsSorted[Math.floor(charsSorted.length / 2)] ?? 0;

if (m.viewports > T.maxPageViewports) add('WARN', 'length', `page is ${m.viewports} viewports tall (soft ceiling ${T.maxPageViewports})`);
if (dead.length > T.maxDeadViewports) add('FAIL', 'density', `${dead.length} dead viewport(s) — under ${T.deadViewportChars} chars and under ${T.deadMediaAreaPct}% media`, dead.map(d => `vp ${d.i}: ${d.chars} chars, ${d.mediaPct}% media`));
// A wall of text and a dense list are different problems. One 500-char paragraph
// is unreadable; eight 80-char spec items in the same viewport are scannable and
// fine. FAIL on an oversized single block; only WARN on a high viewport total.
const walls = m.slices.filter(s => s.largestBlock > T.largestBlockMax);
if (walls.length) add('FAIL', 'density',
  `${walls.length} viewport(s) with a single text block over ${T.largestBlockMax} chars — engine.md §5 wants ≤25 words per sub-paragraph`,
  walls.map(h => `vp ${h.i}: largest block ${h.largestBlock} chars`));
const denseOnly = heavy.filter(h => h.largestBlock <= T.largestBlockMax);
if (denseOnly.length) add('WARN', 'density',
  `${denseOnly.length} dense viewport(s) over ${T.charsPerViewportMax} chars, but no single block is oversized — a list, not a wall. Check it scans.`,
  denseOnly.map(h => `vp ${h.i}: ${h.chars} chars across ${h.blocks} blocks, largest ${h.largestBlock}`));
add('INFO', 'density', `median ${median} chars/viewport (warn above ${T.charsPerViewportWarn}), max ${Math.max(...charsSorted)}`);

const tlEntries = Object.entries(m.timelines);
const tlTotal = tlEntries.reduce((s, [, n]) => s + n, 0);
if (tlTotal) {
  const [topName, topN] = tlEntries.sort((a, b) => b[1] - a[1])[0];
  if (topN / tlTotal > T.techniqueMaxShare && tlTotal > 20)
    add('WARN', 'motion', `${topN}/${tlTotal} scroll-animated elements run the same keyframe (${topName}) — monotone`, m.timelines);
}
add('INFO', 'motion', `${m.animationTotal} animations · timelines ${JSON.stringify(m.animationKinds)} · sticky ${m.sticky}`);
const budgetSrc = TOK ? `${pack}'s copyBudget` : 'engine.md §5';
if (m.h1Words && m.h1Words > T.headlineMaxWords)
  add('WARN', 'copy', `h1 is ${m.h1Words} words (${budgetSrc} wants ≤${T.headlineMaxWords})`);
if (m.longHeadCount)
  add('WARN', 'copy', `${m.longHeadCount} heading(s) over ${T.headlineMaxWords} words (${budgetSrc})`, m.longHeads.map(h => `${h.tag} ${h.words}w — "${h.text}"`));
if (m.longLabelCount)
  add('WARN', 'copy', `${m.longLabelCount} button label(s) over ${T.buttonLabelMaxWords} words (${budgetSrc})`, m.longLabels.map(l => `${l.words}w — "${l.text}"`));

// ── measure — WCAG 1.4.8 ─────────────────────────────────────────────────
if (!m.measureCount) {
  add('INFO', 'measure', `no wrapped body block over 200 chars — nothing to measure`);
} else {
  const over = m.measures.filter(x => x.ch > T.measureCeilingCh);
  if (over.length) add('FAIL', 'measure',
    `${over.length} body block(s) set past ${T.measureCeilingCh}ch — WCAG 1.4.8 is a ceiling, not a preference`,
    over.map(x => `${x.ch}ch at ${x.font}px (${x.px}px wide) — "${x.text}"`));
  const wide = m.measures.filter(x => x.ch > T.measureMaxCh && x.ch <= T.measureCeilingCh);
  if (wide.length) add('WARN', 'measure',
    `${wide.length} body block(s) wider than ${pack || 'the'} pack's ${T.measureMaxCh}ch`,
    wide.map(x => `${x.ch}ch at ${x.font}px — "${x.text}"`));
  const narrow = m.measures.filter(x => x.ch < T.measureMinCh);
  if (narrow.length) add('WARN', 'measure',
    `${narrow.length} body block(s) narrower than ${T.measureMinCh}ch — short lines break the eye's return sweep`,
    narrow.map(x => `${x.ch}ch at ${x.font}px — "${x.text}"`));
  add('INFO', 'measure', `longest line ${m.measureMax}ch across ${m.measureCount} block(s) · target ${T.measureMinCh}-${T.measureMaxCh}ch · WCAG ceiling ${T.measureCeilingCh}ch`);
}
if (m.smallBody?.length) add('FAIL', 'type',
  `${m.smallBody.length} body block(s) under the pack's ${T.bodyMinPx}px floor`,
  m.smallBody.map(x => `${x.px}px — "${x.text}"`));
if (m.undersizedCount) add('FAIL', 'targets',
  `${m.undersizedCount} target(s) under ${T.targetSizeMinPx}px at ${primary}px — WCAG 2.5.8 minimum (inline links exempt)`,
  m.undersized.map(t => `${t.tag} ${t.w}x${t.h} — "${t.text}"`));

// ── assets: did anything get hand-drawn in CSS that wanted to be a photograph? ──
add('INFO', 'assets', `${m.rasters} raster element(s) · ${m.bgImages} css background image(s) · ${m.inlineSvg} inline svg`);
if (m.cssObjectCount) {
  // WARN, not FAIL: a large opaque-gradient box is *either* a physical object
  // that should have been a photograph, *or* a legitimate decorative backdrop.
  // CSS cannot tell those apart, and pretending otherwise produces false
  // positives (verified: a parallax backdrop trips it). The verdict lives in
  // the --plan check below, which is deterministic. This is a prompt to look.
  add('WARN', 'assets',
    `${m.cssObjectCount} CSS-object candidate(s) — large, text-free, image-free elements painted as solid bodies. ` +
    `If any of these is a real thing (a device, a room, a product) it should be a raster: engine.md §5, ROUTER Gate 2.5. ` +
    `If it is a backdrop, ignore this.`,
    m.cssObjects.map(o => `${o.tag}.${o.cls || '(no class)'} — ${o.areaPct}% of viewport, ${o.children} children, ${o.why}`));
}
if (m.rasters + m.bgImages === 0)
  add('WARN', 'assets', `page places zero image assets — confirm Gate 2.5 was answered, not skipped`);

// placeholders that announced themselves and were never replaced
if (m.placeholderCount) {
  add('FAIL', 'assets',
    `${m.placeholderCount} unreplaced placeholder(s) still rendering. A stand-in that names itself must not ship.`,
    m.placeholders.map(p => `${p.tag}.${p.cls || '(no class)'} — marker "${p.marker}", ${p.areaPct}% of viewport`));
}

// an image upscaled past its source resolution looks worse than the CSS it replaced
const upscaled = (m.naturalSizes || []).filter(i => i.rendered > i.natural * 1.15);
if (upscaled.length) {
  add('WARN', 'assets',
    `${upscaled.length} image(s) rendering larger than their source — soft on screen`,
    upscaled.map(i => `${i.src}: ${i.natural}px source rendered at ${i.rendered}px (${(i.rendered / i.natural).toFixed(2)}×)`));
}

// declared asset plan honoured?
const planPath = flag('plan', null);
if (planPath) {
  try {
    const plan = JSON.parse(readFileSync(planPath, 'utf8'));
    const declared = plan.assets ?? [];
    const srcs = await page.evaluate(() => {
      const out = new Set();
      document.querySelectorAll('img,video,source,picture').forEach(e => { if (e.src || e.srcset) out.add((e.src || e.srcset).split('?')[0]); });
      document.querySelectorAll('*').forEach(e => { const m = /url\("?([^")]+)"?\)/.exec(getComputedStyle(e).backgroundImage); if (m) out.add(m[1].split('?')[0]); });
      return [...out];
    });
    report.assetPlan = { declared: declared.length, found: srcs.length };
    const missing = declared.filter(a => a.path && !srcs.some(s => s.includes(a.path.split('/').pop())));
    if (missing.length) add('FAIL', 'assets', `${missing.length} declared asset(s) never placed on the page`, missing.map(a => `${a.id} → ${a.path}`));
    else if (declared.length) add('INFO', 'assets', `all ${declared.length} declared asset(s) present`);
  } catch (e) { add('WARN', 'assets', `could not read asset plan at ${planPath}: ${e.message}`); }
}

// reduced-motion honoured?
const rmCtx = await browser.newContext({ viewport: { width: primary, height: viewportHeight(primary) }, reducedMotion: 'reduce' });
const rmPage = await rmCtx.newPage();
await rmPage.goto(url, { waitUntil: 'networkidle' }).catch(() => rmPage.goto(url));
await rmPage.waitForTimeout(settle);
await strip(rmPage);
const rmCount = await rmPage.evaluate(() => document.getAnimations().length);
report.reducedMotionAnimations = rmCount;
if (m.animationTotal > 0 && rmCount >= m.animationTotal * 0.9)
  add('FAIL', 'a11y', `prefers-reduced-motion barely changes anything: ${m.animationTotal} → ${rmCount} animations`);
else
  add('INFO', 'a11y', `prefers-reduced-motion: ${m.animationTotal} → ${rmCount} animations`);
await rmCtx.close();

// pack bans
if (pack && PACK_RULES[pack]) {
  report.packChecks = {};
  for (const [name, fn] of Object.entries(PACK_RULES[pack])) {
    const n = await fn(page).catch(() => null);
    report.packChecks[name] = n;
    if (typeof n === 'number' && n > 0) add('FAIL', `pack:${pack}`, `${name} — ${n} violation(s), banned by the ${pack} pack`);
    if (n === null) add('WARN', `pack:${pack}`, `check "${name}" threw and was skipped — not a pass`);
  }
} else if (pack) {
  add('INFO', 'pack', `no mechanical rules defined for pack "${pack}" — check its ## banned list by hand`);
}

await ctx.close();
await browser.close();

// ── output ───────────────────────────────────────────────────────────────────
const C = { FAIL: '\x1b[31m', WARN: '\x1b[33m', INFO: '\x1b[36m', off: '\x1b[0m', dim: '\x1b[2m' };
const counts = { FAIL: 0, WARN: 0, INFO: 0 };
console.log(`\n  audit  ${url}${pack ? `  ·  pack: ${pack}` : ''}`);
console.log(`  ${m.viewports} viewports · ${m.vw}×${m.vh} · gutter ${m.gutter}px\n`);
for (const f of report.findings) {
  counts[f.level]++;
  console.log(`  ${C[f.level]}${f.level.padEnd(4)}${C.off}  ${C.dim}${(f.area + ' ').padEnd(12)}${C.off}${f.msg}`);
  if (f.data) for (const d of (Array.isArray(f.data) ? f.data : [f.data]).slice(0, 5))
    console.log(`        ${C.dim}${typeof d === 'string' ? d : JSON.stringify(d)}${C.off}`);
}
console.log(`\n  ${counts.FAIL} fail · ${counts.WARN} warn\n`);
if (jsonOut) { writeFileSync(jsonOut, JSON.stringify(report, null, 2)); console.log(`  wrote ${jsonOut}\n`); }
process.exit(counts.FAIL > 0 ? 1 : 0);
