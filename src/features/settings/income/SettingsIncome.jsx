import { useNavigate } from 'react-router';
import './SettingsIncome.css';
import PageHeader from '@shared/components/layout/PageHeader.jsx';
import ScreenContainer from '@shared/components/layout/ScreenContainer.jsx';
import Button from '@shared/components/ui/Button.jsx';
import Card from '@shared/components/ui/Card.jsx';
import DetailRow from '@shared/components/ui/DetailRow.jsx';
import InfoBanner from '@shared/components/ui/InfoBanner.jsx';
import Spinner from '@shared/components/ui/Spinner.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import IncomeForm from './IncomeForm.jsx';
import IncomeHistory from './IncomeHistory.jsx';
import { incomeDate, periodWords } from './incomeText.js';
import { INCOME_SETTINGS } from './settingsIncomeContent.js';
import useCurrentIncome from './useCurrentIncome.js';

function Section({ heading, children }) {
  return (
    <section>
      <h2 className="settings-income__heading">{heading}</h2>
      {children}
    </section>
  );
}

export default function SettingsIncome({ backTo }) {
  const navigate = useNavigate();
  const { income, isPending, loadFailed, retrying, retry } = useCurrentIncome();

  let body;
  if (loadFailed) {
    body = (
      <InfoBanner
        tone="error"
        action={
          <Button variant="secondary" busy={retrying} onClick={retry}>
            {INCOME_SETTINGS.retry}
          </Button>
        }
      >
        {INCOME_SETTINGS.loadFailed}
      </InfoBanner>
    );
  } else if (isPending) {
    body = (
      <div className="settings-income__loading">
        <Spinner />
      </div>
    );
  } else {
    body = (
      <div className="settings-income">
        {income && (
          <Section heading={INCOME_SETTINGS.sectionCurrent}>
            <Card>
              <DetailRow label={INCOME_SETTINGS.period}>{periodWords(income)}</DetailRow>
              <DetailRow label={INCOME_SETTINGS.lowest}>{formatMoney(income.minAmount)}</DetailRow>
              <DetailRow label={INCOME_SETTINGS.highest}>{formatMoney(income.maxAmount)}</DetailRow>
              <DetailRow label={INCOME_SETTINGS.since}>{incomeDate(income.effectiveFrom)}</DetailRow>
            </Card>
            <p className="settings-income__note">{INCOME_SETTINGS.baselineNote}</p>
          </Section>
        )}
        <Section heading={INCOME_SETTINGS.sectionUpdate}>
          <IncomeForm current={income ?? null} />
          <p className="settings-income__note">{INCOME_SETTINGS.updateNote}</p>
        </Section>
        <Section heading={INCOME_SETTINGS.sectionHistory}>
          <IncomeHistory />
        </Section>
      </div>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader title={INCOME_SETTINGS.title} onBack={() => navigate(backTo)} />
      {body}
    </ScreenContainer>
  );
}
