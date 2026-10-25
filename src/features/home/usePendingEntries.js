import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@core/data/queryKeys.js";
import { entriesApi } from "./api/entriesApi.js";

export default function usePendingEntries() {
  const query = useQuery({
    queryKey: queryKeys.entries.pending(),
    queryFn: entriesApi.listPending,
    staleTime: 0,
  });
  return {
    entries: query.data,
    loadFailed: query.isError && !query.data,
    retrying: query.isFetching,
    retry: () => query.refetch(),
  };
}
