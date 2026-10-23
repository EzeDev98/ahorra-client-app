import { ROUTES } from './routes.js';
import AuthGuard from './guards/AuthGuard.jsx';
import InstallGuard from './guards/InstallGuard.jsx';

export function withGuards({ installed, authenticated }, element) {
  let guarded = element;
  if (authenticated) guarded = <AuthGuard redirectTo={ROUTES.welcome} sessionEndedTo={ROUTES.login}>{guarded}</AuthGuard>;
  if (installed) guarded = <InstallGuard redirectTo={ROUTES.install}>{guarded}</InstallGuard>;
  return guarded;
}
