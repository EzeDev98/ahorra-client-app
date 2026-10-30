import { getInstallPlatform } from './installPlatform.js';
import { isPWAInstalled } from './isPWAInstalled.js';

export function pushSupport() {
  const hasApis = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (hasApis) return 'supported';
  return getInstallPlatform() === 'ios' && !isPWAInstalled() ? 'needs-install' : 'unsupported';
}
