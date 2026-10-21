import './AppLogo.css';
import { cx } from '@shared/utils/classNames.js';

export default function AppLogo({ size = 'md', className }) {
  return <span className={cx('ui-logo', `ui-logo--${size}`, className)}>Ahorra</span>;
}
