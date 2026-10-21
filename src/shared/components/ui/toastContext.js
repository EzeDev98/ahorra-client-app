import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

// const toast = useToast();
// toast.show('Saved');                          neutral
// toast.show('Could not save', { tone: 'error' });  tones: 'neutral' | 'success' | 'error'
// toast.show('Saved', { duration: 2000 });      milliseconds
// toast.show('Discarded', { action: { label: 'Undo', onClick } });  one button; pressing it also closes the toast
// toast.dismiss(id) closes one early; show() returns the id.
export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>.');
  return value;
}
