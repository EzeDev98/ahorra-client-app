import Card from '@shared/components/ui/Card.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { BEHAVIOR_COPY } from './behaviorContent.js';
import { baselineName } from './behaviorFormat.js';

export default function BaselineList({ baselines }) {
  return (
    <Card>
      <ul className="behavior__items">
        {baselines.map((baseline) => (
          <li key={`${baseline.category}-${baseline.dayType}-${baseline.windowDays}`} className="behavior__item">
            <div className="behavior__item-top">
              <span>{baselineName(baseline.category, baseline.dayType)}</span>
              <span className="behavior__figure">{BEHAVIOR_COPY.daily(formatMoney(baseline.mean))}</span>
            </div>
            <p className="behavior__sub">{BEHAVIOR_COPY.baselineBasis(baseline.windowDays, baseline.sampleDays)}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
