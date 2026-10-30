import Button from '@shared/components/ui/Button.jsx';
import Card from '@shared/components/ui/Card.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Skeleton from '@shared/components/ui/Skeleton.jsx';
import Tag from '@shared/components/ui/Tag.jsx';
import { incomeDate, incomeLastDay, periodWords, rangeWords } from './incomeText.js';
import { INCOME_SETTINGS } from './settingsIncomeContent.js';
import useIncomeHistory from './useIncomeHistory.js';

export default function IncomeHistory() {
  const { history, isPending, loadFailed, retrying, retry } = useIncomeHistory();

  if (loadFailed) {
    return (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {INCOME_SETTINGS.retry}
          </Button>
        }
      >
        {INCOME_SETTINGS.historyFailed}
      </InfoBanner>
    );
  }
  if (isPending || !history) {
    return (
      <Skeleton rows={3} />
    );
  }
  if (history.length === 0) return <p className="settings-income__empty">{INCOME_SETTINGS.historyEmpty}</p>;

  return (
    <Card>
      <ul className="settings-income__items">
        {history.map((item) => {
          const current = !item.effectiveTo;
          const when = current
            ? INCOME_SETTINGS.from(incomeDate(item.effectiveFrom))
            : INCOME_SETTINGS.range(incomeDate(item.effectiveFrom), incomeLastDay(item.effectiveTo));
          return (
            <li key={item.id} className="settings-income__item">
              <div className="settings-income__item-top">
                <span>{rangeWords(item)}</span>
                {current && <Tag tone="brand">{INCOME_SETTINGS.current}</Tag>}
              </div>
              <p className="settings-income__sub">
                {periodWords(item)} {'\u00b7'} {when}
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
