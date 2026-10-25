import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { invalidateEntryData } from "@core/data/queryClient.js";
import { ApiError } from "@core/http/httpClient.js";
import IconButton from "@shared/components/ui/IconButton.jsx";
import useNetwork, { OFFLINE_MESSAGE } from "@shared/hooks/useNetwork.js";
import TextField from "@shared/components/ui/TextField.jsx";
import { entriesApi, newClientRequestId } from "./api/entriesApi.js";
import {
  BUSY_PLACEHOLDER,
  ENTRY_MAX_LENGTH,
  GENERIC_ERROR,
  LABELS,
  PLACEHOLDER,
} from "./composerContent.js";

export default function Composer() {
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const input = useRef(null);
  const { online } = useNetwork();

  const attempt = useRef(null);
  const capture = useMutation({ mutationFn: entriesApi.capture });
  const busy = capture.isPending;
  const hasText = text.trim().length > 0;
  const placeholder = (busy && BUSY_PLACEHOLDER) || PLACEHOLDER;
  const shownHint = !online ? OFFLINE_MESSAGE : hint;
  const onChange = (event) => {
    setText(event.target.value);
    if (hint) setHint("");
  };
  const submit = async (event) => {
    event.preventDefault();
    const entry = text.trim();
    if (!entry || busy || !online) return;
    if (attempt.current?.text !== entry)
      attempt.current = { text: entry, id: newClientRequestId() };
    setHint("");
    try {
      await capture.mutateAsync({
        text: entry,
        source: "TEXT",
        clientRequestId: attempt.current.id,
      });
      attempt.current = null;
      setText("");
      invalidateEntryData();
    } catch (error) {
      if (!(error instanceof ApiError)) setHint(GENERIC_ERROR);
      else setHint(error.message);
    }
    input.current?.focus();
  };
  return (
    <form
      className="home__composer"
      autoComplete="off"
      aria-busy={busy}
      onSubmit={submit}
    >
      <TextField
        inputRef={input}
        aria-label={LABELS.input}
        placeholder={placeholder}
        enterKeyHint="send"
        maxLength={ENTRY_MAX_LENGTH}
        readOnly={busy}
        value={busy ? "" : text}
        onChange={onChange}
        trailing={
          hasText && !busy ? (
            <IconButton
              icon={ArrowUp}
              type="submit"
              label={LABELS.send}
              disabled={!online}
            />
          ) : null
        }
      />
      {shownHint && (
        <p className="home__hint" role="status">
          {shownHint}
        </p>
      )}
    </form>
  );
}
