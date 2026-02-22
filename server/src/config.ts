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

const env = process.env.NODE_ENV ?? 'development';
const isProd = env === 'production';

export const config = {
  env,
  isProd,
  port: parsePort(process.env.PORT ?? '3000'),
  mongoURI: requireEnv('MONGO_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiration: process.env.JWT_EXPIRATION ?? '1h',
  clientOrigin: requireEnv('CLIENT_ORIGIN'),
};