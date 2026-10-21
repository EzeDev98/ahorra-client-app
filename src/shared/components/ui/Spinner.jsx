import './Spinner.css';
import { cx } from '@shared/utils/classNames.js';

// size: 'sm' | 'md'. It draws in the current text colour. decorative hides it from screen readers
// (use it inside something that already says it is busy, such as a Button).
export default function Spinner({ size = 'md', label = 'Loading', decorative = false, className }) {
  return (
    <span
      role={decorative ? undefined : 'status'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cx('ui-spinner', `ui-spinner--${size}`, className)}
    />
  );
}
