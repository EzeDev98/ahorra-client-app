import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@core/http/httpClient.js';

function shouldRetry(failureCount, error) {
  if (!(error instanceof ApiError)) return false;
  return (error.isNetwork || error.status >= 500) && failureCount < 2;
}

export const queryClient = new QueryClient({
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
    predicate: (query) => ['entries'].includes(query.queryKey[0]),
  });
}

export function clearQueryData() {
  queryClient.cancelQueries();
  queryClient.clear();
}
