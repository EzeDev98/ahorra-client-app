import { ArrowLeft } from 'lucide-react';
import './PageHeader.css';
import IconButton from '@shared/components/ui/IconButton.jsx';
import { cx } from '@shared/utils/classNames.js';

export default function PageHeader({ title, onBack, backLabel = 'Back', action, className }) {
  return (
    <header className={cx('ui-page-header', className)}>
      {onBack && <IconButton icon={ArrowLeft} label={backLabel} className="ui-page-header__back" onClick={onBack} />}
      <h1 className="ui-page-header__title">{title}</h1>
      {action && <div className="ui-page-header__action">{action}</div>}
    </header>
  );
}
