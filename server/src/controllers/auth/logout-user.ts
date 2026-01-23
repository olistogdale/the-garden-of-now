'use strict';

import type { Context } from 'koa';

export const logoutUser = async function (ctx: Context) {
  try {
    ctx.cookies.set('accessToken', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      expires: new Date(0),
    })
    ctx.status = 204;
  } catch (err) {
    console.log('Error logging user out:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not log user out.'}
  }
}