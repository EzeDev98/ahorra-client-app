import { httpClient } from '@core/http/httpClient.js';

const open = { auth: false };

export const authApi = {

  register: (body) => httpClient.post('/register-user', body, open),
 
  verifyEmail: ({ email, otp }) => httpClient.post('/email/verify', { email, otp }, open),

  resendEmailVerification: ({ email }) => httpClient.post('/email/resend-verification', { email }, open),

  login: ({ username, password }) => httpClient.post('/auth/login', { username, password }, open),

  requestPasswordReset: ({ email }) => httpClient.post('/password-reset/request', { email }, open),

  verifyResetOtp: ({ email, otp }) => httpClient.post('/password-reset/verify-otp', { email, otp }, open),

  completePasswordReset: ({ resetToken, newPassword, confirmPassword }) => httpClient.post('/password-reset/complete', { resetToken, newPassword, confirmPassword }, open),
};
