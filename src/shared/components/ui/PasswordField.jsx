import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import IconButton from './IconButton.jsx';
import TextField from './TextField.jsx';

// Use autoComplete="new-password" on register and reset screens.
export default function PasswordField({ autoComplete = 'current-password', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      autoCapitalize="none"
      spellCheck={false}
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      trailing={
        <IconButton
          icon={visible ? EyeOff : Eye}
          label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
        />
      }
    />
  );
}
