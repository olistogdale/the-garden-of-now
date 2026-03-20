function requireEnv(value: string | undefined, name: string): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const API_URL = requireEnv(
  import.meta.env.VITE_API_BASE_URL,
  'VITE_API_BASE_URL'
);