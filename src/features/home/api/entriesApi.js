import { httpClient } from '@core/http/httpClient.js';

export const newClientRequestId = () => crypto.randomUUID();

export const entriesApi = {
  
  capture: ({ text, source = 'TEXT', clientRequestId = newClientRequestId() }) =>
    httpClient.post('/entries/capture', { text, source, clientRequestId }),

  listPending: () => httpClient.get('/entries/pending'),
  confirm: (id, edits) => httpClient.post(`/entries/pending/${encodeURIComponent(id)}/confirm`, edits),
  discard: (id) => httpClient.post(`/entries/pending/${encodeURIComponent(id)}/discard`),
  restore: (id) => httpClient.post(`/entries/pending/${encodeURIComponent(id)}/restore`),
};
