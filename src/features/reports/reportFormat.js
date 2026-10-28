import { formatMoney } from '@shared/utils/formatMoney.js';
import { VARIANCE_WORDS } from './reportDetailContent.js';

const PERCENT = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 1 });

export const formatPercent = (value) => `${PERCENT.format(Number(value) || 0)}%`;

export function varianceWords(variance) {
  const amount = Number(variance) || 0;
  if (amount > 0) return VARIANCE_WORDS.over(formatMoney(amount));
  if (amount < 0) return VARIANCE_WORDS.under(formatMoney(-amount));
  return VARIANCE_WORDS.on;
}
