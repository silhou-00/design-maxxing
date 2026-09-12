#!/usr/bin/env node
// Install Class B design skills into a product repo.
// Class B skills operate on real code or need a live dev server, so they cannot
// run inside design-maxxing. See ROUTER.md.
//
//   node install-class-b.mjs <target-repo> <skill> [<skill>...] [--dry-run]
//   node install-class-b.mjs --list

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

const CLASS_B = {
  'impeccable':                   { from: 'impeccable/.claude/skills/impeccable', special: 'impeccable' },
  'design-taste-frontend':        { from: 'taste/.agents/skills/design-taste-frontend' },
  'redesign-existing-projects':   { from: 'taste/.agents/skills/redesign-existing-projects' },
  'full-output-enforcement':      { from: 'taste/.agents/skills/full-output-enforcement' },
  'animate':                      { from: 'kowalski/.agents/skills/animate' },
  'review-animations':            { from: 'kowalski/.agents/skills/review-animations' },
  'improve-animations':           { from: 'kowalski/.agents/skills/improve-animations' },
  'find-animation-opportunities': { from: 'kowalski/.agents/skills/find-animation-opportunities' },
  'prototype':                    { from: 'kowalski/.agents/skills/prototype' },
  'ask-sonner':                   { from: 'kowalski/.agents/skills/ask-sonner' },
};

const args = process.argv.slice(2);

if (args.includes('--list') || args.length === 0) {
  console.log('Class B skills:\n');
  for (const [name, def] of Object.entries(CLASS_B)) {
    const tag = def.special ? '  (also installs agents + merges hooks)' : '';
    console.log(`  ${name.padEnd(30)} ${def.from}${tag}`);
  }
  console.log('\nUsage: node install-class-b.mjs <target-repo> <skill> [<skill>...] [--dry-run]');
  process.exit(0);
}

const dryRun = args.includes('--dry-run');
const positional = args.filter(a => !a.startsWith('--'));
const target = resolve(positional[0]);
const wanted = positional.slice(1);

if (!existsSync(target)) die(`target repo not found: ${target}`);
if (wanted.length === 0) die('no skills named. Run with --list to see them.');

const unknown = wanted.filter(s => !CLASS_B[s]);
if (unknown.length) die(`not Class B skills: ${unknown.join(', ')}\nRun with --list.`);

console.log(`target : ${target}`);
console.log(`skills : ${wanted.join(', ')}`);
if (dryRun) console.log('mode   : DRY RUN — nothing will be written\n'); else console.log('');

const skillsDir = join(target, '.claude', 'skills');
let hooksMerged = false;

for (const name of wanted) {
  const def = CLASS_B[name];
  const src = join(ROOT, def.from);
  if (!existsSync(src)) die(`source missing: ${src}`);

  const dest = join(skillsDir, name);
  const verb = existsSync(dest) ? 'overwrite' : 'install';
  console.log(`${verb.padEnd(10)} ${name} -> .claude/skills/${name}`);
  if (!dryRun) { mkdirSync(skillsDir, { recursive: true }); cpSync(src, dest, { recursive: true }); }

  if (def.special === 'impeccable') {
    installImpeccableAgents();
    hooksMerged = mergeImpeccableHooks() || hooksMerged;
  }
}

console.log(dryRun ? '\nDry run complete.' : '\nDone.');
if (hooksMerged && !dryRun) {
  console.log('Impeccable hooks merged. Restart Claude Code in the target repo for them to load.');
}

// ---------------------------------------------------------------- helpers

function installImpeccableAgents() {
  const src = join(ROOT, 'impeccable/.claude/agents');
  if (!existsSync(src)) return;
  const destDir = join(target, '.claude', 'agents');
  for (const f of readdirSync(src).filter(f => f.endsWith('.md'))) {
    console.log(`${'agent'.padEnd(10)} ${f} -> .claude/agents/${f}`);
    if (!dryRun) { mkdirSync(destDir, { recursive: true }); copyFileSync(join(src, f), join(destDir, f)); }
  }
}

// Merges impeccable's PostToolUse + Stop hooks into the target's settings.local.json.
// Never overwrites: an existing settings file keeps every hook it already had.
function mergeImpeccableHooks() {
  const srcFile = join(ROOT, 'impeccable/.claude/settings.local.json');
  if (!existsSync(srcFile)) { console.log('warn       impeccable settings.local.json missing, hooks not merged'); return false; }

  const incoming = JSON.parse(readFileSync(srcFile, 'utf8'));
  const destFile = join(target, '.claude', 'settings.local.json');

  let current = {};
  if (existsSync(destFile)) {
    try { current = JSON.parse(readFileSync(destFile, 'utf8')); }
    catch { die(`target settings.local.json is not valid JSON, refusing to touch it:\n  ${destFile}`); }

    const backup = `${destFile}.backup.${Date.now()}`;
    console.log(`${'backup'.padEnd(10)} .claude/settings.local.json -> ${basename(backup)}`);
    if (!dryRun) copyFileSync(destFile, backup);
  }

  current.hooks ??= {};
  let added = 0;

  for (const [event, entries] of Object.entries(incoming.hooks ?? {})) {
    current.hooks[event] ??= [];
    for (const entry of entries) {
      const dup = current.hooks[event].some(e => JSON.stringify(e) === JSON.stringify(entry));
      if (dup) { console.log(`${'skip'.padEnd(10)} hook ${event} already present`); continue; }
      current.hooks[event].push(entry);
      console.log(`${'hook'.padEnd(10)} + ${event}`);
      added++;
    }
  }

  if (added === 0) { console.log('           no new hooks to add'); return false; }
  if (!dryRun) {
    mkdirSync(dirname(destFile), { recursive: true });
    writeFileSync(destFile, JSON.stringify(current, null, 2) + '\n');
  }
  return true;
}

function die(msg) { console.error(`error: ${msg}`); process.exit(1); }
