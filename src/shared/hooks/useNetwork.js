import { useSyncExternalStore } from 'react';

export const OFFLINE_MESSAGE = 'A connection is needed. Check your network and try again.';

const subscribe = (listener) => {
  addEventListener('online', listener);
  addEventListener('offline', listener);
  return () => {
    removeEventListener('online', listener);
    removeEventListener('offline', listener);
  };
};

const getSnapshot = () => navigator.onLine;

export const isOnline = getSnapshot;

export default function useNetwork() {
  return { online: useSyncExternalStore(subscribe, getSnapshot) };
}
