import { GATE_COPY } from './gateContent.js';

const TIME = /^(\d{1,2}):(\d{2})/; 
const DAY = /^(\d{4})-(\d{2})-(\d{2})/; 
const MS_PER_DAY = 86_400_000;
const RECHECK_DELAY_MS = 2000; 

export function friendlyTime(hardGateTime, locale) {
  const match = TIME.exec(hardGateTime ?? '');
  if (!match) return null;
  const at = new Date(2000, 0, 1, Number(match[1]), Number(match[2]));
  const parts = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(at);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  if (match[2] === '00' && part('dayPeriod')) return `${part('hour')} ${part('dayPeriod')}`;
  return parts.map((item) => item.value).join('');
}

export function friendlyDay(day, now = new Date(), locale) {
  const match = DAY.exec(day ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = Math.round((today - date) / MS_PER_DAY);

  if (daysAgo === 1) return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day');
  if (daysAgo >= 2 && daysAgo <= 6) return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const year = date.getFullYear() === today.getFullYear() ? {} : { year: 'numeric' };
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', ...year }).format(date);
}

export function gateNote(status, now = new Date(), locale) {
  if (!status?.gated) return null;
  if (status.reason === 'HARD_GATE_TODAY') return GATE_COPY.hardGate(friendlyTime(status.hardGateTime, locale));
  if (status.reason === 'SUSPENDED_DAY') {
    return GATE_COPY.suspendedDay(friendlyDay(status.day, now, locale) ?? 'an earlier day', status.otherDaysRemaining ?? 0);
  }
  return GATE_COPY.generic;
}

export function msUntilGate(hardGateTime, now = new Date()) {
  const match = TIME.exec(hardGateTime ?? '');
  if (!match) return null;
  const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(match[1]), Number(match[2]));
  if (at <= now) at.setDate(at.getDate() + 1);
  return at - now + RECHECK_DELAY_MS;
}
