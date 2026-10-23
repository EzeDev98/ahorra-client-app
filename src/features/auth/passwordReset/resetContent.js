export const OTP_LENGTH = 6;

export const REQUEST = {
  title: 'Forgot your password?',
  description: 'Enter the email address on your account and we will email you a code.',
};

export const VERIFY = {
  title: 'Enter the code',
  description: (maskedEmail) => `If an account uses ${maskedEmail}, we sent a ${OTP_LENGTH}-digit code to it. Enter it below.`,
};

export const NEW_PASSWORD = {
  title: 'Create a new password',
  description: 'Choose a new password. Changing it signs you out of Ahorra on other devices.',
};

export const LABELS = {
  email: 'Email',
  code: 'Verification code',
  newPassword: 'New password',
  confirmPassword: 'Confirm new password',
};

export const HINTS = {
  email: 'The email address you registered with.',
  newPassword: 'At least 8 characters.',
};

export const SHORT_CODE_ERROR = `Enter the ${OTP_LENGTH}-digit code.`;
export const GENERIC_ERROR = 'Something went wrong. Please try again.';
export const RESENT_TOAST = 'A new code is on its way.';
export const DONE_TOAST = 'Password changed. Sign in with your new password.';
