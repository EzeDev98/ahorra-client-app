import { TriangleAlert } from 'lucide-react';
import Button from '@shared/components/ui/Button.jsx';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import AppLogo from '@shared/components/branding/AppLogo.jsx';
import './SystemScreen.css';

export default function SomethingWentWrong({ onRetry }) {
  return (
    <ScreenContainer className="system-screen" role="alert">
      <AppLogo className="system-screen__logo" />
      <EmptyState
        icon={TriangleAlert}
        title="Something went wrong"
        description="Ahorra ran into a problem. Your entries are safe on the server."
        action={onRetry && <Button onClick={onRetry}>Try again</Button>}
      />
    </ScreenContainer>
  );
}
