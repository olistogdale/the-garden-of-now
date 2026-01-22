'use strict';

import bcrypt from 'bcryptjs'

import { userModel } from '../../models/user-model';
import { signAccessToken } from '../../utilities/jwt-utils';

import type { Context } from 'koa';
import type { UserT, UserLoginRequestT } from '../../../../data/users/types/user-types';


export const loginUser = async function (ctx: Context) {
  const { email, password } = ctx.request.body as UserLoginRequestT;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid login credentials. Please provide a valid email and password.'};
    return;
  }

  try {
    const user = await userModel.findOne <UserT> ({ email: email.toLowerCase()});

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'User not found. Please provide a valid email address.'};
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid password. Please provide a valid password.'}
    }

    const token = signAccessToken(user._id.toString());

    ctx.cookies.set('access token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    })
    ctx.status = 200;
    ctx.body = { id: user._id.toString(), email: user.email }
  } catch (err) {
    console.log('Error logging user in:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not log user in.'}
  }
}