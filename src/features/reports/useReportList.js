import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { reportApi } from './api/reportApi.js';

export default function useReportList() {
  const query = useQuery({ queryKey: queryKeys.report.list(), queryFn: () => reportApi.listDaily() });

  return {
    reports: query.data,
    isPending: query.isPending,
    loadFailed: query.isError && !query.data,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
