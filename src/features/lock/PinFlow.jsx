import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ApiError } from '@core/http/httpClient.js';
import { run } from '@core/motion/motion.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import OtpField from '@shared/components/ui/OtpField.jsx';
import useCountdown from '@shared/hooks/useCountdown.js';
import './PinFlow.css';
import { PIN_FLOW, UNLOCK } from './lockContent.js';
import { SHAKE } from './pinMotion.js';
import { pinService } from './pinService.js';
import { PIN_LENGTH, pinStore } from './pinStore.js';

const SLIDE_PX = 16;

const STEPS = { set: ['new', 'confirm'], change: ['current', 'new', 'confirm'], off: ['current'] };

const text = (value) => (typeof value === 'function' ? value(PIN_LENGTH) : value);

export default function PinFlow({ mode, reset = false, onBack, onDone, onSkip }) {
  const copy = PIN_FLOW[mode];
  const steps = STEPS[mode];
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(() => pinStore.getAttempts().lockedUntil);
  const [focusTick, setFocusTick] = useState(0);
  const seconds = useCountdown(lockedUntil);
  const pending = useRef(''); 
  const currentPin = useRef(''); 
  const direction = useRef(0); 
  const stage = useRef(null);
  const boxes = useRef(null);
  const waiting = step === 'current' && seconds > 0;

  useLayoutEffect(() => {
    if (!direction.current) return;
    const from = direction.current * SLIDE_PX;
    direction.current = 0;
    run(stage.current, [{ opacity: 0, transform: `translateX(${from}px)` }, { opacity: 1, transform: 'none' }], {
      duration: 'base',
      ease: 'out',
    });
  }, [index]);

  useEffect(() => {
    if (!waiting) boxes.current?.querySelector('input')?.focus();
  }, [focusTick, waiting]);

  const go = (nextIndex) => {
    direction.current = nextIndex > index ? 1 : -1;
    setIndex(nextIndex);
    setCode('');
    setError(null);
    setBusy(false);
    setFocusTick((tick) => tick + 1);
  };

  const fail = (message) => {
    setError(message);
    setCode('');
    setBusy(false);
    setFocusTick((tick) => tick + 1);
    run(boxes.current, SHAKE, { duration: 'base', ease: 'standard' });
  };

  const change = (next) => {
    setCode(next);
    if (error) setError(null);
  };

  const submit = async (pin) => {
    if (busy || waiting) return;
    setError(null);

    if (step === 'current') {
      setBusy(true);
      try {
        const result = mode === 'off' ? await pinService.remove(pin) : await pinService.verify(pin);
        if (result.ok) {
          if (index === steps.length - 1) onDone(); 
          else {
            currentPin.current = pin;
            go(index + 1);
          }
          return;
        }
        setLockedUntil(result.lockedUntil);
        fail(result.lockedUntil ? null : UNLOCK.wrong(result.attemptsLeft));
      } catch (caught) {
        fail(caught instanceof Error ? caught.message : UNLOCK.generic);
      }
      return;
    }

    if (step === 'new') {
      pending.current = pin;
      go(index + 1);
      return;
    }

    if (pin !== pending.current) {
      fail(PIN_FLOW.mismatch);
      return;
    }
    setBusy(true);
    try {
      if (reset) await pinService.reset(pin);
      else if (mode === 'change') await pinService.change(currentPin.current, pin);
      else await pinService.set(pin);
      pending.current = '';
      currentPin.current = '';
      onDone(); 
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : UNLOCK.generic;
      if (caught instanceof ApiError && caught.status === 400) {
        pending.current = '';
        go(index - 1);
        setError(message);
        return;
      }
      fail(message);
    }
  };

  const back = () => {
    if (step === 'confirm') {
      pending.current = '';
      go(index - 1);
      return;
    }
    onBack();
  };

  if (!pinStore.isSupported()) {
    return (
      <FormScreen title={PIN_FLOW.unsupported.title} description={PIN_FLOW.unsupported.description} onBack={onBack} />
    );
  }

  const message = waiting ? UNLOCK.lockedOut : error;
  const footer =
    waiting || onSkip ? (
      <>
        {waiting && <p className="pin-flow__wait">{UNLOCK.wait(seconds)}</p>}
        {onSkip && (
          <Button variant="ghost" block onClick={onSkip}>
            {PIN_FLOW.skip}
          </Button>
        )}
      </>
    ) : undefined;

  return (
    <div ref={stage}>
      <FormScreen className="ui-form-screen--code" title={copy[step].title} description={text(copy[step].description)} onBack={back} footer={footer}>
        <FormField label={PIN_FLOW.label} error={message}>
          <div ref={boxes}>
            <OtpField value={code} onChange={change} onComplete={submit} length={PIN_LENGTH} disabled={busy || waiting} masked />
          </div>
        </FormField>
      </FormScreen>
    </div>
  );
}
