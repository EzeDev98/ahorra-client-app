export const FLOW_LABEL = { EXPENSE: 'Spent', INCOME: 'Received' };

export const FALLBACK_CATEGORY = 'Other';

export const CARD_COPY = {
  total: 'Total',
  later: 'Later',
  confirm: 'Confirm',
  edit: 'Edit',
  hint: 'Tap the card to edit or discard',
};

export const STACK_COPY = {
  loadFailed: 'Could not load your pending entries.',
  retry: 'Try again',
};

export const CONFIRM_COPY = {
  failed: 'Could not confirm. Try again.',
};

export const BELL_LABEL = {
  empty: 'Nothing waiting',
  waiting: (count) => (count === 1 ? '1 entry waiting' : `${count} entries waiting`),
};

export const DISCARD_COPY = {
  discarded: 'Entry discarded',
  undo: 'Undo',
  failed: 'Could not discard. Try again.',
  restoreFailed: 'Could not bring the entry back.',
};
