import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ApiError } from '@core/http/httpClient.js';
import { authApi } from '@features/auth/api/authApi.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import OtpField from '@shared/components/ui/OtpField.jsx';
import { useToast } from '@shared/components/ui/toastContext.js';
import useCountdown from '@shared/hooks/useCountdown.js';
import { maskEmail } from './maskEmail.js';
import { RESEND_COOLDOWN_MS, pendingVerification } from './pendingVerification.js';
import {
  CODE_LABEL,
  GENERIC_ERROR,
  OTP_LENGTH,
  RESENT_TOAST,
  SHORT_CODE_ERROR,
  TITLE,
  VERIFIED_TOAST,
  description,
} from './verifyContent.js';

function cooldownFrom(message) {
  const match = /(\d+)\s*(?:seconds?|secs?)\b/i.exec(message ?? '');
  return match ? Number(match[1]) * 1000 : RESEND_COOLDOWN_MS;
}

export default function VerifyEmail({ welcomeTo, loginTo }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [pending] = useState(pendingVerification.get);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendAt, setResendAt] = useState(pending?.resendAvailableAt ?? null);
  const [focusTick, setFocusTick] = useState(0);
  const seconds = useCountdown(resendAt);
  const field = useRef(null);

  useEffect(() => {
    if (focusTick) field.current?.querySelector('input')?.focus();
  }, [focusTick]);

  if (!pending) return <Navigate to={welcomeTo} replace />;

  const fail = (message) => {
    setError(message);
    setCode('');
    setFocusTick((tick) => tick + 1);
  };

  const startCooldown = (ms) => {
    const at = Date.now() + ms;
    setResendAt(at);
    pendingVerification.update({ resendAvailableAt: at });
  };

  const change = (next) => {
    setCode(next);
    if (error) setError(null);
  };

  const verify = async (otp) => {
    if (verifying) return;
    if (otp.length < OTP_LENGTH) {
      setError(SHORT_CODE_ERROR);
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      await authApi.verifyEmail({ email: pending.email, otp });
      pendingVerification.clear();
      toast.show(VERIFIED_TOAST, { tone: 'success' });
      navigate(loginTo, { replace: true, state: { username: pending.username } });
    } catch (caught) {
      fail(caught instanceof ApiError ? caught.message : GENERIC_ERROR);
      setVerifying(false);
    }
  };

  const resend = async () => {
    if (resending || seconds > 0) return;
    setError(null);
    setResending(true);
    try {
      await authApi.resendEmailVerification({ email: pending.email });
      startCooldown(RESEND_COOLDOWN_MS);
      setCode('');
      setFocusTick((tick) => tick + 1);
      toast.show(RESENT_TOAST, { tone: 'success' });
    } catch (caught) {
      if (caught instanceof ApiError && caught.isRateLimited) startCooldown(cooldownFrom(caught.message));
      setError(caught instanceof ApiError ? caught.message : GENERIC_ERROR);
    } finally {
      setResending(false);
    }
  };

  return (
    <FormScreen
      className="ui-form-screen--code"
      title={TITLE}
      description={description(maskEmail(pending.email))}
      onBack={() => navigate(welcomeTo)}
      onSubmit={() => verify(code)}
      footer={
        <>
          <Button type="submit" block busy={verifying}>
            Verify
          </Button>
          <Button variant="ghost" block busy={resending} disabled={seconds > 0} onClick={resend}>
            {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
          </Button>
        </>
      }
    >
      <div ref={field}>
        <FormField label={CODE_LABEL} error={error}>
          <OtpField value={code} onChange={change} onComplete={verify} length={OTP_LENGTH} disabled={verifying} autoFocus />
        </FormField>
      </div>
    </FormScreen>
  );
}
