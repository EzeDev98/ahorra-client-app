import Onboarding from "@features/onboarding/Onboarding.jsx";
import Install from "@features/install/Install.jsx";
import Welcome from "@features/auth/welcome/Welcome.jsx";
import NextStep from "@shared/components/feedback/NextStep.jsx";
import { ROUTES } from "./routes.js";

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
    element: <Welcome registerTo={ROUTES.nextStep} loginTo={ROUTES.nextStep} />,
  },
  { path: ROUTES.nextStep, element: <NextStep /> },
];
