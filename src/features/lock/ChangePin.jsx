import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useToast } from '@shared/components/ui/toastContext.js';
import PinFlow from './PinFlow.jsx';
import { PIN_FLOW } from './lockContent.js';
import { pinStore } from './pinStore.js';

export default function ChangePin({ securityTo, setPinTo }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [hasPin] = useState(pinStore.has); 

  if (!hasPin) return <Navigate to={setPinTo} replace />;

  const done = () => {
    toast.show(PIN_FLOW.change.done, { tone: 'success' });
    navigate(securityTo, { replace: true });
  };

  return <PinFlow mode="change" onBack={() => navigate(securityTo)} onDone={done} />;
}
