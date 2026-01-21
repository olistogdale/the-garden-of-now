const KEY = 'garden_of_now_session_key';
const cryptoRef = typeof globalThis.crypto === 'undefined' ? null : globalThis.crypto;

function generateKey(): string {
  if (cryptoRef?.randomUUID) {
    return cryptoRef.randomUUID();
  }

  if (!cryptoRef?.getRandomValues) {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  const bytes = new Uint8Array(16);
  cryptoRef.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSessionKey(): string {
  const existing = sessionStorage.getItem(KEY);
  if (existing) return existing;

  const fresh = generateKey();
  sessionStorage.setItem(KEY, fresh);
  return fresh;
}
