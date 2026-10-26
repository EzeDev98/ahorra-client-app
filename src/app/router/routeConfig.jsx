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
import Install from '@features/install/Install.jsx';
import NextStep from '@/shared/components/feedback/NextStep.jsx';
import { ROUTES } from './routes.js';

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
  { path: ROUTES.home, ...IN_APP, element: <Home destinations={{ reports: ROUTES.nextStep, insights: ROUTES.nextStep, behavior: ROUTES.nextStep, settings: ROUTES.nextStep}} />},
  {path: ROUTES.nextStep, ...IN_APP, element: <NextStep />,},

];
