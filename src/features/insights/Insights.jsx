import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import './Insights.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Skeleton from '@shared/components/ui/Skeleton.jsx';
import InsightsBody from './InsightsBody.jsx';
import { INSIGHTS_COPY } from './insightsContent.js';
import useVariance from './useVariance.js';

export default function Insights({ backTo, incomeTo }) {
  const navigate = useNavigate();
  const { variance, isPending, notFound, loadFailed, retrying, retry } = useVariance();

  let body;
  if (notFound) {
    body = (
      <EmptyState
        icon={Wallet}
        title={INSIGHTS_COPY.noIncomeTitle}
        description={INSIGHTS_COPY.noIncomeDescription}
        action={<Button variant="secondary" onClick={() => navigate(incomeTo)}>{INSIGHTS_COPY.setIncome}</Button>}
      />
    );
  } else if (loadFailed) {
    body = (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {INSIGHTS_COPY.retry}
          </Button>
        }
      >
        {INSIGHTS_COPY.loadFailed}
      </InfoBanner>
    );
  } else if (isPending || !variance) {
    body = (
      <Skeleton rows={4} />
    );
  } else {
    body = <InsightsBody data={variance} />;
  }

  return (
    <ScreenContainer>
      <PageHeader title={INSIGHTS_COPY.title} onBack={() => navigate(backTo)} />
      {body}
    </ScreenContainer>
  );
}
