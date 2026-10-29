import Bar from '@shared/components/ui/Bar.jsx';
import Card from '@shared/components/ui/Card.jsx';
import { formatMoney } from '@shared/utils/formatMoney.js';
import { formatPercent } from '@features/reports/reportFormat.js';
import { INSIGHTS_COPY } from './insightsContent.js';

export default function CategoryBreakdown({ categories }) {
  return (
    <Card>
      <ul className="insights__categories">
        {categories.map((category) => {
          const share = INSIGHTS_COPY.share(formatPercent(category.shareOfSpendPercent));
          const excess = Number(category.attributedExcess) > 0 ? ` \u00b7 ${INSIGHTS_COPY.excess(formatMoney(category.attributedExcess))}` : '';
          return (
            <li key={category.categoryId ?? category.categoryName} className="insights__category">
              <div className="insights__category-top">
                <span>{category.categoryName}</span>
                <span className="insights__amount">{formatMoney(category.amount)}</span>
              </div>
              <Bar value={category.shareOfSpendPercent} max={100} label={share} />
              <p className="insights__sub">
                {share}
                {excess}
              </p>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
