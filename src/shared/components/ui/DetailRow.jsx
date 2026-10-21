import './DetailRow.css';
import { cx } from '@shared/utils/classNames.js';

// A label on the left, a value on the right. Stack several for report and account details.
export default function DetailRow({ label, className, children }) {
  return (
    <div className={cx('ui-detail-row', className)}>
      <span className="ui-detail-row__label">{label}</span>
      <span className="ui-detail-row__value">{children}</span>
    </div>
  );
}
