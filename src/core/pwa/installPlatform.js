// Which install route this browser needs. Read once by the Install screen.
//   'android'         Chrome, Edge, Samsung Internet: install prompt, menu steps as the fallback
//   'desktop'         Chrome, Edge and the rest of desktop: install prompt, browser-menu steps as the fallback
//   'safari-desktop'  Safari on a Mac: no prompt ever, "Add to Dock"
//   'ios'             Safari and other iPhone or iPad browsers: no prompt ever, "Add to Home Screen"
//   'ios-inapp'       An app's built-in browser on iOS (WhatsApp, Instagram...): cannot install, must open Safari
const IN_APP = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|Twitter|LinkedInApp|WhatsApp|GSA\//;

export function getInstallPlatform() {
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPad asking for the desktop site

  if (/iPhone|iPad|iPod/.test(ua) || touchMac) {
    // A web view inside an app has no "Safari/" token in its user agent; the real browsers all do.
    return IN_APP.test(ua) || !/Safari\//.test(ua) ? 'ios-inapp' : 'ios';
  }
  if (/Android/i.test(ua)) return 'android';

  const safari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
  return safari ? 'safari-desktop' : 'desktop';
}

// Only these browsers can hand over a beforeinstallprompt event. The others always get manual steps.
export const canPromptInstall = (platform) => platform === 'android' || platform === 'desktop';
