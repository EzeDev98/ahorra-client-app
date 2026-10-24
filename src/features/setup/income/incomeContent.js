// All income-setup copy lives here, so changing a word never means touching the screen.
export const INCOME = {
  title: 'What do you earn?',
  description: 'A rough range is enough. Ahorra compares your spending with the lower end of it.',
};

export const LABELS = {
  period: 'Income period',
  periodLength: 'Length of your period (days)',
  minAmount: 'Lowest income',
  maxAmount: 'Highest income',
};

export const HINTS = {
  periodLength: 'For example 14 for every two weeks. From 1 to 366 days.',
  minAmount: (noun) => `The least you usually receive in a ${noun}.`,
  maxAmount: (noun) => `The most you usually receive in a ${noun}. If it never changes, enter the same amount.`,
};

export const GENERIC_ERROR = 'Something went wrong. Please try again.';
