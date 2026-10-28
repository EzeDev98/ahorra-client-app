import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { reportApi } from './api/reportApi.js';

const DAY = /^\d{4}-\d{2}-\d{2}$/;

export default function useReportDetail(date) {
  const valid = DAY.test(date ?? '');
  const query = useQuery({ queryKey: queryKeys.report.detail(date), queryFn: () => reportApi.getDaily(date), enabled: valid });
  const notFound = !valid || (query.isError && Boolean(query.error?.isNotFound));

  return {
    report: query.data,
    isPending: valid && query.isPending,
    notFound,
    loadFailed: query.isError && !query.data && !notFound,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
