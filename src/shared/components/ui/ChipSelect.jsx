import { useId } from 'react';
import './ChipSelect.css';
import { useFormField } from './formFieldContext.js';
import { cx } from '@shared/utils/classNames.js';

// One choice from a short list, shown as chips. The selected chip is filled; the rest are outlined.
// options: [{ value, label }]. value: the selected value. onChange(value): the new value, not the event.
// Built on native radio inputs, so arrow keys, focus and screen readers work as they do for any radio group.
export default function ChipSelect({ name, options, value, onChange, disabled = false, className }) {
  const field = useFormField();
  const fallbackName = useId();

  return (
    <div
      role="radiogroup"
      id={field.id}
      aria-labelledby={field.labelId}
      aria-describedby={field.describedBy}
      className={cx('ui-chips', className)}
    >
      {options.map((option) => (
        <label key={option.value} className={cx('ui-chip', disabled && 'ui-chip--disabled')}>
          <input
            type="radio"
            className="ui-chip__input"
            name={name ?? fallbackName}
            value={option.value}
            checked={option.value === value}
            disabled={disabled}
            onChange={() => onChange?.(option.value)}
          />
          <span className="ui-chip__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
