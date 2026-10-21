import { BrowserRouter } from "react-router";
import NetworkGate from "@shared/components/feedback/NetworkGate.jsx";
import ToastProvider from "@shared/components/ui/ToastProvider.jsx";
import StartupGate from "@app/startup/StartupGate.jsx";
import UpdatePrompt from '@app/update/UpdatePrompt.jsx';
import ResumeDecision from "@app/startup/ResumeDecision.jsx";
import AnimatedRoutes from "@app/router/AnimatedRoutes.jsx";
export default function App() {
  return (
    <NetworkGate>
      <StartupGate>
        <ToastProvider>
          <BrowserRouter>
            <ResumeDecision />
            <AnimatedRoutes />
            <UpdatePrompt />
          </BrowserRouter>
        </ToastProvider>
      </StartupGate>
    </NetworkGate>
  );
}
