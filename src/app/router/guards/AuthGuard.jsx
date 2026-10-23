import { useSyncExternalStore } from 'react';
import { Navigate } from 'react-router';
import { sessionManager } from '@features/auth/session/sessionManager.js';

export default function AuthGuard({ redirectTo, sessionEndedTo, children }) {
  const signedIn = useSyncExternalStore(sessionManager.subscribe, sessionManager.hasSession);
  if (signedIn) return children;
  return <Navigate to={sessionManager.getEndedReason() ? sessionEndedTo : redirectTo} replace />;
}
