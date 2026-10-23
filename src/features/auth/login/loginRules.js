export function validateLogin(values) {
  const errors = {};
  if (!values.username.trim()) errors.username = 'Username is required.';
  if (!values.password) errors.password = 'Password is required.';
  return errors;
}

export const UNVERIFIED_MESSAGE = /unverified|not (yet )?verified|verify your (email|account)|email.{0,20}verif/i;
