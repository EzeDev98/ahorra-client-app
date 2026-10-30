import { useEffect, useSyncExternalStore } from 'react';
import { pushSupport } from '@core/pwa/pushSupport.js';
import { sessionManager } from '@features/auth/session/sessionManager.js';
import { enablePush, restoreReminder } from './pushSubscription.js';

export default function ReminderSync() {
  const signedIn = useSyncExternalStore(sessionManager.subscribe, sessionManager.hasSession);

  useEffect(() => {
    if (!signedIn || pushSupport() !== 'supported') return undefined;
    let cancelled = false;
    let stopWaiting = () => {};

    restoreReminder()
      .then((result) => {
        if (cancelled || result !== 'needs-tap') return;
        const onTap = () => {
          enablePush().catch(() => {});
        };
        document.addEventListener('click', onTap, { capture: true, once: true });
        stopWaiting = () => document.removeEventListener('click', onTap, true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      stopWaiting();
    };
  }, [signedIn]);

  return null;
}
