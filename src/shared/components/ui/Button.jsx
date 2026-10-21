import './Button.css';
import Spinner from './Spinner.jsx';
import { cx } from '@shared/utils/classNames.js';

export default function Button({
  variant = 'primary',
  busy = false,
  block = false,
  type = 'button',
  className,
  onClick,
  children,
  ...rest
}) {
  const handleClick = (event) => {
    if (busy) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={cx(
        'ui-button',
        `ui-button--${variant}`,
        busy && 'ui-button--busy',
        block && 'ui-button--block',
        className,
      )}
      aria-busy={busy || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="ui-button__label">{children}</span>
      {busy && <Spinner size="sm" className="ui-button__spinner" decorative />}
    </button>
  );
}
