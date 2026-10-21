import { useEffect, useRef } from 'react';
import './OtpField.css';
import { useFormField } from './formFieldContext.js';
import { cx } from '@shared/utils/classNames.js';

const onlyDigits = (text) => text.replace(/\D/g, '');

// value: the digits typed so far, as a string. onChange(nextString). onComplete(code) fires when all boxes are filled.
// masked shows dots instead of digits, for a PIN. It also stops the browser offering a one-time code.
export default function OtpField({
  value = '',
  onChange,
  onComplete,
  length = 6,
  invalid,
  disabled = false,
  autoFocus = false,
  masked = false,
  className,
}) {
  const field = useFormField();
  const boxes = useRef([]);
  // The newest value, kept current at once. A box focused straight after a change must see it, or focus is sent back.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);
  const isInvalid = invalid ?? field.invalid ?? false;

  const focusBox = (index) => boxes.current[Math.max(0, Math.min(index, length - 1))]?.focus();

  const commit = (next) => {
    latest.current = next;
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (index, event) => {
    const digits = onlyDigits(event.target.value);
    if (!digits) return;
    // Typing over a filled box gives two characters; keep the new one.
    const incoming = value[index] && digits.length === 2 ? digits.slice(-1) : digits;
    const next =
      incoming.length === 1
        ? value.slice(0, index) + incoming + value.slice(index + 1)
        : (value.slice(0, index) + incoming).slice(0, length);
    commit(next.slice(0, length));
    focusBox(Math.min(next.length, length - 1));
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (value[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        commit(value.slice(0, index - 1) + value.slice(index));
        focusBox(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (index, event) => {
    const digits = onlyDigits(event.clipboardData.getData('text'));
    if (!digits) return;
    event.preventDefault();
    const next = (value.slice(0, index) + digits).slice(0, length);
    commit(next);
    focusBox(next.length);
  };

  const handleFocus = (index, event) => {
    event.target.select();
    // Never leave a gap: focus the first empty box instead.
    if (index > latest.current.length) focusBox(latest.current.length);
  };

  return (
    <div role="group" aria-labelledby={field.labelId} className={cx('ui-otp', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            boxes.current[index] = node;
          }}
          id={index === 0 ? field.id : undefined}
          className={cx('ui-otp__box', masked && 'ui-otp__box--masked', isInvalid && 'ui-otp__box--invalid')}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={masked || index > 0 ? 'off' : 'one-time-code'}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={isInvalid || undefined}
          aria-describedby={field.describedBy}
          value={value[index] ?? ''}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => handleFocus(index, event)}
        />
      ))}
    </div>
  );
}
