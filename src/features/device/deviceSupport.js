const hasLightDark = () =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('color', 'light-dark(red, blue)');

export function getDeviceSupport() {
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPad asking for the desktop site
  const desktop = !touchMac && !/Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua);

  if (desktop && /Firefox\//.test(ua)) return { supported: false, reason: 'desktop-firefox', desktop };
  if (!hasLightDark()) return { supported: false, reason: 'colors', desktop };
  return { supported: true };
}
