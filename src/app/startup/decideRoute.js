import { env } from '@core/config/env.js';
import { queryClient } from '@core/data/queryClient.js';
import { queryKeys } from '@core/data/queryKeys.js';
import { isPWAInstalled } from '@core/pwa/isPWAInstalled.js';
import { sessionManager } from '@features/auth/session/sessionManager.js';
import { lockState } from '@features/lock/lockState.js';
import { pinService } from '@features/lock/pinService.js';
import { pinStore } from '@features/lock/pinStore.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';
import { setupStatus } from '@features/setup/setupStatus.js';
import { isOnline } from '@shared/hooks/useNetwork.js';
import { ROUTES } from '@app/router/routes.js';

const INCOME_WAIT_MS = 3000;

const SETUP_ROUTES = [ROUTES.setupIncome, ROUTES.setupLock, ROUTES.setPin];

const tooSlow = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Too slow')), ms));

async function isIncomeSet({ fetch }) {
  const key = queryKeys.income.current();
  if (!fetch) {
    const cached = queryClient.getQueryData(key);
    return cached === undefined ? null : cached !== null;
  }
  if (!isOnline()) return null;
  try {
    const income = await Promise.race([queryClient.fetchQuery({ queryKey: key, queryFn: incomeApi.get }), tooSlow(INCOME_WAIT_MS)]);
    return income !== null;
  } catch {
    return null;
  }
}

export async function decideRoute({ launching, pathname = '' }) {
  const installed = env.skipInstallGuard || isPWAInstalled();
  if (!installed) return null; 

  if (!sessionManager.hasSession()) return launching ? ROUTES.welcome : null;

  if (launching) await pinService.sync(); 

  if (lockState.isLocked()) return pathname === ROUTES.unlock ? null : ROUTES.unlock;

  if (pinService.resetPending() && pinStore.has()) return pathname === ROUTES.setPin ? null : ROUTES.setPin;

  const incomeSet = await isIncomeSet({ fetch: launching });
  if (incomeSet === false) return SETUP_ROUTES.includes(pathname) ? null : ROUTES.setupIncome;

  if (incomeSet === true && !setupStatus.isComplete()) {
    return SETUP_ROUTES.includes(pathname) ? null : ROUTES.setupLock;
  }

  return launching ? ROUTES.nextStep: null;
}
