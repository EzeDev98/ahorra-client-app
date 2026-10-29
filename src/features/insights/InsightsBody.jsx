import Bar from '@shared/components/ui/Bar.jsx';
import Card from '@shared/components/ui/Card.jsx';
import DetailRow from '@shared/components/ui/DetailRow.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { varianceWords } from '@features/reports/reportFormat.js';
import CategoryBreakdown from './CategoryBreakdown.jsx';
import { INSIGHTS_COPY } from './insightsContent.js';
import { periodRange } from './periodRange.js';

const money = (value) => (value == null ? null : formatMoney(value));

function Section({ heading, children }) {
  return (
    <section>
      <h2 className="insights__heading">{heading}</h2>
      {children}
    </section>
  );
}

export default function InsightsBody({ data }) {
  const { periodStart, periodEnd, daysElapsed, daysInPeriod, incomeMin, incomeMax, baseline, spend, variance, categories } = data;
  const hasBaseline = Number(baseline) > 0;
  const barLabel = INSIGHTS_COPY.barLabel(formatMoney(spend), formatMoney(baseline));
  const hasRange = incomeMin != null && incomeMax != null;

  const rows = [
    [INSIGHTS_COPY.period, periodRange(periodStart, periodEnd)],
    [INSIGHTS_COPY.day, daysElapsed == null || daysInPeriod == null ? null : INSIGHTS_COPY.dayOf(daysElapsed, daysInPeriod)],
    [INSIGHTS_COPY.incomeRange, hasRange ? INSIGHTS_COPY.range(formatMoney(incomeMin), formatMoney(incomeMax)) : null],
    [INSIGHTS_COPY.baseline, money(baseline)],
    [INSIGHTS_COPY.spent, money(spend)],
    [INSIGHTS_COPY.against, variance == null ? null : varianceWords(variance)],
  ].filter(([, value]) => value != null);

  return (
    <div className="insights">
      <Section heading={INSIGHTS_COPY.sectionPeriod}>
        <Card>
          {hasBaseline && (
            <div className="insights__meter">
              <Bar value={spend} max={baseline} tone={Number(spend) > Number(baseline) ? 'over' : 'brand'} label={barLabel} />
              <p className="insights__caption">{barLabel}</p>
            </div>
          )}
          {rows.map(([label, value]) => (
            <DetailRow key={label} label={label}>
              {value}
            </DetailRow>
          ))}
        </Card>
      </Section>
      <Section heading={INSIGHTS_COPY.sectionCategories}>
        {categories?.length > 0 ? (
          <CategoryBreakdown categories={categories} />
        ) : (
          <p className="insights__empty">{INSIGHTS_COPY.nothingSpent}</p>
        )}
      </Section>
    </div>
  );
}
