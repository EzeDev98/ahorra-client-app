import './control.css';
import { useFormField } from './formFieldContext.js';
import { cx } from '@shared/utils/classNames.js';

// leading / trailing: small slots inside the box (a prefix like ₦, or an IconButton).
// className goes on the box, not the input. Extra props go to the <input>.
export default function TextField({
  id,
  invalid,
  disabled = false,
  leading,
  trailing,
  inputRef,
  className,
  type = 'text',
  ...inputProps
}) {
  const field = useFormField();
  const isInvalid = invalid ?? field.invalid ?? false;

  return (
    <div
      className={cx(
        'ui-control',
        isInvalid && 'ui-control--invalid',
        disabled && 'ui-control--disabled',
        trailing && 'ui-control--trailing',
        className,
      )}
    >
      {leading && <span className="ui-control__affix">{leading}</span>}
      <input
        ref={inputRef}
        id={id ?? field.id}
        type={type}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field.describedBy}
        className="ui-control__input"
        {...inputProps}
      />
      {trailing}
    </div>
  );
}
