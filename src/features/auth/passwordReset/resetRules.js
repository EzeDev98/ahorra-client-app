import { EMAIL, MIN_PASSWORD_LENGTH } from '@features/auth/register/registerRules.js';

export function validateEmail(value) {
  if (!value || !value.trim()) return 'Email is required.';
  if (!EMAIL.test(value.trim())) return 'Enter a valid email address.';
  return null;
}

export function validateNewPassword({ newPassword, confirmPassword }) {
  const errors = {};

  if (!newPassword) errors.newPassword = 'Password is required.';
  else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) errors.confirmPassword = 'Confirm your new password.';
  else if (confirmPassword !== newPassword) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}
