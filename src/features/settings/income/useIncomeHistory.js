import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';

export default function useIncomeHistory() {
  const query = useQuery({ queryKey: queryKeys.income.history(), queryFn: incomeApi.getHistory });

  return {
    history: query.data,
    isPending: query.isPending,
    loadFailed: query.isError && !query.data,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
