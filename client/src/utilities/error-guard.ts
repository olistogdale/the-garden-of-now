import type { ErrorWithStatusT } from '../types/auth-types';

export function isErrorWithStatus(err: unknown): err is ErrorWithStatusT {
  return (
    err instanceof Error &&
    'status' in err &&
    Number.isFinite((err as { status?: unknown }).status)
  );
}
