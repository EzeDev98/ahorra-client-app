import { useSyncExternalStore } from 'react';
import { Navigate, useLocation } from 'react-router';
import { lockState } from '@features/lock/lockState.js';

export default function UnlockGuard({ redirectTo, children }) {
  const location = useLocation();
  const locked = useSyncExternalStore(lockState.subscribe, lockState.isLocked);
  return locked ? <Navigate to={redirectTo} replace state={{ from: location.pathname + location.search }} /> : children;
}
