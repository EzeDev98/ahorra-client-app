import './IconButton.css';
import { cx } from '@shared/utils/classNames.js';

// icon: a lucide-react component. label: required, it is the accessible name (there is no visible text).
// children render after the icon, for things like a count badge.
export default function IconButton({ icon: Icon, label, type = 'button', className, children, ...rest }) {
  return (
    <button type={type} aria-label={label} className={cx('ui-icon-button', className)} {...rest}>
      <Icon aria-hidden="true" focusable="false" />
      {children}
    </button>
  );
}
