import { FLOW_LABEL } from './pendingContent.js';

export const SHEET = {
  title: 'Edit entry',
  cancel: 'Cancel',
  confirm: 'Confirm',
};

export const LABELS = {
  flow: 'Type',
  vendor: 'Vendor',
  date: 'Date',
  category: 'Category',
  items: 'Items',
  item: (number) => `Item ${number}`,
  amount: 'Amount',
  total: 'Total',
  addItem: 'Add item',
  removeItem: (number) => `Remove item ${number}`,
};

export const FLOW_OPTIONS = [
  { value: 'EXPENSE', label: FLOW_LABEL.EXPENSE },
  { value: 'INCOME', label: FLOW_LABEL.INCOME },
];

export const ERRORS = {
  description: 'Add a description.',
  amount: 'Enter an amount above zero.',
  date: 'Pick a date.',
};

export const MAX_ITEMS = 50;
export const VENDOR_MAX = 255;

export const DISCARD = {
  open: 'Discard entry',
  question: 'Discard this entry?',
  detail: 'It will not count toward your spending.',
  keep: 'Keep entry',
  confirm: 'Discard',
};
