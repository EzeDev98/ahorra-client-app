import { PANEL_COPY, USUAL_WORDS } from './sidePanelContent.js';

const NEAR_USUAL = 0.1;

export function todayVerdict(ambient) {
  if (!ambient) return null;
  if (ambient.verdict === 'NO_INCOME_SET') return { value: 'NO_INCOME_SET' };

  const spend = Number(ambient.provisionalSpend) || 0;
  if (spend === 0) return { label: PANEL_COPY.nothingLogged };
  if (!ambient.comparisonAvailable) return null;

  const usual = Number(ambient.usualDailySpend) || 0;
  if (spend > usual * (1 + NEAR_USUAL)) return { value: 'OVER', label: USUAL_WORDS.above };
  if (spend < usual * (1 - NEAR_USUAL)) return { value: 'UNDER', label: USUAL_WORDS.below };
  return { value: 'ON_TRACK', label: USUAL_WORDS.about };
}
