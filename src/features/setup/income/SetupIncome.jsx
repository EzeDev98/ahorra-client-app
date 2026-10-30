import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@core/http/httpClient.js';
import { queryKeys } from '@core/data/queryKeys.js';
import { run } from '@core/motion/motion.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';
import FormScreen from '@shared/components/layout/FormScreen.jsx';
import AmountField from '@shared/components/ui/AmountField.jsx';
import Button from '@shared/components/ui/Button.jsx';
import ChipSelect from '@shared/components/ui/ChipSelect.jsx';
import FormError from '@shared/components/ui/FormError.jsx';
import FormField from '@shared/components/ui/FormField.jsx';
import TextField from '@shared/components/ui/TextField.jsx';
import { GENERIC_ERROR, HINTS, INCOME, LABELS } from './incomeContent.js';
import { PERIODS, periodNoun, toRequestBody, valuesFromIncome, validateIncome } from './incomeRules.js';

const SLIDE_PX = 16;

export default function SetupIncome({ nextTo }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [values, setValues] = useState(() => valuesFromIncome(queryClient.getQueryData(queryKeys.income.current())));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [focusTick, setFocusTick] = useState(0);

  const stage = useRef(null);
  const lengthField = useRef(null);
  const custom = values.periodType === 'CUSTOM';
  const noun = periodNoun(values.periodType);

  useLayoutEffect(() => {
    if (!custom || !lengthField.current) return;
    run(lengthField.current, [{ opacity: 0, transform: `translateY(${-SLIDE_PX}px)` }, { opacity: 1, transform: 'none' }]);
  }, [custom]);

  useEffect(() => {
    if (focusTick) stage.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  const setField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, ...(name === 'periodType' ? { periodLength: undefined } : {}) }));
    setFormError(null);
  };

  const submit = async () => {
    if (busy) return;
    const found = validateIncome(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setFocusTick((tick) => tick + 1);
      return;
    }

    setErrors({});
    setFormError(null);
    setBusy(true);
    try {
      const income = await incomeApi.set(toRequestBody(values));
      queryClient.setQueryData(queryKeys.income.current(), income);
      queryClient.invalidateQueries({ queryKey: queryKeys.income.all, predicate: (query) => query.queryKey[1] !== 'current' });
      queryClient.invalidateQueries({ queryKey: queryKeys.report.all });
      navigate(nextTo);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : GENERIC_ERROR);
      setBusy(false);
    }
  };

  return (
    <div ref={stage}>
      <FormScreen
        title={INCOME.title}
        description={INCOME.description}
        onSubmit={submit}
        footer={
          <>
            <FormError>{formError}</FormError>
            <Button type="submit" block busy={busy}>
              Continue
            </Button>
          </>
        }
      >
        <FormField label={LABELS.period}>
          <ChipSelect
            name="income-period"
            options={PERIODS}
            value={values.periodType}
            onChange={(next) => setField('periodType', next)}
          />
        </FormField>

        {custom && (
          <div ref={lengthField}>
            <FormField label={LABELS.periodLength} hint={HINTS.periodLength} error={errors.periodLength}>
              <TextField
                inputMode="numeric"
                autoComplete="off"
                value={values.periodLength}
                onChange={(event) => setField('periodLength', event.target.value.replace(/\D/g, ''))}
              />
            </FormField>
          </div>
        )}

        <FormField label={LABELS.minAmount} hint={HINTS.minAmount(noun)} error={errors.minAmount}>
          <AmountField value={values.minAmount} onChange={(next) => setField('minAmount', next)} />
        </FormField>

        <FormField label={LABELS.maxAmount} hint={HINTS.maxAmount(noun)} error={errors.maxAmount}>
          <AmountField value={values.maxAmount} onChange={(next) => setField('maxAmount', next)} />
        </FormField>
      </FormScreen>
    </div>
  );
}
