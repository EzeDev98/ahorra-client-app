import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { dayApi } from './api/dayApi.js';

export default function useDayStatus() {
  const query = useQuery({ queryKey: queryKeys.day.status(), queryFn: dayApi.getStatus, staleTime: 0 });

  return {
    status: query.data,
    loadFailed: query.isError && !query.data,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
