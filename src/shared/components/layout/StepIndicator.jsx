import './StepIndicator.css';
import { cx } from '@shared/utils/classNames.js';

export default function StepIndicator({ current, total, className }) {
  return (
    <div className={cx('ui-steps', className)}>
      <div className="ui-steps__bars" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cx('ui-steps__bar', index < current && 'ui-steps__bar--done')}
          />
        ))}
      </div>
      <p className="ui-steps__text">
        Step {current} of {total}
      </p>
    </div>
  );
}
