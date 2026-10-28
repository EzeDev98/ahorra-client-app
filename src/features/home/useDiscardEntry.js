import { useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@core/http/httpClient.js";
import { queryKeys } from "@core/data/queryKeys.js";
import { useToast } from "@shared/components/ui/toastContext.js";
import { entriesApi } from "./api/entriesApi.js";
import { DISCARD_COPY } from "./pendingContent.js";

const UNDO_MS = 6000;

export default function useDiscardEntry() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.day.status() });
    queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
  };
  const undo = async (entry) => {
    try {
       await entriesApi.restore(entry.id);
    } catch {
      toast.show(DISCARD_COPY.restoreFailed, { tone: "error" });
      return;
    }
    refresh();
  };
  
  return async function discard(entry, leave, { onError } = {}) {
    try {
      await entriesApi.discard(entry.id);
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.isGated || error.isNotFound || error.isConflict)
      ) {
        queryClient.invalidateQueries({ queryKey: queryKeys.day.status() });
      } else {
        const message =
          error instanceof ApiError && error.status === 400
            ? error.message
            : DISCARD_COPY.failed;
        if (onError) onError(message);
        else toast.show(message, { tone: "error" });
      }
      return false;
    }
    await leave?.();
    queryClient.setQueryData(
      queryKeys.day.status(),
      (status) =>
        status && {
          ...status,
          pending: status.pending.filter(
            (item) => String(item.id) !== String(entry.id),
          ),
        },
    );
    refresh();
    toast.show(DISCARD_COPY.discarded, {
      action: { label: DISCARD_COPY.undo, onClick: () => undo(entry) },
      duration: UNDO_MS,
    });
    return true;
  };
}
