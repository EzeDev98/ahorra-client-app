import { httpClient } from '@core/http/httpClient.js';

export const pinApi = {

  status: () => httpClient.get('/pin/status'),

  set: (pin) => httpClient.post('/pin', { pin, confirmPin: pin }),

  change: (oldPin, pin) => httpClient.put('/pin', { oldPin, pin, confirmPin: pin }),

  verify: (pin) => httpClient.post('/pin/verify', { pin }),

  remove: (pin) => httpClient.post('/pin/remove', { pin }),

  reset: (pin) => httpClient.post('/pin/reset', { pin, confirmPin: pin }),
};
