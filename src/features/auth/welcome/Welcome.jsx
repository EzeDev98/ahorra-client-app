import { useNavigate } from 'react-router';
import './Welcome.css';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import { DESCRIPTION, TITLE } from './welcomeContent.js';

export default function Welcome({ registerTo, loginTo }) {
  const navigate = useNavigate();
  
  return (
    <ScreenContainer className="welcome">
      <div className="ui-screen__bar" aria-hidden="true" />
      <div className="ui-screen__group">
        <div className="welcome__body">
          <div className="welcome__text">
            <h1 className="welcome__title">{TITLE}</h1>
            <p className="welcome__description">{DESCRIPTION}</p>
          </div>
        </div>
        <div className="welcome__footer">
          <Button block onClick={() => navigate(registerTo)}>
            Create account
          </Button>
          <Button block variant="secondary" onClick={() => navigate(loginTo)}>
            Sign in
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
}
