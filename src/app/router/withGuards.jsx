import { ROUTES } from './routes.js';
import InstallGuard from './guards/InstallGuard.jsx';

export function withGuards({ installed }, element) {
  let guarded = element;
  if (installed) guarded = <InstallGuard redirectTo={ROUTES.install}>{guarded}</InstallGuard>;
  return guarded;
}
