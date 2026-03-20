export function sanitizePage(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function sanitizeLimit(value: unknown): 24 | 48 {
  const n = Number(value);
  return n === 48 ? 48 : 24;
}
