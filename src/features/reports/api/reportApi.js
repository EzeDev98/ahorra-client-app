import { httpClient } from '@core/http/httpClient.js';

export const reportApi = {

  getAmbient: () => httpClient.get('/report/ambient'),

  listDaily: ({ from, to } = {}) => httpClient.get('/report/daily', { params: { from, to } }),

  getLatest: () => httpClient.get('/report/daily/latest'),

  getDaily: (date) => httpClient.get(`/report/daily/${encodeURIComponent(date)}`),
};
