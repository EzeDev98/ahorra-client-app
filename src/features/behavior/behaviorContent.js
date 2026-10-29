const days = (count) => `${count} ${count === 1 ? 'day' : 'days'}`;

export const BEHAVIOR_COPY = {
  title: 'Behaviour',

  observationTitle: 'Getting to know your spending',
  observationText: (observed, until) =>
    `${days(observed)} observed so far. About ${days(until)} to go before Ahorra describes your patterns.`,
  progressLabel: (observed, total) => `${observed} of ${total} days`,

  unusual: 'Today looks different from your usual days.',

  sectionSummary: 'So far',
  daysObserved: 'Days observed',
  confidence: 'Confidence',

  sectionTrend: 'Trend',
  aboveMeans: 'Spending above your baseline',
  direction: 'Direction',
  latestWeek: 'Latest week',
  latestValue: (percent) => `${percent} of your baseline`,
  change: 'Change a week',
  slopeUp: (points) => `Up ${points} points`,
  slopeDown: (points) => `Down ${points} points`,
  slopeFlat: 'No change',
  weeksUsed: 'Weeks used',

  sectionHabits: 'Habits',
  noHabits: 'No habits spotted yet.',
  frequencyOnce: 'Once a week',
  frequencyTimes: (count) => `${count} times a week`,
  average: (amount) => `averaging ${amount}`,
  habitConfidence: (percent) => `${percent} confidence`,

  sectionBaselines: 'Your usual spending',
  daily: (amount) => `${amount} a day`,
  baselineBasis: (window, sample) => `${window}-day average from ${days(sample)} of data`,
  dayTypes: { ALL: '', WEEKDAY: ' on weekdays', WEEKEND: ' on weekends' },

  directions: { STABLE: 'Steady', WORSENING: 'Rising', IMPROVING: 'Falling' },

  loadFailed: 'Could not load this screen.',
  retry: 'Try again',
};
