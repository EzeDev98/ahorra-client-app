import Verdict from '@shared/components/feedback/Verdict.jsx';
import Card from '@shared/components/ui/Card.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { REPORTS_COPY } from './reportsContent.js';
import { reportDate } from './reportDate.js';

export default function ReportRow({ report, onOpen }) {
  const { date, kind, entryCount, daySpend, verdict, summary } = report;
  const logged = kind !== 'NO_ENTRIES';
  const words = summary || (logged ? '' : REPORTS_COPY.noEntries);

  return (
    <Card as="button" type="button" className="reports__row" onClick={onOpen}>
      <span className="reports__row-top">
        <span>{reportDate(date)}</span>
        {logged && <span className="reports__spend">{formatMoney(daySpend)}</span>}
      </span>
      {logged && (
        <span className="reports__row-meta">
          <span className="reports__count">{REPORTS_COPY.entries(entryCount ?? 0)}</span>
          <Verdict value={verdict} />
        </span>
      )}
      {words && <span className="reports__summary">{words}</span>}
    </Card>
  );
}
