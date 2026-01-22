import { verifyAccessToken } from "../utilities/jwt-utils";

import type { Middleware } from "koa";

const requireAuth: Middleware = async function(ctx, next) {
  const token = ctx.cookies.get("accessToken");

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Not authenticated. Please provide a valid access token.'};
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const userId = payload.sub;

    if (!userId || typeof userId !== 'string') {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token. Please provide a valid access token.'};
      return
    }

    ctx.state.user = { userId };
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token. Please provide a valid access token.'}
  }
}
