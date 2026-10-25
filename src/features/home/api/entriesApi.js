import { httpClient } from '@core/http/httpClient.js';

export const newClientRequestId = () => crypto.randomUUID();

export const entriesApi = {
  
  capture: ({ text, source = 'TEXT', clientRequestId = newClientRequestId() }) =>
    httpClient.post('/entries/capture', { text, source, clientRequestId }),

  listPending: () => httpClient.get('/entries/pending'),
};
