import './Badge.css';
import { cx } from '@shared/utils/classNames.js';

export default function Badge({ count, max = 99, floating = false, className }) {
  if (!count || count < 1) return null;
  const text = count > max ? `${max}+` : String(count);

  return (
    <span
      className={cx('ui-badge', floating && 'ui-badge--floating', className)}
      aria-hidden={floating || undefined}
    >
      {text}
    </span>
  );
}
