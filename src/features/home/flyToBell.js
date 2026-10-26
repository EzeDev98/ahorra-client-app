import { run, stagger } from '@core/motion/motion.js';

const END_SCALE = 0.06; 
const BOW = 0.16; 
const STEPS = 16; 

const centre = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

function makeCopy(card, from) {
  const copy = card.cloneNode(true);
  ['data-entry-id', 'tabindex', 'aria-label'].forEach((name) => copy.removeAttribute(name));
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('inert', '');
  copy.classList.add('home__fly');
  Object.assign(copy.style, {
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    transform: '',
    opacity: '',
  });
  document.body.appendChild(copy);
  return copy;
}

export function flyToBell(card, bell) {
  const from = card.getBoundingClientRect();
  const start = centre(from);
  const end = centre(bell.getBoundingClientRect());
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;

  const control = { x: dx / 2 + (-dy / distance) * distance * BOW * 2, y: dy / 2 + (dx / distance) * distance * BOW * 2 };

  const frames = Array.from({ length: STEPS + 1 }, (_, index) => {
    const t = index / STEPS;
    const x = 2 * (1 - t) * t * control.x + t * t * dx;
    const y = 2 * (1 - t) * t * control.y + t * t * dy;
    const scale = 1 + (END_SCALE - 1) * t;
    const opacity = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
    return { transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity };
  });

  const copy = makeCopy(card, from);
  card.style.visibility = 'hidden';

  return run(copy, frames, { duration: 'fly', ease: 'standard', fill: 'forwards' }).then(() => copy.remove());
}

export const pulseBell = (bell) => run(bell, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 'base' });

export function flyFromBell(card, bell, index, area) {
  const to = card.getBoundingClientRect();
  const view = area.getBoundingClientRect();
  if (to.bottom <= view.top || to.top >= view.bottom) return Promise.resolve();

  const start = centre(bell.getBoundingClientRect());
  const end = centre(to);
  const copy = makeCopy(card, to);
  card.style.visibility = 'hidden';

  const frames = [
    { transform: `translate(${start.x - end.x}px, ${start.y - end.y}px) scale(${END_SCALE})`, opacity: 0 },
    { transform: 'none', opacity: 1 },
  ];
  return run(copy, frames, { duration: 'fly', ease: 'out', delay: stagger(index), fill: 'backwards' }).then(() => {
    card.style.visibility = '';
    copy.remove();
  });
}
