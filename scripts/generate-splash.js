import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { logoWithShadow } from './logoWithShadow.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/splash/`;
const htmlPath = `${root}index.html`;

const BACKGROUND = '#0F1219'; 
const LOGO_SHARE = 0.36; 

const DEVICES = [
  [375, 667, 2], //   iPhone SE (2nd, 3rd gen)
  [375, 812, 3], //   iPhone XS, 11 Pro, 12 mini, 13 mini
  [414, 896, 2], //   iPhone XR, 11
  [414, 896, 3], //   iPhone XS Max, 11 Pro Max
  [390, 844, 3], //   iPhone 12, 12 Pro, 13, 13 Pro, 14, 16e, 17e
  [428, 926, 3], //   iPhone 12 Pro Max, 13 Pro Max, 14 Plus
  [393, 852, 3], //   iPhone 14 Pro, 15, 15 Pro, 16
  [430, 932, 3], //   iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  [402, 874, 3], //   iPhone 16 Pro, 17, 17 Pro
  [420, 912, 3], //   iPhone Air
  [440, 956, 3], //   iPhone 16 Pro Max, 17 Pro Max
  [744, 1133, 2], //  iPad mini (6th gen and later)
  [768, 1024, 2], //  iPad mini (5th gen), iPad 9.7"
  [810, 1080, 2], //  iPad 10.2"
  [820, 1180, 2], //  iPad Air 11", iPad (10th gen and later)
  [834, 1112, 2], //  iPad Air (3rd gen), iPad Pro 10.5"
  [834, 1194, 2], //  iPad Pro 11" (to 4th gen)
  [834, 1210, 2], //  iPad Pro 11" (M4)
  [1024, 1366, 2], // iPad Pro 12.9", iPad Air 13"
  [1032, 1376, 2], // iPad Pro 13" (M4)
];

const START = '<!-- apple-splash:start -->';
const END = '<!-- apple-splash:end -->';

const markSource = `${root}assets/logo-mark.png`; 
if (!existsSync(markSource)) throw new Error('No assets/logo-mark.png. Add the plain "A" on a transparent background.');

const html = readFileSync(htmlPath, 'utf8');
const from = html.indexOf(START);
const to = html.indexOf(END);
if (from === -1 || to < from) throw new Error(`index.html needs the ${START} and ${END} markers.`);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const links = [];
for (const [width, height, ratio] of DEVICES) {
  const pixelWidth = width * ratio;
  const pixelHeight = height * ratio;
  const file = `${pixelWidth}x${pixelHeight}.png`;

  const logoSize = Math.round(Math.min(pixelWidth, pixelHeight) * LOGO_SHARE);
  const logo = await logoWithShadow(markSource, logoSize, false); 

  await sharp({ create: { width: pixelWidth, height: pixelHeight, channels: 3, background: BACKGROUND } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(`${outDir}${file}`);

  const media = `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`;
  links.push(`    <link rel="apple-touch-startup-image" href="/splash/${file}" media="${media}" />`);
  console.log(`public/splash/${file}`);
}

writeFileSync(htmlPath, `${html.slice(0, from + START.length)}\n${links.join('\n')}\n    ${html.slice(to)}`);
console.log(`index.html: ${links.length} launch image links written`);
