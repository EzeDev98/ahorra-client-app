import { httpClient } from '@core/http/httpClient.js';
import { isStandIn } from '@core/http/standIn.js';
import { pushStandIn } from './pushStandIn.js';

const real = {

  subscribe: ({ endpoint, keys }) => httpClient.post('/push/subscriptions', { endpoint, keys }),

  unsubscribe: (endpoint) => httpClient.delete('/push/subscriptions', { params: { endpoint } }),

  getReminder: () => httpClient.get('/push/reminder'),

  setReminder: (enabled) => httpClient.put('/push/reminder', { enabled }),
};

export const pushApi = isStandIn('push') ? pushStandIn : real;
