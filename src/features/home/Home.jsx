import { useEffect, useMemo, useState } from "react";
import { Bell, Menu } from "lucide-react";
import "./Home.css";
import Badge from "@shared/components/ui/Badge.jsx";
import IconButton from "@shared/components/ui/IconButton.jsx";
import Composer from "./Composer.jsx";
import { BELL_LABEL } from "./pendingContent.js";
import { parkedEntries, useParked } from "./parkedEntries.js";
import PendingStack from "./PendingStack.jsx";
import SidePanel from "./SidePanel.jsx";
import useBellPeek from "./useBellPeek.js";
import usePendingEntries from "./usePendingEntries.js";

export default function Home({ destinations }) {
  const { entries: pending, loadFailed, retrying, retry } = usePendingEntries();
  const parked = useParked();
  const peek = useBellPeek();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => parkedEntries.attach(), []);

  const visible = useMemo(
    () => pending?.filter((entry) => !parked.parked.has(String(entry.id))),
    [pending, parked.parked],
  );

  const waiting = pending
    ? pending.filter((entry) => parked.inBell.has(String(entry.id))).length
    : 0;

  const openBell = () => {
    if (parkedEntries.release().length === 0) peek.show();
  };
  return (
    <div className="home">
      <header className="home__bar">
        <IconButton
          icon={Menu}
          label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        />
        <div className="home__bell">
          <IconButton
            icon={Bell}
            label={waiting ? BELL_LABEL.waiting(waiting) : BELL_LABEL.empty}
            data-bell
            onClick={openBell}
          >
            <Badge count={waiting} floating />
          </IconButton>
          <div className="home__peek" role="status" data-visible={peek.visible}>
            {peek.mounted ? BELL_LABEL.empty : null}
          </div>
        </div>
      </header>
      <main className="home__stage">
        <Composer />
        <PendingStack
          entries={visible}
          loadFailed={loadFailed}
          retrying={retrying}
          onRetry={retry}
        />
      </main>
      <SidePanel
        open={menuOpen}
        destinations={destinations}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
}
