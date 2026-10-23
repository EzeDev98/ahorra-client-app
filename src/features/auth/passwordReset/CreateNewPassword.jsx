import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ApiError } from '@core/http/httpClient.js';
import { authApi } from '@features/auth/api/authApi.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormError from '@shared/components/ui/FormError.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import PasswordField from '@shared/components/ui/PasswordField.jsx';
import { useToast } from '@shared/components/ui/toastContext.js';
import { passwordResetFlow } from './passwordResetFlow.js';
import { DONE_TOAST, GENERIC_ERROR, HINTS, LABELS, NEW_PASSWORD } from './resetContent.js';
import { validateNewPassword } from './resetRules.js';

export default function CreateNewPassword({ requestTo, loginTo }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [resetToken] = useState(passwordResetFlow.getResetToken);
  const [values, setValues] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const stage = useRef(null);

  useEffect(() => {
    if (focusTick) stage.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  if (!resetToken) return <Navigate to={requestTo} replace />;

  const startAgain = () => {
    passwordResetFlow.clearResetToken();
    navigate(requestTo);
  };

  const onChange = (name) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    setFormError(null);
  };

  const submit = async () => {
    if (busy) return;
    const found = validateNewPassword(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setFocusTick((tick) => tick + 1);
      return;
    }

    setErrors({});
    setFormError(null);
    setBusy(true);
    try {
      await authApi.completePasswordReset({
        resetToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      passwordResetFlow.clear();
      toast.show(DONE_TOAST, { tone: 'success' });
      navigate(loginTo, { replace: true });
    } catch (caught) {
      setFormError(caught instanceof ApiError ? caught.message : GENERIC_ERROR);
      setBusy(false);
    }
  };

  return (
    <div ref={stage}>
      <FormScreen
        title={NEW_PASSWORD.title}
        description={NEW_PASSWORD.description}
        onBack={startAgain}
        onSubmit={submit}
        footer={
          <>
            <FormError>{formError}</FormError>
            <Button type="submit" block busy={busy}>
              Change password
            </Button>
            {formError && (
              <Button variant="ghost" block onClick={startAgain}>
                Start again
              </Button>
            )}
          </>
        }
      >
        <FormField label={LABELS.newPassword} hint={HINTS.newPassword} error={errors.newPassword}>
          <PasswordField value={values.newPassword} onChange={onChange('newPassword')} autoComplete="new-password" />
        </FormField>
        <FormField label={LABELS.confirmPassword} error={errors.confirmPassword}>
          <PasswordField
            value={values.confirmPassword}
            onChange={onChange('confirmPassword')}
            autoComplete="new-password"
          />
        </FormField>
      </FormScreen>
    </div>
  );
}
