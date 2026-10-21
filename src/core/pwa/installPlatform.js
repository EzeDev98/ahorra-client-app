const IN_APP = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat|TikTok|Twitter|LinkedInApp|WhatsApp|GSA\//;

export function getInstallPlatform() {
  const ua = navigator.userAgent;
  const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; 

  if (/iPhone|iPad|iPod/.test(ua) || touchMac) {
    return IN_APP.test(ua) || !/Safari\//.test(ua) ? 'ios-inapp' : 'ios';
  }
  if (/Android/i.test(ua)) return 'android';

  const safari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
  return safari ? 'safari-desktop' : 'desktop';
}

export const canPromptInstall = (platform) => platform === 'android' || platform === 'desktop';
