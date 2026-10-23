export const OTP_LENGTH = 6;

export const TITLE = 'Verify your email';

export const description = (maskedEmail) => `We sent a ${OTP_LENGTH}-digit code to ${maskedEmail}. Enter it below.`;

export const CODE_LABEL = 'Verification code';
export const SHORT_CODE_ERROR = `Enter the ${OTP_LENGTH}-digit code.`;
export const GENERIC_ERROR = 'Something went wrong. Please try again.';
export const VERIFIED_TOAST = 'Email verified. Sign in to continue.';
export const RESENT_TOAST = 'A new code is on its way.';
