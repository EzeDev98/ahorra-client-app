import { parkedEntries } from './parkedEntries.js';

let started = false;

export function startResurface() {
  if (started) return;
  started = true;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') parkedEntries.resurface();
  });
  addEventListener('pageshow', (event) => {
    if (event.persisted) parkedEntries.resurface();
  });
}
