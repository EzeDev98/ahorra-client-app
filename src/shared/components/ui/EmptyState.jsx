import './EmptyState.css';
import { cx } from '@shared/utils/classNames.js';

// icon: a lucide-react component (optional). action: a slot for a Button.
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cx('ui-empty', className)}>
      {Icon && <Icon className="ui-empty__icon" aria-hidden="true" />}
      {title && <p className="ui-empty__title">{title}</p>}
      {description && <p className="ui-empty__description">{description}</p>}
      {action && <div className="ui-empty__action">{action}</div>}
    </div>
  );
}
