#!/usr/bin/env node
/* Build both artifacts for a pack, from tokens.json.

     node _shared/build-pack.mjs <pack> | --all

   modules.html and page.html do NOT read each other. Both read tokens.json:
   the same sheet.css, the same tokens, the same banned list. This wrapper
   exists so nobody has to remember an order — there isn't one. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
for (const script of ['build-modules.mjs', 'build-page.mjs']) {
  const r = spawnSync(process.execPath, [join(HERE, script), ...args], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
