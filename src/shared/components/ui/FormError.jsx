import './FormField.css';
import { cx } from '@shared/utils/classNames.js';

// Error text. Renders nothing when there is no message. Also usable on its own for a form-level error.
export default function FormError({ id, className, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className={cx('ui-form-error', className)}>
      {children}
    </p>
  );
}
