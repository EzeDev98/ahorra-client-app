import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { queryClient } from '@core/data/queryClient.js';
import { queryKeys } from '@core/data/queryKeys.js';
import { run } from '@core/motion/motion.js';
import { sessionManager } from '@features/auth/session/sessionManager.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import OtpField from '@shared/components/ui/OtpField.jsx';
import useCountdown from '@shared/hooks/useCountdown.js';
import './Unlock.css';
import { UNLOCK } from './lockContent.js';
import { lockState } from './lockState.js';
import { pinService } from './pinService.js';
import { PIN_LENGTH, pinStore } from './pinStore.js';
import { SHAKE } from './pinMotion.js';

const FORGOT_PIN = 'forgotPin';

export default function Unlock({ homeTo }) {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(() => pinStore.getAttempts().lockedUntil);
  const [focusTick, setFocusTick] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const seconds = useCountdown(lockedUntil);
  const boxes = useRef(null);
  const waiting = seconds > 0;

  const goOn = useCallback(() => {
    lockState.unlock();
    const from = state?.from;
    const inside = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//');
    const back = inside && from.split(/[?#]/)[0] !== pathname;
    navigate(back ? from : homeTo, { replace: true });
  }, [navigate, state, pathname, homeTo]);

  useEffect(() => {
    if (!pinStore.has()) goOn();
  }, [goOn]);

  useEffect(() => {
    queryClient.prefetchQuery({ queryKey: queryKeys.income.current(), queryFn: incomeApi.get });
  }, []);

  useEffect(() => {
    if (!waiting) boxes.current?.querySelector('input')?.focus();
  }, [focusTick, waiting]);

  const verify = async (pin) => {
    if (verifying || waiting) return;
    if (!pinStore.isSupported()) {
      setError(UNLOCK.unsupported);
      setCode('');
      setFocusTick((tick) => tick + 1);
      return;
    }

    setError(null);
    setVerifying(true);
    try {
      const result = await pinService.verify(pin);
      if (result.ok) {
        goOn();
        return; 
      }
      setLockedUntil(result.lockedUntil);
      setError(result.lockedUntil ? null : UNLOCK.wrong(result.attemptsLeft));
      run(boxes.current, SHAKE, { duration: 'base', ease: 'standard' });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : UNLOCK.generic);
    }
    setCode('');
    setVerifying(false);
    setFocusTick((tick) => tick + 1);
  };

  const change = (next) => {
    setCode(next);
    if (error) setError(null);
  };

  const forgot = () => {
    if (leaving) return;
    setLeaving(true);
    pinService.forgot(); 
    sessionManager.signOut(FORGOT_PIN);
  };

  const message = waiting ? UNLOCK.lockedOut : error;

  return (
    <FormScreen
      className="ui-form-screen--code"
      title={UNLOCK.title}
      description={UNLOCK.description(PIN_LENGTH)}
      footer={
        <>
          {waiting && <p className="unlock__wait">{UNLOCK.wait(seconds)}</p>}
          <Button variant="ghost" block busy={leaving} onClick={forgot}>
            {UNLOCK.forgot}
          </Button>
        </>
      }
    >
      <FormField label={UNLOCK.label} error={message}>
        <div ref={boxes}>
          <OtpField
            value={code}
            onChange={change}
            onComplete={verify}
            length={PIN_LENGTH}
            disabled={verifying || waiting}
            masked
            autoFocus
          />
        </div>
      </FormField>
    </FormScreen>
  );
}
