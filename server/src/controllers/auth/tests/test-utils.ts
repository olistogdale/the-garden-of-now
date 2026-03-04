export function extractAccessToken(res: any) {
  const rawSetCookie = res.headers["set-cookie"] ?? [];
  const setCookie = Array.isArray(rawSetCookie)
    ? rawSetCookie
    : rawSetCookie
      ? [rawSetCookie]
      : [];
  return setCookie.filter((cookie) => cookie.startsWith("accessToken="))[0];
}