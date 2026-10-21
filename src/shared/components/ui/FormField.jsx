import { useId } from 'react';
import './FormField.css';
import FormError from './FormError.jsx';
import { FormFieldProvider } from './formFieldContext.js';
import { cx } from '@shared/utils/classNames.js';

// Label, control, then hint or error. An error replaces the hint in the same slot.
export default function FormField({ label, hint, error, optional = false, className, children }) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cx('ui-form-field', className)}>
      {label && (
        <label id={labelId} htmlFor={id} className="ui-form-field__label">
          {label}
          {optional && <span className="ui-form-field__optional">(optional)</span>}
        </label>
      )}
      <FormFieldProvider value={{ id, labelId, describedBy, invalid: Boolean(error) }}>
        {children}
      </FormFieldProvider>
      {error ? (
        <FormError id={errorId}>{error}</FormError>
      ) : hint ? (
        <p id={hintId} className="ui-form-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}
