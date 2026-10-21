import { Check } from 'lucide-react';
import './Choice.css';
import { cx } from '@shared/utils/classNames.js';

// Internal. Use Checkbox or Radio. The whole row is the label, so the tap target is the row.
export default function Choice({ type, label, hint, disabled = false, inputRef, className, ...inputProps }) {
  return (
    <label className={cx('ui-choice', `ui-choice--${type}`, disabled && 'ui-choice--disabled', className)}>
      <span className="ui-choice__control">
        <input ref={inputRef} type={type} disabled={disabled} className="ui-choice__input" {...inputProps} />
        <span className="ui-choice__box" aria-hidden="true">
          {type === 'checkbox' && <Check className="ui-choice__tick" />}
        </span>
      </span>
      {(label || hint) && (
        <span className="ui-choice__text">
          {label && <span className="ui-choice__label">{label}</span>}
          {hint && <span className="ui-choice__hint">{hint}</span>}
        </span>
      )}
    </label>
  );
}
