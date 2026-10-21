import { useEffect, useState } from 'react';
import { readTokenMs } from '@shared/utils/cssTime.js';

export default function usePresence(open) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
    }

    setVisible(false);
    const timer = setTimeout(() => setMounted(false), readTokenMs('--motion-base'));
    return () => clearTimeout(timer);
  }, [open]);

  return { mounted, visible };
}
