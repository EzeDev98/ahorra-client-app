import { useEffect, useMemo, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import './Home.css';
import Badge from '@shared/components/ui/Badge.jsx';
import IconButton from '@shared/components/ui/IconButton.jsx';
import Composer from './Composer.jsx';
import Greeting from './Greeting.jsx';
import { gateNote } from './gate.js';
import { BELL_LABEL } from './pendingContent.js';
import { parkedEntries, useParked } from './parkedEntries.js';
import PendingStack from './PendingStack.jsx';
import SidePanel from './SidePanel.jsx';
import useBellPeek from './useBellPeek.js';
import useGreeting from './useGreeting.js';
import useDayStatus from './useDayStatus.js';
import useGateWatch from './useGateWatch.js';
import ReminderNudge from './reminderNudge.jsx';

export default function Home({ destinations }) {
  const { title, subtitle } = useGreeting();
  const { status, loadFailed, retrying, retry } = useDayStatus();
  const parked = useParked();
  const peek = useBellPeek();
  const [menuOpen, setMenuOpen] = useState(false);
  const gated = Boolean(status?.gated);
  const note = gateNote(status);
  useGateWatch(status);

  useEffect(() => parkedEntries.attach(), []);

  useEffect(() => {
    if (gated) parkedEntries.releaseAll();
  }, [gated]);

  const pending = status?.pending;
  const visible = useMemo(() => pending?.filter((entry) => !parked.parked.has(String(entry.id))), [pending, parked.parked]);
  const waiting = pending ? pending.filter((entry) => parked.inBell.has(String(entry.id))).length : 0;

  const openBell = () => {
    if (parkedEntries.release().length === 0) peek.show();
  };

  return (
    <div className="home">
      <header className="home__bar">
        <IconButton icon={Menu} label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)} />
        <div className="home__bell">
          <IconButton icon={Bell} label={waiting ? BELL_LABEL.waiting(waiting) : BELL_LABEL.empty} data-bell onClick={openBell}>
            <Badge count={waiting} floating />
          </IconButton>
          <div className="home__peek" role="status" data-visible={peek.visible}>
            {peek.mounted ? BELL_LABEL.empty : null}
          </div>
        </div>
      </header>
      <main className="home__stage">
        <Greeting title={title} subtitle={subtitle} />
        <Composer gated={gated} />
        <PendingStack entries={visible} gated={gated} note={note} loadFailed={loadFailed} retrying={retrying} onRetry={retry} />
        <ReminderNudge to={destinations.reminder} />
      </main>
      <SidePanel open={menuOpen} gated={gated} destinations={destinations} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
