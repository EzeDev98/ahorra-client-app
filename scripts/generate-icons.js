import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logoWithShadow } from './logoWithShadow.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/icons/`;

const BACKGROUND = '#203C93';
const DARK = '#0F1219';
const MASKABLE_MARK = 0.5; 

const source = ['icon-source.png', 'icon-source.svg'].map((name) => `${root}assets/${name}`).find(existsSync);
if (!source) throw new Error('No source image. Add assets/icon-source.png or assets/icon-source.svg.');

const markSource = `${root}assets/logo-mark.png`;
if (!existsSync(markSource)) throw new Error('No assets/logo-mark.png. Add the plain "A" on a transparent background.');

const targets = [
  { file: 'icon-192.png', size: 192, mark: true },
  { file: 'icon-512.png', size: 512, mark: true },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, opaque: true },
  { file: 'favicon-32.png', size: 32 },
];

await mkdir(outDir, { recursive: true });

async function maskableIcon(size) {
  const edge = Math.round(size * MASKABLE_MARK);
  const mark = await sharp(markSource).trim().resize(edge, edge, { fit: 'inside' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: DARK } }).composite([{ input: mark, gravity: 'center' }]);
}

for (const { file, size, opaque, mark, maskable } of targets) {
  let image;
  if (maskable) image = await maskableIcon(size);
  else if (mark) image = sharp(await logoWithShadow(markSource, size, false));
  else image = sharp(source).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (opaque) image = image.flatten({ background: BACKGROUND });
  await image.png().toFile(`${outDir}${file}`);
  console.log(`public/icons/${file}  ${size}x${size}`);
}
