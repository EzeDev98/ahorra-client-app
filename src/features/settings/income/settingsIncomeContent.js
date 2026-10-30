export const INCOME_SETTINGS = {
  title: 'Income',
  sectionCurrent: 'Current income',
  sectionUpdate: 'Update income',
  sectionHistory: 'History',

  period: 'Period',
  lowest: 'Lowest income',
  highest: 'Highest income',
  since: 'In place since',
  baselineNote: 'Ahorra compares your spending with the lowest income.',
  updateNote: 'Past reports keep the income that applied at the time.',
  custom: (days) => `Every ${days} days`,

  save: 'Save changes',
  saved: 'Income updated',

  historyEmpty: 'No income recorded yet.',
  current: 'Current',
  range: (start, end) => `${start} to ${end}`,
  from: (start) => `From ${start}`,

  loadFailed: 'Could not load your income.',
  historyFailed: 'Could not load your income history.',
  retry: 'Try again',
};
