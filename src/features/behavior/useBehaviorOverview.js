import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { behaviorApi } from './api/behaviorApi.js';

export default function useBehaviorOverview() {
  const query = useQuery({ queryKey: queryKeys.behavior.overview(), queryFn: behaviorApi.getOverview, staleTime: 0 });

  return {
    overview: query.data,
    isPending: query.isPending,
    loadFailed: query.isError && !query.data,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
