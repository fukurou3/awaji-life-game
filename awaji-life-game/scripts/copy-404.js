// Simple SPA fallback: copy index.html to 404.html after build
// Usage: node scripts/copy-404.js <outDir>
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] || 'dist';
const from = join(outDir, 'index.html');
const to = join(outDir, '404.html');

if (!existsSync(from)) {
  console.error(`[copy-404] not found: ${from}`);
  process.exit(1);
}

try {
  copyFileSync(from, to);
  console.log(`[copy-404] created: ${to}`);
} catch (e) {
  console.error('[copy-404] failed:', e);
  process.exit(2);
}

