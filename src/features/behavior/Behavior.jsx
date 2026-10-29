import { useNavigate } from 'react-router';
import './Behavior.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Skeleton from '@shared/components/ui/Skeleton.jsx';
import BehaviorBody from './BehaviorBody.jsx';
import { BEHAVIOR_COPY } from './behaviorContent.js';
import useBehaviorOverview from './useBehaviorOverview.js';

export default function Behavior({ backTo }) {
  const navigate = useNavigate();
  const { overview, isPending, loadFailed, retrying, retry } = useBehaviorOverview();

  let body;
  if (loadFailed) {
    body = (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {BEHAVIOR_COPY.retry}
          </Button>
        }
      >
        {BEHAVIOR_COPY.loadFailed}
      </InfoBanner>
    );
  } else if (isPending || !overview) {
    body = (
      <Skeleton rows={4} />
    );
  } else {
    body = <BehaviorBody data={overview} />;
  }

  return (
    <ScreenContainer>
      <PageHeader title={BEHAVIOR_COPY.title} onBack={() => navigate(backTo)} />
      {body}
    </ScreenContainer>
  );
}
