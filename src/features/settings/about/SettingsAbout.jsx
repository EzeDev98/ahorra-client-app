import { useNavigate } from 'react-router';
import './SettingsAbout.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Card from '@shared/components/ui/Card.jsx';
import DetailRow from '@shared/components/ui/DetailRow.jsx';
import { ABOUT_COPY } from './aboutContent.js';

export default function SettingsAbout({ backTo }) {
  const navigate = useNavigate();

  return (
    <ScreenContainer>
      <PageHeader title={ABOUT_COPY.title} onBack={() => navigate(backTo)} />
      <div className="settings-about">
        <p className="settings-about__tagline">{ABOUT_COPY.tagline}</p>
        <Card>
          <DetailRow label={ABOUT_COPY.appName}>
            {ABOUT_COPY.version} {typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0'}
          </DetailRow>
        </Card>
        <h2 className="settings-about__heading">{ABOUT_COPY.legalTitle}</h2>
        {ABOUT_COPY.documents.map((doc) => (
          <Card key={doc.key}>
            <h3 className="settings-about__doc-title">{doc.title}</h3>
            {doc.body.map((paragraph) => (
              <p key={paragraph} className="settings-about__text">
                {paragraph}
              </p>
            ))}
          </Card>
        ))}
      </div>
    </ScreenContainer>
  );
}
