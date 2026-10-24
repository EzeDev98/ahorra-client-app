export const queryKeys = {
  income: {
    all: ['income'],
    current: () => ['income', 'current']
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
  },
};
