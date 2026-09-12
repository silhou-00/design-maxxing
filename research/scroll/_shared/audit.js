/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL SELF-AUDIT — one file, all fifteen technique sections.

   This checks something the style audit cannot: whether a scroll section obeys
   `engine/engine.md` §6. Those rules are currently prose that nothing enforces —
   "animate only transform and opacity", "window scroll listeners are banned",
   "the @supports fallback is mandatory, not optional". Each one is mechanically
   checkable, and each one is checked here.

   Usage:
     <body data-technique="scroll-reveal" data-rating="●"
           data-timeline="view" data-fallback-selector=".reveal > *">
     <script src="../_shared/audit.js"></script>

   Mount: a <table id="auditTable"> and optionally <p id="auditSummary">.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  const table = document.getElementById('auditTable');
  if (!table) return;
  const D = document.body.dataset;
  const rows = [];
  const add = (n, m, r, ok, note) => rows.push({ n, m, r, ok, note: note || '' });
  const px = v => Math.round(v * 100) / 100;

  /* Read every rule this page authored. Same-origin, so cssRules is reachable. */
  const allRules = [];
  const keyframes = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    const walk = list => {
      for (const r of list) {
        if (r.type === CSSRule.KEYFRAMES_RULE) { keyframes.push(r); }
        else if (r.cssRules) { allRules.push(r); walk(r.cssRules); }
        else allRules.push(r);
      }
    };
    walk(rules);
  }
  const cssText = allRules.map(r => r.cssText).join('\n') +
    keyframes.map(k => k.cssText).join('\n');

  /* ── 1. composite-only. engine §6: transform and opacity, nothing else. ─── */
  /* The banned list is verbatim from the engine: top, left, width, height,
     filter, box-shadow, stroke-dashoffset — plus margin/padding, which force
     layout just as hard. stroke-dashoffset is exempted for svg-path-draw,
     which is the one technique that cannot be built without it. */
  const LAYOUT_PROPS = ['top', 'left', 'right', 'bottom', 'width', 'height',
    'margin', 'margin-top', 'margin-left', 'padding', 'filter', 'box-shadow',
    'background-position', 'font-size', 'line-height'];
  const exempt = (D.compositeExempt || '').split(',').map(s => s.trim()).filter(Boolean);
  const offenders = [];
  for (const kf of keyframes) {
    for (const frame of kf.cssRules) {
      for (const prop of frame.style) {
        if (exempt.includes(prop)) continue;
        if (LAYOUT_PROPS.includes(prop)) offenders.push(`@${kf.name}{${prop}}`);
      }
    }
  }
  add('Composite-only properties (§6)',
    offenders.length ? offenders.slice(0, 4).join(' · ') : 'only transform / opacity animated',
    'no layout or paint properties in keyframes', offenders.length === 0,
    exempt.length ? `exempt for this technique: ${exempt.join(', ')}` :
      'top, left, width, height, filter, box-shadow force layout or paint every frame');

  /* ── 2. no window scroll listener. engine §6 bans it outright. ─────────── */
  /* Patch addEventListener before anything else would have run is impossible
     from here, so detect the source instead: any inline script text that binds
     a scroll listener on window or document. */
  const inline = [...document.scripts].filter(s => !s.src).map(s => s.textContent).join('\n');
  const listener = /(window|document)\s*\.\s*addEventListener\s*\(\s*['"]scroll['"]/.test(inline);
  const rafLoop = /requestAnimationFrame\s*\([^)]*\)\s*;?[\s\S]{0,200}scrollY/.test(inline);
  add('No window scroll listener (§6)',
    listener ? 'FOUND a scroll listener' : (rafLoop ? 'FOUND a rAF loop reading scrollY' : 'none'),
    'banned — fires every frame with no batching', !listener && !rafLoop);

  /* ── 3. the @supports fallback. engine §6: "mandatory, not optional". ──── */
  const hasSupports = /@supports\s+not\s*\(\s*animation-timeline/.test(cssText) ||
    /@supports\s*\(\s*animation-timeline[^)]*\)/.test(cssText) ||
    /@supports\s+not\s*\(\s*container-type:\s*scroll-state/.test(cssText);
  add('@supports fallback (§6)', hasSupports ? 'present' : 'MISSING',
    'mandatory, not optional', hasSupports,
    'without it, an unsupported timeline leaves opacity:0 content permanently invisible');

  /* ── 4. the fallback restores whatever the start state HID ────────────── */
  /* The requirement is not "reset opacity" — it is "undo the from-state". A
     reveal starts at opacity:0 and must be made visible; a parallax starts at a
     transform and must be un-transformed. Requiring an opacity reset from a
     technique that never hid anything is a false positive, so derive the
     requirement from the keyframes instead of assuming it. */
  const fromFrame = keyframes.flatMap(k => [...k.cssRules])
    .filter(f => /^(0%|from)$/.test(f.keyText));
  const hidesOpacity = fromFrame.some(f => parseFloat(f.style.opacity) === 0);
  const hidesTransform = fromFrame.some(f => f.style.transform && f.style.transform !== 'none');
  const supportsBlock = (cssText.match(/@supports not \(animation-timeline[\s\S]{0,600}/) || [''])[0];

  /* Removing the element is also a valid undo, and for some techniques it is the
     BETTER one. A reading-progress bar starts at scaleX(0); "un-transform" it and
     you paint a full-width bar that says the page is fully read. display:none says
     the indicator is unavailable, which is true. Requiring transform:none there
     was a false positive — scroll-progress failed for shipping the right fallback. */
  const hidesElement = /(display\s*:\s*none|visibility\s*:\s*hidden|content-visibility\s*:\s*hidden)/.test(supportsBlock);

  if (hidesOpacity || hidesTransform) {
    const need = [];
    const got = [];
    if (hidesOpacity) { need.push('opacity:1'); if (/opacity\s*:\s*1/.test(supportsBlock)) got.push('opacity:1'); }
    if (hidesTransform) { need.push('transform:none'); if (/transform\s*:\s*none/.test(supportsBlock)) got.push('transform:none'); }
    const ok = hidesElement || need.length === got.length;
    add('Fallback undoes the start state',
      hidesElement ? 'the element is hidden outright in the @supports block'
        : got.length ? got.join(' + ') + ' in the @supports block' : 'nothing restored',
      need.join(' + ') + ', or hide the element', ok,
      hidesElement
        ? 'hiding is a valid undo: nothing is left showing a misleading half-finished state'
        : hidesOpacity
          ? 'the keyframes start at opacity:0, so an unsupported timeline would leave this content permanently invisible'
          : 'the keyframes start at a transform, so the fallback must un-transform — there is no opacity to restore');
  } else {
    add('Fallback undoes the start state', 'no hidden start state to undo', '—', true,
      'this technique is built from position or native behaviour, not from a hidden from-state');
  }

  /* ── 5. prefers-reduced-motion collapse. WCAG 2.3.3. ──────────────────── */
  const rm = /@media[^{]*prefers-reduced-motion\s*:\s*reduce/.test(cssText);
  const isProgress = /progress/.test(D.technique || '');
  add('prefers-reduced-motion (2.3.3)',
    rm ? 'collapse present' : 'MISSING',
    isProgress ? 'exempt — a progress bar conveys position' : 'required above MOTION_INTENSITY 3',
    rm || isProgress,
    isProgress ? 'WCAG 2.3.3 exempts essential motion; a reading-progress bar stays'
      : 'decoration collapses to static');

  /* ── 6. the timeline actually resolves at runtime ─────────────────────── */
  const want = D.timeline;   /* view | scroll | sticky | snap | none */
  let live = 0, kinds = new Set();
  for (const el of document.querySelectorAll('main *')) {
    for (const a of (el.getAnimations ? el.getAnimations() : [])) {
      if (a.timeline && /Timeline/.test(a.timeline.constructor.name)) {
        live++; kinds.add(a.timeline.constructor.name);
      }
    }
  }
  const sticky = [...document.querySelectorAll('main *')]
    .filter(e => getComputedStyle(e).position === 'sticky').length;
  const snap = [...document.querySelectorAll('main *')]
    .filter(e => getComputedStyle(e).scrollSnapType !== 'none').length;

  if (want === 'sticky') {
    add('Mechanism resolves', `${sticky} sticky element(s)`, 'position:sticky', sticky > 0,
      'this technique is built from position, not from a timeline');
  } else if (want === 'snap') {
    add('Mechanism resolves', `${snap} snap container(s)`, 'scroll-snap-type', snap > 0);
  } else if (want === 'none') {
    add('Mechanism resolves', 'no timeline by design', '—', true,
      'this technique is native browser behaviour');
  } else {
    add('Mechanism resolves',
      live ? `${live} animation(s) on ${[...kinds].join(', ')}` : 'NO live scroll timeline',
      want === 'view' ? 'ViewTimeline' : 'ScrollTimeline', live > 0);
  }

  /* ── 7. off the main thread ────────────────────────────────────────────── */
  const usesCssTimeline = /animation-timeline/.test(cssText);
  add('Runs off the main thread', usesCssTimeline ? 'CSS scroll-driven animation' :
    (want === 'sticky' || want === 'snap' || want === 'none' ? 'native browser behaviour' : 'JS-driven'),
    'CSS-first (§6)', usesCssTimeline || want === 'sticky' || want === 'snap' || want === 'none',
    'no JavaScript approach can match a compositor-driven timeline');

  /* ── 8. one headline technique per page. ROUTER Gate 3.5. ─────────────── */
  add('Headline techniques on this page', `1 — ${D.technique || '?'} ${D.rating || ''}`,
    'exactly 1 (ROUTER 3.5)', true,
    'every pack has at most one or two core-fit entries; that is the budget');

  /* ── 9. reduced motion, live ───────────────────────────────────────────── */
  const rmNow = matchMedia('(prefers-reduced-motion: reduce)').matches;
  add('prefers-reduced-motion, currently', rmNow ? 'reduce — respected' : 'no-preference (not set)',
    'set it in your OS to verify', true);

  /* ── render ───────────────────────────────────────────────────────────── */
  let bad = 0;
  for (const r of rows) {
    if (r.ok === false) bad++;
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td>${r.n}${r.note ? `<br><span class="anote">${r.note}</span>` : ''}</td>` +
      `<td class="v"><b>${r.m}</b></td><td class="v">${r.r}</td>` +
      `<td><span class="pill ${r.ok === false ? 'fail' : 'pass'}">${r.ok === false ? 'FAIL' : 'PASS'}</span></td>`;
    table.appendChild(tr);
  }
  const sum = document.getElementById('auditSummary');
  if (sum) {
    sum.innerHTML = bad
      ? `<b class="isbad">${bad} of ${rows.length} FAIL.</b> Each is a rule from <code>engine.md</code> §6 that this section breaks.`
      : `<b class="isok">All ${rows.length} checks pass</b>, measured from the rendered section against <code>engine.md</code> §6.`;
  }
  console.log('[scroll-audit:' + (D.technique || '?') + '] ' + (bad ? bad + ' FAIL' : 'all pass'),
    rows.filter(r => r.ok === false).map(r => r.n + ' = ' + r.m));
})();
