import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@core/http/httpClient.js';
import { queryKeys } from './queryKeys';

function shouldRetry(failureCount, error) {
  if (!(error instanceof ApiError)) return false;
  return (error.isNetwork || error.status >= 500) && failureCount < 2;
}

function handleGated(error) {
  if (error instanceof ApiError && error.isGated) {
    queryClient.invalidateQueries({ queryKey:  queryKeys.day.all })
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleGated }),
  mutationCache: new MutationCache({ onError: handleGated }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: true, 
      refetchOnReconnect: true,
    },
    mutations: { retry: false },
  },
});

export function invalidateEntryData() {
  return queryClient.invalidateQueries({
    predicate: (query) => ['day', 'entries', 'report'].includes(query.queryKey[0]),
  });
}

export function clearQueryData() {
  queryClient.cancelQueries();
  queryClient.clear();
}
