import { Navigate, Route, Routes } from 'react-router';
import { ROUTE_CONFIG } from './routeConfig.jsx';
import { ROUTES } from './routes.js';
import { withGuards } from './withGuards.jsx';

export default function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      {ROUTE_CONFIG.map(({ path, element, ...flags }) => (
        <Route key={path} path={path} element={withGuards(flags, element)} />
      ))}
      <Route path="*" element={<Navigate to={ROUTES.onboarding} replace />} />
    </Routes>
  );
}
