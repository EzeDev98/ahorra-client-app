import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { msUntilGate } from './gate.js';

export default function useGateWatch(status) {
  const queryClient = useQueryClient();
  const hardGateTime = status && !status.gated && status.pending?.length > 0 ? status.hardGateTime : null;

  useEffect(() => {
    const wait = msUntilGate(hardGateTime);
    if (wait === null) return undefined;
    const timer = setTimeout(() => queryClient.invalidateQueries({ queryKey: queryKeys.day.status() }), wait);
    return () => clearTimeout(timer);
  }, [hardGateTime, queryClient]);
}
