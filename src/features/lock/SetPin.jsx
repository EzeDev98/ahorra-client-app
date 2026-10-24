import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import useFinishSetup from '../setup/useFinishSetup.js';
import { useToast } from '@shared/components/ui/toastContext.js';
import PinFlow from './PinFlow.jsx';
import { PIN_FLOW } from './lockContent.js';
import { pinService } from './pinService.js';
import { pinStore } from './pinStore.js';

export default function SetPin({ offerTo, securityTo, changePinTo, homeTo }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const toast = useToast();
  const finish = useFinishSetup(homeTo);
  const [hasPin] = useState(pinStore.has);
  const [resetting] = useState(pinService.resetPending); 
  const fromSetup = Boolean(state?.fromSetup);

  useEffect(() => {
    if (hasPin && fromSetup) finish();
  }, [hasPin, fromSetup, finish]);

  if (hasPin && !resetting) return fromSetup ? null : <Navigate to={changePinTo} replace />;

  const back = () => {
    if (resetting) pinService.clearForgot(); 
    navigate(fromSetup ? offerTo : securityTo);
  };

  const done = () => {
    toast.show(PIN_FLOW.set.done, { tone: 'success' });
    if (fromSetup) finish();
    else navigate(securityTo, { replace: true });
  };

  return (
    <PinFlow
      mode="set"
      reset={resetting}
      onBack={back}
      onDone={done}
      onSkip={fromSetup ? finish : undefined}
    />
  );
}
