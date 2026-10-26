import { useState } from "react";
import { useNavigate } from "react-router";
import "./SidePanel.css";
import { sessionManager } from "@features/auth/session/sessionManager.js";
import Button from "@shared/components/ui/Button.jsx";
import Drawer from "@shared/components/ui/Drawer.jsx";
import { NAV_ITEMS, PANEL_COPY } from "./sidePanelContent.js";

export default function SidePanel({ open, destinations, onClose }) {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const go = (to) => {
    onClose();
    navigate(to);
  };

  const signOut = () => {
    if (leaving) return;
    setLeaving(true);
    sessionManager.signOut();
  };
  return (
    <Drawer
      open={open}
      onClose={onClose}
      footer={
        <Button variant="secondary" block busy={leaving} onClick={signOut}>
          {PANEL_COPY.signOut}
        </Button>
      }
    >
      <nav className="side-panel__nav" aria-label={PANEL_COPY.navLabel}>
        {NAV_ITEMS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className="side-panel__link"
            onClick={() => go(destinations[key])}
          >
            {label}
          </button>
        ))}
      </nav>
    </Drawer>
  );
}
