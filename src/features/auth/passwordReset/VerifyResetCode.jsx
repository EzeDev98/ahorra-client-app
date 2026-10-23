import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ApiError } from '@core/http/httpClient.js';
import { authApi } from '@features/auth/api/authApi.js';
import { maskEmail } from '@features/auth/verification/maskEmail.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import OtpField from '@shared/components/ui/OtpField.jsx';
import { useToast } from '@shared/components/ui/toastContext.js';
import useCountdown from '@shared/hooks/useCountdown.js';
import { cooldownFromMessage } from '@shared/utils/cooldown.js';
import { RESEND_COOLDOWN_MS, passwordResetFlow } from './passwordResetFlow.js';
import { GENERIC_ERROR, LABELS, OTP_LENGTH, RESENT_TOAST, SHORT_CODE_ERROR, VERIFY } from './resetContent.js';

export default function VerifyResetCode({ requestTo, newPasswordTo }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [flow] = useState(passwordResetFlow.get);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendAt, setResendAt] = useState(flow?.resendAvailableAt ?? null);
  const [focusTick, setFocusTick] = useState(0);
  const seconds = useCountdown(resendAt);
  const field = useRef(null);

  useEffect(() => {
    if (focusTick) field.current?.querySelector('input')?.focus();
  }, [focusTick]);

  if (!flow) return <Navigate to={requestTo} replace />;

  const fail = (message) => {
    setError(message);
    setCode('');
    setFocusTick((tick) => tick + 1);
  };

  const startCooldown = (ms) => {
    const at = Date.now() + ms;
    setResendAt(at);
    passwordResetFlow.update({ resendAvailableAt: at });
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
      const result = await authApi.verifyResetOtp({ email: flow.email, otp });
      if (!result?.resetToken) throw new Error('No reset token in the response.');
      passwordResetFlow.setResetToken(result.resetToken);
      navigate(newPasswordTo, { replace: true });
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
      await authApi.requestPasswordReset({ email: flow.email });
      startCooldown(RESEND_COOLDOWN_MS);
      setCode('');
      setFocusTick((tick) => tick + 1);
      toast.show(RESENT_TOAST, { tone: 'success' });
    } catch (caught) {
      if (caught instanceof ApiError && caught.isRateLimited) {
        startCooldown(cooldownFromMessage(caught.message, RESEND_COOLDOWN_MS));
      }
      setError(caught instanceof ApiError ? caught.message : GENERIC_ERROR);
    } finally {
      setResending(false);
    }
  };

  return (
    <FormScreen
      className="ui-form-screen--code"
      title={VERIFY.title}
      description={VERIFY.description(maskEmail(flow.email))}
      onBack={() => navigate(requestTo)}
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
        <FormField label={LABELS.code} error={error}>
          <OtpField value={code} onChange={change} onComplete={verify} length={OTP_LENGTH} disabled={verifying} autoFocus />
        </FormField>
      </div>
    </FormScreen>
  );
}
