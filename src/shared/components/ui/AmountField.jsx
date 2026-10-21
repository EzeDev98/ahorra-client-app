import { useState } from 'react';
import TextField from './TextField.jsx';

const CURRENCY = '₦';

function sanitize(text) {
  const [whole, ...rest] = text.replace(/[^\d.]/g, '').split('.');
  return rest.length === 0 ? whole : `${whole}.${rest.join('').slice(0, 2)}`;
}

function group(raw) {
  const [whole, decimals] = raw.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimals === undefined ? grouped : `${grouped}.${decimals}`;
}

export default function AmountField({ value = '', onChange, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <TextField
      {...props}
      inputMode="decimal"
      autoComplete="off"
      leading={CURRENCY}
      value={focused ? value : group(value)}
      onChange={(event) => onChange?.(sanitize(event.target.value))}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    />
  );
}
