export function maskEmail(email) {
  const [name = '', domain = ''] = String(email).split('@');
  return `${name.slice(0, 1)}${'•'.repeat(Math.max(name.length - 1, 2))}@${domain}`;
}