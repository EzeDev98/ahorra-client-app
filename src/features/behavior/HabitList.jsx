import Card from '@shared/components/ui/Card.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { BEHAVIOR_COPY } from './behaviorContent.js';
import { formatConfidence, frequencyWords } from './behaviorFormat.js';

export default function HabitList({ habits }) {
  return (
    <Card>
      <ul className="behavior__items">
        {habits.map((habit) => (
          <li key={habit.description} className="behavior__item">
            <div className="behavior__item-top">
              <span>{habit.description}</span>
              <span className="behavior__figure">{BEHAVIOR_COPY.directions[habit.trendDirection]}</span>
            </div>
            <p className="behavior__sub">
              {frequencyWords(habit.frequencyPerWeek)} {'\u00b7'} {BEHAVIOR_COPY.average(formatMoney(habit.avgAmount))} {'\u00b7'}{' '}
              {BEHAVIOR_COPY.habitConfidence(formatConfidence(habit.confidence))}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
