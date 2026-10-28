const DAY = /^(\d{4})-(\d{2})-(\d{2})/; 

export function reportDate(day, now = new Date(), locale) {
  const match = DAY.exec(day ?? '');
  if (!match) return day ?? '';
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const year = date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' };
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', ...year }).format(date);
}

export function reportDateLong(day, now = new Date(), locale) {
  const match = DAY.exec(day ?? '');
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const year = date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' };
  return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', ...year }).format(date);
}
