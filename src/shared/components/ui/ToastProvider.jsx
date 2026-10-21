import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast.jsx';
import { ToastContext } from './toastContext.js';
import { readTokenMs } from '@shared/utils/cssTime.js';

const DURATION = { neutral: 4000, success: 4000, error: 6000 };
const MAX_VISIBLE = 3;

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    setItems((list) => list.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
    timers.current.set(
      id,
      setTimeout(() => {
        timers.current.delete(id);
        setItems((list) => list.filter((item) => item.id !== id));
      }, readTokenMs('--motion-fast')),
    );
  }, []);

  const show = useCallback(
    (message, { tone = 'neutral', duration, action } = {}) => {
      counter.current += 1;
      const id = counter.current;
      setItems((list) => [...list, { id, message, tone, action, leaving: false }].slice(-MAX_VISIBLE));
      timers.current.set(id, setTimeout(() => dismiss(id), duration ?? DURATION[tone] ?? DURATION.neutral));
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const value = useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="ui-toasts" aria-live="polite">
          {items.map((item) => (
            <Toast
              key={item.id}
              tone={item.tone}
              message={item.message}
              action={item.action}
              leaving={item.leaving}
              onDismiss={() => dismiss(item.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
