import { formatPercent } from '@features/reports/reportFormat.js';
import { BEHAVIOR_COPY } from './behaviorContent.js';

const COUNT = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 1 });
const formatCount = (value) => COUNT.format(Number(value) || 0);

export const formatConfidence = (value) => formatPercent(Math.round((Number(value) || 0) * 100));

export function slopeWords(slope) {
  const points = Number(slope) || 0;
  if (Math.abs(points) < 0.05) return BEHAVIOR_COPY.slopeFlat;
  return points > 0 ? BEHAVIOR_COPY.slopeUp(formatCount(points)) : BEHAVIOR_COPY.slopeDown(formatCount(-points));
}

export function frequencyWords(perWeek) {
  const count = Number(perWeek) || 0;
  return Math.abs(count - 1) < 0.05 ? BEHAVIOR_COPY.frequencyOnce : BEHAVIOR_COPY.frequencyTimes(formatCount(count));
}

export const baselineName = (category, dayType) => `${category}${BEHAVIOR_COPY.dayTypes[dayType] ?? ''}`;
