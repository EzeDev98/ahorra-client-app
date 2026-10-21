import { useState } from 'react';
import './Install.css';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import { DONE_EMOJI, HANDOFF_COPY, HANDOFF_PLACE, PHONE_EMOJI } from './installContent.js';
import PhoneFeed from './PhoneFeed.jsx';

const CLOSE_FALLBACK_MS = 400;

export default function InstallHandoff({ platform }) {
  const [closeBlocked, setCloseBlocked] = useState(false);
  const place = HANDOFF_PLACE[platform] ?? HANDOFF_PLACE.android;

  const handleContinue = () => {
    window.close();
    setTimeout(() => setCloseBlocked(true), CLOSE_FALLBACK_MS);
  };

  return (
    <FormScreen
      className="install-card"
      hero={closeBlocked ? <span className="install__hero" aria-hidden="true">{DONE_EMOJI}</span> : <PhoneFeed />}
      title={closeBlocked ? HANDOFF_COPY.doneTitle : HANDOFF_COPY.installingTitle}
      description={HANDOFF_COPY.description(place)}
      footer={
        closeBlocked ? undefined : (
          <Button block onClick={handleContinue}>
            {HANDOFF_COPY.continue}
          </Button>
        )
      }
    >
      <InfoBanner emoji={PHONE_EMOJI}>{HANDOFF_COPY.banner(place)}</InfoBanner>
      {closeBlocked && <p className="install__footnote">{HANDOFF_COPY.closeNote}</p>}
    </FormScreen>
  );
}
