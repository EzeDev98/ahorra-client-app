import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useToast } from '@shared/components/ui/toastContext.js';
import PinFlow from './PinFlow.jsx';
import { PIN_FLOW } from './lockContent.js';
import { pinStore } from './pinStore.js';


export default function TurnOffLock({ securityTo }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [hasPin] = useState(pinStore.has); 

  if (!hasPin) return <Navigate to={securityTo} replace />;

  const done = () => {
    pinStore.remove();
    toast.show(PIN_FLOW.off.done, { tone: 'success' });
    navigate(securityTo, { replace: true });
  };

  return <PinFlow mode="off" onBack={() => navigate(securityTo)} onDone={done} />;
}
