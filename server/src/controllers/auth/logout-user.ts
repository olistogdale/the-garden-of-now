'use strict';

import bcrypt from 'bcryptjs'



import type { Context } from 'koa';


export const logoutUser = async function (ctx: Context) {
  try {
    ctx.cookies.set('access token', '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    })
    ctx.status = 204;
  } catch (err) {
    console.log('Error logging user out:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not log user out.'}
  }
}