import { env } from '@core/config/env.js';

export const isStandIn = (area) => env.standIns.includes(area);
