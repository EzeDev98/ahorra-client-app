import { MonitorX } from 'lucide-react';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import AppLogo from '@shared/components/branding/AppLogo.jsx';
import '@shared/components/feedback/SystemScreen.css';

const MESSAGES = {
  'desktop-firefox': {
    title: 'This browser cannot install Ahorra',
    description: 'Ahorra is an installed app, and Firefox on desktop cannot install web apps. Open this page in Chrome or Edge.',
  },
  'colors-desktop': {
    title: 'Please update your browser',
    description: 'Ahorra needs a newer browser than this one. Update it, or open this page in Chrome or Edge.',
  },
  'colors-mobile': {
    title: 'Please update your browser',
    description: 'Ahorra needs iOS 17.5 or newer, or Chrome 123 or newer. Update, then open Ahorra again.',
  },
};

export default function DeviceNotSupported({ reason, desktop }) {
  const { title, description } = MESSAGES[reason === 'colors' ? `colors-${desktop ? 'desktop' : 'mobile'}` : reason];
  return (
    <ScreenContainer className="system-screen" role="alert">
      <AppLogo className="system-screen__logo" />
      <EmptyState icon={MonitorX} title={title} description={description} />
    </ScreenContainer>
  );
}
