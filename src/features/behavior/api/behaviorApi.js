import { httpClient } from '@core/http/httpClient.js';

export const behaviorApi = {

  getOverview: () => httpClient.get('/behavior/overview'),
};
