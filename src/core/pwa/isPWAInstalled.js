let installedInBrowser = false;

const ASK_TIMEOUT_MS = 2000;
const INSTALLED_FLAG = 'ahorra.installed';
const INSTALLED_MODES = ['standalone', 'minimal-ui', 'window-controls-overlay'];

const rememberInstalled = () => {
  try {
    localStorage.setItem(INSTALLED_FLAG, 'yes');
  } catch {
    
  }
};

const knownToBeInstalled = () => {
  try {
    return localStorage.getItem(INSTALLED_FLAG) === 'yes';
  } catch {
    return false;
  }
};

const inDisplayMode = (mode) => window.matchMedia(`(display-mode: ${mode})`).matches;

export async function detectInstalledApp() {
  try {
    const timeout = new Promise((resolve) => setTimeout(() => resolve([]), ASK_TIMEOUT_MS));
    const apps = await Promise.race([navigator.getInstalledRelatedApps?.() ?? [], timeout]);
    installedInBrowser = apps.some((app) => app.platform === 'webapp');
  } catch {
    installedInBrowser = false;
  }
  if (installedInBrowser) rememberInstalled();
}

export function markInstalled() {
  installedInBrowser = true;
  rememberInstalled();
}

export function isPWAInstalled() {
  if (INSTALLED_MODES.some(inDisplayMode) || navigator.standalone === true) {
    rememberInstalled();
    return true;
  }
  if (installedInBrowser) return true;
  return inDisplayMode('fullscreen') && knownToBeInstalled();
}

export function isRunningAsApp() {
  if (INSTALLED_MODES.some(inDisplayMode) || navigator.standalone === true) return true;
  return inDisplayMode('fullscreen') && knownToBeInstalled();
}
