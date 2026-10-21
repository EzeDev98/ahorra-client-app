import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router';
import Button from '@shared/components/ui/Button.jsx';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import AppLogo from '@shared/components/branding/AppLogo.jsx';
import './SystemScreen.css';

export default function NotFound({ to }) {
  const navigate = useNavigate();
  return (
    <ScreenContainer className="system-screen">
      <AppLogo className="system-screen__logo" />
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="This page does not exist or has moved."
        action={<Button onClick={() => navigate(to, { replace: true })}>Go back</Button>}
      />
    </ScreenContainer>
  );
}
