export function cooldownFromMessage(message, fallbackMs) {
  const match = /(\d+)\s*(?:seconds?|secs?)\b/i.exec(message ?? '');
  return match ? Number(match[1]) * 1000 : fallbackMs;
}
