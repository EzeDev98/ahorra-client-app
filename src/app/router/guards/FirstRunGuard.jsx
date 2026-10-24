import { useState } from 'react';
import { Navigate } from 'react-router';
import { setupStatus } from '@features/setup/setupStatus.js';

export default function FirstRunGuard({ redirectTo, children }) {
  const [finished] = useState(setupStatus.isComplete);
  return finished ? <Navigate to={redirectTo} replace /> : children;
}
