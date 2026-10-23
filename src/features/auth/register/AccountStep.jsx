import FormScreen from '@shared/components/layout/FormScreen.jsx';
import StepIndicator from '@shared/components/layout/StepIndicator.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormError from '@shared/components/ui/FormError.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import PasswordField from '@shared/components/ui/PasswordField.jsx';
import TextField from '@shared/components/ui/TextField.jsx';
import { ACCOUNT, HINTS, LABELS, STEP_COUNT } from './registerContent.js';

export default function AccountStep({ values, errors, formError, busy, onChange, onSubmit, onBack }) {
  return (
    <FormScreen
      title={ACCOUNT.title}
      description={ACCOUNT.description}
      step={<StepIndicator current={2} total={STEP_COUNT} />}
      onBack={onBack}
      onSubmit={onSubmit}
      footer={
        <>
          <FormError>{formError}</FormError>
          <Button type="submit" block busy={busy}>
            Create account
          </Button>
        </>
      }
    >
      <FormField label={LABELS.username} error={errors.username}>
        <TextField
          value={values.username}
          onChange={onChange('username')}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </FormField>
      <FormField label={LABELS.email} hint={HINTS.email} error={errors.email}>
        <TextField
          type="email"
          inputMode="email"
          value={values.email}
          onChange={onChange('email')}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
        />
      </FormField>
      <FormField label={LABELS.password} hint={HINTS.password} error={errors.password}>
        <PasswordField value={values.password} onChange={onChange('password')} autoComplete="new-password" />
      </FormField>
      <FormField label={LABELS.confirmPassword} error={errors.confirmPassword}>
        <PasswordField
          value={values.confirmPassword}
          onChange={onChange('confirmPassword')}
          autoComplete="new-password"
        />
      </FormField>
    </FormScreen>
  );
}
