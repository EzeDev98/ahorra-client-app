import { useEffect, useState } from 'react';

const secondsLeft = (until) => (until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0);

export default function useCountdown(until) {
  const [seconds, setSeconds] = useState(() => secondsLeft(until));

  useEffect(() => {
    const tick = () => setSeconds(secondsLeft(until));
    tick();
    if (!until || until <= Date.now()) return undefined;
    const timer = setInterval(() => {
      tick();
      if (Date.now() >= until) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [until]);

  return seconds;
}
