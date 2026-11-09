/**
 * Batch render multiple Reels/Shorts from a single JSON config file.
 * Usage: node scripts/batch-render.mjs
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const reelsDataFile = path.resolve('scripts/sample-reels.json');
if (!fs.existsSync(reelsDataFile)) {
  console.log('No scripts/sample-reels.json found. Rendering default reel...');
  execSync('npx remotion render src/index.ts CaptionsReel out/default-reel.mp4', {
    stdio: 'inherit',
  });
  process.exit(0);
}

const reels = JSON.parse(fs.readFileSync(reelsDataFile, 'utf-8'));

console.log(`Found ${reels.length} reels to render.`);

const extraArgs = process.argv.slice(2).join(' ');

for (let i = 0; i < reels.length; i++) {
  const reel = reels[i];
  const outPath = path.join(outDir, `${reel.id || `reel-${i + 1}`}.mp4`);
  console.log(`\n========================================`);
  console.log(`[${i + 1}/${reels.length}] Rendering: ${reel.titleHook?.badge || reel.id}`);
  console.log(`Output: ${outPath}`);
  console.log(`========================================\n`);

  const propsJson = JSON.stringify({ config: reel });
  const tmpPropsPath = path.resolve(`scripts/.temp-props-${i}.json`);
  fs.writeFileSync(tmpPropsPath, propsJson);

  try {
    const cmd = `npx remotion render src/index.ts CaptionsReel "${outPath}" --props="${tmpPropsPath}" ${extraArgs}`;
    execSync(cmd, { stdio: 'inherit' });
  } finally {
    if (fs.existsSync(tmpPropsPath)) {
      fs.unlinkSync(tmpPropsPath);
    }
  }
}

console.log(`\nAll ${reels.length} reels have been rendered successfully into /out!`);

