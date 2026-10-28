export const queryKeys = {
  day: {
    all: ['day'],
    status: () => ['day', 'status'],
  },
  entries: {
    all: ['entries'],
    pending: () => ['entries', 'pending'],
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
  },
  report: {
    all: ['report'],
    ambient: () => ['report', 'ambient'],
    list: ({ from, to } = {}) => ['report', 'list', { from: from ?? null, to: to ?? null }],
    latest: () => ['report', 'latest'],
    detail: (date) => ['report', 'detail', date],
  },
  income: {
    all: ['income'],
    current: () => ['income', 'current']
  },
};
