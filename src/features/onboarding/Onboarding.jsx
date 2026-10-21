import { ArrowRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router';
import './Onboarding.css';
import { isPWAInstalled } from '@core/pwa/isPWAInstalled.js';
import AppLogo from '@shared/components/branding/AppLogo.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import Card from '@shared/components/ui/Card.jsx';
import EmojiTile from '@shared/components/ui/EmojiTile.jsx';
import { DEMO, FEATURES, HEADLINE, SUBLINE } from './onboardingContent.js';

export default function Onboarding({ installTo, welcomeTo }) {
  const navigate = useNavigate();

  if (isPWAInstalled()) return <Navigate to={welcomeTo} replace />;

  return (
    <ScreenContainer className="onboarding">
      <div className="ui-screen__bar" aria-hidden="true" />
      <div className="ui-screen__group">
        <AppLogo size="lg" className="onboarding__logo" />
        <header className="onboarding__head">
          <h1 className="onboarding__headline">{HEADLINE}</h1>
          <p className="onboarding__subline">{SUBLINE}</p>
        </header>
        <div className="onboarding__demo" aria-hidden="true">
          <div className="onboarding__say">
            <span>{DEMO.entryEmoji}</span>
            <span className="onboarding__typed">{DEMO.entry}</span>
          </div>
          <Card className="onboarding__result">
            <EmojiTile emoji={DEMO.resultEmoji} />
            <div className="onboarding__result-text">
              <p>{DEMO.label}</p>
              <p className="onboarding__result-note">{DEMO.note}</p>
            </div>
            <p className="onboarding__amount">{DEMO.amount}</p>
            <span className="onboarding__confirm">{DEMO.confirm}</span>
          </Card>
        </div>
        <ul className="onboarding__features">
          {FEATURES.map(({ id, emoji, title, description }, index) => (
            <Card as="li" key={id} className="onboarding__feature" style={{ '--i': index }}>
              <EmojiTile emoji={emoji} />
              <div>
                <p className="onboarding__feature-title">{title}</p>
                <p className="onboarding__feature-text">{description}</p>
              </div>
            </Card>
          ))}
        </ul>
        <div className="onboarding__footer">
          <Button block onClick={() => navigate(installTo)}>
            Get started
            <ArrowRight className="onboarding__arrow" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
