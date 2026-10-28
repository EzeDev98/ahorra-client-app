import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ArrowUp, Check, Mic, X } from 'lucide-react';
import { invalidateEntryData } from '@core/data/queryClient.js';
import { ApiError } from '@core/http/httpClient.js';
import IconButton from '@shared/components/ui/IconButton.jsx';
import useNetwork, { OFFLINE_MESSAGE } from '@shared/hooks/useNetwork.js';
import TextField from '@shared/components/ui/TextField.jsx';
import { entriesApi, newClientRequestId } from './api/entriesApi.js';
import { voiceApi } from './api/voiceApi.js';
import {
  BUSY_PLACEHOLDER,
  ENTRY_MAX_LENGTH,
  GATED_PLACEHOLDER,
  GENERIC_ERROR,
  LABELS,
  PLACEHOLDER,
  VOICE,
} from './composerContent.js';
import useVoiceRecorder, { voiceSupported } from './useVoiceRecorder.js';

export default function Composer({ gated = false }) {
  const [text, setText] = useState('');
  const [hint, setHint] = useState('');
  const input = useRef(null);
  const { online } = useNetwork();

  const attempt = useRef(null);

  const capture = useMutation({ mutationFn: entriesApi.capture });
  const busy = capture.isPending;
  const transcribe = useMutation({ mutationFn: voiceApi.transcribe });
  const transcribing = transcribe.isPending;
  const fromVoice = useRef(false); 

  const listen = async (blob) => {
    try {
      const { text: heard } = await transcribe.mutateAsync(blob);
      fromVoice.current = true;
      attempt.current = null;
      setText(String(heard ?? '').slice(0, ENTRY_MAX_LENGTH));
      setHint(VOICE.review);
    } catch (error) {
      if (!(error instanceof ApiError)) setHint(GENERIC_ERROR);
      else if (!error.isGated) setHint(error.message);
    }
    input.current?.focus();
  };
  const recorder = useVoiceRecorder({ maxSeconds: VOICE.maxSeconds, onComplete: listen });
  const canListen = voiceSupported() && online && !gated && !busy && !transcribing;

  const startListening = async () => {
    setHint('');
    try {
      await recorder.start();
    } catch (error) {
      setHint(error?.name === 'NotAllowedError' || error?.name === 'SecurityError' ? VOICE.blocked : VOICE.failed);
    }
  };
  const hasText = text.trim().length > 0;
  const placeholder =
    (busy && BUSY_PLACEHOLDER) ||
    (transcribing && VOICE.transcribing) ||
    (recorder.recording && VOICE.listening) ||
    (gated && GATED_PLACEHOLDER) ||
    PLACEHOLDER;
  const shownHint = !online ? OFFLINE_MESSAGE : recorder.recording ? VOICE.listeningHint : hint; 

  const onChange = (event) => {
    setText(event.target.value);
    if (!event.target.value) fromVoice.current = false;
    if (hint) setHint('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const entry = text.trim();
    if (!entry || busy || gated || !online) return;

    if (attempt.current?.text !== entry) attempt.current = { text: entry, id: newClientRequestId() };
    setHint('');

    try {
      await capture.mutateAsync({
        text: entry,
        source: fromVoice.current ? 'VOICE' : 'TEXT',
        clientRequestId: attempt.current.id,
      });
      attempt.current = null;
      fromVoice.current = false;
      setText('');
      invalidateEntryData();
    } catch (error) {
      if (!(error instanceof ApiError)) setHint(GENERIC_ERROR);
      else if (!error.isGated) setHint(error.message);
    }
    input.current?.focus();
  };

  return (
    <form className="home__composer" autoComplete="off" aria-busy={busy} onSubmit={submit}>
      <TextField
        inputRef={input}
        aria-label={LABELS.input}
        placeholder={placeholder}
        enterKeyHint="send"
        maxLength={ENTRY_MAX_LENGTH}
        readOnly={busy || transcribing || recorder.recording}
        disabled={gated}
        value={busy ? '' : text}
        onChange={onChange}
        trailing={
          recorder.recording ? (
            <>
              <IconButton icon={X} type="button" label={VOICE.cancel} onClick={recorder.cancel} />
              <IconButton icon={Check} type="button" label={VOICE.stop} onClick={recorder.stop} />
            </>
          ) : hasText && !busy && !gated ? (
            <IconButton icon={ArrowUp} type="submit" label={LABELS.send} disabled={!online} />
          ) : (
            <IconButton
              icon={Mic}
              type="button"
              label={voiceSupported() ? LABELS.mic : VOICE.unavailable}
              onClick={startListening}
              disabled={!canListen}
            />
          )
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
