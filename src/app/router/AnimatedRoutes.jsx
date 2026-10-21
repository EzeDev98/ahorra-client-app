import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import './AnimatedRoutes.css';
import { run } from '@core/motion/motion.js';
import AppRoutes from './AppRoutes.jsx';

const SLIDE_PX = 16;

const slide = (px) => (px ? `translateX(${px}px)` : 'none');

export default function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const stage = useRef(null);
  const [shown, setShown] = useState(location);
  const arrival = useRef(null); 

  const direction = navigationType === 'PUSH' ? 1 : navigationType === 'POP' ? -1 : 0;

  useEffect(() => {
    if (location.pathname === shown.pathname) return undefined; 

    let cancelled = false;
    const swap = () => {
      if (cancelled) return;
      arrival.current = direction * SLIDE_PX;
      setShown(location);
    };

    const el = stage.current;
    const hasScreen = el.firstElementChild && el.getAnimations().length === 0;
    if (hasScreen) {
      run(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: slide(-direction * SLIDE_PX) }], {
        duration: 'fast',
        ease: 'standard',
        fill: 'forwards',
      }).then(swap);
    } else {
      swap();
    }

    return () => {
      cancelled = true;
    };
  }, [location, shown, direction]);

  useLayoutEffect(() => {
    if (arrival.current === null) return; 
    const from = arrival.current;
    arrival.current = null;

    const el = stage.current;
    el.getAnimations().forEach((animation) => animation.cancel());
    window.scrollTo(0, 0);

    const heading = el.querySelector('h1');
    if (heading && !el.contains(document.activeElement)) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    run(el, [{ opacity: 0, transform: slide(from) }, { opacity: 1, transform: 'none' }], { duration: 'base', ease: 'out' });
  }, [shown]);

  return (
    <div ref={stage} className="route-stage">
      <AppRoutes location={shown} />
    </div>
  );
}
