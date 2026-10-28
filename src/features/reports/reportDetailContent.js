export const DETAIL_COPY = {
  title: 'Report',
  noEntries: 'No entries logged on this day',
  sectionDay: 'The day',
  sectionPeriod: 'This period',
  sectionDayCategories: 'By category, this day',
  sectionPeriodCategories: 'By category, this period',
  spent: 'Spent',
  entries: 'Entries',
  usual: 'Usual day',
  periodSpent: 'Spent this period',
  baseline: 'Baseline',
  incomeRange: 'Income range',
  against: 'Against baseline',
  range: (low, high) => `${low} to ${high}`,
  excess: (amount) => `${amount} of the excess`,
  notFoundTitle: 'No report for this day',
  notFoundDescription: 'A report appears once a day’s entries are confirmed and the day is closed.',
  loadFailed: 'Could not load this report.',
  retry: 'Try again',
};

export const VARIANCE_WORDS = {
  over: (amount) => `${amount} over`,
  under: (amount) => `${amount} under`,
  on: 'On baseline',
};
