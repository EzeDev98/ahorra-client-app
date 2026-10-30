import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';

export default function useCurrentIncome() {
  const query = useQuery({ queryKey: queryKeys.income.current(), queryFn: incomeApi.get });

  return {
    income: query.data,
    isPending: query.isPending,
    loadFailed: query.isError && query.data === undefined,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
