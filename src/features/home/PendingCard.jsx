import Card from "@shared/components/ui/Card.jsx";
import { formatMoney } from "@shared/utils/formatMoney.js";
import { CARD_COPY, FALLBACK_CATEGORY, FLOW_LABEL } from "./pendingContent.js";

export default function PendingCard({ entry }) {
  const { id, flow, categoryName, items, totalAmount } = entry;
  return (
    <Card as="article" className="home__card" data-entry-id={id}>
      <p className="home__card-meta">
        {categoryName || FALLBACK_CATEGORY} · {FLOW_LABEL[flow]}
      </p>
      <ul className="home__card-rows">
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.description}</span>
            <span>{formatMoney(item.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="home__card-total">
        <span>{CARD_COPY.total}</span>
        <span>{formatMoney(totalAmount)}</span>
      </div>
    </Card>
  );
}
