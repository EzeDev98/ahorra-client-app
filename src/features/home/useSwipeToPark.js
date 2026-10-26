import { useRef } from 'react';
import { run } from '@core/motion/motion.js';

const START = 6;
const THRESHOLD = 80; 
const FLICK_SPEED = 0.5; 
const FLICK_MIN = 24;
const FADE_DISTANCE = 400; 
const FADE_MAX = 0.35; 
const SAMPLE_WINDOW = 100; 

export default function useSwipeToPark({ enabled, onPark, onBlocked }) {
  const drag = useRef(null);
  const swallowClick = useRef(false);

  if (!enabled) return {};

  const finish = (event, cancelled) => {
    const current = drag.current;
    drag.current = null;
    if (!current?.active) return;

    swallowClick.current = true;
    setTimeout(() => {
      swallowClick.current = false;
    }, 50);

    const element = event.currentTarget;
    const distance = Math.hypot(current.dx, current.dy);
    const recent = current.samples.filter((sample) => performance.now() - sample.t <= SAMPLE_WINDOW);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const elapsed = first && last ? last.t - first.t : 0;
    const speed = elapsed > 0 ? Math.hypot(last.x - first.x, last.y - first.y) / elapsed : 0;

    if (!cancelled && (distance > THRESHOLD || (speed > FLICK_SPEED && distance > FLICK_MIN))) {
      if (!onBlocked) {
        onPark();
        return;
      }
      onBlocked(); 
    }

    const fromTransform = element.style.transform || 'none';
    const fromOpacity = element.style.opacity || '1';
    element.style.transform = '';
    element.style.opacity = '';
    run(element, [{ transform: fromTransform, opacity: fromOpacity }, { transform: 'none', opacity: 1 }], {
      duration: 'base',
      ease: 'out',
    });
  };

  return {
    onPointerDown(event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('button, input, textarea, a')) return; 
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, active: false, samples: [] };
    },

    onPointerMove(event) {
      const current = drag.current;
      if (!current || current.id !== event.pointerId) return;

      const dx = event.clientX - current.x;
      const dy = event.clientY - current.y;
      const distance = Math.hypot(dx, dy);
      if (!current.active) {
        if (distance < START) return;
        current.active = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      current.dx = dx;
      current.dy = dy;
      current.samples.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      if (current.samples.length > 8) current.samples.shift();

      event.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`;
      event.currentTarget.style.opacity = String(1 - Math.min(distance / FADE_DISTANCE, FADE_MAX));
    },

    onPointerUp: (event) => finish(event, false),
    onPointerCancel: (event) => finish(event, true),

    onClickCapture(event) {
      if (swallowClick.current) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
  };
}
