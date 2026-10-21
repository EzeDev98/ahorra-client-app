import { CircleAlert, CircleCheck, X } from 'lucide-react';
import './Toast.css';
import Button from './Button.jsx';
import IconButton from './IconButton.jsx';
import { cx } from '@shared/utils/classNames.js';

const ICONS = { success: CircleCheck, error: CircleAlert };

// Rendered by ToastProvider; screens call useToast() instead of using this directly.
export default function Toast({ tone = 'neutral', message, action, leaving = false, onDismiss }) {
  const Icon = ICONS[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cx('ui-toast', leaving && 'ui-toast--leaving')}
    >
      {Icon && <Icon className={cx('ui-toast__icon', `ui-toast__icon--${tone}`)} aria-hidden="true" />}
      <p className="ui-toast__message">{message}</p>
      {action && (
        <Button
          variant="ghost"
          onClick={() => {
            onDismiss();
            action.onClick();
          }}
        >
          {action.label}
        </Button>
      )}
      <IconButton icon={X} label="Dismiss" onClick={onDismiss} />
    </div>
  );
}
