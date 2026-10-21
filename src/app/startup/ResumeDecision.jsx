import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { decideRoute } from './decideRoute.js';

export default function ResumeDecision() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      const destination = await decideRoute({ launching: false, pathname });
      if (destination && destination !== window.location.pathname) navigate(destination, { replace: true, state: { from: pathname } });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [navigate, pathname]);

  return null;
}
