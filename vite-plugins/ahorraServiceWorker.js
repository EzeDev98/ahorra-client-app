import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const NEVER_PRECACHE = new Set(['sw.js', 'version.json', 'index.html']);
const SKIPPED_FILE = /\.(map|txt)$|(^|\/)\.gitkeep$|^splash\//;

function listFiles(dir, base = '') {
  return readdirSync(join(dir, base), { withFileTypes: true }).flatMap((entry) => {
    const path = base ? `${base}/${entry.name}` : entry.name;
    return entry.isDirectory() ? listFiles(dir, path) : [path];
  });
}

export function makeBuildId(root) {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
  let commit = 'nogit';
  try {
    commit = execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    // Not a git checkout: the timestamp alone still makes the id unique.
  }
  return `${stamp}-${commit}`;
}

export async function nextVersion() {
  const onHost = Boolean(process.env.RENDER);
  const base = (process.env.VERSION_SOURCE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/+$/, '');
  const giveUp = (reason) => {
    if (onHost) throw new Error(`version: ${reason}. Build stopped so the live version is not lost. Set VERSION_SOURCE_URL to the site address and redeploy.`);
    console.warn(`version: ${reason}; using 0.0.0 (local build).`);
    return '0.0.0';
  };
  if (!base) return giveUp('no live site address (VERSION_SOURCE_URL or RENDER_EXTERNAL_URL)');

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${base}/version.json?t=${Date.now()}`, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
      const live = response.ok ? await response.json().catch(() => ({})) : {};
      const current = Number.parseInt(String(live.version ?? '0'), 10);
      const next = (Number.isInteger(current) && current >= 0 ? current : 0) + 1;
      console.log(`version: live site is ${live.version ?? 'unversioned'}, this build is ${next}.0.0`);
      return `${next}.0.0`;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  return giveUp(`could not reach ${base} (${lastError.message})`);
}

// Fails the build loudly if a marker is missing, instead of shipping an unstamped worker.
function replaceOnce(text, marker, value, file) {
  if (!text.includes(marker)) throw new Error(`${file}: marker ${marker} not found.`);
  return text.replace(marker, () => value);
}

export function ahorraServiceWorker(buildId, version) {
  let outDir;

  return {
    name: 'ahorra-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
    },
    writeBundle() {
      const precache = listFiles(outDir)
        .filter((file) => !NEVER_PRECACHE.has(file) && !SKIPPED_FILE.test(file))
        .map((file) => `/${file}`)
        .sort();

      const styles = readFileSync(join(outDir, 'index.html'), 'utf8').match(/<link\b[^>]*\brel="stylesheet"[^>]*>/g) ?? [];
      if (styles.length === 0) throw new Error('index.html has no stylesheet link to copy into offline.html.');
      const offlinePath = join(outDir, 'offline.html');
      writeFileSync(
        offlinePath,
        replaceOnce(readFileSync(offlinePath, 'utf8'), '<!--ahorra:styles-->', styles.join('\n    '), 'offline.html'),
      );

      const swPath = join(outDir, 'sw.js');
      let sw = readFileSync(swPath, 'utf8');
      sw = replaceOnce(sw, "'__BUILD_ID__'", JSON.stringify(buildId), 'sw.js');
      sw = replaceOnce(sw, "['__PRECACHE_URLS__']", JSON.stringify(precache, null, 2), 'sw.js');
      writeFileSync(swPath, sw);

      writeFileSync(
        join(outDir, 'version.json'),
        `${JSON.stringify({ buildId, version, builtAt: new Date().toISOString() }, null, 2)}\n`,
      );

      console.log(`service worker: build ${buildId}, ${precache.length} files precached`);
    },
  };
}
