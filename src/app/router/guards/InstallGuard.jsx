import { Navigate } from 'react-router';
import { env } from '@core/config/env.js';
import { isPWAInstalled } from '@core/pwa/isPWAInstalled.js';

export default function InstallGuard({ redirectTo, children }) {
  if (env.skipInstallGuard || isPWAInstalled()) return children;
  return <Navigate to={redirectTo} replace />;
}
