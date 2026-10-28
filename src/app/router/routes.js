export const ROUTES = Object.freeze({
  onboarding: "/",
  install: "/install",

  welcome: "/welcome",

  register: "/register",
  verifyEmail: "/verify-email",

  login: "/login",
  
  forgotPassword: "/forgot-password",
  verifyResetCode: "/forgot-password/verify",
  createNewPassword: "/forgot-password/new-password",

  setupIncome: '/setup/income',
  setupLock: '/setup/lock',

  setPin: '/set-pin',
  unlock: '/unlock',

  settingsSecurity: "/next-step",
  changePin: "/next-step",

  home: "/home",

  reports: "/reports",
  reportDetail: "/reports/:date",
  
  nextStep: "/next-step",
});

export const reportDetailPath = (date) => ROUTES.reportDetail.replace(':date', encodeURIComponent(date));
