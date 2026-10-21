import { readTokenMs } from '@shared/utils/cssTime.js';

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export const isReducedMotion = () => reducedQuery.matches;

const toMs = (duration) => (typeof duration === 'number' ? duration : readTokenMs(`--motion-${duration}`));

const toEasing = (ease) =>
  ease === 'standard' || ease === 'out'
    ? getComputedStyle(document.documentElement).getPropertyValue(`--ease-${ease}`).trim()
    : ease;

export const stagger = (index) => index * readTokenMs('--motion-stagger');

export function run(el, frames, { duration = 'base', ease = 'out', delay = 0, fill = 'none' } = {}) {
  let keyframes = frames;
  let ms = toMs(duration);
  let wait = delay;

  if (isReducedMotion()) {
    const from = frames[0].opacity ?? 1;
    const to = frames[frames.length - 1].opacity ?? 1;
    keyframes = [{ opacity: from }, { opacity: to }];
    ms = readTokenMs('--motion-reduced');
    wait = 0;
  }

  return el.animate(keyframes, { duration: ms, easing: toEasing(ease), delay: wait, fill }).finished.catch(() => {});
}

export function flip(container, mutate, options = {}) {
  if (isReducedMotion()) {
    mutate();
    return;
  }

  const offsets = () => {
    const top = container.getBoundingClientRect().top;
    return new Map([...container.children].map((child) => [child, child.getBoundingClientRect().top - top]));
  };

  const before = offsets();
  mutate();
  const after = offsets();

  after.forEach((offset, child) => {
    if (!before.has(child)) return;
    const dy = before.get(child) - offset;
    if (dy) run(child, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], options);
  });
}
