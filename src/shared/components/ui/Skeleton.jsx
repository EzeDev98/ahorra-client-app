import './Skeleton.css';
import { cx } from '@shared/utils/classNames.js';

// Placeholder rows shown while a list loads, so the screen keeps its shape and nothing jumps when the data arrives.
// Plain blocks in the line colour: no shimmer, nothing moves. The last row is shorter, like the end of a real list.
// rows: how many to draw. label: what a screen reader announces.
export default function Skeleton({ rows = 3, label = 'Loading', className }) {
  return (
    <div role="status" aria-label={label} className={cx('ui-skeleton', className)}>
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className={cx('ui-skeleton__row', index === rows - 1 && rows > 1 && 'ui-skeleton__row--short')} />
      ))}
    </div>
  );
}
