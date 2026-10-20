// Generates every app icon from one source image. Run with: npm run icons
// Source: assets/icon-source.png (preferred) or assets/icon-source.svg. Square, artwork inside the central 80%.
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logoWithShadow } from './logoWithShadow.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/icons/`;

// The Apple icon is placed on this colour (the logo tile's own blue).
const BACKGROUND = '#203C93';
// The maskable icon is placed on the dark page colour, the same as the manifest background_color, so on Android's start screen
// the "A" sits on the plain background with no tile around it.
const DARK = '#0F1219';
const MASKABLE_MARK = 0.5; // the "A" as a share of the icon: keeps it inside the safe zone (the central circle, 80% across)

const source = ['icon-source.png', 'icon-source.svg'].map((name) => `${root}assets/${name}`).find(existsSync);
if (!source) throw new Error('No source image. Add assets/icon-source.png or assets/icon-source.svg.');

// The plain "A" on a transparent background, used as it is: no shadow, no outline. The two "any" icons and the maskable icon use it.
// The Apple icon and the favicon stay on the full logo tile.
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

// The plain "A" centred on the dark page colour. The trim happens on a copy in memory; the logo file is not changed.
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
