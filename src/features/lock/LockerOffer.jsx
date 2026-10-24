import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FROM_SETUP } from '@features/setup/setupSteps.js';
import useFinishSetup from '@features/setup/useFinishSetup.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import LoadingScreen from '@shared/components/feedback/LoadingScreen.jsx';
import { LOCK_OFFER } from './lockContent.js';
import { pinService } from './pinService.js';

export default function LockOffer({ backTo, setPinTo, homeTo }) {
  const navigate = useNavigate();
  const finish = useFinishSetup(homeTo);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    pinService.hasServerPin().then((has) => {
      if (cancelled) return;
      if (has) finish();
      else setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [finish]);

  if (!checked) return <LoadingScreen page />;

  return (
    <FormScreen
      title={LOCK_OFFER.title}
      description={LOCK_OFFER.description}
      onBack={() => navigate(backTo)}
      footer={
        <>
          <Button block onClick={() => navigate(setPinTo, { state: FROM_SETUP })}>
            Set PIN
          </Button>
          <Button variant="ghost" block onClick={finish}>
            Skip for now
          </Button>
        </>
      }
    />
  );
}
