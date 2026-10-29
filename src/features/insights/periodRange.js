const DAY = /^(\d{4})-(\d{2})-(\d{2})/;

const toDate = (day) => {
  const match = DAY.exec(day ?? '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
};

export function periodRange(start, end, locale) {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return null;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).formatRange(from, to);
}
