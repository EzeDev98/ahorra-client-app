const FALLBACK_NAME = 'there';

const OCCASIONS = [
  { month: 0, day: 1, words: 'Happy New Year' },
  { month: 11, day: 25, words: 'Merry Christmas' },
  { month: 9, day: 1, words: 'Happy Independence Day' }, 
];

function titleFor(hour, name) {
  if (hour < 5) return `Still up, ${name}?`;
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

function subtitleFor({ now, mode, daysObserved }) {
  const month = now.getMonth();
  const weekday = now.getDay(); 

  const occasion = OCCASIONS.find((item) => item.month === month && item.day === now.getDate());
  if (occasion) return occasion.words;
  if (mode === 'OBSERVATION') return `Day ${daysObserved + 1} of getting to know your spending`;
  if (weekday === 1) return 'A fresh week';
  if (weekday === 5) return 'Happy Friday';
  if (weekday === 0 || weekday === 6) return 'Enjoy your weekend';
  if (month === 11 || month <= 1) return 'Harmattan season. Stay hydrated.';
  if (month >= 5 && month <= 8) return 'Rainy season. Stay dry out there.';
  return '';
}

export function greeting({ name, now = new Date(), mode, daysObserved = 0 }) {
  return {
    title: titleFor(now.getHours(), name?.trim() || FALLBACK_NAME),
    subtitle: subtitleFor({ now, mode, daysObserved }),
  };
}
