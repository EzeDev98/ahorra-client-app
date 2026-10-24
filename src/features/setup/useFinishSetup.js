import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { setupStatus } from './setupStatus.js';

export default function useFinishSetup(homeTo) {
  const navigate = useNavigate();
  return useCallback(() => {
    setupStatus.markComplete();
    navigate(homeTo, { replace: true });
  }, [navigate, homeTo]);
}
