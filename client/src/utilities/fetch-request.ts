import type { ErrorWithStatusT } from '../types/auth-types';

export async function fetchRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  if (!res.ok) {
    let message = `Response status: ${res.status}`;
    let data: unknown;

    try {
      data = await res.json();
      if (
        data &&
        typeof data === 'object' &&
        'error' in data &&
        typeof (data as { error?: unknown }).error === 'string'
      ) {
        message = String(data.error);
      }
    } catch {
      //
    }

    const newError = new Error(message) as ErrorWithStatusT;
    newError.status = res.status;
    newError.data = data;
    throw newError;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
