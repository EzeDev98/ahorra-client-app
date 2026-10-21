import './Bar.css';
import { cx } from '@shared/utils/classNames.js';

export default function Bar({ value, max, tone = 'brand', label, className }) {
  const ratio = Number(max) > 0 ? Math.min(Math.max(Number(value) / Number(max), 0), 1) : 0;

  return (
    <div role="img" aria-label={label} className={cx('ui-bar', `ui-bar--${tone}`, className)}>
      <span className="ui-bar__fill" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
