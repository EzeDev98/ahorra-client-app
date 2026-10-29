import Verdict from '@shared/components/feedback/Verdict.jsx';
import Card from '@shared/components/ui/Card.jsx';
import DetailRow from '@shared/components/ui/DetailRow.jsx';
import { formatPercent } from '@features/reports/reportFormat.js';
import { slopeWords } from './behaviorFormat.js';
import { BEHAVIOR_COPY } from './behaviorContent.js';
import Section from './Section.jsx';

export default function TrendSection({ trend }) {
  const rows = [
    [BEHAVIOR_COPY.direction, BEHAVIOR_COPY.directions[trend.direction]],
    [BEHAVIOR_COPY.latestWeek, trend.latestRatioPercent == null ? null : BEHAVIOR_COPY.latestValue(formatPercent(trend.latestRatioPercent))],
    [BEHAVIOR_COPY.change, trend.slopePerWeek == null ? null : slopeWords(trend.slopePerWeek)],
    [BEHAVIOR_COPY.weeksUsed, trend.weeksUsed == null ? null : String(trend.weeksUsed)],
  ].filter(([, value]) => value != null);

  return (
    <Section heading={BEHAVIOR_COPY.sectionTrend}>
      <Card>
        {trend.livingAboveMeans && (
          <div className="behavior__flag">
            <Verdict value="OVER" label={BEHAVIOR_COPY.aboveMeans} />
          </div>
        )}
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label}>
            {value}
          </DetailRow>
        ))}
      </Card>
    </Section>
  );
}
