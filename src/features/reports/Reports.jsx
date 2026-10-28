import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import './Reports.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import EmptyState from '@shared/components/ui/EmptyState.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Skeleton from '@shared/components/ui/Skeleton.jsx';
import ReportRow from './ReportRow.jsx';
import { REPORTS_COPY } from './reportsContent.js';
import useReportList from './useReportList.js';

export default function Reports({ backTo, detailTo }) {
  const navigate = useNavigate();
  const { reports, isPending, loadFailed, retrying, retry } = useReportList();

  let body;
  if (loadFailed) {
    body = (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {REPORTS_COPY.retry}
          </Button>
        }
      >
        {REPORTS_COPY.loadFailed}
      </InfoBanner>
    );
  } else if (isPending) {
    body = (
      <Skeleton rows={6} />
    );
  } else if (reports.length === 0) {
    body = <EmptyState icon={FileText} title={REPORTS_COPY.emptyTitle} description={REPORTS_COPY.emptyDescription} />;
  } else {
    body = (
      <ul className="reports__list">
        {reports.map((report) => (
          <li key={report.date}>
            <ReportRow report={report} onOpen={() => navigate(detailTo(report.date))} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader title={REPORTS_COPY.title} onBack={() => navigate(backTo)} />
      {body}
    </ScreenContainer>
  );
}
