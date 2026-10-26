import { useCallback, useEffect, useRef, useState } from 'react';
import usePresence from '@shared/hooks/usePresence.js';

const PEEK_MS = 1800;

export default function useBellPeek() {
  const [open, setOpen] = useState(false);
  const timer = useRef(0);
  const { mounted, visible } = usePresence(open);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = useCallback(() => {
    setOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), PEEK_MS);
  }, []);

  return { mounted, visible, show };
}
