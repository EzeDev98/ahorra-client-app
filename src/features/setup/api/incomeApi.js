import { httpClient } from '@core/http/httpClient.js';

export const incomeApi = {
  async get() {
    try {
      return await httpClient.get('/income');
    } catch (error) {
      if (error.isNotFound) return null;
      throw error;
    }
  },

  set: ({ minAmount, maxAmount, periodType, periodLength }) =>
    httpClient.put('/income', { minAmount, maxAmount, periodType, periodLength }),

  getVariance: ({ date } = {}) => httpClient.get('/income/variance', { params: { date } }),
};
