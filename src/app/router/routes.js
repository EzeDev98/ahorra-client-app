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

  settingsSecurity: "/settings/security",
  changePin: "/settings/security/change-pin",
  lockOff: "/settings/security/lock-off",
  settingsIncome: "/settings/income",

  home: "/home",

  reports: "/reports",
  reportDetail: "/reports/:date",
  insights: "/insights",
  behavior: "/behavior",
  settingsAccount: "/settings/account",
  settingsAbout: "/settings/about",
  settingsReminder: "/settings/reminder",
  settings: "/settings",
  settingsAppearance: "/settings/appearance",
  
  nextStep: "/next-step",
});

export const reportDetailPath = (date) => ROUTES.reportDetail.replace(':date', encodeURIComponent(date));
