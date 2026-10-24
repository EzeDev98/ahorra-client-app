export const MAX_CUSTOM_PERIOD_DAYS = 366;
export const MAX_AMOUNT = 1_000_000_000_000;

export const PERIODS = [
  { value: 'DAILY', label: 'Daily', noun: 'day' },
  { value: 'WEEKLY', label: 'Weekly', noun: 'week' },
  { value: 'MONTHLY', label: 'Monthly', noun: 'month' },
  { value: 'CUSTOM', label: 'Custom', noun: 'period' },
];

export const INITIAL_VALUES = { periodType: 'MONTHLY', periodLength: '', minAmount: '', maxAmount: '' };

export const periodNoun = (periodType) => PERIODS.find((period) => period.value === periodType)?.noun ?? 'period';

const toNumber = (text) => (text === '' || text === '.' ? NaN : Number(text));

export function valuesFromIncome(income) {
  if (!income) return INITIAL_VALUES;
  return {
    periodType: income.periodType,
    periodLength: income.periodLength ? String(income.periodLength) : '',
    minAmount: String(income.minAmount),
    maxAmount: String(income.maxAmount),
  };
}

export function validateIncome(values) {
  const errors = {};
  const min = toNumber(values.minAmount);
  const max = toNumber(values.maxAmount);

  if (Number.isNaN(min)) errors.minAmount = 'Enter your lowest income.';
  else if (min <= 0) errors.minAmount = 'Lowest income must be more than zero.';
  else if (min >= MAX_AMOUNT) errors.minAmount = 'That amount is too large.';

  if (Number.isNaN(max)) errors.maxAmount = 'Enter your highest income.';
  else if (max >= MAX_AMOUNT) errors.maxAmount = 'That amount is too large.';
  else if (!errors.minAmount && max < min) errors.maxAmount = 'Highest income cannot be less than the lowest.';

  if (values.periodType === 'CUSTOM') {
    const days = values.periodLength === '' ? NaN : Number(values.periodLength);
    if (!Number.isInteger(days) || days < 1 || days > MAX_CUSTOM_PERIOD_DAYS) {
      errors.periodLength = `Enter a whole number of days from 1 to ${MAX_CUSTOM_PERIOD_DAYS}.`;
    }
  }

  return errors;
}

export function toRequestBody(values) {
  return {
    minAmount: Number(values.minAmount),
    maxAmount: Number(values.maxAmount),
    periodType: values.periodType,
    periodLength: values.periodType === 'CUSTOM' ? Number(values.periodLength) : undefined,
  };
}
