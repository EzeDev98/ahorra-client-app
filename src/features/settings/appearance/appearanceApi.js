import { httpClient } from '@core/http/httpClient.js';

export const appearanceApi = {

  get: () => httpClient.get('/appearance'),

  set: (theme) => httpClient.put('/appearance', { theme }),
};
