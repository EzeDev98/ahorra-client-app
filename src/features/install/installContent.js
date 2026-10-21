export const COPY = {
  title: 'Install Ahorra',
  description: 'Ahorra runs as an installed app. Install it to continue.',
  manualDescription: 'Ahorra runs as an installed app. Follow these steps to add it.',
  cancelled: 'Install was cancelled. You can still add Ahorra with the steps below.',
  handoffTitle: 'Ahorra is installed',
  closeTab: 'Close this tab',
  closeFailed: 'This tab could not close itself. You can close it yourself.',
};

export const HANDOFF_PLACE = {
  ios: 'your Home Screen',
  'ios-inapp': 'your Home Screen',
  android: 'your home screen',
  desktop: 'your app list or taskbar',
  'safari-desktop': 'your Dock',
};

export const PHONE_EMOJI = '📱';
export const DONE_EMOJI = '🎉';

export const MANUAL_STEPS = {
  ios: [
    { emoji: '📤', text: 'Tap the Share button in your browser toolbar.' },
    { emoji: '➕', text: 'Scroll down and tap Add to Home Screen.' },
    { emoji: '✅', text: 'Tap Add, then open Ahorra from your Home Screen.' },
  ],
  'ios-inapp': [
    { emoji: '⋮', text: 'Open the menu in this app. It is usually the Share icon or three dots.' },
    { emoji: '🧭', text: 'Choose Open in Safari, then follow the Add to Home Screen steps there.' },
  ],
  'safari-desktop': [
    { emoji: '📤', text: 'Click the Share button in the Safari toolbar, or open the File menu.' },
    { emoji: '➕', text: 'Choose Add to Dock. This needs macOS Sonoma or newer.' },
    { emoji: '✅', text: 'Click Add, then open Ahorra from your Dock.' },
  ],
  android: [
    { emoji: '⋮', text: 'Open the browser menu (the three dots).' },
    { emoji: '⬇️', text: 'Tap Install app or Add to Home screen.' },
    { emoji: '✅', text: 'Confirm, then open Ahorra from your home screen.' },
  ],
  desktop: [
    { emoji: '🖥️', text: 'Look for the install icon at the right end of the address bar, or open the browser menu.' },
    { emoji: '⬇️', text: 'Choose Install Ahorra. In Edge, choose Apps, then Install this site as an app.' },
    { emoji: '✅', text: 'Confirm, then open Ahorra from your app list or taskbar.' },
  ],
};

export const HANDOFF_COPY = {
  installingTitle: 'Installing Ahorra…',
  doneTitle: "You're all set!",
  description: (place) => `Ahorra is being added to your device. Find the Ahorra icon on ${place}, open the app from there, and sign in to continue.`,
  banner: (place) => `This browser tab is no longer needed. Use the Ahorra app from ${place} from now on, not this browser.`,
  continue: 'Continue',
  closeNote: 'You can now close this browser tab.',
};
