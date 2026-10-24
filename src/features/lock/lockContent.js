export const LOCK_OFFER = {
  title: 'Lock Ahorra with a PIN?',
  description:'Ahorra will ask for your PIN each time you open it. Your PIN is saved with your account, so it works on any device you sign in on. You can change this later in Settings.',
};

export const UNLOCK = {
  title: 'Enter your PIN',
  description: (length) => `Enter your ${length}-digit PIN to open Ahorra.`,
  label: 'PIN',
  wrong: (attemptsLeft) => `Wrong PIN. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} left.`,
  lockedOut: 'Too many wrong PINs.',
  wait: (seconds) => `Try again in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}.`,
  unsupported: 'A PIN cannot be checked in this browser context.',
  forgot: 'Forgot PIN? Sign in again',
  needsConnection: 'A connection is needed for this. Please connect and try again.',
  generic: 'Something went wrong. Please try again.',
};

export const PIN_FLOW = {
  label: 'PIN',
  mismatch: 'The PINs do not match. Try again.',
  skip: 'Skip for now',
  unsupported: {
    title: 'PIN not available',
    description: 'A PIN cannot be set in this browser context. Open Ahorra as the installed app, over a secure connection.',
  },
  set: {
    new: {
      title: 'Create a PIN',
      description: (length) => `Choose a ${length}-digit PIN. Ahorra will ask for it each time you open the app.`,
    },
    confirm: { title: 'Confirm your PIN', description: 'Enter the same PIN again.' },
    done: 'App lock is on.',
  },
  change: {
    current: { title: 'Enter your current PIN', description: 'Enter the PIN you use now to continue.' },
    new: { title: 'Choose a new PIN', description: (length) => `Choose a new ${length}-digit PIN.` },
    confirm: { title: 'Confirm your new PIN', description: 'Enter the new PIN again.' },
    done: 'PIN changed.',
  },
  off: {
    current: { title: 'Turn off app lock', description: 'Enter your PIN to turn off app lock.' },
    done: 'App lock is off.',
  },
};
