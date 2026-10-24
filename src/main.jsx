import "@core/pwa/installPrompt.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@shared/components/ui/patternfly.js";
import { appUpdate } from "@core/pwa/appUpdate.js";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/reset.css";
import "./styles/base.css";
import "./styles/bridge.css";
import { configureHttpClient } from "@core/http/httpClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { sessionManager } from "@features/auth/session/sessionManager.js";
import { startRefreshAhead } from "@features/auth/session/refreshAhead.js";
import ErrorBoundary from "@shared/components/feedback/ErrorBoundary.jsx";
import DeviceGate from "@features/device/DeviceGate.jsx";
import App from "@app/App.jsx";
import { registerServiceWorker } from "@core/pwa/registerServiceWorker.js";
import { clearQueryData, queryClient } from "./core/data/queryClient";
import { startAutoLock } from "./features/lock/autoLock";
configureHttpClient({
  getAccessToken: sessionManager.getAccessToken,
  refreshAccessToken: sessionManager.refresh,
  onSessionRevoked: sessionManager.handleSessionRevoked,
});

sessionManager.subscribe(() => {
  if (!sessionManager.hasSession()) clearQueryData();
});

startRefreshAhead();
startAutoLock();
registerServiceWorker();
appUpdate.start();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <DeviceGate>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </DeviceGate>
    </ErrorBoundary>
  </StrictMode>,
);
