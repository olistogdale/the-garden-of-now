export async function fetchRequest <T> (
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    let message = `Response status: ${res.status}`;

    try {
      const data = (await res.json()) as { error?: unknown };
      if (data && typeof data === 'object' && 'error' in data) {
        message = String((data).error);
      }
    } catch {
      //
    }

    throw new Error(message);
  }

  return (await res.json()) as T;
}