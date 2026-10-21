import { useEffect, useRef, useState } from 'react';
import Modal from '@shared/components/ui/Modal.jsx';
import Button from '@shared/components/ui/Button.jsx';
import { appUpdate, CHECK_EVERY_MS, useAppUpdate } from '@core/pwa/appUpdate.js';

export default function UpdatePrompt() {
  const { latest } = useAppUpdate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const shownBefore = useRef(false);

  useEffect(() => {
    if (!latest || open) return undefined;
    const timer = setTimeout(() => setOpen(true), shownBefore.current ? CHECK_EVERY_MS : 0);
    return () => clearTimeout(timer);
  }, [latest, open]);

  if (!latest || !open) return null;

  const later = () => {
    shownBefore.current = true;
    setOpen(false);
  };
  const install = async () => {
    setBusy(true);
    await appUpdate.install();
  };

  return (
    <Modal
      open
      onClose={later}
      title="Update available"
      footer={
        <>
          <Button variant="ghost" onClick={later}>
            Later
          </Button>
          <Button busy={busy} onClick={install}>
            Update now
          </Button>
        </>
      }
    >
      <p>A new version of Ahorra is ready. Updating takes a few seconds and signs you out, so you will sign in again.</p>
    </Modal>
  );
}
