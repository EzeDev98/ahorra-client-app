import Onboarding from '@features/onboarding/Onboarding.jsx';
import VerifyEmail from "@features/auth/verification/VerifyEmail.jsx";
import Login from "@features/auth/login/Login.jsx";
import RequestReset from '@features/auth/passwordReset/RequestReset.jsx';
import VerifyResetCode from '@features/auth/passwordReset/VerifyResetCode.jsx';
import CreateNewPassword from '@features/auth/passwordReset/CreateNewPassword.jsx';
import { decideRoute } from "@app/startup/decideRoute.js";
import LockOffer from '@/features/lock/lockerOffer.jsx';
import SetPin from '@/features/lock/SetPin.jsx';
import Unlock from '@/features/lock/Unlock.jsx';
import Register from "@features/auth/register/Register.jsx";
import Welcome from "@features/auth/welcome/Welcome.jsx";
import SetupIncome from '@features/setup/income/SetupIncome.jsx';
import Home from '@/features/home/Home.jsx';
import Reports from '@features/reports/Reports.jsx';
import ReportDetail from '@features/reports/ReportDetail.jsx';
import Behavior from '@features/behavior/Behavior.jsx';
import Insights from '@features/insights/Insights.jsx';
import ChangePin from '@features/lock/ChangePin.jsx';
import TurnOffLock from '@features/lock/TurnOffLock.jsx';
import Settings from '@features/settings/Settings.jsx';
import SettingsIncome from '@features/settings/income/SettingsIncome.jsx';
import SettingsAccount from '@features/settings/account/SettingsAccount.jsx';
import SettingsSecurity from '@features/settings/security/SettingsSecurity.jsx';
import SettingsAppearance from '@features/settings/appearance/SettingsAppearance.jsx';
import SettingsAbout from '@features/settings/about/SettingsAbout.jsx';
import Install from '@features/install/Install.jsx';
import NextStep from '@/shared/components/feedback/NextStep.jsx';
import { ROUTES, reportDetailPath } from './routes.js';
import SettingsReminder from '@/features/notifications/SettingsReminder.jsx';

const OPEN = {}; 
const BEFORE_SIGN_IN = { installed: true };
const SIGNED_IN = { installed: true, authenticated: true };
const FIRST_RUN = { installed: true, authenticated: true, unlocked: true }; 
const SETUP_SCREEN = { ...FIRST_RUN, firstRunOnly: true };
const IN_APP = { ...FIRST_RUN, setupComplete: true }; 


export const ROUTE_CONFIG = [
  { path: ROUTES.onboarding, ...OPEN, element: <Onboarding installTo={ROUTES.install} welcomeTo={ROUTES.welcome} /> },
  { path: ROUTES.install, ...OPEN, element: <Install backTo={ROUTES.onboarding} welcomeTo={ROUTES.welcome} /> },

  { path: ROUTES.welcome, ...BEFORE_SIGN_IN, element: <Welcome registerTo={ROUTES.register} loginTo={ROUTES.login} signedInTo={ROUTES.home} /> },
  { path: ROUTES.register, ...BEFORE_SIGN_IN, element: <Register backTo={ROUTES.welcome} verifyEmailTo={ROUTES.verifyEmail} /> },
  { path: ROUTES.verifyEmail, ...BEFORE_SIGN_IN, element: <VerifyEmail welcomeTo={ROUTES.welcome} loginTo={ROUTES.login} /> },
  { path: ROUTES.login, ...BEFORE_SIGN_IN, element: <Login welcomeTo={ROUTES.welcome} forgotPasswordTo={ROUTES.forgotPassword} verifyEmailTo={ROUTES.verifyEmail} homeTo={ROUTES.home} resolveDestination={() => decideRoute({ launching: true })} /> },
  { path: ROUTES.forgotPassword, ...BEFORE_SIGN_IN, element: <RequestReset backTo={ROUTES.login} verifyCodeTo={ROUTES.verifyResetCode} /> },
  { path: ROUTES.verifyResetCode, ...BEFORE_SIGN_IN, element: <VerifyResetCode requestTo={ROUTES.forgotPassword} newPasswordTo={ROUTES.createNewPassword} /> },
  { path: ROUTES.createNewPassword, ...BEFORE_SIGN_IN, element: <CreateNewPassword requestTo={ROUTES.forgotPassword} loginTo={ROUTES.login} /> },

  { path: ROUTES.setupIncome, ...SETUP_SCREEN, element: <SetupIncome nextTo={ROUTES.setupLock} /> },
  { path: ROUTES.setupLock, ...SETUP_SCREEN, element: <LockOffer backTo={ROUTES.setupIncome} setPinTo={ROUTES.setPin} homeTo={ROUTES.home} /> },

  { path: ROUTES.setPin, ...FIRST_RUN, element: <SetPin offerTo={ROUTES.setupLock} securityTo={ROUTES.settingsSecurity} changePinTo={ROUTES.changePin} homeTo={ROUTES.home} /> },
  { path: ROUTES.unlock, ...SIGNED_IN, element: <Unlock homeTo={ROUTES.home} /> },
  
  { path: ROUTES.home, ...IN_APP, element: <Home destinations={{ reports: ROUTES.reports, insights: ROUTES.insights, behavior: ROUTES.behavior, settings: ROUTES.settings, reminder: ROUTES.settingsReminder }} /> },
  { path: ROUTES.reports, ...IN_APP, element: <Reports backTo={ROUTES.home} detailTo={reportDetailPath} /> },
  { path: ROUTES.reportDetail, ...IN_APP, element: <ReportDetail backTo={ROUTES.reports} /> },
  { path: ROUTES.insights, ...IN_APP, element: <Insights backTo={ROUTES.home} incomeTo={ROUTES.settingsIncome} />},
  { path: ROUTES.behavior, ...IN_APP, element: <Behavior backTo={ROUTES.home}/>},
  
  
  { path: ROUTES.settings, ...IN_APP, element: <Settings backTo={ROUTES.home} destinations={{ income: ROUTES.settingsIncome, account: ROUTES.settingsAccount, security: ROUTES.settingsSecurity, appearance: ROUTES.settingsAppearance, about: ROUTES.settingsAbout, reminder: ROUTES.settingsReminder }} /> },
  { path: ROUTES.settingsIncome, ...IN_APP, element: <SettingsIncome backTo={ROUTES.settings} /> },
  { path: ROUTES.settingsAccount, ...IN_APP, element: <SettingsAccount backTo={ROUTES.settings} /> },
  { path: ROUTES.settingsSecurity, ...IN_APP, element: <SettingsSecurity backTo={ROUTES.settings} setPinTo={ROUTES.setPin} lockOffTo={ROUTES.lockOff} changePinTo={ROUTES.changePin} /> },
  { path: ROUTES.changePin, ...IN_APP, element: <ChangePin securityTo={ROUTES.settingsSecurity} setPinTo={ROUTES.setPin} /> },
  { path: ROUTES.lockOff, ...IN_APP, element: <TurnOffLock securityTo={ROUTES.settingsSecurity} /> },
  { path: ROUTES.settingsAppearance, ...IN_APP, element: <SettingsAppearance backTo={ROUTES.settings} /> },
  { path: ROUTES.settingsAbout, ...IN_APP, element: <SettingsAbout backTo={ROUTES.settings} /> },
  { path: ROUTES.settingsReminder, ...IN_APP, element: <SettingsReminder backTo={ROUTES.settings} /> },


  { path: ROUTES.nextStep, ...IN_APP, element: <NextStep />,},

];
