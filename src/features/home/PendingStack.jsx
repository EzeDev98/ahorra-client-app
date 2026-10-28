import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { flip, run } from '@core/motion/motion.js';
import Button from '@shared/components/ui/Button.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import EditEntrySheet from './EditEntrySheet.jsx';
import PendingCard from './PendingCard.jsx';
import useConfirmEntry from './useConfirmEntry.js';
import useDiscardEntry from './useDiscardEntry.js';
import { flyFromBell, flyToBell, pulseBell } from './flyToBell.js';
import { parkedEntries } from './parkedEntries.js';
import { STACK_COPY } from './pendingContent.js';

const ENTER = [
  { opacity: 0, transform: 'translateY(-12px) scale(.98)' },
  { opacity: 1, transform: 'none' },
];

const LEAVE = [
  { opacity: 1, transform: 'none' },
  { opacity: 0, transform: 'scale(.96)' },
];

const SHAKE = [
  { transform: 'translateX(0)' },
  { transform: 'translateX(-6px)' },
  { transform: 'translateX(5px)' },
  { transform: 'translateX(0)' },
];

export default function PendingStack({ entries, gated, note, loadFailed, retrying, onRetry }) {
  const list = useRef(null);
  const [shown, setShown] = useState([]);
  const known = useRef(null); 
  const confirmEntry = useConfirmEntry();
  const discardEntry = useDiscardEntry();
  const inFlight = useRef(new Set()); 
  const [confirming, setConfirming] = useState([]);
  const [discarding, setDiscarding] = useState([]); 
  const [editing, setEditing] = useState(null); 
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0); 
  const noteRef = useRef(null);
  const [noteText, setNoteText] = useState(null); 

  const edit = (entry) => {
    setEditing(entry);
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const confirm = async (entry, edits, onError) => {
    const id = String(entry.id);
    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setConfirming((current) => [...current, id]);

    const confirmed = await confirmEntry(
      entry,
      () => {
        setSheetOpen(false); 
        const card = list.current?.querySelector(`[data-entry-id="${CSS.escape(id)}"]`);
        return card ? run(card, LEAVE, { fill: 'forwards' }) : undefined;
      },
      { edits, onError },
    );

    if (!confirmed) {
      inFlight.current.delete(id);
      setConfirming((current) => current.filter((item) => item !== id));
    }
  };

  const discard = async (entry, onError) => {
    const id = String(entry.id);
    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setDiscarding((current) => [...current, id]);

    const discarded = await discardEntry(
      entry,
      () => {
        setSheetOpen(false);
        const card = list.current?.querySelector(`[data-entry-id="${CSS.escape(id)}"]`);
        return card ? run(card, LEAVE, { fill: 'forwards' }) : undefined;
      },
      { onError },
    );

    if (!discarded) {
      inFlight.current.delete(id);
      setDiscarding((current) => current.filter((item) => item !== id));
    }
  };

  const later = (entry) => {
    const id = String(entry.id);
    if (gated || parkedEntries.getSnapshot().parked.has(id)) return;
    const card = list.current?.querySelector(`[data-entry-id="${CSS.escape(id)}"]`);
    const bell = document.querySelector('[data-bell]');
    const flight = card && bell ? flyToBell(card, bell) : Promise.resolve();
    parkedEntries.park(id);
    flight.then(() => {
      parkedEntries.settle(id);
      if (bell) pulseBell(bell);
    });
  };

  const shakeNote = () => {
    if (noteRef.current) run(noteRef.current, SHAKE, { duration: 'base', ease: 'standard' });
  };

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || !list.current) return;
      flip(list.current, () => flushSync(() => setNoteText(note)));
    });
    return () => {
      cancelled = true;
    };
  }, [note]);

  useEffect(() => {
    const element = list.current;
    if (!element) return undefined;
    const update = () => {
      element.dataset.scrolls = String(element.scrollHeight > element.clientHeight + 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [shown]);

  useEffect(() => {
    if (!entries) return undefined;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled || !list.current) return;
      const next = [...entries].reverse();
      const fresh = known.current ? next.filter((entry) => !known.current.has(String(entry.id))) : [];
      known.current = new Set(next.map((entry) => String(entry.id)));

      flip(list.current, () => flushSync(() => setShown(next)));

      const { returning } = parkedEntries.getSnapshot();
      const bell = document.querySelector('[data-bell]');
      fresh.forEach((entry) => {
        const id = String(entry.id);
        const card = list.current?.querySelector(`[data-entry-id="${CSS.escape(id)}"]`);
        if (!card) return;
        if (bell && returning.has(id)) flyFromBell(card, bell, returning.get(id), list.current);
        else run(card, ENTER);
      });
      parkedEntries.finishReturn(fresh.map((entry) => String(entry.id)));
    });

    return () => {
      cancelled = true;
    };
  }, [entries]);

  useEffect(() => {
    if (sheetOpen && entries && editing && !entries.some((item) => String(item.id) === String(editing.id))) {
      setSheetOpen(false);
    }
  }, [entries, editing, sheetOpen]);

  return (
    <div ref={list} className="home__cards" aria-live="polite">
      {noteText && (
        <p ref={noteRef} className="home__gate-note">
          {noteText}
        </p>
      )}
      {loadFailed && (
        <InfoBanner
          tone="error"
          action={
            <Button variant="secondary" busy={retrying} onClick={onRetry}>
              {STACK_COPY.retry}
            </Button>
          }
        >
          {STACK_COPY.loadFailed}
        </InfoBanner>
      )}
      {shown.map((entry) => (
        <PendingCard
          key={entry.id}
          entry={entry}
          onConfirm={() => confirm(entry)}
          onLater={() => later(entry)}
          gated={gated}
          onGatedSwipe={shakeNote}
          onEdit={() => edit(entry)}
          busy={confirming.includes(String(entry.id)) || discarding.includes(String(entry.id))}
        />
      ))}
      {editing && (
        <EditEntrySheet
          key={sheetKey}
          entry={editing}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onConfirm={(edits, onError) => confirm(editing, edits, onError)}
          onDiscard={(onError) => discard(editing, onError)}
          busy={confirming.includes(String(editing.id))}
          discardBusy={discarding.includes(String(editing.id))}
        />
      )}
    </div>
  );
}
