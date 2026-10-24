import { ROUTES } from './routes.js';
import AuthGuard from './guards/AuthGuard.jsx';
import FirstRunGuard from './guards/FirstRunGuard.jsx';
import InstallGuard from './guards/InstallGuard.jsx';
import SetupGuard from './guards/SetupGuard.jsx';
import UnlockGuard from './guards/UnlockGuard.jsx';

export function withGuards({ installed, authenticated, unlocked, firstRunOnly, setupComplete }, element) {
  let guarded = element;
  if (firstRunOnly) guarded = <FirstRunGuard redirectTo={ROUTES.home}>{guarded}</FirstRunGuard>;
  if (setupComplete) guarded = <SetupGuard redirectTo={ROUTES.setupIncome} incompleteTo={ROUTES.setupLock}>{guarded}</SetupGuard>;
  if (unlocked) guarded = <UnlockGuard redirectTo={ROUTES.unlock}>{guarded}</UnlockGuard>;
  if (authenticated) guarded = <AuthGuard redirectTo={ROUTES.welcome} sessionEndedTo={ROUTES.login}>{guarded}</AuthGuard>;
  if (installed) guarded = <InstallGuard redirectTo={ROUTES.install}>{guarded}</InstallGuard>;
  return guarded;
}
