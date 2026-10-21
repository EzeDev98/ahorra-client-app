import './Tag.css';
import { cx } from '@shared/utils/classNames.js';

// A small label such as "2 unconfirmed". tone: 'neutral' | 'brand'.
// Verdict wording (Over baseline, Under baseline) belongs to the Verdict component, not here.
export default function Tag({ tone = 'neutral', className, children }) {
  return <span className={cx('ui-tag', `ui-tag--${tone}`, className)}>{children}</span>;
}
