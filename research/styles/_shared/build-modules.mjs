#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-modules.mjs — generate a pack's module sheet from its tokens.json

     node _shared/build-modules.mjs <pack>      # one pack
     node _shared/build-modules.mjs --all       # every pack with a tokens.json

   WHY GENERATED. Twelve hand-written sheets is twelve chances for the sheet to
   disagree with the spec. Here tokens.json is the single source: change a
   value, rebuild, and the rendered proof follows. The eight modules are the
   SAME in every pack on purpose — that is what makes the packs comparable.
   Pack character comes from `css` in tokens.json, not from different markup.

   Everything the sheet needs beyond tokens lives under `sheet` in tokens.json:
     sheet.css        the pack's own CSS (uses .pk* class names below)
     sheet.copy       headline / sub / labels used in the specimens
     sheet.dark       true if the pack supports a dark variant
     sheet.notes      per-module prose, keyed by module id
   ═════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const q = s => String(s ?? '').replace(/"/g, '&quot;');

/* ── the eight modules, in the order the catalogue defines them ─────────── */
const MODULES = [
  ['nav', '1 · Nav / header', '0 of 12 packs specified one'],
  ['hero', '2 · Hero', 'where the copy budget bites'],
  ['button', '3 · Button — five states', 'the module the set exists for'],
  ['form', '4 · Form field + error', 'label, focus, and error without colour alone'],
  ['card', '5 · Card', 'the pack container, or its refusal of one'],
  ['table', '6 · List / table', 'density under the pack rules'],
  ['overlay', '7 · Overlay / modal', '1 of 12 packs specified one'],
  ['empty', '8 · Empty / loading', '0 of 12 packs specified one'],
];

function buildSheet(pack) {
  const dir = join(ROOT, pack);
  const T = JSON.parse(readFileSync(join(dir, 'tokens.json'), 'utf8'));
  const S = T.sheet || {};
  /* Refuse to generate over a pack that has no sheet spec. Without this, --all
     silently replaces a hand-authored sheet with a stub. It did exactly that once. */
  if (!S.markup || !Object.keys(S.markup).length) return null;
  const C = S.copy || {};
  const N = S.notes || {};
  const A = T.a11y || {};
  const CB = T.copyBudget || {};
  const note = id => N[id] ? `<p class="note">${N[id]}</p>` : '';

  /* colour swatches, straight from the token file */
  const swatches = Object.entries(T.color || {}).map(([k, v]) => {
    const hex = typeof v === 'string' ? v : (v.hex || v.value || '');
    const role = (typeof v === 'object' && v.role) ? v.role : '';
    return `    <div><div class="swatch" style="background:${q(hex)}"></div>
      <p class="cap">--${esc(k)}<br>${esc(hex)}${role ? ' · ' + esc(role) : ''}</p></div>`;
  }).join('\n');

  const tokenRows = (S.tokenTable || []).map(r =>
    `    <tr><td>${esc(r[0])}</td><td><code>${esc(r[1])}</code></td><td>${esc(r[2] || '')}</td></tr>`
  ).join('\n');

  const bannedRows = (T.banned || []).map(b => `      <li>${esc(b)}</li>`).join('\n');

  const dark = S.dark !== false;
  const toc = ['tokens', ...MODULES.map(m => m[0]), dark ? 'dark' : null, 'narrow', 'copy', 'audit']
    .filter(Boolean)
    .map(id => `<a href="#${id}">${id === 'tokens' ? 'Tokens' : id === 'audit' ? 'Self-audit' : id[0].toUpperCase() + id.slice(1)}</a>`)
    .join('');

  const moduleBlocks = MODULES.map(([id, title, hint]) => `
<section class="block" id="${id}">
  <h2>${esc(title)} <span class="n">${esc(hint)}</span></h2>
  ${note(id)}
  <div class="stage pk" data-label="${q(id)}">
${S.markup && S.markup[id] ? S.markup[id] : '    <p class="cap">No specimen defined for this module in tokens.json → sheet.markup.' + id + '</p>'}
  </div>
</section>`).join('\n');

  const data = [
    `data-pack="${q(pack)}"`,
    `data-audit-scope=".stage *"`,
    `data-audit-controls="${q(S.auditControls || '.stage .pk-btn, .stage .pk-field')}"`,
    `data-audit-focus-target="${q(S.auditFocus || '#button .pk-btn')}"`,
    `data-audit-copy=".stage p:not(.cap)"`,
    `data-audit-headline="#hero .stage h3"`,
    `data-audit-sub="#hero .stage p"`,
    `data-audit-wrap=".wrap"`,
    A.maxRadiusPx !== undefined ? `data-max-radius="${A.maxRadiusPx}"` : '',
    A.maxHues !== undefined ? `data-max-hues="${A.maxHues}"` : '',
    A.allowBlur !== undefined ? `data-allow-blur="${A.allowBlur ? 1 : 0}"` : '',
    A.allowGradient !== undefined ? `data-allow-gradient="${A.allowGradient ? 1 : 0}"` : '',
    T.focus && T.focus.gapPx ? `data-focus-gap="${T.focus.gapPx}"` : '',
    T.focus && T.focus.ringPx ? `data-focus-ring="${T.focus.ringPx}"` : '',
    CB.headlineMaxWords ? `data-headline-words="${CB.headlineMaxWords}"` : '',
    CB.subMaxWords ? `data-sub-words="${CB.subMaxWords}"` : '',
    /* NOT emitted here: min-page-padding measures .wrap, which on a module sheet is
       SHARED CHROME (_shared/sheet.css), not a pack decision. It belongs on page.html. */
    S.hoverCollapse ? `data-hover-collapse="${q(S.hoverCollapse)}"` : '',
  ].filter(Boolean).join('\n      ');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(T.displayName || pack)} — Module Sheet</title>
<link rel="stylesheet" href="../_shared/sheet.css">
<style>
/* ═══ ${(T.displayName || pack).toUpperCase()} — every value from tokens.json ═══
   GENERATED by _shared/build-modules.mjs. Edit tokens.json, then rebuild.
   Hand edits here are lost on the next build. */
${S.css || '/* no sheet.css in tokens.json */'}
</style>
</head>
<body ${data}>
<div class="wrap">

<header class="top">
  <div class="crumb"><a href="../../specimens/index.html">← specimen sheet</a>
    &nbsp;/&nbsp; ${esc(T.index || '')} ${esc(pack)}
    &nbsp;/&nbsp; <a href="page.html">page example →</a></div>
  <h1>${esc(T.displayName || pack)} — Module Sheet</h1>
  <p class="lede">${esc(T.summary || '')} Eight modules, five button states${dark ? ', dark mode' : ''}
  and narrow width — every value read from <code>tokens.json</code>. This page is the proof;
  <code>style.md</code> and <code>modules.md</code> are the spec.</p>
  <div class="meta">${esc(S.metaLine || '')}${S.source ? ' &nbsp;·&nbsp; source: ' + esc(S.source) : ''}</div>
</header>

<nav class="toc">${toc}</nav>

<section class="block" id="tokens">
  <h2>Token strip <span class="n">tokens.json</span></h2>
  ${note('tokens')}
  <h3 class="sub">Colour</h3>
  <div class="grid3">
${swatches}
  </div>
${tokenRows ? `  <h3 class="sub">Measurements</h3>
  <table class="spec">
    <tr><th>Token</th><th>Value</th><th>Note</th></tr>
${tokenRows}
  </table>` : ''}
</section>
${moduleBlocks}
${dark ? `
<section class="block" id="dark">
  <h2>Dark mode <span class="n">0 of 12 packs specified one</span></h2>
  ${note('dark')}
  <div class="toggle">
    <button id="tLight" aria-pressed="true">Light</button>
    <button id="tDark" aria-pressed="false">Dark</button>
    <span class="cap" style="margin:0 0 0 8px">toggles the panel below only</span>
  </div>
  <div id="darkStage" class="stage pk" data-label="light">
${S.markup && S.markup.darkDemo ? S.markup.darkDemo : (S.markup && S.markup.button) || ''}
  </div>
</section>` : ''}

<section class="block" id="narrow">
  <h2>Narrow width <span class="n">390px — nothing renders this today</span></h2>
  ${note('narrow')}
  <div class="narrow pk"><div class="inner">
${S.markup && S.markup.narrow ? S.markup.narrow : (S.markup && S.markup.hero) || ''}
  </div></div>
</section>

<section class="block" id="copy">
  <h2>Copy budget <span class="n">at the limit, and over</span></h2>
  ${note('copy')}
  <table class="spec">
    <tr><th>Rule</th><th>Value</th><th>Source</th></tr>
    <tr><td>Measure</td><td><code>${esc(CB.measureMinCh || 50)}–${esc(CB.measureMaxCh || 75)}ch</code></td><td>WCAG 1.4.8 ceiling is 80</td></tr>
    <tr><td>Headline</td><td><code>≤ ${esc(CB.headlineMaxWords || 8)} words</code></td><td>${esc(CB.headlineReason || 'engine §5')}</td></tr>
    <tr><td>Sub</td><td><code>≤ ${esc(CB.subMaxWords || 25)} words</code></td><td>engine §5</td></tr>
    <tr><td>Button label</td><td><code>≤ ${esc(CB.buttonLabelMaxWords || 3)} words</code></td><td>engine — ideally 1–2</td></tr>
    <tr><td>Chars / viewport</td><td><code>${esc(CB.charsPerViewportMax || 420)}</code></td><td>audit.mjs threshold</td></tr>
  </table>
  <div class="grid2">
    <div><div class="stage pk good" data-label="at budget">
${S.markup && S.markup.copyGood ? S.markup.copyGood : ''}
    </div></div>
    <div><div class="stage pk bad" data-label="over budget">
${S.markup && S.markup.copyBad ? S.markup.copyBad : ''}
    </div>
    <p class="cap">Rendered on purpose. The audit excludes <code>.bad</code> stages — a deliberate
    violation is a lesson, not a defect.</p></div>
  </div>
</section>

<section class="block" id="banned">
  <h2>Banned <span class="n">the pack's hard filter</span></h2>
  <p class="note">A pack's <code>## banned</code> list outranks any vendor skill. These are
  mechanically checked where a browser can see them; the rest still need eyes.</p>
  <ul class="note">
${bannedRows}
  </ul>
</section>

<section class="block" id="audit">
  <h2>Self-audit <span class="n">measured from this page, on load</span></h2>
  <p class="note">Computed from the live DOM — rendered boxes, real font metrics, resolved colours.
  Nothing is typed in by hand, so if a value in <code>style.md</code> drifts from what the CSS
  actually does, this table disagrees with it. <b>That disagreement is the point.</b></p>
  <table class="spec" id="auditTable">
    <tr><th>Check</th><th>Measured</th><th>Required</th><th></th></tr>
  </table>
  <p class="note" id="auditSummary"></p>
</section>

</div>
${dark ? `<script>
(function(){
  const st=document.getElementById('darkStage'), L=document.getElementById('tLight'), D=document.getElementById('tDark');
  if(!st) return;
  const set=d=>{ st.dataset.theme=d?'dark':''; st.dataset.label=d?'dark':'light';
    D.setAttribute('aria-pressed',d); L.setAttribute('aria-pressed',!d); };
  L.onclick=()=>set(false); D.onclick=()=>set(true);
})();
</script>` : ''}
<script src="../_shared/audit.js"></script>
</body>
</html>
`;
  writeFileSync(join(dir, 'modules.html'), html, 'utf8');
  return html.length;
}

/* ── cli ────────────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const packs = args.includes('--all')
  ? readdirSync(ROOT, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name)
      .filter(p => existsSync(join(ROOT, p, 'tokens.json')))
  : args.filter(a => !a.startsWith('--'));

if (!packs.length) {
  console.error('usage: node _shared/build-modules.mjs <pack> | --all');
  process.exit(1);
}
for (const p of packs) {
  try {
    const n = buildSheet(p);
    console.log(n ? String(n).padStart(7) + ' bytes   ' + p
                  : '   skip           ' + p + ' (no sheet.markup in tokens.json)');
  } catch (e) {
    console.error('FAILED  ', p, '—', e.message);
  }
}
