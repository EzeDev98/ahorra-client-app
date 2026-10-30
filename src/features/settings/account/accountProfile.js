function claimsOf(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(payload);
    const text = decodeURIComponent(
      [...binary].map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
    );
    return JSON.parse(text);
  } catch {
    return {};
  }
}

const text = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);


export function accountProfile(token, fallbackUsername) {
  const claims = claimsOf(token ?? '');
  return {
    username: text(claims.username) ?? text(fallbackUsername),
    email: text(claims.email),
  };
}
