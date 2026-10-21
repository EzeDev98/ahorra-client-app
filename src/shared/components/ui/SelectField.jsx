import { ChevronDown } from 'lucide-react';
import './control.css';
import './SelectField.css';
import { useFormField } from './formFieldContext.js';
import { cx } from '@shared/utils/classNames.js';

// options: [{ value, label }]. placeholder adds a disabled first option with value "".
export default function SelectField({
  id,
  invalid,
  disabled = false,
  options = [],
  placeholder,
  selectRef,
  className,
  ...selectProps
}) {
  const field = useFormField();
  const isInvalid = invalid ?? field.invalid ?? false;
  const showingPlaceholder = Boolean(placeholder) && (selectProps.value ?? selectProps.defaultValue ?? '') === '';

  return (
    <div
      className={cx(
        'ui-control',
        isInvalid && 'ui-control--invalid',
        disabled && 'ui-control--disabled',
        className,
      )}
    >
      <select
        ref={selectRef}
        id={id ?? field.id}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field.describedBy}
        className={cx(
          'ui-control__input',
          'ui-select__input',
          showingPlaceholder && 'ui-select__input--placeholder',
        )}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="ui-select__chevron" aria-hidden="true" />
    </div>
  );
}
