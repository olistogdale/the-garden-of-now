import type { ErrorWithStatus } from "../types/auth-types";

export function isErrorWithStatus(err: unknown): err is ErrorWithStatus {
  return (
    err instanceof Error &&
    'status' in err &&
    typeof (err as { status?: unknown }).status === 'number'
  );
}