import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import { queryKeys } from '@core/data/queryKeys.js';
import { incomeApi } from '@features/setup/api/incomeApi.js';
import { setupStatus } from '@features/setup/setupStatus.js';
import LoadingScreen from '@shared/components/feedback/LoadingScreen.jsx';
import SomethingWentWrong from '@shared/components/feedback/SomethingWentWrong.jsx';

export default function SetupGuard({ redirectTo, incompleteTo, children }) {
  const { data, isPending, isLoadingError, refetch } = useQuery({
    queryKey: queryKeys.income.current(),
    queryFn: incomeApi.get,
  });

  if (isPending) return <LoadingScreen page />;
  if (isLoadingError) return <SomethingWentWrong onRetry={() => refetch()} />;
  if (data === null) return <Navigate to={redirectTo} replace />;
  if (setupStatus.isComplete()) return children;
  return <Navigate to={incompleteTo} replace />;
}
