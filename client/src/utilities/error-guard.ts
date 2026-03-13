import type { ErrorWithStatus } from "../types/auth-types";

export function isErrorWithStatus(err: unknown): err is ErrorWithStatus {
  return (
    err instanceof Error &&
    'status' in err &&
    Number.isFinite((err as { status?: unknown }).status)
  );
}