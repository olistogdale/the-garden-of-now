import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function parsePort(value: string): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) throw new Error('Invalid PORT');
  return number;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value == null) return fallback;

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === 'true') return true;
  if (normalizedValue === 'false') return false;

  throw new Error('Invalid boolean env var value');
}

function parseSameSite(
  value: string | undefined,
  fallback: 'none' | 'lax',
): 'none' | 'lax' {
  if (value == null) return fallback;

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === 'none' || normalizedValue === 'lax') {
    return normalizedValue;
  }

  throw new Error('Invalid COOKIE_SAME_SITE value');
}

const env = process.env.NODE_ENV ?? 'development';
const isProd = env === 'production';

const cookieSecure = parseBoolean(process.env.COOKIE_SECURE, isProd);
const cookieSameSite = parseSameSite(
  process.env.COOKIE_SAME_SITE,
  cookieSecure ? 'none' : 'lax',
);

export const config = {
  env,
  isProd,
  port: parsePort(process.env.PORT ?? '3000'),
  mongoURI: requireEnv('MONGO_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiration: process.env.JWT_EXPIRATION ?? '1h',
  clientOrigin: requireEnv('CLIENT_ORIGIN'),
  cookieName: 'accessToken',
  cookieSameSite,
  cookieSecure,
};
