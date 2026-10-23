export const REFRESH_LEAD_MS = 60_000;

const MIN_PLAUSIBLE_LIFETIME_S = 120;

function jwtExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function accessExpiry(accessToken, expiresIn, now = Date.now()) {
  const fromToken = jwtExpiry(accessToken);
  if (fromToken) return fromToken;
  const seconds = Number(expiresIn);
  return Number.isFinite(seconds) && seconds >= MIN_PLAUSIBLE_LIFETIME_S ? now + seconds * 1000 : null;
}

export const sessionExpiry = (session) => session.accessExpiresAt ?? accessExpiry(session.accessToken);

export const isExpiring = (expiresAt, now = Date.now()) => expiresAt != null && expiresAt - now < REFRESH_LEAD_MS;
