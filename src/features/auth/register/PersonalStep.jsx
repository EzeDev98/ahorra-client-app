import FormScreen from '@shared/components/layout/FormScreen.jsx';
import StepIndicator from '@shared/components/layout/StepIndicator.jsx';
import Button from '@shared/components/ui/Button.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import TextField from '@shared/components/ui/TextField.jsx';
import { HINTS, LABELS, PERSONAL, STEP_COUNT } from './registerContent.js';
import { EARLIEST_BIRTH_DATE, latestBirthDate } from './registerRules.js';

export default function PersonalStep({ values, errors, onChange, onSubmit, onBack }) {
  return (
    <FormScreen
      title={PERSONAL.title}
      description={PERSONAL.description}
      step={<StepIndicator current={1} total={STEP_COUNT} />}
      onBack={onBack}
      onSubmit={onSubmit}
      footer={
        <Button type="submit" block>
          Continue
        </Button>
      }
    >
      <FormField label={LABELS.firstName} error={errors.firstName}>
        <TextField
          value={values.firstName}
          onChange={onChange('firstName')}
          autoComplete="given-name"
          autoCapitalize="words"
          autoCorrect="off"
        />
      </FormField>
      <FormField label={LABELS.middleName} optional>
        <TextField
          value={values.middleName}
          onChange={onChange('middleName')}
          autoComplete="additional-name"
          autoCapitalize="words"
          autoCorrect="off"
        />
      </FormField>
      <FormField label={LABELS.lastName} error={errors.lastName}>
        <TextField
          value={values.lastName}
          onChange={onChange('lastName')}
          autoComplete="family-name"
          autoCapitalize="words"
          autoCorrect="off"
        />
      </FormField>
      <FormField label={LABELS.dateOfBirth} hint={HINTS.dateOfBirth} error={errors.dateOfBirth}>
        <TextField
          type="date"
          min={EARLIEST_BIRTH_DATE}
          max={latestBirthDate()}
          value={values.dateOfBirth}
          onChange={onChange('dateOfBirth')}
          autoComplete="bday"
        />
      </FormField>
    </FormScreen>
  );
}
