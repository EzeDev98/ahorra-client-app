import { env } from "@core/config/env.js";
import { isPWAInstalled } from "@core/pwa/isPWAInstalled.js";
import { ROUTES } from "@app/router/routes.js";

export async function decideRoute({ launching }) {
  const installed = env.skipInstallGuard || isPWAInstalled();
  if (!installed) return null; 
  return launching ? ROUTES.welcome : null;
}
