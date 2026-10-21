import { useEffect, useState, useSyncExternalStore } from 'react';
import { Navigate, useNavigate } from 'react-router';
import './Install.css';
import { clearInstallPrompt, getInstallState, subscribeInstall } from '@core/pwa/installPrompt.js';
import { canPromptInstall, getInstallPlatform } from '@core/pwa/installPlatform.js';
import { isPWAInstalled, isRunningAsApp } from '@core/pwa/isPWAInstalled.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import Card from '@shared/components/ui/Card.jsx';
import EmojiTile from '@shared/components/ui/EmojiTile.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import { COPY, MANUAL_STEPS } from './installContent.js';
import InstallHandoff from './InstallHandoff.jsx';
import PhoneFeed from './PhoneFeed.jsx';

const PROMPT_WAIT_MS = 10000;

export default function Install({ backTo, welcomeTo }) {
  const navigate = useNavigate();
  const [platform] = useState(getInstallPlatform);
  const { prompt, installed } = useSyncExternalStore(subscribeInstall, getInstallState);
  const promptable = canPromptInstall(platform);

  const [waitedOut, setWaitedOut] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!promptable || prompt) return undefined;
    const timer = setTimeout(() => setWaitedOut(true), PROMPT_WAIT_MS);
    return () => clearTimeout(timer);
  }, [promptable, prompt]);

  useEffect(() => {
    const query = window.matchMedia('(display-mode: standalone)');
    const onChange = (event) => {
      if (event.matches) setAccepted(true);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (isRunningAsApp()) return <Navigate to={welcomeTo} replace />;

  let phase = 'waiting';
  if (installed || accepted || isPWAInstalled()) phase = 'handoff';
  else if (!promptable) phase = 'manual';
  else if (installing) phase = 'installing';
  else if (prompt) phase = 'ready';
  else if (cancelled || waitedOut) phase = 'manual';

  const install = async () => {
    if (!prompt) return;
    setInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') setAccepted(true);
      else setCancelled(true);
    } catch {
      setCancelled(true);
    } finally {
      clearInstallPrompt(); 
      setInstalling(false);
    }
  };

  if (phase === 'handoff') return <InstallHandoff platform={platform} />;

  return (
    <FormScreen
      className="install-card"
      hero={<PhoneFeed />}
      title={COPY.title}
      description={phase === 'manual' ? COPY.manualDescription : COPY.description}
      onBack={() => navigate(backTo)}
      footer={
        phase === 'manual' ? undefined : (
          <Button block busy={phase !== 'ready'} onClick={install}>
            Install Ahorra
          </Button>
        )
      }
    >
      {phase === 'manual' && (
        <>
          {cancelled && <InfoBanner>{COPY.cancelled}</InfoBanner>}
          <ol className="install__steps">
            {MANUAL_STEPS[platform].map(({ emoji, text }, index) => (
              <Card as="li" key={text} className="install__step" style={{ '--i': index }}>
                <EmojiTile emoji={emoji} />
                <div>
                  <p className="install__step-label">Step {index + 1}</p>
                  <p className="install__step-text">{text}</p>
                </div>
              </Card>
            ))}
          </ol>
        </>
      )}
    </FormScreen>
  );
}
