import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/core/data/queryKeys.js';
import { sessionManager } from '@features/auth/session/sessionManager.js';
import { behaviorApi } from '../behavior/api/behaviorApi.js';
import { greeting } from './greeting.js';

const CLOCK_TICK_MS = 60_000;

export default function useGreeting() {

  const [now, setNow] = useState(() => new Date());
  const { data, isPending } = useQuery({ queryKey: queryKeys.behavior.overview(), queryFn: behaviorApi.getOverview });
  
  useEffect(() => {
    const tick = () => setNow(new Date());
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    const timer = setInterval(tick, CLOCK_TICK_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const name = sessionManager.getUser()?.firstName;
  const words = greeting({ name, now, mode: data?.mode, daysObserved: data?.daysObserved });
  return { title: words.title, subtitle: isPending ? '' : words.subtitle };
}
