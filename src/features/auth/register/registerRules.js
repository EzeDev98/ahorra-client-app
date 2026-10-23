export const MIN_PASSWORD_LENGTH = 8;
export const MIN_AGE = 18;
export const EARLIEST_BIRTH_DATE = '1900-01-01';

export const INITIAL_VALUES = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value) => !value || !value.trim();
const pad = (number) => String(number).padStart(2, '0');

export function latestBirthDate(today = new Date()) {
  const date = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate());
  if (date.getMonth() !== today.getMonth()) date.setDate(0); 
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function dateOfBirthError(value, today = new Date()) {
  if (!value) return 'Date of birth is required.';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return 'Enter your date of birth as yyyy-MM-dd, for example 2000-01-31.';

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const real = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!real || year < 1900) return 'Enter a real date of birth.';

  const thisMonth = today.getMonth() + 1;
  let age = today.getFullYear() - year;
  if (thisMonth < month || (thisMonth === month && today.getDate() < day)) age -= 1;
  return age < MIN_AGE ? `You must be at least ${MIN_AGE} years old to register.` : null;
}

export function validatePersonal(values) {
  const errors = {};
  if (isBlank(values.firstName)) errors.firstName = 'First name is required.';
  if (isBlank(values.lastName)) errors.lastName = 'Last name is required.';
  const dateError = dateOfBirthError(values.dateOfBirth);
  if (dateError) errors.dateOfBirth = dateError;
  return errors;
}

export function validateAccount(values) {
  const errors = {};

  if (isBlank(values.username)) errors.username = 'Username is required.';

  if (isBlank(values.email)) errors.email = 'Email is required.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email address.';

  if (isBlank(values.password)) errors.password = 'Password is required.';
  else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (isBlank(values.confirmPassword)) errors.confirmPassword = 'Confirm your password.';
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.';

  return errors;
}

export function toRequestBody(values) {
  const middleName = values.middleName.trim();
  return {
    firstName: values.firstName.trim(),
    ...(middleName && { middleName }),
    lastName: values.lastName.trim(),
    username: values.username.trim(),
    email: values.email.trim(),
    password: values.password,
    confirmPassword: values.confirmPassword,
    dateOfBirth: values.dateOfBirth,
  };
}
