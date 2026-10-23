import { env } from "@core/config/env.js";
import { isPWAInstalled } from "@core/pwa/isPWAInstalled.js";
import { sessionManager } from "@features/auth/session/sessionManager.js";
import { ROUTES } from "@app/router/routes.js";
export async function decideRoute({ launching }) {
  const installed = env.skipInstallGuard || isPWAInstalled();
  if (!installed) return null;
  if (!sessionManager.hasSession()) return launching ? ROUTES.welcome : null;
  return launching ? ROUTES.nextStep : null;
}
