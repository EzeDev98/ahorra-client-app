import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiError } from '@core/http/httpClient.js';
import { authApi } from '@features/auth/api/authApi.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormError from '@shared/components/ui/FormError.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import TextField from '@shared/components/ui/TextField.jsx';
import { RESEND_COOLDOWN_MS, passwordResetFlow } from './passwordResetFlow.js';
import { GENERIC_ERROR, HINTS, LABELS, REQUEST } from './resetContent.js';
import { validateEmail } from './resetRules.js';

export default function RequestReset({ backTo, verifyCodeTo }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => passwordResetFlow.get()?.email ?? '');
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  const change = (event) => {
    setEmail(event.target.value);
    setError(null);
    setFormError(null);
  };

  const submit = async () => {
    if (busy) return;
    const problem = validateEmail(email);
    if (problem) {
      setError(problem);
      input.current?.focus();
      return;
    }

    const address = email.trim();

    const current = passwordResetFlow.get();
    if (
      current?.email?.toLowerCase() === address.toLowerCase() &&
      current.resendAvailableAt > Date.now() &&
      !passwordResetFlow.getResetToken()
    ) {
      navigate(verifyCodeTo);
      return;
    }

    setError(null);
    setFormError(null);
    setBusy(true);
    try {
      await authApi.requestPasswordReset({ email: address });
      passwordResetFlow.begin({ email: address, resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS });
      navigate(verifyCodeTo);
    } catch (caught) {
      setFormError(caught instanceof ApiError ? caught.message : GENERIC_ERROR);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormScreen
      title={REQUEST.title}
      description={REQUEST.description}
      onBack={() => navigate(backTo)}
      onSubmit={submit}
      footer={
        <>
          <FormError>{formError}</FormError>
          <Button type="submit" block busy={busy}>
            Send code
          </Button>
        </>
      }
    >
      <FormField label={LABELS.email} hint={HINTS.email} error={error}>
        <TextField
          inputRef={input}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={change}
        />
      </FormField>
    </FormScreen>
  );
}
