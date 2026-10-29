import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';

export default function useVariance() {
  const query = useQuery({ queryKey: queryKeys.income.variance(), queryFn: () => incomeApi.getVariance(), staleTime: 0 });
  const notFound = query.isError && Boolean(query.error?.isNotFound);

  return {
    variance: query.data,
    isPending: query.isPending,
    notFound,
    loadFailed: query.isError && !query.data && !notFound,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
