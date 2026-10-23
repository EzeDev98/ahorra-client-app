export const TITLE = 'Sign in';
export const DESCRIPTION = 'Welcome back. Enter your username and password.';

export const LABELS = { username: 'Username', password: 'Password' };

export const WRONG_CREDENTIALS = 'Incorrect username or password.';
export const GENERIC_ERROR = 'Something went wrong. Please try again.';


export const SESSION_ENDED = {
  revoked: {
    title: 'You were signed out',
    text: 'Your session ended. This can happen if you signed in on another device or changed your password. Sign in again to continue.',
  },
  expired: {
    title: 'Your session expired',
    text: 'Please sign in again to continue.',
  }
};
