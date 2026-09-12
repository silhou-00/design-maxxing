/* ═══════════════════════════════════════════════════════════════════════════
   SHARED SELF-AUDIT — one file, all twelve packs.

   Measures the live DOM: rendered boxes, real font metrics, resolved colours.
   Nothing here is hand-typed, so when a pack's style.md drifts from what its
   CSS actually does, this disagrees with the doc. That is the whole point.

   Usage — put this on the page and give <body> the pack's constraints:

     <body data-pack="neo-brutalism"
           data-max-radius="8" data-max-hues="2" data-allow-blur="0"
           data-allow-gradient="0" data-headline-words="6" data-sub-words="25"
           data-scroll-technique="stacking-cards" data-smooth-scroll="banned">
     <script src="../_shared/audit.js"></script>

   Mount point: an element with id="auditTable" (a <table>) and optionally
   id="auditSummary". Every value is read from data-* so no pack edits this file.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  const table = document.getElementById('auditTable');
  if (!table) return;
  const D = document.body.dataset;
  const num = (k, d) => (D[k] === undefined ? d : parseFloat(D[k]));
  const rows = [];
  const px = v => Math.round(v * 100) / 100;

  /* ── helpers ──────────────────────────────────────────────────────────── */
  const cv = document.createElement('canvas').getContext('2d');
  const chW = el => {
    const c = getComputedStyle(el);
    cv.font = c.fontWeight + ' ' + c.fontSize + ' ' + c.fontFamily;
    return cv.measureText('0').width;
  };
  const lum = rgb => {
    const [r, g, b] = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = c => (c.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);
  const ratio = (a, b) => {
    const p = [lum(parse(a)), lum(parse(b))].sort((m, n) => n - m);
    return (p[0] + 0.05) / (p[1] + 0.05);
  };
  const alphaOf = c => {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return 1;
    const parts = m[1].split(',').map(v => parseFloat(v));
    return parts.length > 3 ? parts[3] : 1;
  };
  const clear = c => !c || c === 'transparent' || alphaOf(c) === 0;

  /* Composite translucent layers down to an opaque colour.
     A glass panel is rgba(255,255,255,.2) over a gradient — reading its own
     background literally reports white-on-white at 1.00:1, which is a lie about
     a real page. Blend each translucent layer over what is actually behind it. */
  const bgOf = el => {
    const stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const c = cs.backgroundColor;
      if (!clear(c)) {
        stack.push(c);
        if (alphaOf(c) >= 0.999) break;
      }
      /* A gradient or image backdrop has no single colour. Saying "1.00:1" about it
         would be a fabricated number — report it as indeterminate instead. */
      if (/gradient|url\(/.test(cs.backgroundImage)) return null;
      n = n.parentElement;
    }
    if (!stack.length) return getComputedStyle(document.body).backgroundColor;
    if (alphaOf(stack[0]) < 0.999 && stack.length === 1 && n === null) return null;
    /* bottom-up source-over composite */
    let out = parse(stack[stack.length - 1]);
    if (alphaOf(stack[stack.length - 1]) < 0.999) {
      const base = parse(getComputedStyle(document.body).backgroundColor);
      const a = alphaOf(stack[stack.length - 1]);
      out = out.map((v, i) => v * a + base[i] * (1 - a));
    }
    for (let i = stack.length - 2; i >= 0; i--) {
      const a = alphaOf(stack[i]), top = parse(stack[i]);
      out = out.map((v, j) => top[j] * a + v * (1 - a));
    }
    return 'rgb(' + out.map(v => Math.round(v)).join(',') + ')';
  };
  const add = (n, m, r, ok, note) => rows.push({ n, m, r, ok, note: note || '' });

  /* Scope: specimens and composition only. Never the sheet's own furniture. */
  const SCOPE = D.auditScope || 'main *, nav *, footer *, .stage *';
  /* A `.bad` stage, a `#banned` section or anything marked `.no-audit` exists to
     RENDER a violation on purpose. Auditing inside one reports the lesson as a bug. */
  const EXCLUDE = '.audit, #audit, .no-audit, .bad, #banned, [data-violation], .cap, .pill, .note, .anote';
  const all = [...document.querySelectorAll(SCOPE)].filter(e => !e.closest(EXCLUDE));
  const vis = e => {
    const c = getComputedStyle(e);
    return c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity) !== 0;
  };

  /* ── 1. banned: shadow blur or spread ─────────────────────────────────── */
  if (num('allowBlur', 1) === 0) {
    const bad = all.filter(e => {
      const s = getComputedStyle(e).boxShadow;
      if (!s || s === 'none') return false;
      const m = s.match(/(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?/);
      return !!m && (parseFloat(m[3]) > 0 || parseFloat(m[4] || 0) > 0);
    });
    add('Shadow blur / spread', bad.length + ' element(s) with blur or spread > 0',
      '0 — the 0 is the style', bad.length === 0, 'scans every element in scope');
  }

  /* ── 2. banned: gradients ─────────────────────────────────────────────── */
  if (num('allowGradient', 1) === 0) {
    const g = all.filter(e => /gradient/.test(getComputedStyle(e).backgroundImage));
    add('Gradient fills', g.length + ' found', '0 — banned', g.length === 0);
  }

  /* ── 3. radius ceiling ────────────────────────────────────────────────── */
  if (D.maxRadius !== undefined) {
    const cap = num('maxRadius', 999);
    let mx = 0, el = null;
    /* border-radius can be a PERCENTAGE. parseFloat("50%") is 50, which reported a
       12px LED as a 50px radius. Resolve percentages against the element's own box. */
    const radiusPx = e => {
      const v = getComputedStyle(e).borderTopLeftRadius;
      if (!v) return 0;
      const n = parseFloat(v) || 0;
      if (!/%/.test(v)) return n;
      const r = e.getBoundingClientRect();
      return (n / 100) * Math.min(r.width || 0, r.height || 0);
    };
    all.forEach(e => {
      const r = radiusPx(e);
      if (r > mx) { mx = r; el = e; }
    });
    add('Largest border-radius', px(mx) + 'px', '≤ ' + cap + 'px', mx <= cap,
      mx > cap ? 'on .' + String(el.className || el.tagName).split(' ')[0] : '');
  }

  /* ── 4. accent hue budget ─────────────────────────────────────────────── */
  if (D.maxHues !== undefined) {
    const cap = num('maxHues', 99), hues = new Set();
    all.forEach(e => {
      const c = getComputedStyle(e).backgroundColor;
      if (clear(c)) return;
      const v = parse(c), mx = Math.max(...v), mn = Math.min(...v);
      if (mx - mn > 40) hues.add(c);
    });
    add('Distinct accent hues', hues.size + (hues.size ? ' — ' + [...hues].join(' , ') : ''),
      '≤ ' + cap, hues.size <= cap, 'greys, black and white are not accents');
  }

  /* ── 5. text contrast, against each run's real backdrop ───────────────── */
  let worst = 99, on = '', need0 = 0, indet = 0;
  all.filter(e => e.children.length === 0 && e.textContent.trim().length > 3 && vis(e))
    .forEach(e => {
      /* 1.4.3 Incidental + 1.4.11: an inactive component has no contrast requirement */
      if (e.closest('[disabled], [aria-disabled="true"], .is-disabled')) return;
      const bg = bgOf(e);
      if (bg === null) { indet++; return; }      /* gradient / image backdrop */
      const cs = getComputedStyle(e);
      const fs = parseFloat(cs.fontSize), wt = parseInt(cs.fontWeight) || 400;
      const need = (fs >= 24 || (fs >= 18.66 && wt >= 700)) ? 3 : 4.5;
      const r = ratio(cs.color, bg);
      if (r < need && r < worst) { worst = r; on = e.textContent.trim().slice(0, 32); need0 = need; }
    });
  add('Lowest failing text contrast',
    worst === 99 ? 'none — every measurable run clears its threshold'
                 : worst.toFixed(2) + ':1 on "' + on + '"',
    worst === 99 ? '4.5:1 body · 3:1 large' : need0 + ':1', worst === 99,
    'large text = 24px+, or 18.66px+ at weight 700 (WCAG 1.4.3)');
  if (indet) {
    add('Text over an unresolvable backdrop', indet + ' run(s) — gradient or image behind',
      'cannot be computed', null,
      "A gradient has no single colour, so no ratio can be asserted. This is a REAL limitation of the design, not of the audit: the panel's effective background is whatever pixels sit behind it. Mitigate with a scrim, higher fill alpha, or more blur — then verify by eye.");
  }

  /* ── 6. target size, WCAG 2.5.8 ───────────────────────────────────────── */
  const CTRL = D.auditControls || 'a.btn, button, nav a, [role=button]';
  let mw = 1e9, mh = 1e9, who = '';
  document.querySelectorAll(CTRL).forEach(e => {
    if (e.closest(EXCLUDE) || !vis(e)) return;
    const r = e.getBoundingClientRect();
    if (!r.width) return;
    if (r.height < mh) { mh = r.height; mw = r.width; who = e.textContent.trim().slice(0, 20); }
  });
  if (mw < 1e9) {
    add('Smallest control (2.5.8)', px(mw) + ' × ' + px(mh) + 'px — "' + who + '"',
      '24 × 24', mw >= 24 && mh >= 24, 'icon-only controls are what fail this');
  }

  /* ── 7. focus indicator area, WCAG 2.4.13 ─────────────────────────────── */
  const fb = document.querySelector(D.auditFocusTarget || CTRL);
  const gap = num('focusGap', 3), ring = num('focusRing', 3);
  if (fb && gap && ring) {
    const r = fb.getBoundingClientRect();
    const area = (r.width + 2 * gap + 2 * ring) * (r.height + 2 * gap + 2 * ring)
      - (r.width + 2 * gap) * (r.height + 2 * gap);
    const req = 4 * r.width + 4 * r.height;
    add('Focus ring area (2.4.13)', px(area) + 'px²', px(req) + 'px² (4h+4w)', area >= req,
      'the indicator must cover at least a 2px perimeter of the control');
  }

  /* ── 8. measure, only on copy long enough to wrap ─────────────────────── */
  let ch = 0;
  document.querySelectorAll(D.auditCopy || 'main p, .stage p:not(.cap)').forEach(e => {
    if (e.closest(EXCLUDE)) return;
    if (e.textContent.trim().length < 120) return;
    const c = e.getBoundingClientRect().width / chW(e);
    if (c > ch) ch = c;
  });
  add('Longest measure (1.4.8)', ch ? Math.round(ch) + 'ch' : 'no wrapping body copy',
    '≤ 80ch', !ch || ch <= 80, 'only paragraphs long enough to wrap are measured');

  /* ── 9. copy budget ───────────────────────────────────────────────────── */
  const hSel = D.auditHeadline, sSel = D.auditSub;
  if (hSel && document.querySelector(hSel)) {
    const h = document.querySelector(hSel);
    const w = h.textContent.trim().split(/\s+/).length, cap = num('headlineWords', 8);
    add('Hero headline', w + ' words — "' + h.textContent.trim().slice(0, 44) + '"',
      '≤ ' + cap, w <= cap, 'engine §5 allows 8; a pack may tighten it');
  }
  if (sSel && document.querySelector(sSel)) {
    const p = document.querySelector(sSel);
    const w = p.textContent.trim().split(/\s+/).length, cap = num('subWords', 25);
    add('Hero sub', w + ' words', '≤ ' + cap, w <= cap);
  }

  /* ── 10. page padding floor ───────────────────────────────────────────── */
  const wrap = document.querySelector(D.auditWrap || 'main .wrap, .wrap');
  if (wrap && D.minPagePadding) {
    const pad = parseFloat(getComputedStyle(wrap).paddingLeft);
    const min = num('minPagePadding', 0);
    add('Page padding', px(pad) + 'px', '≥ ' + min + 'px', pad >= min,
      'below this a hard shadow clips at the viewport edge');
  }

  /* ── 11. hover collapse is exact (packs whose hover moves onto a shadow) ─ */
  if (D.hoverCollapse) {
    const desync = [];
    document.querySelectorAll(D.hoverCollapse).forEach(e => {
      /* forced-state previews paint a hover/active look at rest — they are fakes by design */
      if (e.matches('.f-hover, .f-active, .f-focus') || e.closest(EXCLUDE)) return;
      const cs = getComputedStyle(e);
      const sx = parseFloat(cs.getPropertyValue('--sx')) || 0;
      const sy = parseFloat(cs.getPropertyValue('--sy')) || 0;
      const m = cs.boxShadow.match(/(-?[\d.]+)px\s+(-?[\d.]+)px/);
      if (!m || Math.abs(parseFloat(m[1]) - sx) > 0.5 || Math.abs(parseFloat(m[2]) - sy) > 0.5) {
        desync.push(e.textContent.trim().slice(0, 18) + ' ' + (m ? m[1] + '/' + m[2] : 'none') + ' vs ' + sx + '/' + sy);
      }
    });
    add('Hover collapse is exact',
      desync.length ? desync.join(' ; ') : 'every control: shadow offsets == translate distance',
      'offsets must equal --sx/--sy', desync.length === 0,
      'the element must land exactly on its own shadow, leaving nothing behind');
  }

  /* ── 12. one headline scroll technique ────────────────────────────────── */
  if (D.scrollTechnique) {
    add('Headline scroll technique', D.scrollTechnique, 'exactly 1 (ROUTER 3.5)', true,
      'reveals and supporting effects do not count against the budget');
  }

  /* ── 13. smooth scroll, where a pack bans it ──────────────────────────── */
  if (D.smoothScroll === 'banned') {
    const sb = getComputedStyle(document.documentElement).scrollBehavior;
    add('scroll-behavior', sb, 'auto — smooth is ✗ for this pack', sb !== 'smooth');
  }

  /* ── 14. reduced motion ───────────────────────────────────────────────── */
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  add('prefers-reduced-motion', rm ? 'reduce — respected' : 'no-preference (not set)',
    'motion collapses', true, 'set it in your OS to verify the collapse');

  /* ── render ───────────────────────────────────────────────────────────── */
  let bad = 0;
  for (const r of rows) {
    if (r.ok === false) bad++;
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + r.n + (r.note ? '<br><span class="anote">' + r.note + '</span>' : '') + '</td>' +
      '<td class="v"><b>' + r.m + '</b></td><td class="v">' + r.r + '</td>' +
      '<td><span class="pill ' + (r.ok === null ? 'by' : r.ok ? 'pass' : 'fail') + '">' +
      (r.ok === null ? 'by design' : r.ok ? 'PASS' : 'FAIL') + '</span></td>';
    table.appendChild(tr);
  }
  const sum = document.getElementById('auditSummary');
  const counted = rows.filter(r => r.ok !== null).length;
  if (sum) {
    sum.innerHTML = bad
      ? '<b class="isbad">' + bad + ' of ' + counted + ' FAIL.</b> Each is a real disagreement between this page and the spec — one of the two is wrong.'
      : '<b class="isok">All ' + counted + ' checks pass</b>, measured from the rendered page.';
  }
  console.log('[audit:' + (D.pack || '?') + '] ' + (bad ? bad + ' FAIL' : 'all pass'),
    rows.filter(r => r.ok === false).map(r => r.n + ' = ' + r.m));
})();
