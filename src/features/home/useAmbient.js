import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@core/data/queryKeys.js';
import { reportApi } from '@features/reports/api/reportApi.js';

export default function useAmbient({ enabled }) {
  const query = useQuery({ queryKey: queryKeys.report.ambient(), queryFn: reportApi.getAmbient, staleTime: 0, enabled });

  return {
    ambient: query.data,
    failed: query.isError && !query.data,
    retry: () => query.refetch(),
  };
}
