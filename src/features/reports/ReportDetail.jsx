import { FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import './Reports.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Skeleton from '@shared/components/ui/Skeleton.jsx';
import ReportBody from './ReportBody.jsx';
import { DETAIL_COPY } from './reportDetailContent.js';
import { reportDateLong } from './reportDate.js';
import useReportDetail from './useReportDetail.js';

export default function ReportDetail({ backTo }) {
  const navigate = useNavigate();
  const { date } = useParams();
  const { report, isPending, notFound, loadFailed, retrying, retry } = useReportDetail(date);

  let body;
  if (notFound) {
    body = <EmptyState icon={FileText} title={DETAIL_COPY.notFoundTitle} description={DETAIL_COPY.notFoundDescription} />;
  } else if (loadFailed) {
    body = (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {DETAIL_COPY.retry}
          </Button>
        }
      >
        {DETAIL_COPY.loadFailed}
      </InfoBanner>
    );
  } else if (isPending || !report) {
    body = (
      <Skeleton rows={4} />
    );
  } else {
    body = <ReportBody report={report} />;
  }

  return (
    <ScreenContainer>
      <PageHeader title={reportDateLong(date) ?? DETAIL_COPY.title} onBack={() => navigate(backTo)} />
      {body}
    </ScreenContainer>
  );
}
