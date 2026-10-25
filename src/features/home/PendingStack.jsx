import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flip, run } from "@core/motion/motion.js";
import Button from "@shared/components/ui/Button.jsx";
import InfoBanner from "@shared/components/ui/InfoBanner.jsx";
import PendingCard from "./PendingCard.jsx";
import { STACK_COPY } from "./pendingContent.js";

const ENTER = [
  { opacity: 0, transform: "translateY(-12px) scale(.98)" },
  { opacity: 1, transform: "none" },
];

export default function PendingStack({
  entries,
  loadFailed,
  retrying,
  onRetry,
}) {
  const list = useRef(null);
  const [shown, setShown] = useState([]);
  const known = useRef(null);
  useEffect(() => {
    if (!entries) return undefined;
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled || !list.current) return;
      const next = [...entries].reverse();
      const fresh = known.current
        ? next.filter((entry) => !known.current.has(String(entry.id)))
        : [];
      known.current = new Set(next.map((entry) => String(entry.id)));
      flip(list.current, () => flushSync(() => setShown(next)));
      fresh.forEach((entry) => {
        const id = String(entry.id);
        const card = list.current?.querySelector(
          `[data-entry-id="${CSS.escape(id)}"]`,
        );
        if (card) run(card, ENTER);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [entries]);
  return (
    <div ref={list} className="home__cards" aria-live="polite">
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
        <PendingCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
