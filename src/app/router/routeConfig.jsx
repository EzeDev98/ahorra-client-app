import Onboarding from "@features/onboarding/Onboarding.jsx";
import Install from "@features/install/Install.jsx";
import Welcome from "@features/auth/welcome/Welcome.jsx";
import Register from "@features/auth/register/Register.jsx";
import VerifyEmail from "@features/auth/verification/VerifyEmail.jsx";
import Login from "@features/auth/login/Login.jsx";
import { decideRoute } from "@app/startup/decideRoute.js";
import NextStep from "@shared/components/feedback/NextStep.jsx";
import { ROUTES } from "./routes.js";
import RequestReset from "@/features/auth/passwordReset/RequestReset.jsx";
import { Route } from "lucide-react";
import VerifyResetCode from "@/features/auth/passwordReset/VerifyResetCode.jsx";
import CreateNewPassword from "@/features/auth/passwordReset/CreateNewPassword.jsx";

export const ROUTE_CONFIG = [
  {
    path: ROUTES.onboarding,
    element: (
      <Onboarding installTo={ROUTES.install} welcomeTo={ROUTES.welcome} />
    ),
  },
  {
    path: ROUTES.install,
    element: <Install backTo={ROUTES.onboarding} welcomeTo={ROUTES.welcome} />,
  },
  {
    path: ROUTES.welcome,
    installed: true,
    element: <Welcome registerTo={ROUTES.register} loginTo={ROUTES.login} />,
  },
  {
    path: ROUTES.register,
    installed: true,
    element: (
      <Register backTo={ROUTES.welcome} verifyEmailTo={ROUTES.verifyEmail} />
    ),
  },
  {
    path: ROUTES.verifyEmail,
    installed: true,
    element: <VerifyEmail welcomeTo={ROUTES.welcome} loginTo={ROUTES.login} />,
  },
  {
    path: ROUTES.login,
    installed: true,
    element: (
      <Login
        welcomeTo={ROUTES.welcome}
        forgotPasswordTo={ROUTES.forgotPassword}
        verifyEmailTo={ROUTES.verifyEmail}
        homeTo={ROUTES.nextStep}
        resolveDestination={() => decideRoute({ launching: true })}
      />
    ),
  },
  {
    path: ROUTES.forgotPassword,
    installed: true,
    element: (
      <RequestReset backTo={ROUTES.login} verifyCodeTo={ROUTES.verifyResetCode}/>
    ),
  },
  {
    path: ROUTES.verifyResetCode,
    installed: true,
    element: (
      <VerifyResetCode requestTo={ROUTES.forgotPassword} newPasswordTo={ROUTES.createNewPassword} />
    ),
  },
  {
    path: ROUTES.createNewPassword,
    installed: true,
    element: (
      <CreateNewPassword requestTo={ROUTES.forgotPassword} loginTo={ROUTES.login} />
    ),
  },
  {
    path: ROUTES.nextStep,
    installed: true,
    authenticated: true,
    element: <NextStep title="Reset password" description="This screen is coming soon." />,
  },
];
