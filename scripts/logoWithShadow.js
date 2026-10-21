import sharp from 'sharp';

const SHADOW_RGB = { r: 42, g: 75, b: 155 }; // the brand blue, matching --splash-logo-shadow
const SHADOW_OPACITY = 0.35;
const MARGIN = 0.12; 
const BLUR = 0.025; 
const DROP = 0.015; 

export async function logoWithShadow(source, size, withShadow = true) {
  const margin = Math.round(size * MARGIN);
  const inner = size - 2 * margin;
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };

  const logo = await sharp(source)
    .resize(inner, inner, { fit: 'contain', background: clear })
    .extend({ top: margin, bottom: margin, left: margin, right: margin, background: clear })
    .png()
    .toBuffer();

  const shadowAlpha = await sharp(logo)
    .extractChannel(3)
    .blur(Math.max(0.5, size * BLUR))
    .linear(SHADOW_OPACITY, 0)
    .toBuffer();
  const shadow = await sharp({ create: { width: size, height: size, channels: 3, background: SHADOW_RGB } })
    .joinChannel(shadowAlpha)
    .png()
    .toBuffer();

  return sharp({ create: { width: size, height: size, channels: 4, background: clear } })
    .composite([
      ...(withShadow ? [{ input: shadow, top: Math.round(size * DROP), left: 0 }] : []),
      { input: logo, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();
}
