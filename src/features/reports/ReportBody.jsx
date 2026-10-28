import Verdict from '@shared/components/feedback/Verdict.jsx';
import Card from '@shared/components/ui/Card.jsx';
import DetailRow from '@shared/components/ui/DetailRow.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import CategoryLines from './CategoryLines.jsx';
import { DETAIL_COPY } from './reportDetailContent.js';
import { varianceWords } from './reportFormat.js';

const money = (value) => (value == null ? null : formatMoney(value));

function Section({ heading, children }) {
  return (
    <section>
      <h2 className="report__heading">{heading}</h2>
      {children}
    </section>
  );
}

function Rows({ heading, rows }) {
  const shown = rows.filter(([, value]) => value != null);
  if (shown.length === 0) return null;
  return (
    <Section heading={heading}>
      <Card>
        {shown.map(([label, value]) => (
          <DetailRow key={label} label={label}>
            {value}
          </DetailRow>
        ))}
      </Card>
    </Section>
  );
}

export default function ReportBody({ report }) {
  const { kind, summary, insight, verdict, entryCount, daySpend, rollingAvgDailySpend } = report;
  const { periodSpend, baseline, incomeMax, variance, dayCategories, periodCategories } = report;

  if (kind === 'NO_ENTRIES') {
    return (
      <div className="report">
        <div className="report__lead">
          <p className="report__summary">{summary || DETAIL_COPY.noEntries}</p>
          {insight && <p className="report__insight">{insight}</p>}
        </div>
      </div>
    );
  }

  const hasRange = baseline != null && incomeMax != null;

  return (
    <div className="report">
      <div className="report__lead">
        <Verdict value={verdict} />
        {summary && <p className="report__summary">{summary}</p>}
        {insight && <p className="report__insight">{insight}</p>}
      </div>
      <Rows
        heading={DETAIL_COPY.sectionDay}
        rows={[
          [DETAIL_COPY.spent, money(daySpend)],
          [DETAIL_COPY.entries, entryCount == null ? null : String(entryCount)],
          [DETAIL_COPY.usual, money(rollingAvgDailySpend)],
        ]}
      />
      <Rows
        heading={DETAIL_COPY.sectionPeriod}
        rows={[
          [DETAIL_COPY.periodSpent, money(periodSpend)],
          [DETAIL_COPY.baseline, money(baseline)],
          [DETAIL_COPY.incomeRange, hasRange ? DETAIL_COPY.range(formatMoney(baseline), formatMoney(incomeMax)) : null],
          [DETAIL_COPY.against, variance == null ? null : varianceWords(variance)],
        ]}
      />
      {dayCategories?.length > 0 && (
        <Section heading={DETAIL_COPY.sectionDayCategories}>
          <CategoryLines lines={dayCategories} />
        </Section>
      )}
      {periodCategories?.length > 0 && (
        <Section heading={DETAIL_COPY.sectionPeriodCategories}>
          <CategoryLines lines={periodCategories} />
        </Section>
      )}
    </div>
  );
}
