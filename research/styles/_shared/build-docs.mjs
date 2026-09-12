#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   build-docs.mjs — split a pack's docs into the hot/cold shape

     node _shared/build-docs.mjs <pack> | --all

   Reads tokens.json + the existing style.md and emits:

     style.md      HOT   — build rules only. Gains a State floor, a Copy budget
                           and a Files table; loses its provenance.
     modules.md    COLD  — the eight module specs, from tokens.json → sheet.notes
     reference.md  COLD  — the provenance that used to sit in style.md, plus the
                           decisions recorded in tokens.json → a11y

   WHY. ROUTER.md's load order is engine → platform → style pack → brief, sized
   so a style re-roll costs ~1.5K tokens rather than a full reload. A style.md
   carrying its own quotes is ~35% provenance the agent pays for on every run
   and never acts on. This moves that weight to a cold file.

   Idempotent: a style.md that already carries the hot-file marker is skipped.
   ═════════════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const MARK = '**Hot file.**';

/* pull a `## Heading` section out of a markdown document */
function section(md, name) {
  const re = new RegExp(`^## ${name}\\s*$`, 'm');
  const m = md.match(re);
  if (!m) return null;
  const start = m.index;
  const rest = md.slice(start + m[0].length);
  const next = rest.search(/^## /m);
  return {
    body: (next === -1 ? rest : rest.slice(0, next)).trim(),
    whole: md.slice(start, next === -1 ? md.length : start + m[0].length + next),
  };
}

const MODULES = [
  ['nav', '1. Nav / header'], ['hero', '2. Hero'], ['button', '3. Button — five states'],
  ['form', '4. Form field + error'], ['card', '5. Card'], ['table', '6. List / table'],
  ['overlay', '7. Overlay / modal'], ['empty', '8. Empty / loading'],
];

/* tokens.json notes are HTML (they render into the sheet). Markdown wants plain-ish text. */
const deHtml = s => String(s || '')
  .replace(/<\/?b>|<\/?strong>/g, '**')
  .replace(/<\/?i>|<\/?em>/g, '*')
  .replace(/<code>/g, '`').replace(/<\/code>/g, '`')
  .replace(/<br\s*\/?>/g, '\n')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
  .replace(/<[^>]+>/g, '');

function build(pack) {
  const dir = join(ROOT, pack);
  const tPath = join(dir, 'tokens.json');
  const sPath = join(dir, 'style.md');
  if (!existsSync(tPath) || !existsSync(sPath)) return 'no tokens.json or style.md';

  let style = readFileSync(sPath, 'utf8');
  if (style.includes(MARK)) return 'already split';

  const T = JSON.parse(readFileSync(tPath, 'utf8'));
  const S = T.sheet || {}, N = S.notes || {}, A = T.a11y || {}, CB = T.copyBudget || {}, SC = T.scroll || {};

  const title = (style.match(/^# (.+)$/m) || [, T.displayName || pack])[1];
  const blurb = (style.match(/^> (.+(?:\n> .+)*)$/m) || [, T.summary || ''])[1].replace(/\n> /g, '\n> ');

  const art = section(style, 'Art direction');
  const ref = section(style, 'Reference');
  const impl = section(style, 'Implementation');
  const banned = section(style, 'Banned');
  const gotchas = section(style, 'Gotchas');
  const sources = (style.match(/^Sources:.*(?:\n(?!\n).*)*$/m) || [''])[0].trim();

  const mood = (style.match(/^\*\*Mood & occasion\*\*.*(?:\n(?!\n).*)*$/m) || [''])[0].trim();

  /* ── style.md — HOT ─────────────────────────────────────────────────── */
  const focusBlock = T.focus ? `
## State floor

Standards, not preferences. These outrank the \`## banned\` list where they collide — see
\`../../captures/module-and-state-vocabulary.md\`.

\`\`\`css
:focus-visible{ ${T.focus.css} }
\`\`\`

${T.focus.reason ? `**Why this and not something on-style.** ${T.focus.reason}\n` : ''}
| requirement | value | how this pack meets it |
|---|---|---|
| Non-text contrast (1.4.11) | ${A.nonTextContrastMin || 3}:1 | control boundaries and state indicators |
| Focus appearance (2.4.13) | 3:1 change + \`4h+4w\` area | the ring above |
| Target size (2.5.8) | ${A.targetSizeMinPx || 24}×${A.targetSizeMinPx || 24} min | ${A.targetSizeNote ? A.targetSizeNote : 'controls are sized against this floor'} |
| Disabled | exempt from contrast | 1.4.3 Incidental · 1.4.11 |
${Object.entries(A).filter(([k, v]) => /Note$|Rule$|Problem$|Warning$/.test(k) && typeof v === 'string')
  .map(([k, v]) => `\n**${k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).replace(/ Note$| Rule$| Problem$| Warning$/, '')}.** ${v}`).join('\n')}
` : '';

  const copyBlock = `
## Copy budget

Read by \`engine/audit.mjs\` via \`--pack ${pack}\`; the numbers live in \`tokens.json\`.

| | value | note |
|---|---|---|
| measure | \`${CB.measureMinCh || 50}–${CB.measureMaxCh || 75}ch\` | WCAG 1.4.8 ceiling is 80 |
| headline | **≤${CB.headlineMaxWords || 8} words** | ${CB.headlineReason || 'engine §5 default is 8'} |
| sub | ≤${CB.subMaxWords || 25} words | |
| button label | ≤${CB.buttonLabelMaxWords || 3} words | |
| chars per viewport | ${CB.charsPerViewportMax || 420} | engine default is 420 |
${CB.note ? `\n${CB.note}\n` : ''}`;

  const filesBlock = `
## Files

| file | load when |
|---|---|
| \`tokens.json\` | you need values, or \`audit.mjs\` runs. **Also the source \`modules.html\` and \`page.html\` are built from** |
| \`modules.md\` | building any of the eight modules |
| \`reference.md\` | citing the pack, or asked why a rule exists |
| \`modules.html\` | **never read into context** — generated; open in a browser |
| \`page.html\` | **never read into context** — one composition at page scale |
| \`refs/\` | images; never read |
`;

  const newStyle = `# ${title}

> ${blurb}

**Hot file.** Build rules only. Provenance and quotes are in \`reference.md\`; the eight module specs
are in \`modules.md\`; machine-readable values are in \`tokens.json\`. Load those only when the job
needs them.

${mood ? mood + '\n' : ''}
${impl ? '## Implementation\n\n' + impl.body + '\n' : ''}
${focusBlock}
${banned ? '## Banned\n\n' + banned.body + '\n' : ''}
${copyBlock}
${gotchas ? '## Gotchas\n\n' + gotchas.body + '\n' : ''}
${filesBlock}`;

  /* ── modules.md — COLD ──────────────────────────────────────────────── */
  const moduleSecs = MODULES.map(([id, heading]) =>
    `## ${heading}\n\n${deHtml(N[id]) || '_No spec recorded for this module in `tokens.json` → `sheet.notes`._'}\n`
  ).join('\n');

  const dm = T.darkMode || {};
  const modules = `# ${title} — module specs

Cold file. Load only when building one of these. Rendered proof: \`modules.html\` — browser only,
never read into context, and **generated** from \`tokens.json\` by \`_shared/build-modules.mjs\`.
Values: \`tokens.json\`. Rules: \`style.md\`.

Eight modules, chosen because they are where the twelve packs visibly disagree. A separator is a 1px
line in all twelve; a disabled field is different in all twelve and was specified in none.

---

${moduleSecs}
---

## Dark mode

${dm.supported === false ? 'Not supported by this pack.' : deHtml(N.dark) || deHtml(dm.note) || '_Not recorded._'}

${dm.note && N.dark ? `\n${deHtml(dm.note)}\n` : ''}
## Narrow width

${deHtml(N.narrow) || '_Not recorded._'}

## Scroll

Headline technique: **${SC.headline || 'none'}**${SC.reason ? `\n\n${deHtml(SC.reason)}` : ''}
${(SC.alsoCore || []).length ? `\nAlso core: ${SC.alsoCore.map(t => `\`${t}\``).join(' · ')}` : ''}
${(SC.banned || []).length ? `\n**Banned for this pack:**\n${SC.banned.map(b => `- ${b}`).join('\n')}` : ''}
${SC.warning ? `\n**Warning.** ${SC.warning}` : ''}

Wired from \`tokens.json\` → \`scroll\` by \`_shared/build-page.mjs\`, so the technique on the page
cannot drift from the one recorded here.
`;

  /* ── reference.md — COLD ────────────────────────────────────────────── */
  const decisions = Object.entries(A)
    .filter(([k, v]) => /Note$|Rule$|Problem$|Warning$|Exemption$|resolution$/i.test(k) && typeof v === 'string')
    .map(([k, v]) => `| ${k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())} | ${v} |`)
    .join('\n');

  const reference = `# ${title} — provenance

Cold file. Load only to cite the pack, or to answer why a rule exists. None of this changes what you
build — that is \`style.md\` and \`modules.md\`.

${T.researchNote ? `## Research note\n\n${T.researchNote}\n` : ''}
${art ? '## Definitions, verbatim\n\n' + art.body + '\n' : ''}
${decisions ? `## Decisions recorded against this pack

Not all of these are in a source. Several were derived when the module set was specified, or forced
by the self-audit in \`modules.html\` / \`page.html\`, and they are recorded so a later reader does
not mistake them for measured values.

| | |
|---|---|
${decisions}
` : ''}
${T.focus?.reason ? `**Focus.** ${T.focus.reason}\n` : ''}
${ref ? '## Reference images\n\n' + ref.body.replace(/^Sources:.*(?:\n(?!\n).*)*$/m, '').trim() + '\n' : ''}
## Related

- \`../../captures/module-and-state-vocabulary.md\` — the WCAG floor and where the module set came from
- \`../../scroll/compatibility.md\` — this pack's scroll row
- \`modules.html\` — eight modules, all states, dark mode, narrow width
- \`page.html\` — one composition at page scale, carrying the ● technique

${sources || (T.source ? 'Sources: ' + T.source : '')}
`;

  writeFileSync(sPath, newStyle.replace(/\n{3,}/g, '\n\n'), 'utf8');
  writeFileSync(join(dir, 'modules.md'), modules.replace(/\n{3,}/g, '\n\n'), 'utf8');
  writeFileSync(join(dir, 'reference.md'), reference.replace(/\n{3,}/g, '\n\n'), 'utf8');
  return `style.md ${newStyle.length}B · modules.md ${modules.length}B · reference.md ${reference.length}B`;
}

const args = process.argv.slice(2);
const packs = args.includes('--all')
  ? readdirSync(ROOT, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_'))
      .map(d => d.name).filter(p => existsSync(join(ROOT, p, 'tokens.json')))
  : args.filter(a => !a.startsWith('--'));

for (const p of packs) {
  try { console.log(p.padEnd(16), build(p)); }
  catch (e) { console.error(p.padEnd(16), 'FAILED —', e.message); }
}
