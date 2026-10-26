import { useCallback, useEffect, useRef, useState } from 'react';

const TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

const pickType = () => TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';

export const voiceSupported = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined';

export default function useVoiceRecorder({ maxSeconds, onComplete }) {
  const [recording, setRecording] = useState(false);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);
  const discard = useRef(false);
  const complete = useRef(onComplete);

  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);

  const stop = useCallback(() => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }, []);

  const cancel = useCallback(() => {
    discard.current = true;
    stop();
  }, [stop]);

  const start = useCallback(async () => {
    const media = await navigator.mediaDevices.getUserMedia({ audio: true });
    const type = pickType();
    const rec = type ? new MediaRecorder(media, { mimeType: type }) : new MediaRecorder(media);
    chunks.current = [];
    discard.current = false;

    rec.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    rec.onstop = () => {
      clearTimeout(timer.current);
      media.getTracks().forEach((track) => track.stop());
      recorder.current = null;
      setRecording(false);
      if (!discard.current && chunks.current.length > 0) {
        complete.current(new Blob(chunks.current, { type: rec.mimeType || type || 'audio/webm' }));
      }
      chunks.current = [];
    };

    rec.start();
    recorder.current = rec;
    setRecording(true);
    timer.current = setTimeout(() => {
      if (rec.state === 'recording') rec.stop();
    }, maxSeconds * 1000);
  }, [maxSeconds]);

  useEffect(
    () => () => {
      discard.current = true;
      clearTimeout(timer.current);
      if (recorder.current?.state === 'recording') recorder.current.stop();
    },
    [],
  );

  return { recording, start, stop, cancel };
}
