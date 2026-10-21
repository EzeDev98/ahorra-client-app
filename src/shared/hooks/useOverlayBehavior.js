import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const stack = [];
let scrollLocks = 0;

const lockScroll = () => {
  if (scrollLocks++ === 0) document.body.style.overflow = 'hidden';
};
const unlockScroll = () => {
  if (--scrollLocks === 0) document.body.style.overflow = '';
};

export default function useOverlayBehavior({ active, containerRef, onClose }) {
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const token = Symbol('overlay');
    const previous = document.activeElement;
    stack.push(token);
    lockScroll();

    const target =
      container.querySelector('[data-autofocus]') || container.querySelector(FOCUSABLE) || container;
    target.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (stack[stack.length - 1] !== token) return;

      if (event.key === 'Escape') {
        closeRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = [...container.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const inside = container.contains(document.activeElement);

      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const index = stack.indexOf(token);
      if (index !== -1) stack.splice(index, 1);
      unlockScroll();
      if (previous instanceof HTMLElement && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef]);
}
