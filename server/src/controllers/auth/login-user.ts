'use strict';

import bcrypt from 'bcryptjs'

import { userModel } from '../../models/user-model';
import { signAccessToken } from '../../utilities/jwt-utils';
import { normalize } from '../../utilities/string-utils';

import type { Context } from 'koa';
import type { UserT, UserLoginRequestT, UserAuthResponseT } from '../../../../data/users/types/user-types';


export const loginUser = async function (ctx: Context) {
  const { email, password } = ctx.request.body as UserLoginRequestT;

  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || password.length === 0 || password.trim() !== password) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid login credentials. Please provide a valid email and password.'};
    return;
  }

  const normalizedEmail = normalize(email);

  try {
    const user = await userModel.findOne<UserT>({ email: normalizedEmail});

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid login credentials. Please provide a valid email and password.'};
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid login credentials. Please provide a valid email and password.'};
      return;
    }

    const token = signAccessToken(user._id.toString());

    ctx.cookies.set('accessToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    })
    ctx.status = 200;
    const body: UserAuthResponseT = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.name.first,
      lastName: user.name.last,
      favourites: user.favouriteRecipes
    }
    ctx.body = body;
  } catch (err) {
    console.log('Error logging user in:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error. Could not log user in.'}
  }
}