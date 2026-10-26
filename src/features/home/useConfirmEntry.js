import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@core/http/httpClient.js";
import { queryKeys } from "@core/data/queryKeys.js";
import { useToast } from "@shared/components/ui/toastContext.js";
import { entriesApi } from "./api/entriesApi.js";
import { CONFIRM_COPY } from "./pendingContent.js";

export default function useConfirmEntry() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return async function confirm(entry, leave, { edits, onError } = {}) {
    try {
      await entriesApi.confirm(entry.id, edits);
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.isGated || error.isNotFound || error.isConflict)
      ) {
        queryClient.invalidateQueries({ queryKey: queryKeys.day.status() });
      } else if (onError) {
        onError(
          error instanceof ApiError && error.status === 400
            ? error.message
            : CONFIRM_COPY.failed,
        );
      } else {
        toast.show(CONFIRM_COPY.failed, { tone: "error" });
      }
      return false;
    }

    await leave?.();

    queryClient.setQueryData(
      queryKeys.entries.pending(),
      (entries) =>
        entries &&
        entries.filter((item) => String(item.id) !== String(entry.id)),
    );
    queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
    return true;
  };
}
